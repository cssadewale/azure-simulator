/* =====================================================
   WHATIF.JS — What-If Cost Estimator
   Calculates estimated monthly Azure costs from
   resource configurations using hardcoded pricing data.
   No external API required — prices are based on
   Azure public pricing (East US region, Pay-as-you-go).

   What is this feature?
   Before deploying resources in real Azure, smart engineers
   estimate costs first. The Azure Pricing Calculator does
   this officially. This simulator does it locally — you
   select resource types and configurations and get an
   instant monthly cost estimate. Prices update infrequently
   so hardcoded values are accurate enough for learning.
   ===================================================== */

// Price database (USD/month, East US, Pay-As-You-Go)
// Source: Azure Pricing pages (approximate, for learning purposes)
const AzurePricing = {
  vm: {
    'Standard_B1s':    { cpu: 1,  ram: 1,   price: 7.30,   desc: 'Burstable, dev/test' },
    'Standard_B2ms':   { cpu: 2,  ram: 8,   price: 35.04,  desc: 'General purpose, dev' },
    'Standard_B4ms':   { cpu: 4,  ram: 16,  price: 70.08,  desc: 'General purpose, medium' },
    'Standard_D2s_v3': { cpu: 2,  ram: 8,   price: 96.36,  desc: 'General purpose, production' },
    'Standard_D4s_v3': { cpu: 4,  ram: 16,  price: 192.72, desc: 'General purpose, larger' },
    'Standard_D8s_v3': { cpu: 8,  ram: 32,  price: 385.44, desc: 'General purpose, large' },
    'Standard_E4s_v3': { cpu: 4,  ram: 32,  price: 252.19, desc: 'Memory optimised' },
    'Standard_NC6s_v3':{ cpu: 6,  ram: 112, price: 744.96, desc: 'GPU, V100 - ML training' },
    'Standard_NC12s_v3':{ cpu:12, ram: 224, price:1489.92, desc: 'GPU, 2×V100 - heavy ML' }
  },
  storage: {
    perGBHot:  0.018,  // $/GB/month Hot tier
    perGBCool: 0.01,   // $/GB/month Cool tier
    perGBArchive: 0.00099,
    transactions: 0.0004 // per 10K transactions
  },
  sql: {
    'Basic (5 DTU)':    4.90,
    'Standard S1':      15.00,
    'Standard S2':      30.00,
    'Standard S3':      150.00,
    'Premium P1':       465.00,
    'General Purpose 2 vCores': 183.96
  },
  appService: {
    'F1 (Free)':        0,
    'B1 Basic':         13.14,
    'B2 Basic':         26.28,
    'S1 Standard':      69.35,
    'S2 Standard':      138.70,
    'P1v3 Premium':     138.70
  },
  functions: {
    'Consumption (first 1M free)': 0,
    'Premium EP1':      173.76,
    'Premium EP2':      347.52
  },
  cosmos: {
    'Serverless (per RU)': 0.0000002,
    '400 RU/s Manual':  23.36,
    '1000 RU/s Manual': 58.40,
    '4000 RU/s Manual': 233.60
  },
  bandwidth: {
    perGB: 0.087 // outbound data transfer $/GB
  },
  ml: {
    'cpu-cluster-D2s_v3': 96.36, // per node per month
    'gpu-cluster-NC6s_v3': 744.96
  },
  keyvault: {
    secretOperations: 0.03, // per 10K operations
    certificateRenewal: 3.00
  },
  monitor: {
    perGBLogs: 2.76,
    alerts: 0.10 // per alert rule per month
  }
};

let WhatIfSelections = {
  vms: [],
  storage: { gb: 0, tier: 'Hot' },
  sql: '',
  appService: '',
  functions: '',
  cosmos: '',
  mlCompute: ''
};

function openWhatIf() {
  closeAllPanels();
  const panel = document.getElementById('whatifPanel');
  panel.classList.add('open');
  renderWhatIf();
}

function closeWhatIf() {
  document.getElementById('whatifPanel').classList.remove('open');
}

