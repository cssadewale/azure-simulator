/* =====================================================
   SEARCH.JS — Global search across all resources
   ===================================================== */

const SearchIndex = [
  { name: 'Dashboard', category: 'Navigation', page: 'dashboard', icon: '🏠' },
  { name: 'Resource Groups', category: 'Navigation', page: 'resource-groups', icon: '📁' },
  { name: 'All Resources', category: 'Navigation', page: 'all-resources', icon: '🌐' },
  { name: 'Subscriptions', category: 'Navigation', page: 'subscriptions', icon: '💳' },
  { name: 'Virtual Machines', category: 'Compute', page: 'virtual-machines', icon: '🖥️' },
  { name: 'App Service', category: 'Compute', page: 'app-service', icon: '🌐' },
  { name: 'Functions', category: 'Compute', page: 'functions', icon: '⚡' },
  { name: 'Container Instances', category: 'Compute', page: 'container-instances', icon: '📦' },
  { name: 'Kubernetes (AKS)', category: 'Compute', page: 'kubernetes', icon: '☸️' },
  { name: 'Storage Accounts', category: 'Storage', page: 'storage-accounts', icon: '💾' },
  { name: 'Blob Storage', category: 'Storage', page: 'blob-storage', icon: '🗄️' },
  { name: 'SQL Database', category: 'Database', page: 'sql-database', icon: '🗃️' },
  { name: 'Cosmos DB', category: 'Database', page: 'cosmos-db', icon: '🌌' },
  { name: 'Synapse Analytics', category: 'Analytics', page: 'synapse', icon: '📊' },
  { name: 'Azure Databricks', category: 'Analytics', page: 'databricks', icon: '🔷' },
  { name: 'ML Studio', category: 'AI & ML', page: 'ml-studio', icon: '🤖' },
  { name: 'Data Factory', category: 'Integration', page: 'data-factory', icon: '🔄' },
  { name: 'Event Hubs', category: 'Messaging', page: 'event-hubs', icon: '📡' },
  { name: 'Virtual Network', category: 'Networking', page: 'virtual-network', icon: '🕸️' },
  { name: 'Load Balancer', category: 'Networking', page: 'load-balancer', icon: '⚖️' },
  { name: 'VPN Gateway', category: 'Networking', page: 'vpn-gateway', icon: '🔒' },
  { name: 'DNS Zones', category: 'Networking', page: 'dns', icon: '📋' },
  { name: 'Key Vault', category: 'Security', page: 'key-vault', icon: '🔑' },
  { name: 'Security Center', category: 'Security', page: 'security-center', icon: '🛡️' },
  { name: 'Active Directory', category: 'Identity', page: 'active-directory', icon: '👥' },
  { name: 'Azure Firewall', category: 'Security', page: 'firewall', icon: '🔥' },
  { name: 'Azure DevOps', category: 'DevOps', page: 'devops', icon: '🚀' },
  { name: 'Pipelines', category: 'DevOps', page: 'pipelines', icon: '🔁' },
  { name: 'Repos', category: 'DevOps', page: 'repos', icon: '📂' },
  { name: 'Container Registry', category: 'Containers', page: 'container-registry', icon: '🐳' },
  { name: 'Azure Monitor', category: 'Monitoring', page: 'monitor', icon: '📈' },
  { name: 'Cost Management', category: 'Billing', page: 'cost-management', icon: '💰' },
  { name: 'Log Analytics', category: 'Monitoring', page: 'log-analytics', icon: '📜' },
  { name: 'Service Bus', category: 'Messaging', page: 'service-bus', icon: '📨' },
  { name: 'API Management', category: 'Integration', page: 'api-management', icon: '🔌' },
  { name: 'Stream Analytics', category: 'Analytics', page: 'stream-analytics', icon: '⚡' },
  { name: 'Azure Advisor', category: 'Governance', page: 'advisor', icon: '💡' },
  { name: 'Architecture Diagrams', category: 'Tools', page: 'architecture', icon: '🏗️' },
  { name: 'Exam Quiz', category: 'Learning', page: 'quiz', icon: '🎯' },
  { name: 'ARM Template Builder', category: 'Tools', page: 'arm-builder', icon: '📄' },
  { name: 'Activity Log', category: 'Monitoring', page: 'activity-log', icon: '📋' },
  { name: 'Cost Estimator', category: 'Billing', page: 'cost-estimator', icon: '💡' },
  // Resources
  ...AzureData.virtualMachines.map(r => ({ name: r.name, category: 'Virtual Machine', page: 'virtual-machines', icon: '🖥️' })),
  ...AzureData.storageAccounts.map(r => ({ name: r.name, category: 'Storage Account', page: 'storage-accounts', icon: '💾' })),
  ...AzureData.resourceGroups.map(r => ({ name: r.name, category: 'Resource Group', page: 'resource-groups', icon: '📁' })),
  ...AzureData.functions.map(r => ({ name: r.name, category: 'Function App', page: 'functions', icon: '⚡' })),
  ...AzureData.appServices.map(r => ({ name: r.name, category: 'App Service', page: 'app-service', icon: '🌐' })),
  ...AzureData.keyVaults.map(r => ({ name: r.name, category: 'Key Vault', page: 'key-vault', icon: '🔑' })),
];

const searchInput = document.getElementById('globalSearch');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { searchResults.classList.remove('visible'); return; }

  const matches = SearchIndex.filter(item =>
    item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
  ).slice(0, 8);

  if (!matches.length) {
    searchResults.innerHTML = '<div style="padding:12px 14px;font-size:13px;color:#8a8886">No results found</div>';
    searchResults.classList.add('visible');
    return;
  }

  searchResults.innerHTML = matches.map(m => `
    <div class="search-result-item" onclick="navigateTo('${m.page}');searchResults.classList.remove('visible');searchInput.value=''">
      <div class="search-result-icon">${m.icon}</div>
      <div class="search-result-text">
        <div class="search-result-name">${highlight(m.name, q)}</div>
        <div class="search-result-category">${m.category}</div>
      </div>
    </div>
  `).join('');
  searchResults.classList.add('visible');
});

function highlight(text, q) {
  const idx = text.toLowerCase().indexOf(q);
  if (idx === -1) return text;
  return text.substring(0, idx) + '<strong>' + text.substring(idx, idx + q.length) + '</strong>' + text.substring(idx + q.length);
}

document.addEventListener('click', e => {
  if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
    searchResults.classList.remove('visible');
  }
});

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') { searchResults.classList.remove('visible'); searchInput.value = ''; }
});

// Handle special search page navigation for panel-based features
const _originalNavigateTo = navigateTo;
function navigateToWithPanels(page) {
  if (page === 'quiz') { openQuizMode(); return; }
  if (page === 'arm-builder') { openARMBuilder(); return; }
  if (page === 'activity-log') { openActivityLog(); return; }
  if (page === 'cost-estimator') { openWhatIf(); return; }
  _originalNavigateTo(page);
}
