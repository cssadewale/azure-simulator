/* =====================================================
   COMPUTE PAGES: VMs, App Service, Functions, AKS, Containers
   ===================================================== */

// ---- VIRTUAL MACHINES ----
registerPage('virtual-machines', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Virtual Machines</div>
      <div class="page-title"><div class="page-title-icon">🖥️</div><span>Virtual Machines</span></div>
      <div class="page-subtitle">Create and manage Windows or Linux virtual machines in Azure.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openCreateVMModal()">+ Create</button>
        <button class="btn btn-secondary" onclick="showToast('Refreshed','info')">Refresh</button>
        <button class="btn btn-secondary" onclick="openTerminal()">Open Cloud Shell</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is an Azure VM?</strong> A Virtual Machine is a computing environment that emulates a physical computer. You choose the OS (Windows/Linux), CPU/RAM, and disk size. Useful for running workloads, development environments, or data processing. You pay per second of usage (stopped VMs still incur disk costs).</div>
    </div>
    <div class="grid-3" style="margin-bottom:20px">
      <div class="metric-card">
        <div class="metric-label">Total VMs</div>
        <div class="metric-value">${AzureData.virtualMachines.length}</div>
        <div class="metric-sub">across all resource groups</div>
        <div class="metric-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Running</div>
        <div class="metric-value" style="color:#107c10">${AzureData.virtualMachines.filter(v=>v.status==='Running').length}</div>
        <div class="metric-sub">consuming resources</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Stopped</div>
        <div class="metric-value" style="color:#a4262c">${AzureData.virtualMachines.filter(v=>v.status==='Stopped').length}</div>
        <div class="metric-sub">deallocated VMs</div>
      </div>
    </div>
    <div class="grid-auto" id="vmGrid">
      ${AzureData.virtualMachines.map(vm => renderVMCard(vm)).join('')}
    </div>
  `;
});

function renderVMCard(vm) {
  return `
    <div class="vm-card">
      <div class="vm-card-header">
        <span style="font-size:24px">${vm.image}</span>
        <div style="flex:1;min-width:0">
          <div style="font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${vm.name}</div>
          <div style="font-size:11px;color:#8a8886">${vm.size}</div>
        </div>
        ${statusBadge(vm.status)}
      </div>
      <div class="vm-card-body">
        <div class="vm-stat-row"><span class="vm-stat-label">OS</span><span class="vm-stat-val">${vm.os}</span></div>
        <div class="vm-stat-row"><span class="vm-stat-label">Region</span><span class="vm-stat-val">${vm.region}</span></div>
        <div class="vm-stat-row"><span class="vm-stat-label">Resource Group</span><span class="vm-stat-val" style="font-size:11px">${vm.resourceGroup}</span></div>
        <div class="vm-stat-row"><span class="vm-stat-label">Public IP</span><span class="vm-stat-val">${vm.publicIp}</span></div>
        ${vm.status === 'Running' ? `
          <div style="margin-top:8px">
            <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px"><span>CPU</span><span>${vm.cpuUsage}%</span></div>
            <div class="progress-bar"><div class="progress-fill ${vm.cpuUsage>80?'danger':vm.cpuUsage>60?'warning':''}" style="width:${vm.cpuUsage}%"></div></div>
            <div style="display:flex;justify-content:space-between;font-size:11px;margin:6px 0 3px"><span>Memory</span><span>${vm.memUsage}%</span></div>
            <div class="progress-bar"><div class="progress-fill ${vm.memUsage>80?'danger':vm.memUsage>60?'warning':''}" style="width:${vm.memUsage}%"></div></div>
          </div>
        ` : ''}
      </div>
      <div class="vm-actions">
        ${vm.status === 'Running'
          ? `<button class="btn btn-secondary btn-sm" onclick="vmAction('${vm.id}','stop')">⏹ Stop</button>
             <button class="btn btn-ghost btn-sm" onclick="vmAction('${vm.id}','restart')">🔄 Restart</button>`
          : `<button class="btn btn-primary btn-sm" onclick="vmAction('${vm.id}','start')">▶ Start</button>`}
        <button class="btn btn-ghost btn-sm" onclick="openVMDetail('${vm.id}')">Details</button>
      </div>
    </div>
  `;
}

function vmAction(id, action) {
  const vm = AzureData.virtualMachines.find(v => v.id === id);
  if (!vm) return;
  const msgs = { start: 'Starting', stop: 'Stopping', restart: 'Restarting' };
  showToast(`${msgs[action]} VM "${vm.name}"...`, 'info');
  setTimeout(() => {
    if (action === 'start') { vm.status = 'Running'; vm.cpuUsage = Math.floor(Math.random()*40)+10; vm.memUsage = Math.floor(Math.random()*40)+30; }
    if (action === 'stop') { vm.status = 'Stopped'; vm.cpuUsage = 0; vm.memUsage = 0; }
    if (action === 'restart') { vm.status = 'Running'; }
    showToast(`VM "${vm.name}" ${action}ed successfully.`, 'success');
    document.getElementById('vmGrid').innerHTML = AzureData.virtualMachines.map(v => renderVMCard(v)).join('');
  }, 1500);
}

function openVMDetail(id) {
  const vm = AzureData.virtualMachines.find(v => v.id === id);
  if (!vm) return;
  openModal(`
    <div class="modal">
      <div class="modal-header">
        <h2>${vm.image} ${vm.name}</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="grid-2" style="gap:16px">
          <div class="card">
            <div class="card-header"><div class="card-title">Configuration</div></div>
            <div class="card-body">
              <div class="detail-prop"><div class="detail-prop-label">Size</div><div class="detail-prop-value">${vm.size}</div></div>
              <div class="detail-prop"><div class="detail-prop-label">CPU</div><div class="detail-prop-value">${vm.cpu} vCPUs</div></div>
              <div class="detail-prop"><div class="detail-prop-label">RAM</div><div class="detail-prop-value">${vm.ram} GB</div></div>
              <div class="detail-prop"><div class="detail-prop-label">OS Disk</div><div class="detail-prop-value">${vm.disk} GB SSD</div></div>
              <div class="detail-prop"><div class="detail-prop-label">OS</div><div class="detail-prop-value">${vm.os}</div></div>
            </div>
          </div>
          <div class="card">
            <div class="card-header"><div class="card-title">Networking</div></div>
            <div class="card-body">
              <div class="detail-prop"><div class="detail-prop-label">Public IP</div><div class="detail-prop-value">${vm.publicIp}</div></div>
              <div class="detail-prop"><div class="detail-prop-label">Private IP</div><div class="detail-prop-value">${vm.privateIp}</div></div>
              <div class="detail-prop"><div class="detail-prop-label">Virtual Network</div><div class="detail-prop-value">${vm.vnet}</div></div>
              <div class="detail-prop"><div class="detail-prop-label">Subnet</div><div class="detail-prop-value">${vm.subnet}</div></div>
              <div class="detail-prop"><div class="detail-prop-label">Region</div><div class="detail-prop-value">${vm.region}</div></div>
            </div>
          </div>
        </div>
        <div class="info-box" style="margin-top:16px">
          <span>💡</span>
          <span>To connect to a Linux VM, use SSH: <code>ssh ${AzureData.user.github}@${vm.publicIp}</code>. For Windows, use Remote Desktop (RDP). Always use SSH keys instead of passwords for security!</span>
        </div>
        <div style="margin-top:12px">
          <div style="font-size:12px;font-weight:600;color:#605e5c;margin-bottom:8px">ARM Template (Resource Definition)</div>
          <div class="json-viewer">
<span class="json-key">"type"</span>: <span class="json-string">"Microsoft.Compute/virtualMachines"</span>,
<span class="json-key">"name"</span>: <span class="json-string">"${vm.name}"</span>,
<span class="json-key">"location"</span>: <span class="json-string">"${vm.region}"</span>,
<span class="json-key">"properties"</span>: {
  <span class="json-key">"hardwareProfile"</span>: { <span class="json-key">"vmSize"</span>: <span class="json-string">"${vm.size}"</span> },
  <span class="json-key">"osProfile"</span>: { <span class="json-key">"computerName"</span>: <span class="json-string">"${vm.name}"</span> },
  <span class="json-key">"storageProfile"</span>: { <span class="json-key">"osDisk"</span>: { <span class="json-key">"diskSizeGB"</span>: <span class="json-number">${vm.disk}</span> } }
}
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      </div>
    </div>
  `);
}

function openCreateVMModal() {
  openModal(`
    <div class="modal" style="max-width:600px">
      <div class="modal-header">
        <h2>🖥️ Create Virtual Machine</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="wizard-steps">
          <div class="wizard-step active"><div class="wizard-step-num">1</div><div class="wizard-step-label">Basics</div></div>
          <div class="wizard-connector"></div>
          <div class="wizard-step"><div class="wizard-step-num">2</div><div class="wizard-step-label">Size</div></div>
          <div class="wizard-connector"></div>
          <div class="wizard-step"><div class="wizard-step-num">3</div><div class="wizard-step-label">Networking</div></div>
          <div class="wizard-connector"></div>
          <div class="wizard-step"><div class="wizard-step-num">4</div><div class="wizard-step-label">Review</div></div>
        </div>
        <div class="info-box" style="margin-bottom:16px">
          <span>📘</span><span>Fill in the basic details for your virtual machine. In a real Azure portal, there are additional tabs for disks, networking, monitoring, and tags.</span>
        </div>
        <div class="form-group">
          <label class="form-label">Resource Group *</label>
          <select id="vmRG" class="form-control">
            ${AzureData.resourceGroups.map(rg => `<option>${rg.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Virtual Machine Name *</label>
          <input id="vmName" class="form-control" placeholder="e.g. my-vm-01" />
        </div>
        <div class="form-group">
          <label class="form-label">Region *</label>
          <select id="vmRegion" class="form-control">
            ${AzureData.regions.map(r => `<option>${r}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Image (Operating System) *</label>
          <select id="vmOS" class="form-control">
            <option value="Ubuntu 22.04 LTS">Ubuntu 22.04 LTS (🐧 Linux)</option>
            <option value="Ubuntu 20.04 LTS">Ubuntu 20.04 LTS (🐧 Linux)</option>
            <option value="Windows Server 2022">Windows Server 2022 (🪟 Windows)</option>
            <option value="Windows Server 2019">Windows Server 2019 (🪟 Windows)</option>
            <option value="Debian 11">Debian 11 (🐧 Linux)</option>
            <option value="CentOS 8">CentOS 8 (🐧 Linux)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Size *</label>
          <select id="vmSize" class="form-control">
            ${AzureData.vmSizes.map(s => `<option value="${s.name}">${s.name} — ${s.desc}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Authentication Type</label>
          <select class="form-control"><option>SSH public key (Recommended)</option><option>Password</option></select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="createVM()">Create & Deploy</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function createVM() {
  const name = document.getElementById('vmName').value.trim();
  const rg = document.getElementById('vmRG').value;
  const region = document.getElementById('vmRegion').value;
  const os = document.getElementById('vmOS').value;
  const size = document.getElementById('vmSize').value;
  if (!name) { showToast('VM name is required.', 'error'); return; }
  const sizeData = AzureData.vmSizes.find(s => s.name === size);
  const newVM = {
    id: newGuid(), name, resourceGroup: rg, region, status: 'Running',
    size, os, cpu: sizeData?.cpu || 2, ram: sizeData?.ram || 8, disk: 64,
    publicIp: `${Math.floor(Math.random()*200+20)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*254+1)}`,
    privateIp: `10.0.1.${Math.floor(Math.random()*200+5)}`,
    image: os.includes('Windows') ? '🪟' : '🐧',
    vnet: 'vnet-data-science', subnet: 'subnet-compute',
    cpuUsage: Math.floor(Math.random()*30)+5, memUsage: Math.floor(Math.random()*40)+20, diskUsage: 20,
    created: todayStr(), tags: {}
  };
  AzureData.virtualMachines.push(newVM);
  showToast(`VM "${name}" is being deployed...`, 'info');
  setTimeout(() => showToast(`VM "${name}" deployed successfully!`, 'success'), 2000);
  closeModal();
  navigateTo('virtual-machines');
}

// ---- APP SERVICE ----
registerPage('app-service', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › App Service</div>
      <div class="page-title"><div class="page-title-icon">🌐</div><span>App Service</span></div>
      <div class="page-subtitle">Host web applications, REST APIs, and mobile backends without managing infrastructure.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openCreateAppModal()">+ Create</button>
        <button class="btn btn-secondary" onclick="showToast('Refreshed','info')">Refresh</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure App Service?</strong> A fully managed Platform-as-a-Service (PaaS) for hosting web apps. You deploy your code (Python, Node.js, Java, .NET, PHP) and Azure handles the OS, security patches, scaling, and load balancing. No server management needed. It integrates with GitHub/Azure DevOps for CI/CD.</div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">App Services (${AzureData.appServices.length})</div></div>
      <table class="data-table">
        <thead><tr><th>Name</th><th>Status</th><th>Runtime</th><th>Plan</th><th>URL</th><th>Resource Group</th><th>Actions</th></tr></thead>
        <tbody>
          ${AzureData.appServices.map(app => `
            <tr>
              <td><div style="display:flex;align-items:center;gap:8px"><span>🌐</span><a class="link" onclick="openAppDetail('${app.id}')">${app.name}</a></div></td>
              <td>${statusBadge(app.status)}</td>
              <td>${app.runtime}</td>
              <td>${app.plan}</td>
              <td><a class="link" href="${app.url}" target="_blank" style="font-size:12px">${app.url}</a></td>
              <td>${app.resourceGroup}</td>
              <td>
                <button class="btn btn-ghost btn-sm" onclick="openAppDetail('${app.id}')">Browse</button>
                <button class="btn btn-ghost btn-sm" onclick="showToast('Restarting ${app.name}...','info')">Restart</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
});

function openAppDetail(id) {
  const app = AzureData.appServices.find(a => a.id === id);
  if (!app) return;
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>🌐 ${app.name}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="card">
          <div class="card-body">
            <div class="detail-prop"><div class="detail-prop-label">URL</div><div class="detail-prop-value"><a class="link" href="${app.url}" target="_blank">${app.url}</a></div></div>
            <div class="detail-prop"><div class="detail-prop-label">Runtime</div><div class="detail-prop-value">${app.runtime}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">App Service Plan</div><div class="detail-prop-value">${app.plan}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">Region</div><div class="detail-prop-value">${app.region}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">Deployments</div><div class="detail-prop-value">${app.deployments}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">Daily Requests</div><div class="detail-prop-value">${app.requests}</div></div>
          </div>
        </div>
        <div class="info-box" style="margin-top:16px">
          <span>💡</span>
          <span>To deploy code, link this App Service to your GitHub repo in the <strong>Deployment Center</strong>. Every push to your branch will automatically build and deploy your app.</span>
        </div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Close</button></div>
    </div>
  `);
}

function openCreateAppModal() {
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>🌐 Create Web App</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">App Name *</label><input id="appName" class="form-control" placeholder="e.g. my-data-api"/><div style="font-size:11px;color:#8a8886;margin-top:4px">URL: <span id="appNamePreview">my-data-api</span>.azurewebsites.net</div></div>
        <div class="form-group"><label class="form-label">Resource Group *</label><select class="form-control">${AzureData.resourceGroups.map(r=>`<option>${r.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Runtime Stack *</label>
          <select id="appRuntime" class="form-control">
            <option>Python 3.11</option><option>Python 3.10</option><option>Node.js 18 LTS</option><option>Node.js 20 LTS</option><option>.NET 7.0</option><option>Java 17</option><option>PHP 8.2</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Operating System</label><select class="form-control"><option>Linux</option><option>Windows</option></select></div>
        <div class="form-group"><label class="form-label">Region *</label><select id="appRegion" class="form-control">${AzureData.regions.map(r=>`<option>${r}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">App Service Plan</label><select class="form-control"><option>Free F1 (Shared)</option><option>Basic B1 (1 Core, 1.75 GB)</option><option>Standard S1 (1 Core, 1.75 GB)</option></select></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="createApp()">Create</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
  document.getElementById('appName').addEventListener('input', e => {
    const el = document.getElementById('appNamePreview');
    if (el) el.textContent = e.target.value || 'my-data-api';
  });
}

function createApp() {
  const name = document.getElementById('appName').value.trim();
  const runtime = document.getElementById('appRuntime').value;
  const region = document.getElementById('appRegion').value;
  if (!name) { showToast('App name is required.', 'error'); return; }
  AzureData.appServices.push({ id: newGuid(), name, resourceGroup: AzureData.resourceGroups[0].name, region, status: 'Running', runtime, plan: 'Free F1', url: `https://${name}.azurewebsites.net`, deployments: 0, requests: '0 / day', created: todayStr() });
  showToast(`Web app "${name}" created!`, 'success');
  closeModal();
  navigateTo('app-service');
}

// ---- FUNCTIONS ----
registerPage('functions', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Functions</div>
      <div class="page-title"><div class="page-title-icon">⚡</div><span>Function Apps</span></div>
      <div class="page-subtitle">Run small pieces of code (functions) in the cloud without managing server infrastructure.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openCreateFnModal()">+ Create</button>
        <button class="btn btn-secondary" onclick="showToast('Refreshed','info')">Refresh</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What are Azure Functions?</strong> Serverless compute that lets you run event-driven code without provisioning infrastructure. Functions are triggered by HTTP requests, timers, messages, or blob uploads. You pay only when the code runs (first 1 million executions/month are free). Perfect for data preprocessing, model inference, and automation tasks.</div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Function Apps (${AzureData.functions.length})</div></div>
      <table class="data-table">
        <thead><tr><th>Name</th><th>Status</th><th>Runtime</th><th>Trigger</th><th>Executions/month</th><th>Avg Duration</th><th>Error Rate</th><th>Actions</th></tr></thead>
        <tbody>
          ${AzureData.functions.map(fn => `
            <tr>
              <td><div style="display:flex;align-items:center;gap:8px"><span>⚡</span><a class="link" onclick="openFnDetail('${fn.id}')">${fn.name}</a></div></td>
              <td>${statusBadge(fn.status)}</td>
              <td>${fn.runtime}</td>
              <td><span class="badge badge-info">${fn.trigger}</span></td>
              <td>${fn.executions}</td>
              <td>${fn.avgDuration}</td>
              <td style="color:${parseFloat(fn.errors)>1?'#a4262c':'#107c10'}">${fn.errors}</td>
              <td>
                <button class="btn btn-ghost btn-sm" onclick="openFnDetail('${fn.id}')">Code</button>
                <button class="btn btn-ghost btn-sm" onclick="triggerFn('${fn.id}')">Run</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
});

function triggerFn(id) {
  const fn = AzureData.functions.find(f => f.id === id);
  showToast(`Triggering function "${fn.name}"...`, 'info');
  setTimeout(() => showToast(`Function "${fn.name}" executed successfully (200 OK, 1.1s)`, 'success'), 1200);
}

function openFnDetail(id) {
  const fn = AzureData.functions.find(f => f.id === id);
  if (!fn) return;
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>⚡ ${fn.name}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="card" style="margin-bottom:12px">
          <div class="card-body">
            <div class="detail-prop"><div class="detail-prop-label">Runtime</div><div class="detail-prop-value">${fn.runtime}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">Trigger</div><div class="detail-prop-value">${fn.trigger}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">Executions / month</div><div class="detail-prop-value">${fn.executions}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">Average Duration</div><div class="detail-prop-value">${fn.avgDuration}</div></div>
          </div>
        </div>
        <div style="font-size:12px;font-weight:600;color:#605e5c;margin-bottom:6px">Sample Function Code (Python)</div>
        <div class="log-query-box">
<span class="comment"># Azure Function — HTTP Trigger Example</span>
<span class="kw">import</span> azure.functions <span class="kw">as</span> func
<span class="kw">import</span> json, pandas <span class="kw">as</span> pd

<span class="kw">def</span> main(req: func.HttpRequest) -> func.HttpResponse:
    data = req.get_json()
    df = pd.DataFrame(data)
    result = df.describe().to_dict()
    <span class="kw">return</span> func.HttpResponse(
        json.dumps(result),
        mimetype=<span class="str">"application/json"</span>
    )
        </div>
      </div>
      <div class="modal-footer"><button class="btn btn-primary" onclick="triggerFn('${fn.id}');closeModal()">▶ Run Now</button><button class="btn btn-secondary" onclick="closeModal()">Close</button></div>
    </div>
  `);
}

function openCreateFnModal() {
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>⚡ Create Function App</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Function App Name *</label><input id="fnName" class="form-control" placeholder="e.g. data-processor-fn"/></div>
        <div class="form-group"><label class="form-label">Resource Group *</label><select class="form-control">${AzureData.resourceGroups.map(r=>`<option>${r.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Runtime</label><select id="fnRuntime" class="form-control"><option>Python 3.10</option><option>Python 3.11</option><option>Node.js 18</option><option>.NET 7</option></select></div>
        <div class="form-group"><label class="form-label">Trigger Type</label><select id="fnTrigger" class="form-control"><option>HTTP Trigger</option><option>Timer Trigger</option><option>Blob Trigger</option><option>Event Hub Trigger</option></select></div>
        <div class="form-group"><label class="form-label">Region *</label><select id="fnRegion" class="form-control">${AzureData.regions.map(r=>`<option>${r}</option>`).join('')}</select></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="createFn()">Create</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function createFn() {
  const name = document.getElementById('fnName').value.trim();
  const runtime = document.getElementById('fnRuntime').value;
  const trigger = document.getElementById('fnTrigger').value;
  const region = document.getElementById('fnRegion').value;
  if (!name) { showToast('Function app name required.', 'error'); return; }
  AzureData.functions.push({ id: newGuid(), name, resourceGroup: AzureData.resourceGroups[0].name, region, runtime, trigger, status: 'Active', executions: '0 / month', avgDuration: '—', errors: '0.0%', created: todayStr() });
  showToast(`Function App "${name}" created!`, 'success');
  closeModal();
  navigateTo('functions');
}

// ---- CONTAINERS ----
registerPage('container-instances', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Container Instances</div>
      <div class="page-title"><div class="page-title-icon">📦</div><span>Container Instances</span></div>
      <div class="page-subtitle">Run Docker containers in Azure without managing virtual machines or orchestrators.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What are Container Instances?</strong> Azure Container Instances (ACI) lets you run Docker containers directly in Azure with a single command. Unlike VMs, containers start in seconds. Ideal for burst processing, ML batch jobs, CI/CD task runners, and microservices. You pay per second of container execution.</div>
    </div>
    <div class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
      <h3>No container instances</h3>
      <p>Deploy your first container instance from Docker Hub or Azure Container Registry.</p>
      <button class="btn btn-primary" style="margin-top:16px" onclick="showToast('Creating container instance...','info');setTimeout(()=>showToast('Container deployed!','success'),1500)">Deploy Container</button>
    </div>
  `;
});

// ---- KUBERNETES ----
registerPage('kubernetes', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Kubernetes Service</div>
      <div class="page-title"><div class="page-title-icon">☸️</div><span>Azure Kubernetes Service (AKS)</span></div>
      <div class="page-subtitle">Deploy, scale, and manage containerized applications with Kubernetes.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is AKS?</strong> Azure Kubernetes Service is a managed Kubernetes cluster. Kubernetes automates the deployment, scaling, and management of containerized apps. Azure manages the Kubernetes control plane for free — you only pay for the worker nodes (VMs). Great for ML model serving, microservices, and scalable data pipelines.</div>
    </div>
    <div class="info-box warning" style="margin-bottom:16px">
      <span>⚠️</span>
      <span>AKS requires a paid Azure subscription for production clusters. On Azure for Students, you can create small Dev/Test clusters within your $100 credit.</span>
    </div>
    <div class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
      <h3>No Kubernetes clusters</h3>
      <p>Create your first AKS cluster to start orchestrating containerized workloads.</p>
      <button class="btn btn-primary" style="margin-top:16px" onclick="showToast('AKS cluster creation takes ~5 mins in real Azure.','info')">Create Cluster</button>
    </div>
  `;
});
