/* =====================================================
   V3-CORE.JS — Core v3.0 Features
   Tags Manager, Resource Locks, IAM/RBAC, 
   Deployment History, Diagnostic Settings,
   Azure Policy, SVG Metrics Charts, Pagination
   Author: Adewale Samson Adeagbo | cssadewale
   ===================================================== */

/* =====================================================
   TAGS MANAGER
   What: Every Azure resource can have tags — key:value
   pairs used for cost tracking, ownership, and automation.
   In real Azure you edit tags on any resource's Tags blade.
   ===================================================== */

function openTagsModal(resourceType, resourceId, currentTags) {
  let tags = Object.entries(currentTags || {}).map(([k,v]) => ({k,v}));
  if (tags.length === 0) tags = [{k:'',v:''}];

  function renderTagRows() {
    return tags.map((t,i) => `
      <div class="tag-row" id="tag-row-${i}">
        <input class="form-control" placeholder="Name (e.g. environment)" value="${t.k}" 
               onchange="v3Tags[${i}].k=this.value" id="tag-k-${i}"/>
        <input class="form-control" placeholder="Value (e.g. production)" value="${t.v}"
               onchange="v3Tags[${i}].v=this.value" id="tag-v-${i}"/>
        <button class="tag-remove" onclick="removeTag(${i})" title="Remove tag">×</button>
      </div>
    `).join('');
  }

  window.v3Tags = [...tags];
  window.removeTag = (i) => {
    window.v3Tags.splice(i,1);
    if (window.v3Tags.length === 0) window.v3Tags.push({k:'',v:''});
    document.getElementById('tagsEditorBody').innerHTML = renderTagRows();
  };
  window.addTag = () => {
    window.v3Tags.push({k:'',v:''});
    document.getElementById('tagsEditorBody').innerHTML = renderTagRows();
  };
  window.saveTags = () => {
    // Sync DOM values before saving
    window.v3Tags.forEach((t,i) => {
      const k = document.getElementById(`tag-k-${i}`);
      const v = document.getElementById(`tag-v-${i}`);
      if (k) t.k = k.value.trim();
      if (v) t.v = v.value.trim();
    });
    const newTags = {};
    window.v3Tags.filter(t => t.k).forEach(t => newTags[t.k] = t.v);
    // Update the resource in AzureData
    let resource = findResourceById(resourceId);
    if (resource) resource.tags = newTags;
    showToast(`Tags saved successfully!`, 'success');
    logActivity('update', 'Updated resource tags', resourceId, '—');
    closeModal();
    navigateTo(AppState.currentPage);
  };

  openModal(`
    <div class="modal" style="max-width:580px">
      <div class="modal-header">
        <h2>🏷️ Edit Tags — ${resourceType}</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="info-box" style="margin-bottom:16px">
          <span>📘</span>
          <div><strong>What are Resource Tags?</strong> Tags are name-value metadata pairs you attach to Azure resources. They are used for:<br>
          • <strong>Cost allocation</strong> — filter bills by department, project, or owner<br>
          • <strong>Automation</strong> — scripts can find resources by tag (e.g. auto-shutdown VMs with tag <code>autoshutdown: true</code>)<br>
          • <strong>Organisation</strong> — quickly find all resources belonging to a project<br>
          Tag names are case-insensitive. Each resource can have up to 50 tags. Tag names max 512 chars, values max 256 chars.</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr auto;gap:8px;margin-bottom:8px">
          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;padding:0 2px">Name</div>
          <div style="font-size:11px;font-weight:700;color:var(--text-muted);text-transform:uppercase;padding:0 2px">Value</div>
          <div></div>
        </div>
        <div class="tags-editor" id="tagsEditorBody">${renderTagRows()}</div>
        <button class="btn btn-ghost btn-sm" onclick="addTag()" style="margin-top:10px">+ Add tag</button>
        <div class="info-box warning" style="margin-top:16px">
          <span>⚠️</span>
          <span>Tags are not inherited by child resources. If you want all resources in a resource group to share tags, use <strong>Azure Policy</strong> to enforce tag inheritance automatically.</span>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="saveTags()">Save</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

/* =====================================================
   RESOURCE LOCKS
   What: Prevents accidental deletion or modification.
   Two lock types: CanNotDelete and ReadOnly.
   Even Owners cannot delete a locked resource without
   first removing the lock.
   ===================================================== */

const ResourceLocks = {};

function openLocksModal(resourceName, resourceType) {
  const locks = ResourceLocks[resourceName] || [];
  function renderLocks() {
    return locks.length === 0
      ? '<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px">No locks configured</div>'
      : locks.map((l,i) => `
          <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--card-border)">
            <span style="font-size:20px">${l.type==='CanNotDelete'?'🔒':'📵'}</span>
            <div style="flex:1">
              <div style="font-weight:700;font-size:13px">${l.name}</div>
              <div style="font-size:12px;color:var(--text-muted)">${l.type} · Added by: ${l.by} · ${l.added}</div>
              <div style="font-size:12px;color:var(--text-muted);margin-top:2px">${l.notes || ''}</div>
            </div>
            <span class="lock-badge ${l.type==='CanNotDelete'?'delete':''}">${l.type}</span>
            <button class="btn btn-danger btn-sm" onclick="deleteLock('${resourceName}',${i})">Delete</button>
          </div>
        `).join('');
  }
  window.deleteLock = (res, idx) => {
    ResourceLocks[res].splice(idx,1);
    showToast('Lock deleted', 'success');
    logActivity('delete', 'Deleted resource lock', res, '—');
    closeModal();
  };
  window.addLock = () => {
    const name = document.getElementById('lockName').value.trim();
    const type = document.getElementById('lockType').value;
    const notes = document.getElementById('lockNotes').value.trim();
    if (!name) { showToast('Lock name required','error'); return; }
    if (!ResourceLocks[resourceName]) ResourceLocks[resourceName] = [];
    ResourceLocks[resourceName].push({ name, type, by: AzureData.user.email, added: todayStr(), notes });
    showToast(`Lock "${name}" applied to ${resourceName}`, 'success');
    logActivity('create', 'Added resource lock', resourceName, '—');
    closeModal();
  };

  openModal(`
    <div class="modal" style="max-width:560px">
      <div class="modal-header">
        <h2>🔒 Resource Locks — ${resourceName}</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="info-box" style="margin-bottom:16px">
          <span>📘</span>
          <div><strong>What are Resource Locks?</strong> Locks prevent accidental modification or deletion — even by resource Owners. Two types:<br>
          • <strong>CanNotDelete</strong> — Users can read and modify but cannot delete. Use this on production databases.<br>
          • <strong>ReadOnly</strong> — Users can only read. No modifications or deletions allowed. Use on critical infrastructure.<br>
          Locks are inherited: a lock on a resource group applies to all resources inside it. You must remove the lock before deleting the resource.</div>
        </div>
        <div id="locksListBody">${renderLocks()}</div>
        <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--card-border)">
          <div style="font-size:13px;font-weight:700;margin-bottom:12px">Add Lock</div>
          <div class="form-group">
            <label class="form-label">Lock Name *</label>
            <input id="lockName" class="form-control" placeholder="e.g. production-delete-lock"/>
          </div>
          <div class="form-group">
            <label class="form-label">Lock Type *</label>
            <select id="lockType" class="form-control">
              <option value="CanNotDelete">CanNotDelete — Allow read/modify, prevent delete</option>
              <option value="ReadOnly">ReadOnly — Allow read only, prevent all changes</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Notes (optional)</label>
            <input id="lockNotes" class="form-control" placeholder="Reason for this lock..."/>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="addLock()">Add Lock</button>
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      </div>
    </div>
  `);
}

/* =====================================================
   IAM / RBAC ROLE ASSIGNMENT
   What: Assign roles (Owner, Contributor, Reader, custom)
   to users, groups, or service principals on any resource.
   This is Role-Based Access Control — the core of Azure
   identity and security.
   ===================================================== */

const RoleAssignments = {
  global: [
    { principal: 'Adewale Samson Adeagbo', email: AzureData.user.email, type: 'User', role: 'Owner', scope: 'Subscription', initials: 'AA', since: '2024-01-15' },
    { principal: 'ML Service Principal', email: 'ml-svc@cssadewale.dev', type: 'ServicePrincipal', role: 'Contributor', scope: 'Resource Group', initials: 'ML', since: '2024-02-01' },
    { principal: 'Databricks Service', email: 'dbr-svc@cssadewale.dev', type: 'ServicePrincipal', role: 'Reader', scope: 'Resource Group', initials: 'DB', since: '2024-02-05' },
    { principal: 'Data Scientists Group', email: 'grp-ds@cssadewale.dev', type: 'Group', role: 'Contributor', scope: 'Subscription', initials: 'DS', since: '2024-01-20' }
  ]
};

const AZURE_ROLES = [
  { name: 'Owner', desc: 'Full access to all resources including the ability to assign roles' },
  { name: 'Contributor', desc: 'Create and manage all Azure resources but cannot assign roles' },
  { name: 'Reader', desc: 'View all resources but cannot make any changes' },
  { name: 'User Access Administrator', desc: 'Manage user access to Azure resources' },
  { name: 'Storage Blob Data Contributor', desc: 'Read, write, delete Azure Storage blob containers and data' },
  { name: 'Storage Blob Data Reader', desc: 'Read and list Azure Storage blob containers and data' },
  { name: 'Key Vault Secrets User', desc: 'Read secret contents from Key Vault' },
  { name: 'Key Vault Contributor', desc: 'Manage key vaults, but not access to secrets or keys' },
  { name: 'AzureML Data Scientist', desc: 'Perform all actions within an Azure ML workspace' },
  { name: 'Monitoring Reader', desc: 'Read all monitoring data' },
  { name: 'Monitoring Contributor', desc: 'Read all monitoring data and edit monitoring settings' },
  { name: 'Cost Management Reader', desc: 'View cost data and configuration' },
  { name: 'SQL DB Contributor', desc: 'Manage SQL databases but not security-related policies' },
  { name: 'Virtual Machine Contributor', desc: 'Manage VMs but not the VNet or storage account' },
  { name: 'Network Contributor', desc: 'Manage networks but not access to them' }
];

function openIAMModal(scope) {
  const assignments = RoleAssignments.global;
  function renderAssignments(filter) {
    const filtered = filter
      ? assignments.filter(a => a.principal.toLowerCase().includes(filter) || a.role.toLowerCase().includes(filter))
      : assignments;
    return filtered.map((a,i) => `
      <div class="iam-assignment">
        <div class="iam-avatar" style="background:${a.type==='Group'?'#107c10':a.type==='ServicePrincipal'?'#8764b8':'#0078D4'}">${a.initials}</div>
        <div class="iam-info">
          <div class="iam-name">${a.principal}</div>
          <div class="iam-email">${a.email}</div>
          <div style="font-size:11px;margin-top:2px">
            <span class="badge badge-info" style="font-size:10px">${a.type}</span>
            · Since ${a.since}
          </div>
        </div>
        <div>
          <span class="badge badge-running">${a.role}</span><br>
          <span style="font-size:11px;color:var(--text-muted)">${a.scope}</span>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="removeRoleAssignment(${i})" style="color:#a4262c">Remove</button>
      </div>
    `).join('') || '<div style="padding:20px;text-align:center;color:var(--text-muted)">No assignments match your filter</div>';
  }

  window.removeRoleAssignment = (i) => {
    const a = RoleAssignments.global[i];
    RoleAssignments.global.splice(i,1);
    showToast(`Removed ${a.role} from ${a.principal}`, 'success');
    logActivity('delete', 'Removed role assignment', a.principal, scope);
    document.getElementById('iamListBody').innerHTML = renderAssignments('');
  };
  window.addRoleAssignment = () => {
    const principal = document.getElementById('iamPrincipal').value.trim();
    const role = document.getElementById('iamRole').value;
    const type = document.getElementById('iamType').value;
    if (!principal) { showToast('Principal name required','error'); return; }
    const initials = principal.split(' ').map(n=>n[0]).join('').toUpperCase().substring(0,2);
    RoleAssignments.global.push({ principal, email: `${principal.toLowerCase().replace(/\s/g,'-')}@cssadewale.dev`, type, role, scope: scope || 'Subscription', initials, since: todayStr() });
    showToast(`Assigned ${role} to ${principal}`, 'success');
    logActivity('create', `Assigned role: ${role}`, principal, scope);
    document.getElementById('iamListBody').innerHTML = renderAssignments('');
  };

  openModal(`
    <div class="modal" style="max-width:680px">
      <div class="modal-header">
        <h2>👥 Access Control (IAM) — ${scope || 'Subscription'}</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="info-box" style="margin-bottom:16px">
          <span>📘</span>
          <div><strong>What is IAM (Identity & Access Management)?</strong> Azure uses RBAC (Role-Based Access Control) to control who can do what on which resources. You assign a <strong>Role</strong> to a <strong>Security Principal</strong> (user, group, or service principal) at a specific <strong>Scope</strong> (subscription, resource group, or resource). The role defines the allowed actions. Azure has 70+ built-in roles plus you can create custom roles.<br><br>
          <strong>Best practice:</strong> Always use the <em>principle of least privilege</em> — give only the minimum permissions needed. Use <strong>Managed Identity</strong> for services instead of storing credentials.</div>
        </div>
        <div class="tab-bar" id="iamTabBar">
          <button class="tab-item active" data-tab="assignments" onclick="setActiveTab('iamTabBar','assignments')">Role Assignments</button>
          <button class="tab-item" data-tab="roles" onclick="setActiveTab('iamTabBar','roles')">Roles</button>
          <button class="tab-item" data-tab="add" onclick="setActiveTab('iamTabBar','add')">+ Add Assignment</button>
        </div>
        <div data-pane="assignments">
          <div style="display:flex;gap:8px;margin-bottom:12px">
            <input class="form-control" placeholder="Filter by name or role..." style="max-width:280px" oninput="document.getElementById('iamListBody').innerHTML=renderAssignments?renderAssignments(this.value.toLowerCase()):''" />
          </div>
          <div id="iamListBody">${renderAssignments('')}</div>
        </div>
        <div data-pane="roles" style="display:none">
          <table class="data-table">
            <thead><tr><th>Role Name</th><th>Type</th><th>Description</th></tr></thead>
            <tbody>
              ${AZURE_ROLES.map(r => `
                <tr>
                  <td><strong>${r.name}</strong></td>
                  <td><span class="badge badge-info">Built-in</span></td>
                  <td style="font-size:12px;color:var(--text-muted)">${r.desc}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div data-pane="add" style="display:none">
          <div class="form-group">
            <label class="form-label">Role *</label>
            <select id="iamRole" class="form-control">
              ${AZURE_ROLES.map(r => `<option value="${r.name}">${r.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Principal Type *</label>
            <select id="iamType" class="form-control">
              <option value="User">User</option>
              <option value="Group">Group</option>
              <option value="ServicePrincipal">Service Principal / Managed Identity</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Search for User / Group / Service Principal *</label>
            <input id="iamPrincipal" class="form-control" placeholder="e.g. Adewale Samson Adeagbo"/>
            <div style="font-size:11px;color:var(--text-muted);margin-top:4px">In real Azure, this searches your Microsoft Entra ID (Azure AD) tenant.</div>
          </div>
          <div class="form-group">
            <label class="form-label">Scope</label>
            <input class="form-control" value="${scope || 'Subscription: Azure for Students'}" readonly/>
          </div>
          <button class="btn btn-primary" onclick="addRoleAssignment()">Add Assignment</button>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      </div>
    </div>
  `);
  setTimeout(() => {
    const bar = document.getElementById('iamTabBar');
    if (bar) initTabs('iamTabBar', 'assignments');
  }, 50);
}

/* =====================================================
   DEPLOYMENT HISTORY
   What: Every ARM template deployment is recorded.
   You can view the template, parameters, outputs, and
   errors for each deployment — essential for debugging.
   ===================================================== */

const DeploymentHistory = [
  { name: 'azure-simulator-infra-v1', rg: 'rg-data-science-lab', status: 'succeeded', by: 'adewale@cssadewale.dev', started: '2024-01-20 14:22', duration: '4m 12s', resources: 8, template: 'Microsoft.Compute/virtualMachines + Microsoft.Storage/storageAccounts' },
  { name: 'ml-workspace-deploy', rg: 'rg-ml-experiments', status: 'succeeded', by: 'adewale@cssadewale.dev', started: '2024-02-10 09:15', duration: '6m 44s', resources: 5, template: 'Microsoft.MachineLearningServices/workspaces' },
  { name: 'databricks-setup', rg: 'rg-ml-experiments', status: 'succeeded', by: 'adewale@cssadewale.dev', started: '2024-02-05 11:30', duration: '3m 18s', resources: 3, template: 'Microsoft.Databricks/workspaces' },
  { name: 'networking-baseline', rg: 'rg-networking-lab', status: 'succeeded', by: 'adewale@cssadewale.dev', started: '2024-03-05 16:00', duration: '1m 55s', resources: 4, template: 'Microsoft.Network/virtualNetworks + subnets + NSGs' },
  { name: 'storage-pipeline-update', rg: 'rg-data-science-lab', status: 'failed', by: 'adf-svc@cssadewale.dev', started: '2024-03-12 08:00', duration: '0m 32s', resources: 0, template: 'Microsoft.Storage/storageAccounts', error: 'StorageAccountAlreadyExists: The name adewalemlstorage is already taken.' }
];

function openDeploymentHistory(rg) {
  const deps = rg ? DeploymentHistory.filter(d => d.rg === rg) : DeploymentHistory;
  openModal(`
    <div class="modal" style="max-width:720px">
      <div class="modal-header">
        <h2>📦 Deployment History${rg ? ` — ${rg}` : ''}</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="info-box" style="margin-bottom:16px">
          <span>📘</span>
          <div><strong>What is Deployment History?</strong> Every time you deploy an ARM template (via portal, CLI, or GitHub Actions), Azure records it here. You can see the template that was used, the parameters passed, any outputs generated, and detailed error messages if it failed. This is invaluable for debugging infrastructure-as-code issues and auditing changes.</div>
        </div>
        <div style="margin-bottom:8px;font-size:13px;color:var(--text-muted)">${deps.length} deployment${deps.length!==1?'s':''} found</div>
        <div>
          ${deps.map((d,i) => `
            <div class="deployment-item" onclick="openDeploymentDetail(${i})">
              <div class="deployment-status-icon ${d.status}">
                ${d.status==='succeeded'?'✓':d.status==='running'?'⟳':'✗'}
              </div>
              <div class="deployment-info">
                <div class="deployment-name">${d.name}</div>
                <div class="deployment-meta">${d.rg} · ${d.by} · ${d.resources} resources · ${d.template}</div>
                ${d.error ? `<div style="font-size:11px;color:#a4262c;margin-top:2px">⚠ ${d.error}</div>` : ''}
              </div>
              <div class="deployment-duration">
                <div style="font-size:11px;color:var(--text-muted)">${d.started}</div>
                <div style="font-size:11px;color:var(--text-muted)">${d.duration}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Close</button></div>
    </div>
  `);
  window.openDeploymentDetail = (i) => {
    const d = DeploymentHistory[i];
    showToast(`Deployment: ${d.name} — ${d.status} (${d.duration})`, d.status === 'succeeded' ? 'success' : 'error');
  };
}

/* =====================================================
   DIAGNOSTIC SETTINGS
   What: Configure where logs and metrics are sent.
   Can send to: Log Analytics Workspace, Storage Account,
   Event Hub, or Partner Solutions.
   ===================================================== */

const DiagSettings = {};

function openDiagnosticSettings(resourceName) {
  const categories = [
    { name: 'AuditLogs', desc: 'All audit events for this resource', enabled: true },
    { name: 'SignInLogs', desc: 'User sign-in events', enabled: false },
    { name: 'AllMetrics', desc: 'All numeric time-series metrics', enabled: true },
    { name: 'OperationLogs', desc: 'Resource operation logs', enabled: false },
    { name: 'SecurityLogs', desc: 'Security-related events', enabled: true },
    { name: 'RequestLogs', desc: 'All HTTP requests to this resource', enabled: false }
  ];
  const settings = DiagSettings[resourceName] || categories;
  DiagSettings[resourceName] = settings;

  openModal(`
    <div class="modal" style="max-width:600px">
      <div class="modal-header">
        <h2>📋 Diagnostic Settings — ${resourceName}</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="info-box" style="margin-bottom:16px">
          <span>📘</span>
          <div><strong>What are Diagnostic Settings?</strong> Configure which logs and metrics flow to your monitoring destinations. Each destination has a cost:<br>
          • <strong>Log Analytics Workspace</strong> — Query logs with KQL. Best for analysis. (~$2.76/GB ingested)<br>
          • <strong>Storage Account</strong> — Archive logs cheaply (~$0.018/GB/month). For compliance/audit retention.<br>
          • <strong>Event Hub</strong> — Stream logs to third-party SIEM tools (Splunk, Azure Sentinel).<br>
          Best practice: Enable at minimum AllMetrics and AuditLogs on every production resource.</div>
        </div>
        <div class="form-group">
          <label class="form-label">Diagnostic Setting Name *</label>
          <input class="form-control" id="diagName" value="${resourceName}-diag-settings" />
        </div>
        <div class="form-group">
          <label class="form-label">Destination</label>
          <select class="form-control" id="diagDest">
            <option>Log Analytics Workspace — adewale-log-workspace</option>
            <option>Storage Account — datasciencefiles01</option>
            <option>Event Hub — adewale-event-hub-ns</option>
          </select>
        </div>
        <div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin:16px 0 8px">Log Categories</div>
        ${settings.map((cat,i) => `
          <div class="diag-category">
            <button class="diag-toggle ${cat.enabled?'on':''}" id="diag-toggle-${i}" 
                    onclick="this.classList.toggle('on');DiagSettings['${resourceName}'][${i}].enabled=this.classList.contains('on')"
                    title="Toggle ${cat.name}"></button>
            <label onclick="document.getElementById('diag-toggle-${i}').click()">
              <strong>${cat.name}</strong>
              <span style="font-size:11px;color:var(--text-muted);margin-left:8px">${cat.desc}</span>
            </label>
          </div>
        `).join('')}
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="saveDiagSettings('${resourceName}')">Save</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function saveDiagSettings(resourceName) {
  const name = document.getElementById('diagName').value;
  const dest = document.getElementById('diagDest').value.split(' — ')[0];
  showToast(`Diagnostic settings "${name}" saved → ${dest}`, 'success');
  logActivity('update', 'Updated diagnostic settings', resourceName, '—');
  closeModal();
}

/* =====================================================
   SVG LINE CHART ENGINE
   Draws real SVG charts from data arrays — no library.
   Used across Monitor, VM metrics, Cost charts.
   ===================================================== */

function renderSVGChart(containerId, datasets, options = {}) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const W = el.clientWidth || 500;
  const H = options.height || 160;
  const pad = { top: 10, right: 20, bottom: 30, left: 45 };
  const cW = W - pad.left - pad.right;
  const cH = H - pad.top - pad.bottom;

  const allVals = datasets.flatMap(d => d.values);
  const minV = options.min !== undefined ? options.min : Math.min(...allVals) * 0.9;
  const maxV = options.max !== undefined ? options.max : Math.max(...allVals) * 1.1 || 100;

  const colors = ['#0078D4','#00B4D8','#107c10','#d83b01','#8764b8'];
  const labels = options.labels || datasets[0]?.values.map((_,i) => `${i+1}`);
  const n = datasets[0]?.values.length || 1;

  function xPos(i) { return pad.left + (i / (n-1)) * cW; }
  function yPos(v) { return pad.top + cH - ((v - minV) / (maxV - minV)) * cH; }

  let svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg" class="svg-chart">`;

  // Grid lines
  const gridY = 4;
  for (let i = 0; i <= gridY; i++) {
    const y = pad.top + (cH / gridY) * i;
    const val = maxV - ((maxV - minV) / gridY) * i;
    svg += `<line x1="${pad.left}" y1="${y}" x2="${W - pad.right}" y2="${y}" class="grid-line"/>`;
    svg += `<text x="${pad.left - 5}" y="${y + 4}" text-anchor="end" class="axis-label">${options.format ? options.format(val) : Math.round(val)}</text>`;
  }

  // X-axis labels
  const labelEvery = Math.ceil(n / 8);
  labels.forEach((label, i) => {
    if (i % labelEvery === 0 || i === n - 1) {
      svg += `<text x="${xPos(i)}" y="${H - 4}" text-anchor="middle" class="axis-label">${label}</text>`;
    }
  });

  // Dataset lines and areas
  datasets.forEach((ds, di) => {
    const col = colors[di % colors.length];
    const pts = ds.values.map((v,i) => `${xPos(i)},${yPos(v)}`).join(' ');
    const areaClose = `${xPos(n-1)},${pad.top + cH} ${xPos(0)},${pad.top + cH}`;

    // Area fill
    svg += `<polygon points="${pts} ${areaClose}" fill="${col}" opacity="0.08"/>`;
    // Line
    svg += `<polyline points="${pts}" fill="none" stroke="${col}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    // Dots on hover
    ds.values.forEach((v, i) => {
      svg += `<circle cx="${xPos(i)}" cy="${yPos(v)}" r="3.5" fill="${col}" opacity="0">
        <title>${labels[i]}: ${options.format ? options.format(v) : v}${options.unit || ''}</title>
        <animate attributeName="opacity" from="0" to="0" dur="0.1s"/>
      </circle>`;
    });
  });

  // Legend
  if (datasets.length > 1) {
    datasets.forEach((ds, di) => {
      svg += `<rect x="${pad.left + di * 110}" y="${H - 12}" width="10" height="3" fill="${colors[di % colors.length]}" rx="1"/>`;
      svg += `<text x="${pad.left + di * 110 + 14}" y="${H - 6}" class="axis-label">${ds.name}</text>`;
    });
  }

  svg += '</svg>';
  el.innerHTML = svg;

  // Add hover interactivity
  el.querySelectorAll('circle').forEach(c => {
    c.addEventListener('mouseenter', () => c.setAttribute('opacity', '1'));
    c.addEventListener('mouseleave', () => c.setAttribute('opacity', '0'));
  });
}

/* =====================================================
   AZURE POLICY ENGINE (Simulated)
   What: Enforce organisational standards.
   Policies evaluate resources against rules and mark
   them Compliant or Non-Compliant.
   ===================================================== */

const PolicyDefinitions = [
  { id: 'pol-001', name: 'Require tags on resources', category: 'Tags', effect: 'Deny', compliant: 8, nonCompliant: 4, desc: 'Enforces that all resources have the required tags: environment, owner, and project.' },
  { id: 'pol-002', name: 'Allowed VM SKUs', category: 'Compute', effect: 'Deny', compliant: 3, nonCompliant: 0, desc: 'Restricts VM sizes to approved list (B-series and D-series only) to control costs.' },
  { id: 'pol-003', name: 'Storage must use HTTPS only', category: 'Storage', effect: 'Audit', compliant: 2, nonCompliant: 0, desc: 'Audits storage accounts that allow HTTP traffic (insecure).' },
  { id: 'pol-004', name: 'Enable diagnostic logs', category: 'Monitoring', effect: 'AuditIfNotExists', compliant: 6, nonCompliant: 6, desc: 'Audits resources that do not have diagnostic settings configured.' },
  { id: 'pol-005', name: 'No public IP on SQL servers', category: 'Security', effect: 'Deny', compliant: 1, nonCompliant: 0, desc: 'Denies creation of SQL servers with a public endpoint.' },
  { id: 'pol-006', name: 'Key Vault soft delete enabled', category: 'Security', effect: 'Audit', compliant: 1, nonCompliant: 0, desc: 'Audits Key Vaults that do not have soft delete enabled.' }
];

function openPolicyPage(container) {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Azure Policy</div>
      <div class="page-title"><div class="page-title-icon">📋</div><span>Azure Policy</span></div>
      <div class="page-subtitle">Implement governance at scale — enforce, audit, and remediate organisational standards across all Azure resources.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openAssignPolicyModal()">+ Assign Policy</button>
        <button class="btn btn-secondary" onclick="showToast('Compliance scan started...','info');setTimeout(()=>showToast('Compliance scan complete!','success'),2000)">Run Compliance Scan</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Policy?</strong> A service that enforces and audits rules across your Azure resources to ensure compliance with organisational standards. Policy <strong>effects</strong>:<br>
      • <strong>Deny</strong> — Block the resource deployment if it violates the policy<br>
      • <strong>Audit</strong> — Allow the resource but mark it as Non-Compliant in the dashboard<br>
      • <strong>AuditIfNotExists</strong> — Audit if a related resource (e.g., diagnostic setting) does not exist<br>
      • <strong>DeployIfNotExists</strong> — Automatically deploy a related resource if missing<br>
      • <strong>Modify</strong> — Add or update properties (e.g., automatically add a tag)<br>
      Azure Policy is essential for enforcing security baselines, cost controls, and governance at scale.</div>
    </div>
    <!-- Compliance Summary -->
    <div class="grid-4" style="margin-bottom:20px">
      ${[
        { label: 'Policies Assigned', val: PolicyDefinitions.length, color: '#0078D4' },
        { label: 'Compliant Resources', val: PolicyDefinitions.reduce((a,p)=>a+p.compliant,0), color: '#107c10' },
        { label: 'Non-Compliant', val: PolicyDefinitions.reduce((a,p)=>a+p.nonCompliant,0), color: '#a4262c' },
        { label: 'Overall Compliance', val: Math.round(PolicyDefinitions.reduce((a,p)=>a+p.compliant,0)/(PolicyDefinitions.reduce((a,p)=>a+p.compliant+p.nonCompliant,0)||1)*100)+'%', color: '#107c10' }
      ].map(m => `
        <div class="metric-card" style="border-top:3px solid ${m.color}">
          <div class="metric-label">${m.label}</div>
          <div class="metric-value" style="color:${m.color}">${m.val}</div>
        </div>
      `).join('')}
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Policy Assignments</div></div>
      <div class="card-body" style="padding:0">
        ${PolicyDefinitions.map(p => {
          const total = p.compliant + p.nonCompliant;
          const pct = total > 0 ? Math.round(p.compliant/total*100) : 100;
          return `
          <div class="policy-item">
            <div style="font-size:24px">${p.category==='Tags'?'🏷️':p.category==='Compute'?'🖥️':p.category==='Storage'?'💾':p.category==='Security'?'🛡️':'📊'}</div>
            <div style="flex:1">
              <div style="font-weight:700;font-size:13px;margin-bottom:4px">${p.name}</div>
              <div style="font-size:12px;color:var(--text-muted);margin-bottom:6px">${p.desc}</div>
              <div style="display:flex;align-items:center;gap:10px">
                <span class="badge badge-info">${p.category}</span>
                <span class="badge badge-${p.effect==='Deny'?'stopped':'warning'}">${p.effect}</span>
                <span style="font-size:12px;color:var(--text-muted)">${p.compliant} compliant · ${p.nonCompliant} non-compliant</span>
              </div>
              <div class="policy-compliance-bar">
                <div class="policy-compliance-fill compliant" style="width:${pct}%"></div>
              </div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${pct}% compliant</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;align-items:flex-end">
              ${p.nonCompliant > 0 ? `<button class="btn btn-primary btn-sm" onclick="showToast('Remediating ${p.nonCompliant} non-compliant resources...','info');setTimeout(()=>showToast('Remediation complete!','success'),2000)">Remediate</button>` : ''}
              <button class="btn btn-ghost btn-sm" onclick="showToast('Viewing policy details...','info')">View</button>
            </div>
          </div>
        `}).join('')}
      </div>
    </div>
  `;
}

function openAssignPolicyModal() {
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>📋 Assign Policy</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Policy Definition *</label>
          <select class="form-control" id="newPolicyDef">
            <option>Require a tag on resources</option>
            <option>Allowed locations</option>
            <option>Allowed virtual machine size SKUs</option>
            <option>Audit VMs that do not use managed disks</option>
            <option>Configure Azure Activity logs to Log Analytics</option>
            <option>Enable Microsoft Defender for Storage</option>
            <option>Storage accounts should use private link</option>
            <option>SQL servers should have an Azure AD administrator</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Scope *</label>
          <select class="form-control"><option>Subscription: Azure for Students</option>${AzureData.resourceGroups.map(r=>`<option>Resource Group: ${r.name}</option>`).join('')}</select>
        </div>
        <div class="form-group">
          <label class="form-label">Effect</label>
          <select class="form-control"><option>Audit</option><option>Deny</option><option>AuditIfNotExists</option><option>DeployIfNotExists</option><option>Modify</option></select>
        </div>
        <div class="form-group">
          <label class="form-label">Assignment Name *</label>
          <input class="form-control" id="newPolicyName" placeholder="e.g. Require-tags-on-resources"/>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="
          const n=document.getElementById('newPolicyName').value||'New Policy';
          const d=document.getElementById('newPolicyDef').value;
          PolicyDefinitions.push({id:newGuid(),name:n,category:'Custom',effect:'Audit',compliant:0,nonCompliant:0,desc:d});
          showToast('Policy assigned: '+n,'success');
          logActivity('create','Assigned Azure Policy',n,'Subscription');
          closeModal();navigateTo('policy');">Assign</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

/* =====================================================
   FIND RESOURCE BY ID helper
   ===================================================== */
function findResourceById(id) {
  const allCollections = [
    AzureData.virtualMachines, AzureData.storageAccounts, AzureData.appServices,
    AzureData.functions, AzureData.sqlDatabases, AzureData.cosmosDb, AzureData.keyVaults,
    AzureData.virtualNetworks, AzureData.resourceGroups, AzureData.databricks,
    AzureData.synapseWorkspaces, AzureData.dataFactory, AzureData.eventHubs,
    AzureData.mlStudio.workspaces
  ];
  for (const col of allCollections) {
    const found = col.find(r => r.id === id || r.name === id);
    if (found) return found;
  }
  return null;
}

/* =====================================================
   PAGINATION HELPER
   ===================================================== */
function paginatedTable(items, pageSize, currentPage, renderRow, columns) {
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = items.slice(start, end);
  const totalPages = Math.ceil(items.length / pageSize);

  const rows = pageItems.map(renderRow).join('');
  const pageButtons = Array.from({length: totalPages}, (_,i) => i+1)
    .map(p => `<button class="pagination-btn ${p===currentPage?'active':''}" onclick="this.dataset.page='${p}'">${p}</button>`)
    .join('');

  return `
    <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">
      Showing ${Math.min(start+1, items.length)}–${Math.min(end, items.length)} of ${items.length} items
    </div>
    <table class="data-table">
      <thead><tr>${columns.map(c=>`<th>${c}</th>`).join('')}</tr></thead>
      <tbody>${rows}</tbody>
    </table>
    ${totalPages > 1 ? `<div class="pagination">
      <button class="pagination-btn" ${currentPage===1?'disabled':''} onclick="">‹</button>
      ${pageButtons}
      <button class="pagination-btn" ${currentPage===totalPages?'disabled':''} onclick="">›</button>
    </div>` : ''}
  `;
}

registerPage('policy', openPolicyPage);
