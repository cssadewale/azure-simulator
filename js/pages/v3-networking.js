/* =====================================================
   V3-PAGES-NETWORKING.JS
   Full networking pages: NSG, Route Tables, Bastion,
   Application Gateway, Azure CDN, Azure Front Door
   Author: Adewale Samson Adeagbo | cssadewale
   ===================================================== */

/* ---- NETWORK SECURITY GROUPS ---- */
registerPage('nsg', (container) => {
  const nsgs = [
    {
      id: 'nsg-001', name: 'nsg-compute-subnet', rg: 'rg-data-science-lab', region: 'East US',
      inbound: [
        { priority: 100, name: 'Allow-SSH', port: '22', protocol: 'TCP', source: '41.58.120.5/32', dest: '*', action: 'Allow', direction: 'Inbound' },
        { priority: 200, name: 'Allow-HTTPS', port: '443', protocol: 'TCP', source: '*', dest: '*', action: 'Allow', direction: 'Inbound' },
        { priority: 300, name: 'Allow-HTTP', port: '80', protocol: 'TCP', source: 'VirtualNetwork', dest: '*', action: 'Allow', direction: 'Inbound' },
        { priority: 65000, name: 'AllowVnetInbound', port: '*', protocol: '*', source: 'VirtualNetwork', dest: 'VirtualNetwork', action: 'Allow', direction: 'Inbound' },
        { priority: 65500, name: 'DenyAllInbound', port: '*', protocol: '*', source: '*', dest: '*', action: 'Deny', direction: 'Inbound' }
      ],
      outbound: [
        { priority: 100, name: 'Allow-Internet-Out', port: '*', protocol: '*', source: '*', dest: 'Internet', action: 'Allow', direction: 'Outbound' },
        { priority: 65000, name: 'AllowVnetOutbound', port: '*', protocol: '*', source: 'VirtualNetwork', dest: 'VirtualNetwork', action: 'Allow', direction: 'Outbound' },
        { priority: 65500, name: 'DenyAllOutbound', port: '*', protocol: '*', source: '*', dest: '*', action: 'Deny', direction: 'Outbound' }
      ],
      associatedSubnets: ['subnet-compute'], associatedNICs: 3
    }
  ];

  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Network Security Groups</div>
      <div class="page-title"><div class="page-title-icon">🔒</div><span>Network Security Groups</span></div>
      <div class="page-subtitle">Filter network traffic to and from Azure resources in a virtual network using security rules.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openCreateNSGModal()">+ Create</button>
        <button class="btn btn-secondary" onclick="showToast('Refreshed','info')">Refresh</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is an NSG?</strong> A Network Security Group contains a list of security rules that allow or deny inbound and outbound traffic based on source/destination IP, port, and protocol. NSGs are associated with subnets or individual VM network interfaces (NICs). Rules are evaluated by <strong>priority number</strong> — lowest number = highest priority. The default rules (65000+) allow VNet traffic and deny everything else from the internet. Always restrict SSH (port 22) and RDP (port 3389) to your specific IP address only.</div>
    </div>
    ${nsgs.map(nsg => `
      <div class="card" style="margin-bottom:16px">
        <div class="card-header">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:22px">🔒</span>
            <div>
              <div style="font-weight:700;font-size:15px">${nsg.name}</div>
              <div style="font-size:12px;color:var(--text-muted)">${nsg.rg} · ${nsg.region} · ${nsg.associatedSubnets.length} subnet · ${nsg.associatedNICs} NICs</div>
            </div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-ghost btn-sm" onclick="openAddNSGRule('${nsg.id}')">+ Add Rule</button>
            <button class="btn btn-ghost btn-sm" onclick="openIAMModal('NSG: ${nsg.name}')">Access Control</button>
          </div>
        </div>
        <div id="nsg-body-${nsg.id}">
          <div style="padding:8px 16px;font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;background:#f9f9f8;border-bottom:1px solid var(--card-border)">
            ↓ INBOUND SECURITY RULES
          </div>
          <div style="display:grid;grid-template-columns:60px 180px 80px 80px 140px 140px 70px 80px;gap:0;font-size:11px;font-weight:700;color:var(--text-muted);padding:6px 16px;background:#f3f2f1;border-bottom:1px solid var(--card-border)">
            <span>Priority</span><span>Name</span><span>Port</span><span>Protocol</span><span>Source</span><span>Destination</span><span>Action</span><span></span>
          </div>
          ${nsg.inbound.map((r,i) => `
            <div class="nsg-rule">
              <span class="nsg-priority">${r.priority}</span>
              <span class="nsg-col" style="font-weight:600;flex:2">${r.name}</span>
              <span class="nsg-col">${r.port}</span>
              <span class="nsg-col">${r.protocol}</span>
              <span class="nsg-col" style="font-family:monospace;font-size:11px">${r.source}</span>
              <span class="nsg-col" style="font-family:monospace;font-size:11px">${r.dest}</span>
              <span class="${r.action==='Allow'?'nsg-action-allow':'nsg-action-deny'}">${r.action}</span>
              ${r.priority < 65000 ? `<button class="btn btn-ghost btn-sm" onclick="deleteNSGRule('${nsg.id}','inbound',${i})" style="color:#a4262c;font-size:11px">Delete</button>` : '<span></span>'}
            </div>
          `).join('')}
          <div style="padding:8px 16px;font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;background:#f9f9f8;border-top:1px solid var(--card-border);border-bottom:1px solid var(--card-border)">
            ↑ OUTBOUND SECURITY RULES
          </div>
          ${nsg.outbound.map(r => `
            <div class="nsg-rule">
              <span class="nsg-priority">${r.priority}</span>
              <span class="nsg-col" style="font-weight:600;flex:2">${r.name}</span>
              <span class="nsg-col">${r.port}</span>
              <span class="nsg-col">${r.protocol}</span>
              <span class="nsg-col" style="font-family:monospace;font-size:11px">${r.source}</span>
              <span class="nsg-col" style="font-family:monospace;font-size:11px">${r.dest}</span>
              <span class="${r.action==='Allow'?'nsg-action-allow':'nsg-action-deny'}">${r.action}</span>
              <span></span>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}
  `;
  window._nsgs = nsgs;
});

window.deleteNSGRule = (nsgId, dir, idx) => {
  const nsg = (window._nsgs||[]).find(n=>n.id===nsgId);
  if (!nsg) return;
  const rule = nsg[dir][idx];
  confirmAction('Delete NSG Rule', `Delete rule <strong>${rule.name}</strong> (Priority ${rule.priority})?`, () => {
    nsg[dir].splice(idx,1);
    showToast(`Rule "${rule.name}" deleted`, 'success');
    logActivity('delete', 'Deleted NSG rule', rule.name, nsg.rg);
    navigateTo('nsg');
  });
};

function openCreateNSGModal() {
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>🔒 Create Network Security Group</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">NSG Name *</label><input id="nsgName" class="form-control" placeholder="e.g. nsg-web-tier"/></div>
        <div class="form-group"><label class="form-label">Resource Group *</label><select class="form-control">${AzureData.resourceGroups.map(r=>`<option>${r.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Region *</label><select id="nsgRegion" class="form-control">${AzureData.regions.map(r=>`<option>${r}</option>`).join('')}</select></div>
        <div class="info-box" style="margin-top:12px"><span>💡</span><span>After creation, associate this NSG with a subnet or VM network interface. New NSGs come with 3 default inbound and 3 default outbound rules that cannot be deleted.</span></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="
          const n=document.getElementById('nsgName').value.trim();
          if(!n){showToast('Name required','error');return;}
          showToast('NSG created: '+n,'success');
          logActivity('create','Created NSG',n,'rg-networking-lab');
          closeModal();">Create</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function openAddNSGRule(nsgId) {
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>+ Add Security Rule</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="grid-2" style="gap:12px">
          <div class="form-group"><label class="form-label">Source</label>
            <select class="form-control" id="ruleSource"><option>Any (*)</option><option>My IP Address</option><option>Service Tag</option><option>IP Addresses/CIDR</option></select></div>
          <div class="form-group"><label class="form-label">Source Port Ranges</label><input class="form-control" value="*" placeholder="* or 80 or 80,443 or 8080-8090"/></div>
          <div class="form-group"><label class="form-label">Destination</label>
            <select class="form-control"><option>Any (*)</option><option>IP Addresses/CIDR</option><option>Virtual Network</option><option>Application Security Group</option></select></div>
          <div class="form-group"><label class="form-label">Destination Port Ranges *</label><input id="rulePort" class="form-control" placeholder="e.g. 22 or 80,443 or 3389"/></div>
          <div class="form-group"><label class="form-label">Protocol</label>
            <select class="form-control" id="ruleProto"><option>TCP</option><option>UDP</option><option>ICMP</option><option>Any (*)</option></select></div>
          <div class="form-group"><label class="form-label">Action *</label>
            <select class="form-control" id="ruleAction"><option>Allow</option><option>Deny</option></select></div>
          <div class="form-group"><label class="form-label">Priority * (100–4096)</label><input id="rulePriority" class="form-control" type="number" placeholder="e.g. 150" min="100" max="4096"/></div>
          <div class="form-group"><label class="form-label">Direction</label>
            <select class="form-control" id="ruleDir"><option>Inbound</option><option>Outbound</option></select></div>
        </div>
        <div class="form-group"><label class="form-label">Name *</label><input id="ruleName" class="form-control" placeholder="e.g. Allow-HTTPS-Inbound"/></div>
        <div class="form-group"><label class="form-label">Description</label><input class="form-control" placeholder="Optional description"/></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="
          const n=document.getElementById('ruleName').value.trim();
          const p=document.getElementById('rulePriority').value;
          if(!n||!p){showToast('Name and priority required','error');return;}
          showToast('Rule added: '+n+' ('+document.getElementById('ruleAction').value+')','success');
          logActivity('create','Added NSG rule',n,'NSG');
          closeModal();">Add</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

/* ---- ROUTE TABLES ---- */
registerPage('route-tables', (container) => {
  const routes = [
    { name: 'UDR-DataScience', rg: 'rg-data-science-lab', region: 'East US', associatedSubnets: 2,
      routes: [
        { name: 'Route-To-Firewall', prefix: '0.0.0.0/0', nextHop: 'Virtual Appliance', nextHopIP: '10.0.4.4' },
        { name: 'Route-To-VNet', prefix: '10.0.0.0/16', nextHop: 'Virtual Network Gateway', nextHopIP: '—' },
        { name: 'Route-To-OnPrem', prefix: '192.168.0.0/24', nextHop: 'VPN Gateway', nextHopIP: '—' }
      ]
    }
  ];
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Route Tables</div>
      <div class="page-title"><div class="page-title-icon">🗺️</div><span>Route Tables</span></div>
      <div class="page-subtitle">Control how network traffic is routed from subnets using user-defined routes (UDRs).</div>
      <div class="page-actions"><button class="btn btn-primary" onclick="showToast('Route table created!','success');logActivity('create','Created Route Table','UDR-New','rg-networking-lab')">+ Create</button></div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What are Route Tables?</strong> Azure automatically routes traffic between subnets, VNets, and the internet using system routes. You can override these with <strong>User-Defined Routes (UDRs)</strong> to:<br>
      • Force all internet traffic through an Azure Firewall or NVA (Network Virtual Appliance)<br>
      • Route traffic to on-premises networks via VPN or ExpressRoute<br>
      • Isolate subnets from each other for security<br>
      Associate a route table with one or more subnets. The routes apply to all traffic leaving those subnets.</div>
    </div>
    ${routes.map(rt => `
      <div class="card" style="margin-bottom:16px">
        <div class="card-header">
          <div><div style="font-weight:700;font-size:15px">🗺️ ${rt.name}</div>
          <div style="font-size:12px;color:var(--text-muted)">${rt.rg} · ${rt.region} · ${rt.associatedSubnets} subnets associated</div></div>
          <button class="btn btn-primary btn-sm" onclick="showToast('Route added!','success')">+ Add Route</button>
        </div>
        <div style="display:grid;grid-template-columns:200px 160px 180px 160px auto;font-size:11px;font-weight:700;color:var(--text-muted);padding:8px 16px;background:#f3f2f1;border-bottom:1px solid var(--card-border)">
          <span>Name</span><span>Address Prefix</span><span>Next Hop Type</span><span>Next Hop IP</span><span></span>
        </div>
        ${rt.routes.map(r => `
          <div class="route-row">
            <span class="route-name">${r.name}</span>
            <span class="route-prefix">${r.prefix}</span>
            <span class="route-next-hop">${r.nextHop}</span>
            <span style="font-family:monospace;font-size:11px">${r.nextHopIP}</span>
            <button class="btn btn-ghost btn-sm" style="color:#a4262c" onclick="showToast('Route deleted','success')">Delete</button>
          </div>
        `).join('')}
      </div>
    `).join('')}
  `;
});

/* ---- AZURE BASTION ---- */
registerPage('bastion', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Azure Bastion</div>
      <div class="page-title"><div class="page-title-icon">🏰</div><span>Azure Bastion</span></div>
      <div class="page-subtitle">Securely connect to your VMs via browser-based RDP/SSH without exposing public IPs.</div>
      <div class="page-actions"><button class="btn btn-primary" onclick="openCreateBastionModal()">+ Create Bastion</button></div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Bastion?</strong> A managed PaaS service that provides secure, seamless RDP/SSH connectivity to your VMs directly through the Azure Portal — using just your browser over HTTPS (port 443). <strong>No public IP on the VM is required.</strong><br><br>
      <strong>Why use Bastion instead of SSH with public IP?</strong><br>
      • Eliminates port 22/3389 exposure to the internet (massive attack surface reduction)<br>
      • No need to manage SSH keys or RDP client software<br>
      • All sessions are logged for audit<br>
      • Works from your itel Vista Tab 30s browser — no app needed<br><br>
      Bastion is deployed into a special subnet called <code>AzureBastionSubnet</code> (minimum /27) in your VNet.</div>
    </div>
    <div class="feature-gate">
      <div class="feature-gate-icon">🏰</div>
      <div>
        <div class="feature-gate-title">Azure Bastion — Deployed</div>
        <div class="feature-gate-desc">
          <strong>Host:</strong> adewale-bastion · <strong>VNet:</strong> vnet-data-science · <strong>Subnet:</strong> AzureBastionSubnet (10.0.3.0/27) · <strong>SKU:</strong> Basic · <strong>Region:</strong> East US
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Connect to a VM via Bastion</div></div>
      <div class="card-body">
        <div class="form-group">
          <label class="form-label">Select Virtual Machine</label>
          <select class="form-control" id="bastionVM">
            ${AzureData.virtualMachines.map(v=>`<option value="${v.id}">${v.name} (${v.os}) — ${v.status}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Authentication Type</label>
          <select class="form-control" id="bastionAuth">
            <option>SSH Private Key from Local File</option>
            <option>SSH Private Key from Azure Key Vault</option>
            <option>Password</option>
            <option>Username and Password (Windows RDP)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Username</label>
          <input class="form-control" value="${AzureData.user.github}" />
        </div>
        <div class="info-box">
          <span>💡</span>
          <span>In real Azure, clicking Connect opens a full RDP or SSH terminal session directly in your browser tab. The connection is encrypted end-to-end over HTTPS. No client software, no VPN, no public IP needed.</span>
        </div>
        <button class="btn btn-primary" style="margin-top:12px" onclick="
          const vm=AzureData.virtualMachines.find(v=>v.id===document.getElementById('bastionVM').value)||AzureData.virtualMachines[0];
          if(vm.status!=='Running'){showToast('VM must be running to connect','error');return;}
          showToast('Opening Bastion session to '+vm.name+'...','info');
          logActivity('action','Bastion SSH/RDP session',vm.name,'Bastion');
          setTimeout(()=>showToast('Session established! (Simulated — real Bastion opens in browser)','success'),1500)">
          Connect
        </button>
      </div>
    </div>
  `;
});

function openCreateBastionModal() {
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>🏰 Create Azure Bastion</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="info-box warning" style="margin-bottom:16px"><span>⚠️</span><span>Azure Bastion costs ~$140/month (Basic SKU). On Azure for Students, this will consume most of your $100 credit. Consider using NSG rules to restrict SSH to your IP as a free alternative for development.</span></div>
        <div class="form-group"><label class="form-label">Name *</label><input class="form-control" value="adewale-bastion"/></div>
        <div class="form-group"><label class="form-label">Virtual Network *</label><select class="form-control">${AzureData.virtualNetworks.map(v=>`<option>${v.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Subnet</label><input class="form-control" value="AzureBastionSubnet" readonly/><div style="font-size:11px;color:var(--text-muted);margin-top:3px">Must be named exactly AzureBastionSubnet, minimum /27</div></div>
        <div class="form-group"><label class="form-label">SKU</label><select class="form-control"><option>Basic (~$140/mo)</option><option>Standard (~$270/mo)</option></select></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="showToast('Bastion deployment started (~10 min in real Azure)','info');logActivity('create','Created Azure Bastion','adewale-bastion','rg-networking-lab');closeModal()">Create</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

/* ---- APPLICATION GATEWAY ---- */
registerPage('application-gateway', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Application Gateway</div>
      <div class="page-title"><div class="page-title-icon">⚖️</div><span>Azure Application Gateway</span></div>
      <div class="page-subtitle">Layer 7 load balancer with SSL termination, URL-based routing, and Web Application Firewall.</div>
      <div class="page-actions"><button class="btn btn-primary" onclick="showToast('Creating Application Gateway (~25 min)','info')">+ Create</button></div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Application Gateway?</strong> Unlike the basic Load Balancer (Layer 4, TCP/UDP), Application Gateway operates at Layer 7 (HTTP/HTTPS). It understands HTTP and can:<br>
      • Route <code>/api/*</code> to one backend pool and <code>/static/*</code> to another<br>
      • Terminate SSL at the gateway (backends use HTTP internally)<br>
      • Enable Web Application Firewall (WAF) to block OWASP Top 10 attacks<br>
      • Perform cookie-based session affinity<br>
      • Rewrite HTTP headers and URLs<br>
      <strong>Data scientist use case:</strong> Route <code>/predict</code> to your ML endpoint pool and <code>/dashboard</code> to your Power BI embed pool.</div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">adewale-appgw — Standard_v2</div><span class="badge badge-running">Running</span></div>
      <div class="essentials-panel">
        <div class="essentials-item"><div class="essentials-label">Frontend IP</div><div class="essentials-value">20.121.45.200 (Public)</div></div>
        <div class="essentials-item"><div class="essentials-label">SKU</div><div class="essentials-value">Standard_v2</div></div>
        <div class="essentials-item"><div class="essentials-label">WAF</div><div class="essentials-value"><span class="badge badge-running">Enabled</span></div></div>
        <div class="essentials-item"><div class="essentials-label">Region</div><div class="essentials-value">East US</div></div>
        <div class="essentials-item"><div class="essentials-label">Capacity</div><div class="essentials-value">Autoscale (1–10)</div></div>
      </div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">Routing Rules</div><button class="btn btn-primary btn-sm" onclick="showToast('Add routing rule...','info')">+ Add Rule</button></div>
      ${[
        { name: 'rule-ml-api', listener: 'HTTPS:443', backend: 'pool-ml-endpoints', priority: 100, pathPattern: '/predict/*' },
        { name: 'rule-dashboard', listener: 'HTTPS:443', backend: 'pool-web-apps', priority: 200, pathPattern: '/dashboard/*' },
        { name: 'rule-default', listener: 'HTTP:80 → redirect HTTPS', backend: '—', priority: 300, pathPattern: '*' }
      ].map(r => `
        <div class="ag-rule">
          <span class="ag-rule-name">${r.name}</span>
          <span class="ag-listener">Listener: ${r.listener}</span>
          <span class="ag-backend">Backend: ${r.backend}</span>
          <span style="font-family:monospace;font-size:11px;color:var(--text-muted)">${r.pathPattern}</span>
          <span class="badge badge-info">Priority ${r.priority}</span>
          <button class="btn btn-ghost btn-sm" onclick="showToast('Editing rule...','info')">Edit</button>
        </div>
      `).join('')}
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Backend Pools</div></div>
      ${[
        { name: 'pool-ml-endpoints', targets: ['10.0.1.4 (ds-workstation-01)'], healthProbe: 'probe-ml-health', healthStatus: 'Healthy' },
        { name: 'pool-web-apps', targets: ['adewale-ml-api.azurewebsites.net'], healthProbe: 'probe-web-health', healthStatus: 'Healthy' }
      ].map(pool => `
        <div style="padding:12px 16px;border-bottom:1px solid var(--card-border)">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
            <strong style="font-size:13px">${pool.name}</strong>
            <span class="badge badge-running">${pool.healthStatus}</span>
          </div>
          <div style="font-size:12px;color:var(--text-muted)">Targets: ${pool.targets.join(', ')}</div>
          <div style="font-size:12px;color:var(--text-muted)">Health probe: ${pool.healthProbe}</div>
        </div>
      `).join('')}
    </div>
  `;
});

/* ---- AZURE CDN ---- */
registerPage('cdn', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Azure CDN</div>
      <div class="page-title"><div class="page-title-icon">🌍</div><span>Azure Content Delivery Network</span></div>
      <div class="page-subtitle">Deliver high-bandwidth content globally with low latency using a worldwide network of edge servers.</div>
      <div class="page-actions"><button class="btn btn-primary" onclick="showToast('Creating CDN profile...','info')">+ Create CDN Profile</button></div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure CDN?</strong> A Content Delivery Network caches your content (images, JavaScript, CSS, datasets) at edge servers close to your users globally. When a user in Lagos requests a file, they get it from the nearest CDN edge node rather than your East US origin — dramatically reducing latency.<br><br>
      <strong>Data scientist use case:</strong> Cache your ML model's static web dashboard assets, host large dataset files for download, or accelerate your ML API responses using CDN caching with short TTLs.</div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">CDN Profiles</div></div>
      ${[
        { name: 'adewale-cdn-profile', provider: 'Microsoft', sku: 'Standard Microsoft', endpoints: 2, rg: 'rg-data-science-lab' }
      ].map(p => `
        <div style="padding:14px 16px;border-bottom:1px solid var(--card-border)">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <span style="font-size:20px">🌍</span>
            <strong style="font-size:14px">${p.name}</strong>
            <span class="badge badge-info">${p.sku}</span>
            <span class="badge badge-running">Active</span>
          </div>
          <div style="font-size:12px;color:var(--text-muted)">Provider: ${p.provider} · ${p.endpoints} endpoints · ${p.rg}</div>
        </div>
      `).join('')}
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">CDN Endpoints</div><button class="btn btn-primary btn-sm" onclick="showToast('Creating endpoint...','info')">+ Endpoint</button></div>
      ${[
        { name: 'adewale-assets', url: 'adewale-assets.azureedge.net', origin: 'datasciencefiles01.blob.core.windows.net', status: 'Running', cacheHitRatio: '94.2%' },
        { name: 'adewale-api-cache', url: 'adewale-api-cache.azureedge.net', origin: 'adewale-ml-api.azurewebsites.net', status: 'Running', cacheHitRatio: '71.8%' }
      ].map(ep => `
        <div class="cdn-endpoint" style="flex-direction:column;align-items:flex-start;gap:6px;padding:14px 16px">
          <div style="display:flex;align-items:center;gap:10px;width:100%">
            <strong style="font-size:13px">${ep.name}</strong>
            ${statusBadge(ep.status)}
            <span style="font-size:12px;color:var(--text-muted);margin-left:auto">Cache hit: ${ep.cacheHitRatio}</span>
            <button class="btn btn-ghost btn-sm" onclick="showToast('Purging CDN cache...','info');setTimeout(()=>showToast('Cache purged!','success'),1500)">Purge Cache</button>
          </div>
          <div class="cdn-endpoint-url">${ep.url}</div>
          <div style="font-size:12px;color:var(--text-muted)">Origin: ${ep.origin}</div>
        </div>
      `).join('')}
    </div>
  `;
});

/* ---- REDIS CACHE ---- */
registerPage('redis-cache', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Azure Cache for Redis</div>
      <div class="page-title"><div class="page-title-icon">⚡</div><span>Azure Cache for Redis</span></div>
      <div class="page-subtitle">Fully managed, in-memory data store based on the open-source Redis, used for caching and real-time applications.</div>
      <div class="page-actions"><button class="btn btn-primary" onclick="showToast('Creating Redis cache...','info')">+ Create</button></div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Cache for Redis?</strong> Redis is an in-memory key-value store that is extremely fast (sub-millisecond responses). Use it to:<br>
      • <strong>Cache ML predictions</strong> — store recent predictions so repeat requests don't hit the model (saves compute cost)<br>
      • <strong>Session storage</strong> — store user sessions for your data dashboards<br>
      • <strong>Rate limiting</strong> — count API calls per user per minute<br>
      • <strong>Pub/Sub messaging</strong> — real-time notifications between services<br>
      • <strong>Leaderboards</strong> — sorted sets for ranking experiment results</div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">adewale-redis-cache</div><span class="badge badge-running">Running</span></div>
      <div class="essentials-panel">
        <div class="essentials-item"><div class="essentials-label">Host Name</div><div class="essentials-value" style="font-size:11px;font-family:monospace">adewale-redis-cache.redis.cache.windows.net:6380</div></div>
        <div class="essentials-item"><div class="essentials-label">SKU</div><div class="essentials-value">Basic C0 (250 MB)</div></div>
        <div class="essentials-item"><div class="essentials-label">SSL Port</div><div class="essentials-value">6380</div></div>
        <div class="essentials-item"><div class="essentials-label">Memory Used</div><div class="essentials-value">47 MB / 250 MB</div></div>
        <div class="essentials-item"><div class="essentials-label">Cache Hits</div><div class="essentials-value" style="color:#107c10">12,847 (94.1%)</div></div>
        <div class="essentials-item"><div class="essentials-label">Connected Clients</div><div class="essentials-value">3</div></div>
      </div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">Redis Console</div><button class="btn btn-ghost btn-sm" onclick="showToast('Connecting to Redis CLI...','info')">Connect CLI</button></div>
      <div class="card-body">
        <div class="redis-console" id="redisConsole">
<span class="redis-prompt">127.0.0.1:6380&gt;</span> <span class="redis-cmd">PING</span>
<span class="redis-ok">PONG</span>
<span class="redis-prompt">127.0.0.1:6380&gt;</span> <span class="redis-cmd">SET prediction:house:abc123 "285400.50" EX 3600</span>
<span class="redis-ok">OK</span>
<span class="redis-prompt">127.0.0.1:6380&gt;</span> <span class="redis-cmd">GET prediction:house:abc123</span>
<span class="redis-response">"285400.50"</span>
<span class="redis-prompt">127.0.0.1:6380&gt;</span> <span class="redis-cmd">TTL prediction:house:abc123</span>
<span class="redis-response">(integer) 3598</span>
<span class="redis-prompt">127.0.0.1:6380&gt;</span> <span class="redis-cmd">INFO keyspace</span>
<span class="redis-response"># Keyspace
db0:keys=1247,expires=1102,avg_ttl=1847293</span>
<span class="redis-prompt">127.0.0.1:6380&gt;</span> <span class="redis-cmd" id="redisCmdInput">_</span>
        </div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <input class="form-control" id="redisCmd" placeholder="Enter Redis command (e.g. KEYS *, SET key value, GET key, DEL key)" style="font-family:monospace;font-size:13px"/>
          <button class="btn btn-primary" onclick="runRedisCmd()">Run</button>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Python SDK Example</div></div>
      <div class="card-body">
        <div class="log-query-box">
<span class="comment"># pip install redis azure-identity</span>
<span class="kw">import</span> redis, json

<span class="comment"># Connect to Azure Cache for Redis (SSL required)</span>
r = redis.StrictRedis(
    host=<span class="str">"adewale-redis-cache.redis.cache.windows.net"</span>,
    port=<span class="num">6380</span>, ssl=<span class="kw">True</span>,
    password=<span class="str">"[ACCESS_KEY_FROM_KEY_VAULT]"</span>  <span class="comment"># Never hardcode!</span>
)

<span class="comment"># Cache an ML prediction result for 1 hour</span>
<span class="kw">def</span> get_prediction(features: dict) -> float:
    cache_key = <span class="str">f"pred:{hash(str(features))}"</span>
    cached = r.get(cache_key)
    <span class="kw">if</span> cached:
        <span class="kw">return</span> float(cached)  <span class="comment"># Cache hit!</span>
    result = model.predict([list(features.values())])[<span class="num">0</span>]
    r.setex(cache_key, <span class="num">3600</span>, result)  <span class="comment"># Cache for 1 hour</span>
    <span class="kw">return</span> result
        </div>
      </div>
    </div>
  `;
});

window.runRedisCmd = () => {
  const cmd = document.getElementById('redisCmd').value.trim();
  if (!cmd) return;
  const console_el = document.getElementById('redisConsole');
  const parts = cmd.toUpperCase().split(' ');
  let response = '';
  if (parts[0] === 'PING') response = '<span class="redis-ok">PONG</span>';
  else if (parts[0] === 'SET') response = '<span class="redis-ok">OK</span>';
  else if (parts[0] === 'GET') response = `<span class="redis-response">"simulated-value-${Math.random().toFixed(4)}"</span>`;
  else if (parts[0] === 'DEL') response = '<span class="redis-ok">(integer) 1</span>';
  else if (parts[0] === 'KEYS') response = `<span class="redis-response">1) "prediction:house:abc123"\n2) "session:user:xyz789"\n3) "rate:api:user001"</span>`;
  else if (parts[0] === 'DBSIZE') response = '<span class="redis-response">(integer) 1247</span>';
  else if (parts[0] === 'FLUSHDB') response = '<span class="redis-ok">OK</span>';
  else if (parts[0] === 'TTL') response = '<span class="redis-response">(integer) 2847</span>';
  else response = `<span class="redis-error">ERR unknown command '${parts[0].toLowerCase()}'</span>`;
  console_el.innerHTML += `\n<span class="redis-prompt">127.0.0.1:6380&gt;</span> <span class="redis-cmd">${cmd}</span>\n${response}`;
  document.getElementById('redisCmd').value = '';
  logActivity('action', 'Ran Redis command', cmd.split(' ')[0], 'Redis Cache');
};
