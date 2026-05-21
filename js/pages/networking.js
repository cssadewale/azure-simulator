/* =====================================================
   NETWORKING PAGES
   ===================================================== */

// ---- VIRTUAL NETWORK ----
registerPage('virtual-network', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Virtual Networks</div>
      <div class="page-title"><div class="page-title-icon">🕸️</div><span>Virtual Networks</span></div>
      <div class="page-subtitle">Isolated, private network in Azure for securely connecting your resources.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openCreateVNetModal()">+ Create</button>
        <button class="btn btn-secondary" onclick="showToast('Refreshed','info')">Refresh</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is an Azure Virtual Network (VNet)?</strong> A VNet is your private, isolated section of the Azure cloud — like your own data centre network. Every VM, database, and service you create lives inside a VNet. Key concepts:<br>
      • <strong>Address Space</strong> — IP range for the entire VNet (e.g., 10.0.0.0/16 = 65,536 IPs)<br>
      • <strong>Subnets</strong> — Subdivisions of the VNet to organise and isolate resources<br>
      • <strong>NSG (Network Security Group)</strong> — Firewall rules controlling inbound/outbound traffic<br>
      • <strong>VNet Peering</strong> — Connect two VNets privately across regions<br>
      • <strong>Service Endpoints</strong> — Secure access to Azure services (Storage, SQL) from within VNet</div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">Virtual Networks (${AzureData.virtualNetworks.length})</div></div>
      <table class="data-table">
        <thead><tr><th>Name</th><th>Address Space</th><th>Subnets</th><th>Peerings</th><th>Region</th><th>Resource Group</th><th>Actions</th></tr></thead>
        <tbody>
          ${AzureData.virtualNetworks.map(vnet => `
            <tr>
              <td><div style="display:flex;align-items:center;gap:8px"><span>🕸️</span><a class="link" onclick="openVNetDetail('${vnet.id}')">${vnet.name}</a></div></td>
              <td><code style="font-size:12px">${vnet.addressSpace}</code></td>
              <td>${vnet.subnets.length}</td>
              <td>${vnet.peerings}</td>
              <td>${vnet.region}</td>
              <td>${vnet.resourceGroup}</td>
              <td><button class="btn btn-ghost btn-sm" onclick="openVNetDetail('${vnet.id}')">View</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Network Topology — ${AzureData.virtualNetworks[0].name}</div></div>
      <div class="card-body">
        <div class="topology-container" id="topologyCanvas">
          <svg width="100%" height="100%" style="position:absolute;top:0;left:0;pointer-events:none">
            <line x1="50%" y1="20%" x2="20%" y2="60%" stroke="#c8c6c4" stroke-width="2" stroke-dasharray="5"/>
            <line x1="50%" y1="20%" x2="50%" y2="60%" stroke="#c8c6c4" stroke-width="2" stroke-dasharray="5"/>
            <line x1="50%" y1="20%" x2="80%" y2="60%" stroke="#c8c6c4" stroke-width="2" stroke-dasharray="5"/>
          </svg>
          <div class="topology-node" style="top:10%;left:50%;transform:translateX(-50%)">
            <div class="topology-node-icon">🕸️</div>
            <div class="topology-node-label">vnet-data-science</div>
          </div>
          <div class="topology-node" style="top:55%;left:15%">
            <div class="topology-node-icon">🖥️</div>
            <div class="topology-node-label">subnet-compute</div>
          </div>
          <div class="topology-node" style="top:55%;left:45%">
            <div class="topology-node-icon">💾</div>
            <div class="topology-node-label">subnet-data</div>
          </div>
          <div class="topology-node" style="top:55%;left:75%">
            <div class="topology-node-icon">🔒</div>
            <div class="topology-node-label">AzureBastion</div>
          </div>
        </div>
      </div>
    </div>
  `;
});

function openVNetDetail(id) {
  const vnet = AzureData.virtualNetworks.find(v => v.id === id);
  if (!vnet) return;
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>🕸️ ${vnet.name}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="grid-2" style="gap:12px;margin-bottom:12px">
          <div class="card"><div class="card-body">
            <div class="detail-prop"><div class="detail-prop-label">Address Space</div><div class="detail-prop-value"><code>${vnet.addressSpace}</code></div></div>
            <div class="detail-prop"><div class="detail-prop-label">Region</div><div class="detail-prop-value">${vnet.region}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">DNS Servers</div><div class="detail-prop-value">${vnet.dnsServers.join(', ')}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">VNet Peerings</div><div class="detail-prop-value">${vnet.peerings}</div></div>
          </div></div>
          <div class="card">
            <div class="card-header"><div class="card-title">Subnets</div><button class="btn btn-primary btn-sm" onclick="showToast('Subnet added!','success')">+ Add Subnet</button></div>
            <div class="card-body" style="padding:0">
              ${vnet.subnets.map(s => `
                <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid #f3f2f1">
                  <span>🔲</span>
                  <div style="flex:1">
                    <div style="font-size:13px;font-weight:600">${s.name}</div>
                    <div style="font-size:11px;color:#8a8886"><code>${s.range}</code> · ${s.devices} devices</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="info-box">
          <span>💡</span>
          <span>Always use <strong>Network Security Groups (NSGs)</strong> on subnets to control traffic. For example: allow port 22 (SSH) only from your IP address, not from the internet.</span>
        </div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Close</button></div>
    </div>
  `);
}

function openCreateVNetModal() {
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>🕸️ Create Virtual Network</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="info-box" style="margin-bottom:16px">
          <span>📘</span><span>Plan your IP address space carefully. Use private ranges: 10.0.0.0/8, 172.16.0.0/12, or 192.168.0.0/16. Avoid overlapping with on-premises or other VNets you plan to peer with.</span>
        </div>
        <div class="form-group"><label class="form-label">Name *</label><input id="vnetName" class="form-control" placeholder="e.g. vnet-production"/></div>
        <div class="form-group"><label class="form-label">Resource Group *</label><select class="form-control">${AzureData.resourceGroups.map(r=>`<option>${r.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Region *</label><select id="vnetRegion" class="form-control">${AzureData.regions.map(r=>`<option>${r}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">IPv4 Address Space *</label><input id="vnetCIDR" class="form-control" value="10.2.0.0/16" placeholder="e.g. 10.2.0.0/16"/></div>
        <div class="form-group"><label class="form-label">Default Subnet Range</label><input class="form-control" value="10.2.0.0/24" placeholder="e.g. 10.2.0.0/24"/></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="createVNet()">Create</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function createVNet() {
  const name = document.getElementById('vnetName').value.trim();
  const region = document.getElementById('vnetRegion').value;
  const cidr = document.getElementById('vnetCIDR').value.trim();
  if (!name) { showToast('VNet name is required.', 'error'); return; }
  AzureData.virtualNetworks.push({
    id: newGuid(), name, resourceGroup: AzureData.resourceGroups[0].name, region,
    addressSpace: cidr || '10.2.0.0/16',
    subnets: [{ name: 'default', range: '10.2.0.0/24', devices: 0 }],
    peerings: 0, dnsServers: ['Azure Default'], status: 'Active', created: todayStr()
  });
  showToast(`VNet "${name}" created!`, 'success');
  closeModal();
  navigateTo('virtual-network');
}

// ---- LOAD BALANCER ----
registerPage('load-balancer', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Load Balancer</div>
      <div class="page-title"><div class="page-title-icon">⚖️</div><span>Load Balancer</span></div>
      <div class="page-subtitle">Distribute incoming network traffic across multiple VMs or services for high availability.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Load Balancer?</strong> Distributes incoming traffic across multiple backend instances (VMs) to ensure no single server is overwhelmed. Works at Layer 4 (TCP/UDP). Key use cases:<br>
      • Distribute web API requests across multiple ML model servers<br>
      • Ensure high availability — if one VM fails, traffic goes to others<br>
      • Scale out ML inference endpoints<br>
      Azure also offers <strong>Application Gateway</strong> (Layer 7, HTTP-aware) and <strong>Traffic Manager</strong> (DNS-level, global).</div>
    </div>
    <div class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
      <h3>No load balancers</h3>
      <p>Create a load balancer to distribute traffic across your VMs for high availability and scalability.</p>
      <button class="btn btn-primary" style="margin-top:16px" onclick="showToast('Creating load balancer...','info');setTimeout(()=>showToast('Load balancer created!','success'),1500)">Create Load Balancer</button>
    </div>
  `;
});

// ---- VPN GATEWAY ----
registerPage('vpn-gateway', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › VPN Gateway</div>
      <div class="page-title"><div class="page-title-icon">🔒</div><span>VPN Gateway</span></div>
      <div class="page-subtitle">Securely connect your on-premises network to Azure over the internet using encrypted VPN tunnels.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is a VPN Gateway?</strong> Creates an encrypted tunnel between your office or home network and your Azure VNet. Two types:<br>
      • <strong>Site-to-Site VPN</strong> — Connect your entire office network to Azure (always-on)<br>
      • <strong>Point-to-Site VPN</strong> — Connect your individual laptop/PC to Azure<br>
      As a data scientist working on an itel Vista tab in Nigeria, a Point-to-Site VPN lets you securely access private Azure resources (like VMs with no public IP) from anywhere.</div>
    </div>
    <div class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      <h3>No VPN gateways</h3>
      <p>VPN Gateway deployment takes 30–45 minutes in real Azure. Use it to securely connect your local machine to your Azure VNet.</p>
      <button class="btn btn-primary" style="margin-top:16px" onclick="showToast('VPN Gateway creation started (simulated ~45 min)','info')">Create VPN Gateway</button>
    </div>
  `;
});

// ---- DNS ZONES ----
registerPage('dns', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › DNS Zones</div>
      <div class="page-title"><div class="page-title-icon">📋</div><span>Azure DNS</span></div>
      <div class="page-subtitle">Host your DNS domain in Azure for fast, reliable name resolution using Microsoft's global infrastructure.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure DNS?</strong> Azure DNS lets you manage DNS records for your domain names using Azure's global infrastructure. DNS (Domain Name System) translates human-readable domain names (e.g., adewale-api.com) into IP addresses (e.g., 20.121.45.12). Instead of buying a DNS hosting plan elsewhere, you can manage everything in Azure alongside your other resources.</div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">DNS Zones</div><button class="btn btn-primary btn-sm" onclick="showToast('Add your domain name to create a DNS zone','info')">+ Add Zone</button></div>
      <div class="card-body">
        <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f9f9f8;border:1px solid #e1dfdd;border-radius:4px">
          <span style="font-size:20px">📋</span>
          <div style="flex:1">
            <div style="font-weight:600">cssadewale.dev</div>
            <div style="font-size:12px;color:#8a8886">4 record sets · East US · Resource Group: rg-data-science-lab</div>
          </div>
          <span class="badge badge-running">Active</span>
          <button class="btn btn-ghost btn-sm" onclick="openDNSRecords()">Manage Records</button>
        </div>
      </div>
    </div>
  `;
});

function openDNSRecords() {
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>📋 DNS Records — cssadewale.dev</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <table class="data-table">
          <thead><tr><th>Name</th><th>Type</th><th>TTL</th><th>Value</th></tr></thead>
          <tbody>
            <tr><td>@</td><td><span class="badge badge-info">A</span></td><td>3600</td><td>20.121.45.12</td></tr>
            <tr><td>www</td><td><span class="badge badge-info">CNAME</span></td><td>3600</td><td>adewale-ml-api.azurewebsites.net</td></tr>
            <tr><td>api</td><td><span class="badge badge-info">A</span></td><td>300</td><td>20.121.88.44</td></tr>
            <tr><td>@</td><td><span class="badge badge-info">MX</span></td><td>3600</td><td>mail.cssadewale.dev</td></tr>
          </tbody>
        </table>
        <button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="showToast('Record set added!','success')">+ Add Record Set</button>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Close</button></div>
    </div>
  `);
}
