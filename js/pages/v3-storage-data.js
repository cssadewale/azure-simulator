/* =====================================================
   V3-STORAGE-DATA.JS
   Enhanced Storage: File Shares, Table Storage, Queue
   Enhanced Data: Purview, Power BI Embedded, Stream
   Author: Adewale Samson Adeagbo | cssadewale
   ===================================================== */

/* ---- AZURE FILE SHARES ---- */
registerPage('file-shares', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › <span onclick="navigateTo('storage-accounts')">Storage</span> › File Shares</div>
      <div class="page-title"><div class="page-title-icon">📂</div><span>Azure File Shares</span></div>
      <div class="page-subtitle">Fully managed cloud file shares accessible via SMB and NFS — mount on Windows, Linux, or macOS.</div>
      <div class="page-actions"><button class="btn btn-primary" onclick="showToast('File share created!','success')">+ File Share</button></div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Files?</strong> Managed file shares in the cloud accessible via SMB 3.x and NFS 4.1 protocols — the same protocols used by Windows and Linux network drives. You can mount Azure Files on:<br>
      • <strong>Windows</strong>: <code>net use Z: \\\\[storage].file.core.windows.net\\[share] /user:Azure [key]</code><br>
      • <strong>Linux/Ubuntu</strong>: <code>mount -t cifs //[storage].file.core.windows.net/[share] /mnt/myshare</code><br>
      • <strong>Python</strong>: Using the azure-storage-file-share SDK<br>
      Use case for data scientists: Mount a shared drive on multiple training VMs so all workers access the same dataset files without copying.</div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">File Shares — adewalemlstorage</div></div>
      ${[
        { name: 'notebooks-share', quota: 100, used: 8.3, protocol: 'SMB 3.1.1', tier: 'Transaction Optimized', snapshots: 2 },
        { name: 'training-data-share', quota: 500, used: 124.7, protocol: 'SMB 3.1.1', tier: 'Hot', snapshots: 5 },
        { name: 'model-artifacts', quota: 200, used: 45.2, protocol: 'NFS 4.1', tier: 'Premium', snapshots: 0 }
      ].map(s => `
        <div style="padding:14px 16px;border-bottom:1px solid var(--card-border)">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
            <span style="font-size:20px">📂</span>
            <div style="flex:1">
              <div style="font-weight:700;font-size:13px">${s.name}</div>
              <div style="font-size:12px;color:var(--text-muted)">${s.protocol} · ${s.tier} tier · ${s.snapshots} snapshots</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:14px;font-weight:700;color:#0078D4">${s.used.toFixed(1)} GB</div>
              <div style="font-size:11px;color:var(--text-muted)">of ${s.quota} GB quota</div>
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill ${s.used/s.quota>0.8?'danger':''}" style="width:${(s.used/s.quota*100).toFixed(1)}%"></div>
          </div>
          <div style="display:flex;gap:8px;margin-top:8px">
            <button class="btn btn-ghost btn-sm" onclick="showToast('Connecting to ${s.name}...','info')">Connect</button>
            <button class="btn btn-ghost btn-sm" onclick="showToast('Taking snapshot...','success')">Snapshot</button>
            <button class="btn btn-ghost btn-sm" onclick="showToast('Browsing files...','info')">Browse</button>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-header"><div class="card-title">Mount Script Generator</div></div>
      <div class="card-body">
        <div class="form-group">
          <label class="form-label">OS / Environment</label>
          <select class="form-control" id="mountOS" onchange="updateMountScript()">
            <option value="linux">Linux / Ubuntu</option>
            <option value="windows">Windows</option>
            <option value="python">Python (SDK)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">File Share</label>
          <select class="form-control" id="mountShare" onchange="updateMountScript()">
            <option>notebooks-share</option>
            <option>training-data-share</option>
            <option>model-artifacts</option>
          </select>
        </div>
        <div id="mountScriptOutput" class="log-query-box" style="margin-top:12px">
<span class="comment"># Linux mount script</span>
<span class="kw">sudo</span> mkdir -p /mnt/notebooks-share
<span class="kw">sudo</span> mount -t cifs //adewalemlstorage.file.core.windows.net/notebooks-share /mnt/notebooks-share \
  -o username=adewalemlstorage,password=<span class="str">[ACCESS_KEY_FROM_KEY_VAULT]</span>,serverino,nosharesock
        </div>
        <button class="copy-btn" style="margin-top:8px" onclick="showToast('Mount script copied!','success')">📋 Copy Script</button>
      </div>
    </div>
  `;
  window.updateMountScript = () => {
    const os = document.getElementById('mountOS').value;
    const share = document.getElementById('mountShare').value;
    const scripts = {
      linux: `<span class="comment"># Linux mount — run as root</span>\n<span class="kw">sudo</span> mkdir -p /mnt/${share}\n<span class="kw">sudo</span> mount -t cifs //adewalemlstorage.file.core.windows.net/${share} /mnt/${share} \\\n  -o username=adewalemlstorage,password=<span class="str">[KEY_FROM_KEY_VAULT]</span>,serverino`,
      windows: `<span class="comment">:: Windows PowerShell — Run as Administrator</span>\n$connectTestResult = Test-NetConnection -ComputerName adewalemlstorage.file.core.windows.net -Port 445\nif ($connectTestResult.TcpTestSucceeded) {\n  net use Z: \\\\adewalemlstorage.file.core.windows.net\\${share} <span class="str">[KEY]</span> /user:Azure\\adewalemlstorage\n}`,
      python: `<span class="comment"># pip install azure-storage-file-share azure-identity</span>\n<span class="kw">from</span> azure.storage.fileshare <span class="kw">import</span> ShareClient\n<span class="kw">from</span> azure.identity <span class="kw">import</span> DefaultAzureCredential\n\nshare = ShareClient(\n    account_url=<span class="str">"https://adewalemlstorage.file.core.windows.net"</span>,\n    share_name=<span class="str">"${share}"</span>,\n    credential=DefaultAzureCredential()  <span class="comment"># Managed Identity — no password!</span>\n)\nfor item in share.list_directories_and_files():\n    print(item[<span class="str">'name'</span>])`
    };
    document.getElementById('mountScriptOutput').innerHTML = scripts[os];
  };
});

/* ---- TABLE STORAGE ---- */
registerPage('table-storage', (container) => {
  const tableData = [
    { PartitionKey: 'experiment', RowKey: 'run-001', accuracy: 0.943, algorithm: 'XGBoost', timestamp: '2024-03-12T14:22:01Z' },
    { PartitionKey: 'experiment', RowKey: 'run-002', accuracy: 0.917, algorithm: 'RandomForest', timestamp: '2024-03-11T10:15:00Z' },
    { PartitionKey: 'prediction', RowKey: 'pred-12345', prediction: 285400.50, confidence: 0.94, timestamp: '2024-03-12T16:00:00Z' }
  ];
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › <span onclick="navigateTo('storage-accounts')">Storage</span> › Table Storage</div>
      <div class="page-title"><div class="page-title-icon">📊</div><span>Azure Table Storage</span></div>
      <div class="page-subtitle">NoSQL key-value store for structured, non-relational data — fast, cheap, and massively scalable.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Table Storage?</strong> A NoSQL key-value store with a simple schema: every entity has a <strong>PartitionKey</strong> (for distribution and querying efficiency), a <strong>RowKey</strong> (unique within partition), and up to 252 custom properties. It is extremely cheap (~$0.00036/10K operations) and can store petabytes. Use it for:<br>
      • Storing ML experiment metadata (run ID, parameters, metrics)<br>
      • Logging prediction requests with timestamps<br>
      • Feature store for simple ML pipelines<br>
      • Storing IoT device telemetry cheaply</div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header">
        <div class="card-title">Tables — adewalemlstorage</div>
        <button class="btn btn-primary btn-sm" onclick="showToast('Table created!','success')">+ Add Table</button>
      </div>
      ${['ExperimentRuns','PredictionLog','FeatureStore','DeviceMetrics'].map((t,i) => `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 16px;border-bottom:1px solid var(--card-border)">
          <span style="font-size:18px">📊</span>
          <div style="flex:1"><div style="font-weight:600;font-size:13px">${t}</div><div style="font-size:12px;color:var(--text-muted)">${[3,47,1250,8934][i].toLocaleString()} entities</div></div>
          <button class="btn btn-ghost btn-sm" onclick="document.getElementById('tableQuerySection').style.display='block';document.getElementById('queryTableName').textContent='${t}'">Query</button>
        </div>
      `).join('')}
    </div>
    <div class="card" id="tableQuerySection">
      <div class="card-header"><div class="card-title">Query Table: <span id="queryTableName">ExperimentRuns</span></div></div>
      <div class="card-body">
        <div class="form-group"><label class="form-label">OData Filter</label><input class="form-control" value="PartitionKey eq 'experiment' and accuracy gt 0.90" placeholder="e.g. PartitionKey eq 'experiment'"/></div>
        <button class="btn btn-primary btn-sm" onclick="document.getElementById('tableResults').style.display=''">▶ Execute Query</button>
        <div id="tableResults" style="display:none;margin-top:12px">
          <table class="data-table">
            <thead><tr><th>PartitionKey</th><th>RowKey</th><th>accuracy</th><th>algorithm</th><th>Timestamp</th></tr></thead>
            <tbody>
              ${tableData.filter(r=>r.accuracy&&r.accuracy>0.90).map(r=>`
                <tr>
                  <td><code>${r.PartitionKey}</code></td>
                  <td><code>${r.RowKey}</code></td>
                  <td style="color:#107c10;font-weight:700">${r.accuracy}</td>
                  <td>${r.algorithm}</td>
                  <td style="font-size:11px">${r.timestamp}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div style="font-size:12px;color:#107c10;margin-top:6px">✓ 2 entities returned</div>
        </div>
      </div>
    </div>
  `;
});

/* ---- QUEUE STORAGE ---- */
registerPage('queue-storage', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › <span onclick="navigateTo('storage-accounts')">Storage</span> › Queue Storage</div>
      <div class="page-title"><div class="page-title-icon">📬</div><span>Azure Queue Storage</span></div>
      <div class="page-subtitle">Simple, cost-effective message queueing for asynchronous communication between application components.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Queue Storage?</strong> A simple FIFO message queue for loosely coupling application components. Cheaper and simpler than Service Bus (no topics, no ordering guarantees beyond 64KB messages). A message is visible for a configurable time while being processed; if not deleted it becomes visible again (at-least-once delivery). Max message size: 64 KB. Max queue size: Unlimited. Use it for: Azure Functions triggers, simple job queues, decoupling ML preprocessing from inference.</div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Queues</div><button class="btn btn-primary btn-sm" onclick="showToast('Queue created!','success')">+ Add Queue</button></div>
      ${[
        { name: 'ml-job-queue', messages: 7, size: '4.2 KB', visibility: '300s' },
        { name: 'notification-queue', messages: 0, size: '0 KB', visibility: '30s' },
        { name: 'data-ingest-queue', messages: 142, size: '87.4 KB', visibility: '600s' }
      ].map(q => `
        <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--card-border)">
          <span style="font-size:20px">📬</span>
          <div style="flex:1">
            <div style="font-weight:600;font-size:13px">${q.name}</div>
            <div style="font-size:12px;color:var(--text-muted)">${q.messages} messages · ${q.size} · Visibility timeout: ${q.visibility}</div>
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-ghost btn-sm" onclick="showToast('Message added to queue!','success')">Enqueue</button>
            <button class="btn btn-ghost btn-sm" onclick="showToast('Peeking at messages...','info')">Peek</button>
            <button class="btn btn-ghost btn-sm" onclick="showToast('Queue cleared!','success')">Clear</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
});

/* ---- AZURE PURVIEW ---- */
registerPage('purview', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Microsoft Purview</div>
      <div class="page-title"><div class="page-title-icon">🔍</div><span>Microsoft Purview</span></div>
      <div class="page-subtitle">Unified data governance — discover, classify, and manage your data estate across Azure, on-premises, and multi-cloud.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Microsoft Purview?</strong> A data governance platform that gives you a complete map of your data landscape. It:<br>
      • <strong>Scans</strong> your data sources (Azure Storage, SQL, Synapse, on-premises) and builds an automated data catalogue<br>
      • <strong>Classifies</strong> sensitive data (PII, financial data, health records) using built-in and custom classifiers<br>
      • <strong>Maps data lineage</strong> — shows exactly where data came from, how it was transformed, and where it went<br>
      • <strong>Enforces access policies</strong> — who can access what data<br>
      Essential for data scientists in regulated industries (banking, healthcare) and for GDPR compliance.</div>
    </div>
    <div class="grid-4" style="margin-bottom:20px">
      <div class="metric-card"><div class="metric-label">Data Assets</div><div class="metric-value">1,247</div><div class="metric-sub">catalogued</div></div>
      <div class="metric-card"><div class="metric-label">Data Sources</div><div class="metric-value">8</div><div class="metric-sub">connected</div></div>
      <div class="metric-card"><div class="metric-label">Classified Assets</div><div class="metric-value" style="color:#d83b01">234</div><div class="metric-sub">sensitive data found</div></div>
      <div class="metric-card"><div class="metric-label">Scans</div><div class="metric-value">12</div><div class="metric-sub">completed</div></div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">Data Catalogue — Search</div></div>
      <div class="card-body">
        <div style="display:flex;gap:8px;margin-bottom:16px">
          <input class="form-control" placeholder="Search data assets (e.g. 'customer', 'sales', 'model')" id="purviewSearch"/>
          <button class="btn btn-primary" onclick="runPurviewSearch()">🔍 Search</button>
        </div>
        <div id="purviewResults">
          ${[
            { name: 'sales_data_2024.csv', source: 'adewalemlstorage/raw-data', type: 'CSV File', classifications: ['Sales Data'], size: '45.2 MB' },
            { name: 'customer_features.parquet', source: 'adewalemlstorage/processed-data', type: 'Parquet File', classifications: ['PII - Email', 'PII - Name'], size: '120.1 MB' },
            { name: 'experiments', source: 'experiments-db', type: 'SQL Table', classifications: ['Internal'], size: '312 MB' },
            { name: 'house-price-v2.pkl', source: 'adewalemlstorage/models', type: 'ML Model', classifications: ['ML Artifact'], size: '12 MB' }
          ].map(a => `
            <div style="display:flex;align-items:flex-start;gap:12px;padding:12px;border:1px solid var(--card-border);border-radius:4px;margin-bottom:8px;cursor:pointer" onclick="showToast('Opening asset details...','info')">
              <span style="font-size:20px">${a.type.includes('CSV')?'📄':a.type.includes('Parquet')?'📊':a.type.includes('SQL')?'🗃️':a.type.includes('ML')?'🤖':'📁'}</span>
              <div style="flex:1">
                <div style="font-weight:700;font-size:13px;color:#0078D4">${a.name}</div>
                <div style="font-size:12px;color:var(--text-muted)">${a.source} · ${a.type} · ${a.size}</div>
                <div style="margin-top:6px;display:flex;gap:4px;flex-wrap:wrap">
                  ${a.classifications.map(c=>`<span class="badge badge-${c.startsWith('PII')?'stopped':'info'}" style="font-size:10px">${c}</span>`).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  window.runPurviewSearch = () => {
    const q = document.getElementById('purviewSearch').value;
    showToast(`Searching Purview catalogue for "${q}"...`, 'info');
  };
});
