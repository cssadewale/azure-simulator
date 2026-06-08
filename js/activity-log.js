/* =====================================================
   ACTIVITY-LOG.JS
   Tracks every create/update/delete/action across the
   portal with timestamps, resource type, and caller.

   What is an Activity Log?
   In real Azure, the Activity Log records every operation
   performed on your resources — who did what, when, and
   whether it succeeded or failed. It uses Azure Resource
   Manager (ARM) audit logs. This is essential for:
   • Security auditing — who deleted that VM?
   • Troubleshooting — what changed before the outage?
   • Compliance — prove actions were authorised
   ===================================================== */

// In-memory activity log (persisted to localStorage)
let ActivityLog = [];

// Initialise from localStorage on load
(function initActivityLog() {
  try {
    const saved = localStorage.getItem('azure-sim-activity');
    if (saved) ActivityLog = JSON.parse(saved);
  } catch (e) {
    ActivityLog = [];
  }
  // Seed with some realistic pre-existing entries if empty
  if (ActivityLog.length === 0) {
    ActivityLog = [
      { id: 1, type: 'create', icon: '✚', title: 'Created Virtual Machine', resource: 'ds-workstation-01', resourceType: 'Microsoft.Compute/virtualMachines', rg: 'rg-data-science-lab', caller: 'adewale@cssadewale.dev', status: 'Succeeded', time: _ago(72) },
      { id: 2, type: 'action', icon: '▶', title: 'Started Virtual Machine', resource: 'ds-workstation-01', resourceType: 'Microsoft.Compute/virtualMachines', rg: 'rg-data-science-lab', caller: 'adewale@cssadewale.dev', status: 'Succeeded', time: _ago(24) },
      { id: 3, type: 'create', icon: '✚', title: 'Created Storage Account', resource: 'adewalemlstorage', resourceType: 'Microsoft.Storage/storageAccounts', rg: 'rg-ml-experiments', caller: 'adewale@cssadewale.dev', status: 'Succeeded', time: _ago(48) },
      { id: 4, type: 'update', icon: '✎', title: 'Updated Key Vault Access Policy', resource: 'adewale-key-vault', resourceType: 'Microsoft.KeyVault/vaults', rg: 'rg-data-science-lab', caller: 'adewale@cssadewale.dev', status: 'Succeeded', time: _ago(36) },
      { id: 5, type: 'action', icon: '▶', title: 'Triggered Function App', resource: 'data-preprocessing-fn', resourceType: 'Microsoft.Web/sites', rg: 'rg-data-science-lab', caller: 'ml-svc@cssadewale.dev', status: 'Succeeded', time: _ago(2) },
      { id: 6, type: 'create', icon: '✚', title: 'Submitted ML Experiment Run', resource: 'house-price-prediction', resourceType: 'Microsoft.MachineLearning/workspaces', rg: 'rg-ml-experiments', caller: 'adewale@cssadewale.dev', status: 'Succeeded', time: _ago(5) },
      { id: 7, type: 'action', icon: '⚠', title: 'Pipeline Run Failed', resource: 'model-refresh', resourceType: 'Microsoft.DataFactory/factories', rg: 'rg-data-science-lab', caller: 'adf-trigger@cssadewale.dev', status: 'Failed', time: _ago(6) },
    ];
  }
})();

function _ago(hours) {
  return new Date(Date.now() - hours * 3600000).toISOString();
}

/**
 * Log an activity. Called from across the portal whenever
 * a user performs an action (create, delete, update, etc.)
 * @param {string} type - 'create' | 'delete' | 'update' | 'action'
 * @param {string} title - Human-readable description
 * @param {string} resource - Resource name
 * @param {string} rg - Resource group
 */
