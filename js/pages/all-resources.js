/* =====================================================
   ALL RESOURCES PAGE
   ===================================================== */

registerPage('all-resources', (container) => {
  const allResources = [
    ...AzureData.virtualMachines.map(r => ({ name: r.name, type: 'Virtual Machine', rg: r.resourceGroup, region: r.region, status: r.status, icon: '🖥️', page: 'virtual-machines' })),
    ...AzureData.storageAccounts.map(r => ({ name: r.name, type: 'Storage Account', rg: r.resourceGroup, region: r.region, status: r.status, icon: '💾', page: 'storage-accounts' })),
    ...AzureData.appServices.map(r => ({ name: r.name, type: 'App Service', rg: r.resourceGroup, region: r.region, status: r.status, icon: '🌐', page: 'app-service' })),
    ...AzureData.functions.map(r => ({ name: r.name, type: 'Function App', rg: r.resourceGroup, region: r.region, status: r.status, icon: '⚡', page: 'functions' })),
    ...AzureData.sqlDatabases.map(r => ({ name: r.name, type: 'SQL Database', rg: r.resourceGroup, region: r.region, status: r.status, icon: '🗃️', page: 'sql-database' })),
    ...AzureData.cosmosDb.map(r => ({ name: r.name, type: 'Cosmos DB', rg: r.resourceGroup, region: r.region, status: r.status, icon: '🌌', page: 'cosmos-db' })),
    ...AzureData.keyVaults.map(r => ({ name: r.name, type: 'Key Vault', rg: r.resourceGroup, region: r.region, status: r.status, icon: '🔑', page: 'key-vault' })),
    ...AzureData.virtualNetworks.map(r => ({ name: r.name, type: 'Virtual Network', rg: r.resourceGroup, region: r.region, status: r.status, icon: '🕸️', page: 'virtual-network' })),
    ...AzureData.synapseWorkspaces.map(r => ({ name: r.name, type: 'Synapse Workspace', rg: r.resourceGroup, region: r.region, status: r.status, icon: '📊', page: 'synapse' })),
    ...AzureData.databricks.map(r => ({ name: r.name, type: 'Databricks Workspace', rg: r.resourceGroup, region: r.region, status: r.status, icon: '🔷', page: 'databricks' })),
    ...AzureData.mlStudio.workspaces.map(r => ({ name: r.name, type: 'ML Workspace', rg: r.resourceGroup, region: r.region, status: r.status, icon: '🤖', page: 'ml-studio' })),
    ...AzureData.dataFactory.map(r => ({ name: r.name, type: 'Data Factory', rg: r.resourceGroup, region: r.region, status: r.status, icon: '🔄', page: 'data-factory' })),
    ...AzureData.eventHubs.map(r => ({ name: r.name, type: 'Event Hubs Namespace', rg: r.resourceGroup, region: r.region, status: r.status, icon: '📡', page: 'event-hubs' })),
  ];

  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › All Resources</div>
      <div class="page-title"><div class="page-title-icon">🌐</div><span>All Resources</span></div>
      <div class="page-subtitle">View and manage all Azure resources across all resource groups and subscriptions.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>All Resources</strong> gives you a flat view of every resource you have across all resource groups. Use the filter bar to search by name, type, region, or resource group. This is useful when you have many resources and need to quickly find something specific.</div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">All Resources (${allResources.length})</div>
        <div style="display:flex;gap:8px">
          <select id="filterType" class="form-control" style="width:180px" onchange="filterAllResources()">
            <option value="">All Types</option>
            ${[...new Set(allResources.map(r=>r.type))].map(t=>`<option>${t}</option>`).join('')}
          </select>
          <select id="filterRG" class="form-control" style="width:200px" onchange="filterAllResources()">
            <option value="">All Resource Groups</option>
            ${AzureData.resourceGroups.map(rg=>`<option>${rg.name}</option>`).join('')}
          </select>
          <input type="text" id="filterName" class="form-control" style="width:200px" placeholder="Search by name..." oninput="filterAllResources()"/>
        </div>
      </div>
      <div style="overflow-x:auto">
        <table class="data-table" id="allResourcesTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Resource Group</th>
              <th>Region</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="allResourcesBody">
            ${renderAllResourceRows(allResources)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  window._allResources = allResources;
});

function renderAllResourceRows(resources) {
  if (!resources.length) return `<tr><td colspan="6" style="text-align:center;padding:40px;color:#8a8886">No resources match your filter.</td></tr>`;
  return resources.map(r => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <span>${r.icon}</span>
          <a class="link" onclick="navigateTo('${r.page}')">${r.name}</a>
        </div>
      </td>
      <td style="font-size:12px;color:#605e5c">${r.type}</td>
      <td><a class="link" style="font-size:12px" onclick="navigateTo('resource-groups')">${r.rg}</a></td>
      <td style="font-size:12px">${r.region}</td>
      <td>${statusBadge(r.status)}</td>
      <td>
        <button class="btn btn-ghost btn-sm" onclick="navigateTo('${r.page}')">Open</button>
        <button class="btn btn-ghost btn-sm" style="color:#a4262c" onclick="showToast('In a real portal, this would delete the resource permanently.','warning')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function filterAllResources() {
  const nameFilter = document.getElementById('filterName').value.trim().toLowerCase();
  const typeFilter = document.getElementById('filterType').value;
  const rgFilter = document.getElementById('filterRG').value;
  const filtered = (window._allResources || []).filter(r => {
    return (!nameFilter || r.name.toLowerCase().includes(nameFilter))
      && (!typeFilter || r.type === typeFilter)
      && (!rgFilter || r.rg === rgFilter);
  });
  document.getElementById('allResourcesBody').innerHTML = renderAllResourceRows(filtered);
}

/* =====================================================
   SUBSCRIPTIONS PAGE
   ===================================================== */

registerPage('subscriptions', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Subscriptions</div>
      <div class="page-title"><div class="page-title-icon">💳</div><span>Subscriptions</span></div>
      <div class="page-subtitle">Manage your Azure subscriptions — billing, resource limits, and cost centres.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is an Azure Subscription?</strong> A subscription is a billing and resource boundary in Azure. Every resource (VM, storage, database) belongs to one subscription. A subscription is linked to a payment method (credit card, invoice, or credits like your Azure for Students $100). You can have multiple subscriptions to separate costs by project, department, or environment (dev/staging/production). Key details:<br>
      • <strong>Subscription ID</strong> — Unique identifier used in CLI commands and ARM templates<br>
      • <strong>Azure for Students</strong> — $100 credit, no credit card required, valid for 12 months<br>
      • <strong>Spending Limit</strong> — Student subscriptions have a soft cap to prevent overspending<br>
      • <strong>Resource Limits (Quotas)</strong> — Each subscription has limits (e.g., max 10 vCPUs per region)</div>
    </div>
    ${AzureData.subscriptions.map(sub => `
      <div class="sub-card">
        <div class="sub-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
        </div>
        <div class="sub-info">
          <div class="sub-name">${sub.name}</div>
          <div class="sub-id">Subscription ID: ${sub.subscriptionId}</div>
          <div class="sub-stats">
            <div><div class="sub-stat-val">${sub.resourceGroups}</div><div class="sub-stat-label">Resource Groups</div></div>
            <div><div class="sub-stat-val">${sub.resources}</div><div class="sub-stat-label">Resources</div></div>
            <div><div class="sub-stat-val">$${sub.spent.toFixed(2)}</div><div class="sub-stat-label">Spent</div></div>
            <div><div class="sub-stat-val">${sub.spendingLimit}</div><div class="sub-stat-label">Spending Limit</div></div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px">
          ${statusBadge(sub.state)}
          <span class="badge badge-info">${sub.type}</span>
          <button class="btn btn-ghost btn-sm" onclick="openSubscriptionDetail('${sub.id}')">View Details</button>
        </div>
      </div>
    `).join('')}
    <div class="card" style="margin-top:16px">
      <div class="card-header"><div class="card-title">Service Quotas & Limits (East US)</div></div>
      <div class="card-body">
        <div class="info-box" style="margin-bottom:12px"><span>📘</span><span>Quotas are limits on how many resources you can create. On student subscriptions, some limits are lower. You can request quota increases for production workloads.</span></div>
        <table class="data-table">
          <thead><tr><th>Resource</th><th>Limit</th><th>Current Usage</th><th>Usage %</th></tr></thead>
          <tbody>
            ${[
              { res: 'Total vCPUs', limit: 10, used: 4 },
              { res: 'Standard BS Family vCPUs', limit: 10, used: 2 },
              { res: 'Standard DS Family vCPUs', limit: 10, used: 2 },
              { res: 'Public IP Addresses', limit: 10, used: 3 },
              { res: 'Virtual Networks', limit: 50, used: 2 },
              { res: 'Storage Accounts', limit: 250, used: 2 },
              { res: 'Resource Groups', limit: 980, used: AzureData.resourceGroups.length }
            ].map(q => {
              const pct = Math.round(q.used / q.limit * 100);
              return `
                <tr>
                  <td>${q.res}</td>
                  <td>${q.limit}</td>
                  <td>${q.used}</td>
                  <td>
                    <div style="display:flex;align-items:center;gap:8px">
                      <div class="progress-bar" style="width:100px;flex-shrink:0"><div class="progress-fill ${pct>80?'danger':pct>60?'warning':''}" style="width:${pct}%"></div></div>
                      <span style="font-size:12px">${pct}%</span>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
});

function openSubscriptionDetail(id) {
  const sub = AzureData.subscriptions.find(s => s.id === id);
  if (!sub) return;
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>💳 ${sub.name}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="grid-2" style="gap:12px">
          <div class="card"><div class="card-body">
            <div class="detail-prop"><div class="detail-prop-label">Subscription ID</div><div class="detail-prop-value" style="font-family:monospace;font-size:12px">${sub.subscriptionId}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">Offer ID</div><div class="detail-prop-value">${sub.offerId}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">Offer Name</div><div class="detail-prop-value">${sub.offerName}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">State</div><div class="detail-prop-value">${statusBadge(sub.state)}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">Created</div><div class="detail-prop-value">${sub.createdDate}</div></div>
          </div></div>
          <div class="card"><div class="card-body">
            <div class="metric-label">Credit Used</div>
            <div class="metric-value" style="color:#107c10">$${sub.spent.toFixed(2)}</div>
            <div class="metric-sub">of ${sub.spendingLimit} credit</div>
            <div class="progress-bar" style="margin-top:10px"><div class="progress-fill success" style="width:${sub.spent/parseFloat(sub.spendingLimit.replace('$',''))*100}%"></div></div>
            <div style="margin-top:10px;font-size:12px;color:#605e5c">
              <div>Resource Groups: <strong>${sub.resourceGroups}</strong></div>
              <div>Total Resources: <strong>${sub.resources}</strong></div>
              <div>Default Region: <strong>${sub.region}</strong></div>
            </div>
          </div></div>
        </div>
        <div class="info-box" style="margin-top:16px">
          <span>💡</span>
          <span>Your <strong>Azure for Students</strong> subscription gives you $100 credit for 12 months without needing a credit card. When the credit runs out or expires, your resources are paused (not deleted) for 30 days before deletion. Export important data before expiry!</span>
        </div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Close</button></div>
    </div>
  `);
}