function renderWhatIf() {
  const body = document.getElementById('whatifBody');
  const total = calculateTotal();

  body.innerHTML = `
    <div class="info-box" style="margin-bottom:14px">
      <span>💡</span>
      <div><strong>What-If Cost Estimator</strong> — Configure resources and see the estimated monthly cost instantly. Prices are approximate East US Pay-As-You-Go rates. Use the <a href="https://azure.microsoft.com/en-us/pricing/calculator/" target="_blank" class="link">Azure Pricing Calculator</a> for exact quotes.</div>
    </div>

    <div class="cost-estimate-card">
      <div class="cost-estimate-label">Estimated Monthly Total</div>
      <div class="cost-estimate-value">$${total.toFixed(2)} / month</div>
      <div class="cost-estimate-detail">${total === 0 ? '✅ All selected services are within free tier' : total <= 100 ? '✅ Within Azure for Students $100 credit' : '⚠️ Exceeds Azure for Students $100 credit'}</div>
    </div>

    <!-- VIRTUAL MACHINES -->
    <div style="font-size:12px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin:14px 0 8px">Virtual Machines</div>
    <div class="form-group">
      <label class="form-label">VM Size</label>
      <select class="form-control" onchange="addVMEstimate(this.value)">
        <option value="">— Select VM size to add —</option>
        ${Object.entries(AzurePricing.vm).map(([k,v]) => `<option value="${k}">${k} (${v.cpu} vCPU, ${v.ram}GB RAM) — $${v.price.toFixed(2)}/mo</option>`).join('')}
      </select>
    </div>
    ${WhatIfSelections.vms.length > 0 ? `
      <div style="margin-bottom:10px">
        ${WhatIfSelections.vms.map((vm,i) => `
          <div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:4px;margin-bottom:4px;font-size:12px">
            <span>🖥️</span>
            <span style="flex:1">${vm.size}</span>
            <span style="font-weight:700;color:var(--azure-blue)">$${vm.price.toFixed(2)}/mo</span>
            <button style="background:none;border:none;cursor:pointer;color:#a4262c" onclick="removeVMEstimate(${i})">✕</button>
          </div>
        `).join('')}
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px">💡 Stopped VMs still incur OS disk cost (~$5/mo). Deallocate to avoid all charges.</div>
      </div>
    ` : ''}

    <!-- STORAGE -->
    <div style="font-size:12px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin:14px 0 8px">Storage Account</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      <div class="form-group">
        <label class="form-label">Storage (GB)</label>
        <input type="number" class="form-control" min="0" max="50000" value="${WhatIfSelections.storage.gb}" placeholder="0" oninput="WhatIfSelections.storage.gb=+this.value;renderWhatIf()"/>
      </div>
      <div class="form-group">
        <label class="form-label">Access Tier</label>
        <select class="form-control" onchange="WhatIfSelections.storage.tier=this.value;renderWhatIf()">
          <option ${WhatIfSelections.storage.tier==='Hot'?'selected':''}>Hot</option>
          <option ${WhatIfSelections.storage.tier==='Cool'?'selected':''}>Cool</option>
          <option ${WhatIfSelections.storage.tier==='Archive'?'selected':''}>Archive</option>
        </select>
      </div>
    </div>
    ${WhatIfSelections.storage.gb > 0 ? `<div style="font-size:12px;color:var(--azure-blue);font-weight:600;margin-bottom:8px">Storage cost: $${calcStorageCost().toFixed(2)}/mo</div>` : ''}

    <!-- SQL DATABASE -->
    <div style="font-size:12px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin:14px 0 8px">SQL Database</div>
    <div class="form-group">
      <select class="form-control" onchange="WhatIfSelections.sql=this.value;renderWhatIf()">
        <option value="">— None —</option>
        ${Object.entries(AzurePricing.sql).map(([k,v]) => `<option value="${k}" ${WhatIfSelections.sql===k?'selected':''}>${k} — $${v.toFixed(2)}/mo</option>`).join('')}
      </select>
    </div>

    <!-- APP SERVICE -->
    <div style="font-size:12px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin:14px 0 8px">App Service Plan</div>
    <div class="form-group">
      <select class="form-control" onchange="WhatIfSelections.appService=this.value;renderWhatIf()">
        <option value="">— None —</option>
        ${Object.entries(AzurePricing.appService).map(([k,v]) => `<option value="${k}" ${WhatIfSelections.appService===k?'selected':''}>${k} — $${v.toFixed(2)}/mo</option>`).join('')}
      </select>
    </div>

    <!-- AZURE FUNCTIONS -->
    <div style="font-size:12px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin:14px 0 8px">Azure Functions</div>
    <div class="form-group">
      <select class="form-control" onchange="WhatIfSelections.functions=this.value;renderWhatIf()">
        <option value="">— None —</option>
        ${Object.entries(AzurePricing.functions).map(([k,v]) => `<option value="${k}" ${WhatIfSelections.functions===k?'selected':''}>${k} — $${v.toFixed(2)}/mo</option>`).join('')}
      </select>
    </div>

    <!-- COSMOS DB -->
    <div style="font-size:12px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin:14px 0 8px">Cosmos DB</div>
    <div class="form-group">
      <select class="form-control" onchange="WhatIfSelections.cosmos=this.value;renderWhatIf()">
        <option value="">— None —</option>
        ${Object.entries(AzurePricing.cosmos).map(([k,v]) => `<option value="${k}" ${WhatIfSelections.cosmos===k?'selected':''}>${k} — $${typeof v === 'number' && v < 1 ? v.toFixed(7)+'$/RU' : v.toFixed(2)+'/mo'}</option>`).join('')}
      </select>
    </div>

    <!-- COST BREAKDOWN TABLE -->
    ${total > 0 ? `
      <div style="font-size:12px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin:14px 0 8px">Cost Breakdown</div>
      <table class="data-table" style="font-size:12px">
        <thead><tr><th>Service</th><th>Config</th><th>Cost/mo</th></tr></thead>
        <tbody>
          ${WhatIfSelections.vms.map(vm => `<tr><td>🖥️ VM</td><td>${vm.size}</td><td>$${vm.price.toFixed(2)}</td></tr>`).join('')}
          ${WhatIfSelections.storage.gb > 0 ? `<tr><td>💾 Storage</td><td>${WhatIfSelections.storage.gb} GB (${WhatIfSelections.storage.tier})</td><td>$${calcStorageCost().toFixed(2)}</td></tr>` : ''}
          ${WhatIfSelections.sql ? `<tr><td>🗃️ SQL DB</td><td>${WhatIfSelections.sql}</td><td>$${AzurePricing.sql[WhatIfSelections.sql].toFixed(2)}</td></tr>` : ''}
          ${WhatIfSelections.appService ? `<tr><td>🌐 App Service</td><td>${WhatIfSelections.appService}</td><td>$${AzurePricing.appService[WhatIfSelections.appService].toFixed(2)}</td></tr>` : ''}
          ${WhatIfSelections.functions ? `<tr><td>⚡ Functions</td><td>${WhatIfSelections.functions}</td><td>$${AzurePricing.functions[WhatIfSelections.functions].toFixed(2)}</td></tr>` : ''}
          ${WhatIfSelections.cosmos ? `<tr><td>🌌 Cosmos DB</td><td>${WhatIfSelections.cosmos}</td><td>$${(+AzurePricing.cosmos[WhatIfSelections.cosmos]).toFixed(2)}</td></tr>` : ''}
          <tr style="font-weight:700;background:#f3f2f1"><td colspan="2">Total</td><td style="color:${total<=100?'#107c10':'#a4262c'}">$${total.toFixed(2)}/mo</td></tr>
        </tbody>
      </table>
      <div style="margin-top:12px;font-size:12px;color:var(--text-muted)">
        Annual estimate: <strong>$${(total*12).toFixed(2)}/year</strong>
        ${total > 0 && total <= 100 ? `<br>✅ Covered by your $100 Azure for Students credit for ${Math.floor(100/total)} month${Math.floor(100/total)!==1?'s':''}` : ''}
      </div>
    ` : ''}

    <div style="margin-top:16px;display:flex;gap:8px">
      <button class="btn btn-secondary btn-sm" onclick="resetWhatIf()">Reset</button>
      <button class="btn btn-primary btn-sm" onclick="showToast('Use Azure Pricing Calculator for exact quotes','info')">
        📊 Full Estimate
      </button>
    </div>
  `;
}