function logActivity(type, title, resource, rg) {
  const entry = {
    id: Date.now(),
    type,
    icon: type === 'create' ? '✚' : type === 'delete' ? '✕' : type === 'update' ? '✎' : '▶',
    title,
    resource,
    resourceType: _inferResourceType(resource),
    rg: rg || 'rg-data-science-lab',
    caller: AzureData.user.email,
    status: 'Succeeded',
    time: new Date().toISOString()
  };
  ActivityLog.unshift(entry);
  if (ActivityLog.length > 200) ActivityLog.pop(); // keep max 200
  _persistActivityLog();
  _flashSaveIndicator();
}

function _inferResourceType(name) {
  if (!name) return 'Microsoft.Resources/generic';
  const n = name.toLowerCase();
  if (n.includes('vm') || n.includes('workstation') || n.includes('server')) return 'Microsoft.Compute/virtualMachines';
  if (n.includes('storage') || n.includes('blob')) return 'Microsoft.Storage/storageAccounts';
  if (n.includes('sql')) return 'Microsoft.Sql/servers/databases';
  if (n.includes('vault') || n.includes('key')) return 'Microsoft.KeyVault/vaults';
  if (n.includes('fn') || n.includes('function')) return 'Microsoft.Web/sites';
  if (n.includes('ml') || n.includes('experiment')) return 'Microsoft.MachineLearning/workspaces';
  if (n.includes('vnet') || n.includes('network')) return 'Microsoft.Network/virtualNetworks';
  if (n.includes('rg') || n.includes('group')) return 'Microsoft.Resources/resourceGroups';
  if (n.includes('pipeline') || n.includes('factory')) return 'Microsoft.DataFactory/factories';
  return 'Microsoft.Resources/generic';
}

function _persistActivityLog() {
  try {
    localStorage.setItem('azure-sim-activity', JSON.stringify(ActivityLog.slice(0, 100)));
  } catch (e) { /* storage full - ignore */ }
}

function _flashSaveIndicator() {
  let ind = document.getElementById('saveIndicator');
  if (!ind) {
    ind = document.createElement('div');
    ind.id = 'saveIndicator';
    ind.className = 'save-indicator';
    ind.innerHTML = '✓ Progress saved';
    document.body.appendChild(ind);
  }
  ind.classList.add('visible');
  clearTimeout(ind._timer);
  ind._timer = setTimeout(() => ind.classList.remove('visible'), 2000);
}

// ---- PANEL UI ----
function openActivityLog() {
  closeAllPanels();
  const panel = document.getElementById('activityPanel');
  panel.classList.add('open');
  renderActivityLog('all');
}

function closeActivityLog() {
  document.getElementById('activityPanel').classList.remove('open');
}

function renderActivityLog(filter) {
  const list = document.getElementById('activityList');
  if (!list) return;

  const filtered = filter === 'all' ? ActivityLog
    : ActivityLog.filter(a => a.type === filter);

  list.innerHTML = `
    <div class="activity-filter-bar">
      ${['all','create','update','delete','action'].map(f => `
        <button class="activity-filter-btn ${filter===f?'active':''}" onclick="renderActivityLog('${f}')">
          ${f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      `).join('')}
    </div>
    ${filtered.length === 0 ? '<div style="padding:20px;text-align:center;color:#8a8886;font-size:13px">No activity found</div>' :
      filtered.map(a => `
        <div class="activity-item">
          <div class="activity-item-icon ${a.type}">
            <span style="font-size:13px">${a.icon}</span>
          </div>
          <div class="activity-item-body">
            <div class="activity-item-title">${a.title}</div>
            <div class="activity-item-meta">
              <span>${a.resource}</span> ·
              <span style="color:${a.status==='Failed'?'#a4262c':'#107c10'}">${a.status}</span>
            </div>
            <div class="activity-item-meta" style="margin-top:2px">${a.resourceType}</div>
            <div class="activity-item-meta">${a.caller}</div>
          </div>
          <div class="activity-item-time">${_formatTime(a.time)}</div>
        </div>
      `).join('')
    }
  `;
}

function _formatTime(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return new Date(iso).toLocaleDateString();
}

function clearActivityLog() {
  ActivityLog = [];
  _persistActivityLog();
  renderActivityLog('all');
  showToast('Activity log cleared', 'info');
}
