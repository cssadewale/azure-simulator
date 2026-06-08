/* =====================================================
   PERSISTENCE.JS — LocalStorage State Persistence
   Saves created resources across browser sessions.

   What is this feature?
   Without persistence, every browser refresh resets all
   simulated resources. With this module, anything you
   create (VMs, resource groups, storage accounts, etc.)
   is saved to localStorage and restored on next visit.
   localStorage is free, built into every browser, and
   stores up to ~5MB of data per origin.

   Data is stored under the key 'azure-sim-state'.
   ===================================================== */

// Keys we persist
const PERSIST_KEY = 'azure-sim-state-v2';
const PERSIST_INTERVAL = 30000; // auto-save every 30 seconds

function saveState() {
  try {
    const snapshot = {
      savedAt: new Date().toISOString(),
      resourceGroups: AzureData.resourceGroups,
      virtualMachines: AzureData.virtualMachines,
      storageAccounts: AzureData.storageAccounts,
      appServices: AzureData.appServices,
      functions: AzureData.functions,
      sqlDatabases: AzureData.sqlDatabases,
      cosmosDb: AzureData.cosmosDb,
      keyVaults: AzureData.keyVaults,
      virtualNetworks: AzureData.virtualNetworks,
      securityCenter: AzureData.securityCenter,
      activeDirectory: AzureData.activeDirectory,
      costManagement: AzureData.costManagement,
      mlStudio: AzureData.mlStudio,
      databricks: AzureData.databricks,
      synapseWorkspaces: AzureData.synapseWorkspaces,
      devops: AzureData.devops,
      monitor: AzureData.monitor,
      notifications: AzureData.notifications
    };
    localStorage.setItem(PERSIST_KEY, JSON.stringify(snapshot));
    return true;
  } catch (e) {
    // localStorage might be full or disabled
    console.warn('Azure Simulator: Could not save state:', e.message);
    return false;
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    if (!raw) return false;
    const snapshot = JSON.parse(raw);
    // Restore each section, falling back to defaults if missing
    if (snapshot.resourceGroups?.length) AzureData.resourceGroups = snapshot.resourceGroups;
    if (snapshot.virtualMachines?.length) AzureData.virtualMachines = snapshot.virtualMachines;
    if (snapshot.storageAccounts?.length) AzureData.storageAccounts = snapshot.storageAccounts;
    if (snapshot.appServices?.length) AzureData.appServices = snapshot.appServices;
    if (snapshot.functions?.length) AzureData.functions = snapshot.functions;
    if (snapshot.sqlDatabases?.length) AzureData.sqlDatabases = snapshot.sqlDatabases;
    if (snapshot.cosmosDb?.length) AzureData.cosmosDb = snapshot.cosmosDb;
    if (snapshot.keyVaults?.length) AzureData.keyVaults = snapshot.keyVaults;
    if (snapshot.virtualNetworks?.length) AzureData.virtualNetworks = snapshot.virtualNetworks;
    if (snapshot.securityCenter) AzureData.securityCenter = snapshot.securityCenter;
    if (snapshot.costManagement) AzureData.costManagement = snapshot.costManagement;
    if (snapshot.mlStudio) AzureData.mlStudio = snapshot.mlStudio;
    if (snapshot.monitor) AzureData.monitor = snapshot.monitor;
    if (snapshot.notifications?.length) AzureData.notifications = snapshot.notifications;
    console.info(`Azure Simulator: State restored from ${snapshot.savedAt}`);
    return true;
  } catch (e) {
    console.warn('Azure Simulator: Could not restore state:', e.message);
    return false;
  }
}

function resetAllState() {
  confirmAction(
    'Reset All Simulator Data',
    'This will delete all resources you have created in this session and restore the original demo data. This cannot be undone.',
    () => {
      localStorage.removeItem(PERSIST_KEY);
      localStorage.removeItem('azure-sim-activity');
      showToast('Simulator reset. Reloading...', 'info');
      setTimeout(() => location.reload(), 1500);
    },
    true
  );
}

function exportState() {
  saveState();
  const raw = localStorage.getItem(PERSIST_KEY);
  if (!raw) { showToast('Nothing to export', 'error'); return; }
  const blob = new Blob([raw], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `azure-simulator-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('State exported as JSON!', 'success');
  logActivity('action', 'Exported Simulator State', 'azure-simulator-backup.json', 'Portal Settings');
}

function importState(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      localStorage.setItem(PERSIST_KEY, JSON.stringify(data));
      showToast('State imported! Reloading...', 'success');
      setTimeout(() => location.reload(), 1200);
    } catch (err) {
      showToast('Invalid backup file', 'error');
    }
  };
  reader.readAsText(file);
}

// Get storage usage info
function getStorageInfo() {
  let used = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      used += localStorage[key].length + key.length;
    }
  }
  const usedKB = (used / 1024).toFixed(1);
  const limitKB = 5120;
  return { usedKB: +usedKB, limitKB, pct: Math.round((used/1024/limitKB)*100) };
}

// Auto-save every 30 seconds
setInterval(() => {
  if (document.visibilityState === 'visible') {
    saveState();
  }
}, PERSIST_INTERVAL);

// Save on page unload
window.addEventListener('beforeunload', saveState);

// Load on startup (called from main.js after data.js is loaded)
function initPersistence() {
  const restored = loadState();
  if (restored) {
    console.info('Azure Simulator: Previous session restored from localStorage');
  }
}
