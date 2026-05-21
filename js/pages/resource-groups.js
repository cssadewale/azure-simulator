/* =====================================================
   RESOURCE GROUPS PAGE
   ===================================================== */

registerPage('resource-groups', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Resource Groups</div>
      <div class="page-title"><div class="page-title-icon">📁</div><span>Resource Groups</span></div>
      <div class="page-subtitle">A container that holds related Azure resources for a solution. Manage lifecycle, permissions, and billing as a group.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openCreateRGModal()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create
        </button>
        <button class="btn btn-secondary" onclick="showToast('Refreshing resource groups...','info')">Refresh</button>
      </div>
    </div>

    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is a Resource Group?</strong> Think of it as a folder for your Azure resources. Every resource (VM, database, storage, etc.) must belong to one resource group. You can give it a name, region, and tags. Deleting a resource group deletes everything inside it — so be careful!</div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">All Resource Groups (${AzureData.resourceGroups.length})</div>
        <input type="text" class="form-control" style="width:220px" placeholder="Filter by name..." oninput="filterRGs(this.value)">
      </div>
      <div style="overflow-x:auto">
        <table class="data-table" id="rgTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Subscription</th>
              <th>Region</th>
              <th>Resources</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="rgTableBody">
            ${renderRGRows()}
          </tbody>
        </table>
      </div>
    </div>
  `;
});

function renderRGRows(filter = '') {
  return AzureData.resourceGroups
    .filter(rg => !filter || rg.name.toLowerCase().includes(filter.toLowerCase()))
    .map(rg => `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:18px">📁</span>
            <a class="link" onclick="openRGDetail('${rg.id}')">${rg.name}</a>
          </div>
        </td>
        <td>${rg.subscription || 'Azure for Students'}</td>
        <td>${rg.region}</td>
        <td>${rg.resources}</td>
        <td>${statusBadge(rg.status)}</td>
        <td>${rg.created}</td>
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn btn-ghost btn-sm" onclick="openRGDetail('${rg.id}')">View</button>
            <button class="btn btn-ghost btn-sm" onclick="deleteRG('${rg.id}','${rg.name}')" style="color:#a4262c">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
}

function filterRGs(val) {
  document.getElementById('rgTableBody').innerHTML = renderRGRows(val);
}

function openRGDetail(id) {
  const rg = AzureData.resourceGroups.find(r => r.id === id);
  if (!rg) return;
  openModal(`
    <div class="modal">
      <div class="modal-header">
        <h2>📁 ${rg.name}</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="card" style="margin-bottom:16px">
          <div class="card-header"><div class="card-title">Overview</div></div>
          <div class="card-body">
            <div class="grid-2">
              <div>
                <div class="detail-prop"><div class="detail-prop-label">Resource Group</div><div class="detail-prop-value">${rg.name}</div></div>
                <div class="detail-prop"><div class="detail-prop-label">Subscription</div><div class="detail-prop-value">${rg.subscription || 'Azure for Students'}</div></div>
                <div class="detail-prop"><div class="detail-prop-label">Region</div><div class="detail-prop-value">${rg.region}</div></div>
              </div>
              <div>
                <div class="detail-prop"><div class="detail-prop-label">Resources</div><div class="detail-prop-value">${rg.resources}</div></div>
                <div class="detail-prop"><div class="detail-prop-label">Status</div><div class="detail-prop-value">${statusBadge(rg.status)}</div></div>
                <div class="detail-prop"><div class="detail-prop-label">Created</div><div class="detail-prop-value">${rg.created}</div></div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">Tags</div></div>
          <div class="card-body">
            ${Object.entries(rg.tags || {}).map(([k,v]) => `
              <span style="display:inline-block;background:#deecf9;color:#0078D4;padding:3px 10px;border-radius:10px;font-size:12px;margin:3px">${k}: ${v}</span>
            `).join('') || '<span style="color:#8a8886;font-size:13px">No tags</span>'}
          </div>
        </div>
        <div class="info-box" style="margin-top:16px">
          <span>💡</span>
          <span>Use tags like <code>environment: dev</code>, <code>owner: adewale</code>, and <code>project: data-science</code> to organize and track costs across resource groups.</span>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-danger btn-sm" onclick="deleteRG('${rg.id}','${rg.name}');closeModal()">Delete Group</button>
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      </div>
    </div>
  `);
}

function deleteRG(id, name) {
  confirmAction(
    'Delete Resource Group',
    `Are you sure you want to delete <strong>${name}</strong>? All resources inside it will be permanently deleted. This cannot be undone.`,
    () => {
      const idx = AzureData.resourceGroups.findIndex(r => r.id === id);
      if (idx !== -1) {
        AzureData.resourceGroups.splice(idx, 1);
        showToast(`Resource group '${name}' deleted.`, 'success');
        navigateTo('resource-groups');
      }
    },
    true
  );
}

function openCreateRGModal() {
  openModal(`
    <div class="modal">
      <div class="modal-header">
        <h2>📁 Create Resource Group</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="info-box" style="margin-bottom:16px">
          <span>📘</span>
          <span>A resource group is a logical container for related Azure resources. Choose a meaningful name and a region close to your users for lower latency.</span>
        </div>
        <div class="form-group">
          <label class="form-label">Subscription *</label>
          <select class="form-control"><option>Azure for Students</option></select>
        </div>
        <div class="form-group">
          <label class="form-label">Resource Group Name *</label>
          <input id="rgName" class="form-control" placeholder="e.g. rg-my-project" />
          <div style="font-size:11px;color:#8a8886;margin-top:4px">Use lowercase letters, numbers, hyphens. No spaces. 1–90 characters.</div>
        </div>
        <div class="form-group">
          <label class="form-label">Region *</label>
          <select id="rgRegion" class="form-control">
            ${AzureData.regions.map(r => `<option>${r}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Tags (optional)</label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <input class="form-control" placeholder="Name (e.g. environment)" id="tagKey1"/>
            <input class="form-control" placeholder="Value (e.g. dev)" id="tagVal1"/>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="createRG()">Create</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function createRG() {
  const name = document.getElementById('rgName').value.trim();
  const region = document.getElementById('rgRegion').value;
  if (!name) { showToast('Resource group name is required.', 'error'); return; }
  if (!/^[a-z0-9\-_\.()]+$/i.test(name)) { showToast('Invalid name. Use only letters, numbers, hyphens.', 'error'); return; }
  const tagKey = document.getElementById('tagKey1').value;
  const tagVal = document.getElementById('tagVal1').value;
  const tags = tagKey ? { [tagKey]: tagVal } : {};
  AzureData.resourceGroups.push({ id: newGuid(), name, region, resources: 0, status: 'Active', created: todayStr(), subscription: 'Azure for Students', tags });
  showToast(`Resource group '${name}' created successfully!`, 'success');
  closeModal();
  navigateTo('resource-groups');
}
