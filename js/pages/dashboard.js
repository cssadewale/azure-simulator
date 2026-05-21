/* =====================================================
   DASHBOARD PAGE
   ===================================================== */

registerPage('dashboard', (container) => {
  const totalResources = AzureData.virtualMachines.length + AzureData.storageAccounts.length +
    AzureData.functions.length + AzureData.appServices.length + AzureData.keyVaults.length +
    AzureData.sqlDatabases.length + AzureData.virtualNetworks.length + AzureData.databricks.length;

  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span>Home</span></div>
      <div class="page-title">
        <div class="page-title-icon">🏠</div>
        <span>Azure Portal — Home</span>
      </div>
    </div>

    <!-- Welcome Banner -->
    <div class="dashboard-welcome">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
        <div>
          <div class="welcome-title">Welcome back, Adewale! 👋</div>
          <div class="welcome-sub">Azure for Students Subscription · ${AzureData.user.tenant} · Role: Data Scientist</div>
          <div class="live-clock" id="liveClock" style="margin-top:4px">${new Date().toUTCString().replace(' GMT',' UTC')}</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.3)" onclick="openQuizMode()">🎯 Take Exam Quiz</button>
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.3)" onclick="openWhatIf()">💡 Estimate Costs</button>
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white;border:1px solid rgba(255,255,255,0.3)" onclick="openARMBuilder()">📄 ARM Builder</button>
        </div>
      </div>
      <div class="welcome-stats" style="margin-top:16px">
        <div class="welcome-stat"><div class="welcome-stat-val">${AzureData.resourceGroups.length}</div><div class="welcome-stat-label">Resource Groups</div></div>
        <div class="welcome-stat"><div class="welcome-stat-val">${totalResources}</div><div class="welcome-stat-label">Total Resources</div></div>
        <div class="welcome-stat"><div class="welcome-stat-val">$0.00</div><div class="welcome-stat-label">Cost This Month</div></div>
        <div class="welcome-stat"><div class="welcome-stat-val">72%</div><div class="welcome-stat-label">Secure Score</div></div>
        <div class="welcome-stat"><div class="welcome-stat-val">${getOverallProgress ? getOverallProgress() : 0}%</div><div class="welcome-stat-label">Learning Progress</div></div>
      </div>
    </div>

    <!-- Info Box -->
    <div class="info-box" style="margin-bottom:16px">
      <span>🎓</span>
      <div><strong>Learning Mode Active:</strong> As a beginner, every page in this simulator includes explanations of what each Azure service does and how to use it. Click the <strong>📘 Learning Path</strong> button in the sidebar for a guided curriculum.</div>
    </div>

    <!-- Quick Actions -->
    <div style="margin-bottom:20px">
      <div style="font-size:13px;font-weight:600;color:#605e5c;margin-bottom:10px">Quick Actions</div>
      <div class="quick-actions">
        <button class="quick-action-btn" onclick="openCreateResourceModal()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Create a Resource
        </button>
        <button class="quick-action-btn" onclick="openTerminal()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          Open Cloud Shell
        </button>
        <button class="quick-action-btn" onclick="navigateTo('ml-studio')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>
          ML Workspace
        </button>
        <button class="quick-action-btn" onclick="navigateTo('cost-management')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          View Costs
        </button>
        <button class="quick-action-btn" onclick="navigateTo('security-center')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Security Score
        </button>
        <button class="quick-action-btn" onclick="openActivityLog()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          Activity Log
        </button>
        <button class="quick-action-btn" onclick="openWhatIf()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Cost Estimator
        </button>
        <button class="quick-action-btn" onclick="openARMBuilder()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          ARM Builder
        </button>
        <button class="quick-action-btn" onclick="openQuizMode()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          Exam Quiz
        </button>
        <button class="quick-action-btn" onclick="navigateTo('advisor')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Azure Advisor
        </button>
      </div>
    </div>

    <!-- Dashboard Grid -->
    <div class="dashboard-grid" style="margin-bottom:20px">
      <!-- Resource Groups Card -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">📁 Resource Groups</div>
          <button class="btn btn-ghost btn-sm" onclick="navigateTo('resource-groups')">View all</button>
        </div>
        <div class="card-body" style="padding:0">
          ${AzureData.resourceGroups.map(rg => `
            <div class="recent-item" style="padding:10px 16px">
              <div class="resource-icon resource-icon-blue">📁</div>
              <div class="recent-item-info">
                <div class="recent-item-name" onclick="navigateTo('resource-groups')">${rg.name}</div>
                <div class="recent-item-meta">${rg.region} · ${rg.resources} resources</div>
              </div>
              <span class="badge badge-running">${rg.status}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Metrics Card -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">📊 Resource Overview</div>
          <button class="btn btn-ghost btn-sm" onclick="navigateTo('all-resources')">View all</button>
        </div>
        <div class="card-body">
          <div class="grid-2" style="gap:12px">
            ${[
              { label: 'Virtual Machines', count: AzureData.virtualMachines.length, icon: '🖥️', page: 'virtual-machines', color: 'blue' },
              { label: 'Storage Accounts', count: AzureData.storageAccounts.length, icon: '💾', page: 'storage-accounts', color: 'green' },
              { label: 'Functions', count: AzureData.functions.length, icon: '⚡', page: 'functions', color: 'orange' },
              { label: 'App Services', count: AzureData.appServices.length, icon: '🌐', page: 'app-service', color: 'purple' },
              { label: 'Key Vaults', count: AzureData.keyVaults.length, icon: '🔑', page: 'key-vault', color: 'red' },
              { label: 'Virtual Networks', count: AzureData.virtualNetworks.length, icon: '🕸️', page: 'virtual-network', color: 'blue' }
            ].map(r => `
              <div class="service-tile" onclick="navigateTo('${r.page}')">
                <div class="service-tile-icon" style="background:${r.color==='blue'?'#deecf9':r.color==='green'?'#dff6dd':r.color==='orange'?'#fff4ce':r.color==='red'?'#fde7e9':'#f4f0fb'}">${r.icon}</div>
                <div class="service-tile-name">${r.label}</div>
                <div class="service-tile-count">${r.count} resource${r.count !== 1 ? 's' : ''}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">🕐 Recent Activity</div>
        </div>
        <div class="card-body" style="padding:0">
          ${[
            { icon: '✅', msg: 'ML experiment "house-price-prediction" completed', time: '15m ago', color: 'success' },
            { icon: '🚀', msg: 'Pipeline "model-training-pipeline" started', time: '25m ago', color: 'info' },
            { icon: '⚠️', msg: 'Security alert: Unusual sign-in detected', time: '3h ago', color: 'warning' },
            { icon: '❌', msg: 'Pipeline "model-refresh" failed', time: '6h ago', color: 'error' },
            { icon: '✅', msg: 'VM "ds-workstation-01" started successfully', time: '1d ago', color: 'success' },
          ].map(a => `
            <div class="recent-item" style="padding:10px 16px">
              <span style="font-size:16px">${a.icon}</span>
              <div class="recent-item-info">
                <div style="font-size:12px;color:#201f1e">${a.msg}</div>
              </div>
              <div class="recent-item-time">${a.time}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Security Score -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">🛡️ Security Score</div>
          <button class="btn btn-ghost btn-sm" onclick="navigateTo('security-center')">Details</button>
        </div>
        <div class="card-body">
          <div style="text-align:center;padding:10px 0 16px">
            <div style="font-size:48px;font-weight:800;color:#0078D4">${AzureData.securityCenter.secureScore}%</div>
            <div style="font-size:13px;color:#605e5c">Your secure score</div>
            <div class="progress-bar" style="margin:12px 0">
              <div class="progress-fill warning" style="width:${AzureData.securityCenter.secureScore}%"></div>
            </div>
            <div style="font-size:12px;color:#8a8886">Complete recommendations to improve your score</div>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px">
            ${AzureData.securityCenter.recommendations.filter(r => r.status === 'Open').slice(0, 3).map(r => `
              <div style="display:flex;align-items:center;gap:8px;font-size:12px">
                <span style="color:${r.severity==='High'?'#a4262c':'#d83b01'}">●</span>
                <span style="flex:1;color:#605e5c">${r.title}</span>
                <span class="badge badge-${r.severity==='High'?'stopped':'warning'}" style="font-size:10px">${r.severity}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Services Overview -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-header">
        <div class="card-title">☁️ Azure Services — Click to Explore</div>
      </div>
      <div class="card-body">
        <div class="services-grid">
          ${[
            { icon: '🖥️', name: 'Virtual Machines', desc: 'Run Windows or Linux VMs in the cloud', page: 'virtual-machines', tag: 'Compute' },
            { icon: '🌐', name: 'App Service', desc: 'Host web apps without managing servers', page: 'app-service', tag: 'Compute' },
            { icon: '⚡', name: 'Functions', desc: 'Run serverless event-driven code', page: 'functions', tag: 'Serverless' },
            { icon: '💾', name: 'Storage Accounts', desc: 'Scalable blob, file, queue & table storage', page: 'storage-accounts', tag: 'Storage' },
            { icon: '🗃️', name: 'SQL Database', desc: 'Fully managed relational database', page: 'sql-database', tag: 'Database' },
            { icon: '🌌', name: 'Cosmos DB', desc: 'Multi-model globally distributed NoSQL DB', page: 'cosmos-db', tag: 'Database' },
            { icon: '📊', name: 'Synapse Analytics', desc: 'Unified analytics with SQL and Spark', page: 'synapse', tag: 'Analytics' },
            { icon: '🔷', name: 'Databricks', desc: 'Apache Spark for big data & ML', page: 'databricks', tag: 'Analytics' },
            { icon: '🤖', name: 'ML Studio', desc: 'Build, train and deploy ML models', page: 'ml-studio', tag: 'AI & ML' },
            { icon: '🔄', name: 'Data Factory', desc: 'ETL and data integration pipelines', page: 'data-factory', tag: 'Integration' },
            { icon: '🕸️', name: 'Virtual Network', desc: 'Private network for Azure resources', page: 'virtual-network', tag: 'Networking' },
            { icon: '🔑', name: 'Key Vault', desc: 'Manage secrets, keys and certificates', page: 'key-vault', tag: 'Security' },
            { icon: '🛡️', name: 'Security Center', desc: 'Unified security management', page: 'security-center', tag: 'Security' },
            { icon: '👥', name: 'Active Directory', desc: 'Identity and access management', page: 'active-directory', tag: 'Identity' },
            { icon: '🚀', name: 'Azure DevOps', desc: 'CI/CD pipelines, repos and boards', page: 'devops', tag: 'DevOps' },
            { icon: '📈', name: 'Azure Monitor', desc: 'Monitor metrics, logs and alerts', page: 'monitor', tag: 'Monitoring' },
            { icon: '💰', name: 'Cost Management', desc: 'Track and optimize Azure spending', page: 'cost-management', tag: 'Billing' },
            { icon: '📡', name: 'Event Hubs', desc: 'Real-time event ingestion at scale', page: 'event-hubs', tag: 'Messaging' },
            { icon: '📨', name: 'Service Bus', desc: 'Enterprise message broker with queues & topics', page: 'service-bus', tag: 'Messaging' },
            { icon: '🔌', name: 'API Management', desc: 'Publish, secure, and monitor your APIs', page: 'api-management', tag: 'Integration' },
            { icon: '⚡', name: 'Stream Analytics', desc: 'Real-time stream processing with SQL', page: 'stream-analytics', tag: 'Analytics' },
            { icon: '💡', name: 'Azure Advisor', desc: 'Personalised best-practice recommendations', page: 'advisor', tag: 'Governance' },
            { icon: '🏗️', name: 'Architecture Diagrams', desc: 'Build and visualise Azure architectures', page: 'architecture', tag: 'Tools' },
          ].map(s => `
            <div class="service-card" onclick="navigateTo('${s.page}')">
              <div class="service-card-header">
                <div class="service-card-icon" style="background:#deecf9">${s.icon}</div>
                <div class="service-card-name">${s.name}</div>
              </div>
              <div class="service-card-desc">${s.desc}</div>
              <div class="service-card-tag">${s.tag}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
});

function openCreateResourceModal() {
  openModal(`
    <div class="modal">
      <div class="modal-header">
        <h2>➕ Create a Resource</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="info-box" style="margin-bottom:16px">
          <span>ℹ️</span><span>In a real Azure portal, this opens the Azure Marketplace with hundreds of services. Here you can simulate creating core services.</span>
        </div>
        <div style="font-size:13px;font-weight:600;color:#605e5c;margin-bottom:12px">Popular Services</div>
        <div class="services-grid">
          ${[
            { icon: '🖥️', name: 'Virtual Machine', page: 'virtual-machines' },
            { icon: '🌐', name: 'Web App', page: 'app-service' },
            { icon: '⚡', name: 'Function App', page: 'functions' },
            { icon: '💾', name: 'Storage Account', page: 'storage-accounts' },
            { icon: '🗃️', name: 'SQL Database', page: 'sql-database' },
            { icon: '🤖', name: 'ML Workspace', page: 'ml-studio' },
          ].map(s => `
            <div class="service-card" onclick="navigateTo('${s.page}');closeModal()" style="cursor:pointer">
              <div class="service-card-header">
                <div class="service-card-icon" style="background:#deecf9">${s.icon}</div>
                <div class="service-card-name">${s.name}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}
