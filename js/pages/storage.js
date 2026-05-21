/* =====================================================
   STORAGE PAGES: Storage Accounts, Blob, SQL, Cosmos DB
   ===================================================== */

// ---- STORAGE ACCOUNTS ----
registerPage('storage-accounts', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Storage Accounts</div>
      <div class="page-title"><div class="page-title-icon">💾</div><span>Storage Accounts</span></div>
      <div class="page-subtitle">Scalable, secure, and highly available cloud storage for blobs, files, queues, and tables.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openCreateStorageModal()">+ Create</button>
        <button class="btn btn-secondary" onclick="showToast('Refreshed','info')">Refresh</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Storage?</strong> A cloud storage solution supporting four types: <strong>Blob</strong> (unstructured data like files, images, datasets), <strong>File</strong> (shared file system), <strong>Queue</strong> (message brokering), and <strong>Table</strong> (NoSQL key-value). Azure Storage is the backbone for data science — your datasets, trained model artifacts, and pipeline outputs all live here.</div>
    </div>
    <div class="grid-3" style="margin-bottom:20px">
      ${AzureData.storageAccounts.map(s => `
        <div class="metric-card">
          <div class="metric-label">${s.name}</div>
          <div class="metric-value">${s.usedGB.toFixed(1)} GB</div>
          <div class="metric-sub">${s.replication} · ${s.accessTier} tier</div>
          <div class="progress-bar" style="margin-top:8px">
            <div class="progress-fill" style="width:${(s.usedGB/s.capacity*100).toFixed(1)}%"></div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Storage Accounts</div></div>
      <table class="data-table">
        <thead><tr><th>Name</th><th>Status</th><th>Type</th><th>Replication</th><th>Access Tier</th><th>Used</th><th>Region</th><th>Actions</th></tr></thead>
        <tbody>
          ${AzureData.storageAccounts.map(s => `
            <tr>
              <td><div style="display:flex;align-items:center;gap:8px"><span>💾</span><a class="link" onclick="openStorageDetail('${s.id}')">${s.name}</a></div></td>
              <td>${statusBadge(s.status)}</td>
              <td>${s.type}</td>
              <td>${s.replication}</td>
              <td>${s.accessTier}</td>
              <td>${s.usedGB.toFixed(1)} GB</td>
              <td>${s.region}</td>
              <td><button class="btn btn-ghost btn-sm" onclick="openStorageDetail('${s.id}')">Browse</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
});

function openStorageDetail(id) {
  const s = AzureData.storageAccounts.find(x => x.id === id);
  if (!s) return;
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>💾 ${s.name}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="grid-2" style="gap:12px;margin-bottom:16px">
          <div class="card"><div class="card-body">
            <div class="detail-prop"><div class="detail-prop-label">Account Kind</div><div class="detail-prop-value">${s.type}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">Replication</div><div class="detail-prop-value">${s.replication}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">Access Tier</div><div class="detail-prop-value">${s.accessTier}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">Region</div><div class="detail-prop-value">${s.region}</div></div>
          </div></div>
          <div class="card"><div class="card-body">
            <div class="metric-label">Usage</div>
            <div class="metric-value" style="font-size:22px">${s.usedGB.toFixed(1)} GB</div>
            <div class="metric-sub">of ${(s.capacity/1024).toFixed(0)} TB capacity</div>
            <div class="progress-bar" style="margin-top:10px"><div class="progress-fill" style="width:${(s.usedGB/s.capacity*100).toFixed(2)}%"></div></div>
          </div></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">Blob Containers</div><button class="btn btn-primary btn-sm" onclick="showToast('Container created!','success')">+ Container</button></div>
          <div>
            ${s.containers.map(c => `
              <div class="blob-item">
                <span class="blob-item-icon">📁</span>
                <span class="blob-item-name">${c}</span>
                <span class="blob-item-meta">Blob container · Hot access</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="info-box" style="margin-top:12px">
          <span>💡</span>
          <span>Connection string: <code style="font-size:11px">DefaultEndpointsProtocol=https;AccountName=${s.name};AccountKey=[KEY];EndpointSuffix=core.windows.net</code></span>
        </div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Close</button></div>
    </div>
  `);
}

function openCreateStorageModal() {
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>💾 Create Storage Account</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Storage Account Name *</label><input id="stName" class="form-control" placeholder="e.g. mldatastorage01"/><div style="font-size:11px;color:#8a8886;margin-top:4px">Must be 3–24 chars, lowercase letters and numbers only, globally unique.</div></div>
        <div class="form-group"><label class="form-label">Resource Group *</label><select class="form-control">${AzureData.resourceGroups.map(r=>`<option>${r.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Region *</label><select id="stRegion" class="form-control">${AzureData.regions.map(r=>`<option>${r}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Performance</label><select class="form-control"><option>Standard (HDD)</option><option>Premium (SSD)</option></select></div>
        <div class="form-group"><label class="form-label">Redundancy</label><select id="stRepl" class="form-control"><option>LRS (Locally Redundant)</option><option>GRS (Geo-Redundant)</option><option>ZRS (Zone-Redundant)</option><option>GZRS (Geo-Zone-Redundant)</option></select></div>
        <div class="form-group"><label class="form-label">Access Tier (Blob)</label><select id="stTier" class="form-control"><option>Hot (frequent access)</option><option>Cool (infrequent access)</option></select></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="createStorage()">Create</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function createStorage() {
  const name = document.getElementById('stName').value.trim().toLowerCase();
  const region = document.getElementById('stRegion').value;
  const repl = document.getElementById('stRepl').value.split(' ')[0];
  const tier = document.getElementById('stTier').value.split(' ')[0];
  if (!name || name.length < 3) { showToast('Storage account name must be 3–24 chars.', 'error'); return; }
  if (!/^[a-z0-9]+$/.test(name)) { showToast('Only lowercase letters and numbers allowed.', 'error'); return; }
  AzureData.storageAccounts.push({ id: newGuid(), name, resourceGroup: AzureData.resourceGroups[0].name, region, type: 'StorageV2', replication: repl, tier: 'Standard', status: 'Active', usedGB: 0, capacity: 5120, containers: [], accessTier: tier, created: todayStr() });
  showToast(`Storage account "${name}" created!`, 'success');
  closeModal();
  navigateTo('storage-accounts');
}

// ---- BLOB STORAGE ----
registerPage('blob-storage', (container) => {
  const s = AzureData.storageAccounts[0];
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › <span onclick="navigateTo('storage-accounts')">Storage Accounts</span> › Blob Storage</div>
      <div class="page-title"><div class="page-title-icon">🗄️</div><span>Blob Storage — ${s.name}</span></div>
      <div class="page-subtitle">Store unstructured data — datasets, model artifacts, images, logs — in containers.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>Blob Storage</strong> stands for Binary Large Object. It's ideal for storing datasets (.csv, .parquet, .json), trained model files (.pkl, .onnx), images, logs, and any unstructured data. Blobs are organised in <strong>containers</strong> (similar to top-level folders). Access is controlled via SAS tokens, Managed Identity, or Storage Account Keys.</div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="blob-breadcrumb" style="margin:0;background:none;padding:0;font-size:14px">
          <span>💾 ${s.name}</span>
          <span class="sep">›</span>
          <span>Containers</span>
        </div>
        <button class="btn btn-primary btn-sm" onclick="showToast('Container created!','success')">+ Container</button>
      </div>
      <div>
        ${s.containers.map((c, i) => {
          const sizes = ['8.3 GB', '12.1 GB', '2.4 GB', '1.9 GB'];
          const counts = [142, 87, 34, 19];
          return `
            <div class="blob-item" onclick="openBlobContainer('${c}')">
              <span class="blob-item-icon">📁</span>
              <span class="blob-item-name">${c}</span>
              <span class="blob-item-meta">${counts[i] || 0} blobs · ${sizes[i] || '0 MB'}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
});

function openBlobContainer(name) {
  const files = {
    'raw-data': [
      { icon: '📄', name: 'sales_data_2024.csv', size: '45.2 MB', modified: '2024-03-10' },
      { icon: '📄', name: 'customer_features.parquet', size: '120.1 MB', modified: '2024-03-09' },
      { icon: '📄', name: 'product_catalog.json', size: '8.7 MB', modified: '2024-03-08' },
      { icon: '📁', name: 'archive/', size: '—', modified: '2024-02-28' }
    ],
    'models': [
      { icon: '📄', name: 'house-price-v2.pkl', size: '12.0 MB', modified: '2024-03-12' },
      { icon: '📄', name: 'churn-classifier-v1.pkl', size: '8.0 MB', modified: '2024-02-28' },
      { icon: '📄', name: 'model_metadata.json', size: '2.1 KB', modified: '2024-03-12' }
    ],
    'processed-data': [
      { icon: '📄', name: 'features_train.parquet', size: '230.4 MB', modified: '2024-03-11' },
      { icon: '📄', name: 'features_test.parquet', size: '57.6 MB', modified: '2024-03-11' }
    ],
    'outputs': [
      { icon: '📄', name: 'predictions_2024-03-12.csv', size: '1.2 MB', modified: '2024-03-12' },
      { icon: '📄', name: 'experiment_report.html', size: '340 KB', modified: '2024-03-10' }
    ]
  };
  const blobs = files[name] || [{ icon: '📄', name: 'example.txt', size: '1 KB', modified: todayStr() }];
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>📁 ${name}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="blob-breadcrumb" style="margin-bottom:12px">
          <span>${AzureData.storageAccounts[0].name}</span>
          <span class="sep">›</span>
          <span>${name}</span>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:12px">
          <button class="btn btn-primary btn-sm" onclick="showToast('File uploaded!','success')">⬆ Upload</button>
          <button class="btn btn-secondary btn-sm" onclick="showToast('Refreshed','info')">Refresh</button>
        </div>
        <div class="card">
          ${blobs.map(b => `
            <div class="blob-item">
              <span class="blob-item-icon">${b.icon}</span>
              <span class="blob-item-name">${b.name}</span>
              <div class="blob-item-meta"><div>${b.size}</div><div>${b.modified}</div></div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Close</button></div>
    </div>
  `);
}

// ---- SQL DATABASE ----
registerPage('sql-database', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › SQL Database</div>
      <div class="page-title"><div class="page-title-icon">🗃️</div><span>SQL Database</span></div>
      <div class="page-subtitle">Fully managed, intelligent, scalable cloud database built on SQL Server engine.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openQueryEditor()">+ Query Editor</button>
        <button class="btn btn-secondary" onclick="showToast('Refreshed','info')">Refresh</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure SQL Database?</strong> A fully managed relational database service based on Microsoft SQL Server. It handles backups, patching, high availability, and security automatically. As a data scientist, you'll use it to store structured experiment results, model metadata, user data, and serve ML model predictions. Connect with Python using <code>pyodbc</code> or <code>sqlalchemy</code>.</div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">Databases</div></div>
      <table class="data-table">
        <thead><tr><th>Database</th><th>Server</th><th>Status</th><th>Service Tier</th><th>Size Used</th><th>Region</th><th>Actions</th></tr></thead>
        <tbody>
          ${AzureData.sqlDatabases.map(db => `
            <tr>
              <td><div style="display:flex;align-items:center;gap:8px"><span>🗃️</span><strong>${db.name}</strong></div></td>
              <td style="font-size:12px">${db.server}</td>
              <td>${statusBadge(db.status)}</td>
              <td>${db.tier}</td>
              <td>${db.usedMB} MB / ${db.maxGB} GB</td>
              <td>${db.region}</td>
              <td><button class="btn btn-ghost btn-sm" onclick="openQueryEditor()">Query</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
});

function openQueryEditor() {
  openModal(`
    <div class="modal" style="max-width:700px">
      <div class="modal-header"><h2>🗃️ Query Editor — experiments-db</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="info-box" style="margin-bottom:12px">
          <span>📘</span><span>Write SQL queries to interact with your database. In real Azure, this connects to your actual SQL Server instance via the Azure portal.</span>
        </div>
        <div class="log-query-box" contenteditable="true" id="sqlQuery" style="min-height:80px">
<span class="kw">SELECT</span> e.experiment_name, e.algorithm, e.accuracy, e.run_date
<span class="kw">FROM</span> dbo.experiments e
<span class="kw">WHERE</span> e.accuracy > <span class="num">0.90</span>
<span class="kw">ORDER BY</span> e.accuracy <span class="kw">DESC</span>;
        </div>
        <button class="btn btn-primary" style="margin-bottom:12px" onclick="runSQLQuery()">▶ Run Query</button>
        <div id="sqlResults" style="display:none">
          <div class="log-result-table">
            <table class="data-table">
              <thead><tr><th>experiment_name</th><th>algorithm</th><th>accuracy</th><th>run_date</th></tr></thead>
              <tbody>
                <tr><td>house-price-prediction</td><td>XGBoost</td><td>0.943</td><td>2024-02-15</td></tr>
                <tr><td>customer-churn-classifier</td><td>Random Forest</td><td>0.917</td><td>2024-02-28</td></tr>
              </tbody>
            </table>
          </div>
          <div style="font-size:12px;color:#107c10;margin-top:8px">✓ Query returned 2 rows (0.043s)</div>
        </div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Close</button></div>
    </div>
  `);
}

function runSQLQuery() {
  showToast('Executing query...', 'info');
  setTimeout(() => {
    const results = document.getElementById('sqlResults');
    if (results) results.style.display = '';
    showToast('Query completed: 2 rows returned', 'success');
  }, 800);
}

// ---- COSMOS DB ----
registerPage('cosmos-db', (container) => {
  const cosmos = AzureData.cosmosDb[0];
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Cosmos DB</div>
      <div class="page-title"><div class="page-title-icon">🌌</div><span>Azure Cosmos DB</span></div>
      <div class="page-subtitle">Globally distributed, multi-model NoSQL database service with guaranteed low latency.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Cosmos DB?</strong> A fully managed NoSQL database supporting multiple APIs: Core SQL (document), MongoDB, Cassandra, Gremlin (graph), and Table. It replicates data globally and guarantees single-digit millisecond response times. As a data scientist, use Cosmos DB to store JSON documents — experiment metadata, prediction logs, real-time telemetry, or user profiles.</div>
    </div>
    <div class="grid-2" style="margin-bottom:16px">
      <div class="card">
        <div class="card-header"><div class="card-title">🌌 ${cosmos.name}</div></div>
        <div class="card-body">
          <div class="detail-prop"><div class="detail-prop-label">API</div><div class="detail-prop-value">${cosmos.api}</div></div>
          <div class="detail-prop"><div class="detail-prop-label">Throughput</div><div class="detail-prop-value">${cosmos.throughput}</div></div>
          <div class="detail-prop"><div class="detail-prop-label">Replication</div><div class="detail-prop-value">${cosmos.replication}</div></div>
          <div class="detail-prop"><div class="detail-prop-label">Region</div><div class="detail-prop-value">${cosmos.region}</div></div>
          <div class="detail-prop"><div class="detail-prop-label">Status</div><div class="detail-prop-value">${statusBadge(cosmos.status)}</div></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Databases</div></div>
        <div class="card-body" style="padding:0">
          ${cosmos.databases.map(db => `
            <div class="recent-item" style="padding:12px 16px">
              <span style="font-size:18px">🗄️</span>
              <div class="recent-item-info">
                <div class="recent-item-name">${db}</div>
                <div class="recent-item-meta">Core (SQL) API</div>
              </div>
              <button class="btn btn-ghost btn-sm" onclick="openCosmosQuery('${db}')">Query</button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
});

function openCosmosQuery(db) {
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>🌌 Data Explorer — ${db}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="log-query-box">
<span class="kw">SELECT</span> * <span class="kw">FROM</span> c
<span class="kw">WHERE</span> c.status = <span class="str">"completed"</span>
<span class="kw">ORDER BY</span> c._ts <span class="kw">DESC</span>
<span class="kw">OFFSET</span> <span class="num">0</span> <span class="kw">LIMIT</span> <span class="num">10</span>
        </div>
        <button class="btn btn-primary btn-sm" style="margin-bottom:12px" onclick="showToast('2 documents returned','success')">Execute Query</button>
        <div class="json-viewer">
[
  {
    <span class="json-key">"id"</span>: <span class="json-string">"exp-001"</span>,
    <span class="json-key">"experiment"</span>: <span class="json-string">"house-price"</span>,
    <span class="json-key">"accuracy"</span>: <span class="json-number">0.943</span>,
    <span class="json-key">"status"</span>: <span class="json-string">"completed"</span>
  }
]
        </div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Close</button></div>
    </div>
  `);
}