function addVMEstimate(size) {
  if (!size) return;
  const vm = AzurePricing.vm[size];
  if (!vm) return;
  WhatIfSelections.vms.push({ size, price: vm.price });
  renderWhatIf();
}

function removeVMEstimate(idx) {
  WhatIfSelections.vms.splice(idx, 1);
  renderWhatIf();
}

function calcStorageCost() {
  const gb = WhatIfSelections.storage.gb || 0;
  const rate = WhatIfSelections.storage.tier === 'Hot' ? AzurePricing.storage.perGBHot
    : WhatIfSelections.storage.tier === 'Cool' ? AzurePricing.storage.perGBCool
    : AzurePricing.storage.perGBArchive;
  return gb * rate;
}

function calculateTotal() {
  let total = 0;
  WhatIfSelections.vms.forEach(v => total += v.price);
  total += calcStorageCost();
  if (WhatIfSelections.sql) total += AzurePricing.sql[WhatIfSelections.sql] || 0;
  if (WhatIfSelections.appService) total += AzurePricing.appService[WhatIfSelections.appService] || 0;
  if (WhatIfSelections.functions) total += AzurePricing.functions[WhatIfSelections.functions] || 0;
  if (WhatIfSelections.cosmos) total += AzurePricing.cosmos[WhatIfSelections.cosmos] || 0;
  return total;
}

function resetWhatIf() {
  WhatIfSelections = { vms: [], storage: { gb: 0, tier: 'Hot' }, sql: '', appService: '', functions: '', cosmos: '', mlCompute: '' };
  renderWhatIf();
  showToast('Estimator reset', 'info');
}
