/* =====================================================
   NEW-SERVICES.JS
   Additional Azure service pages:
   - Azure Service Bus
   - Azure API Management
   - Azure Stream Analytics
   - Azure Advisor
   - Architecture Diagram Builder
   ===================================================== */

// ---- CLOSE ALL PANELS helper ----
function closeAllPanels() {
  ['notificationPanel','learningPanel','activityPanel','armPanel','whatifPanel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  });
}

// ---- SERVICE BUS ----
registerPage('service-bus', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Service Bus</div>
      <div class="page-title"><div class="page-title-icon">📨</div><span>Azure Service Bus</span></div>
      <div class="page-subtitle">Enterprise-grade message broker with queues and publish-subscribe topics.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openCreateSBModal()">+ Create Namespace</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Service Bus?</strong> A fully managed enterprise message broker. It decouples applications and services from each other. Instead of Service A calling Service B directly (tight coupling), A sends a message to Service Bus and B reads it when ready (loose coupling).<br><br>
      Two messaging patterns:<br>
      • <strong>Queues</strong> — One sender, one receiver. FIFO message delivery. Messages persist until processed. Used for task distribution.<br>
      • <strong>Topics + Subscriptions</strong> — One sender, many receivers (pub/sub). Different consumers can filter and receive subsets of messages.<br><br>
      <strong>Data Science use case:</strong> When your ML model endpoint receives a prediction request, it puts the job in a Service Bus Queue. A background worker processes it asynchronously — preventing timeouts on long-running inference jobs.</div>
    </div>
    <div class="grid-3" style="margin-bottom:20px">
      <div class="metric-card"><div class="metric-label">Namespaces</div><div class="metric-value">1</div></div>
      <div class="metric-card"><div class="metric-label">Queues</div><div class="metric-value">3</div><div class="metric-sub">active message queues</div></div>
      <div class="metric-card"><div class="metric-label">Topics</div><div class="metric-value">2</div><div class="metric-sub">pub/sub topics</div></div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">Namespace: adewale-servicebus.servicebus.windows.net</div></div>
      <div class="card-body" style="padding:0">
        <div style="padding:10px 16px;font-size:12px;font-weight:700;color:var(--text-muted);background:#f9f9f8;border-bottom:1px solid var(--card-border)">QUEUES</div>
        ${[
          { name: 'ml-inference-jobs', messages: 42, size: '1.2 MB', maxSize: '1 GB', status: 'Active' },
          { name: 'data-pipeline-tasks', messages: 7, size: '128 KB', maxSize: '1 GB', status: 'Active' },
          { name: 'notification-queue', messages: 0, size: '0 KB', maxSize: '1 GB', status: 'Active' }
        ].map(q => `
          <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #f3f2f1">
            <span style="font-size:20px">📥</span>
            <div style="flex:1">
              <div style="font-weight:600;font-size:13px">${q.name}</div>
              <div style="font-size:12px;color:var(--text-muted)">Messages: ${q.messages} · Size: ${q.size} · Max: ${q.maxSize}</div>
            </div>
            ${statusBadge(q.status)}
            <button class="btn btn-ghost btn-sm" onclick="showToast('Sending test message to ${q.name}...','info');setTimeout(()=>showToast('Message sent! ID: msg-'+Math.random().toString(36).substr(2,8),'success'),800)">Send Message</button>
            <button class="btn btn-ghost btn-sm" onclick="showToast('Peeking at messages in ${q.name}...','info')">Peek</button>
          </div>
        `).join('')}
        <div style="padding:10px 16px;font-size:12px;font-weight:700;color:var(--text-muted);background:#f9f9f8;border-top:1px solid var(--card-border);border-bottom:1px solid var(--card-border)">TOPICS</div>
        ${[
          { name: 'model-events', subscriptions: ['scoring-sub', 'logging-sub', 'monitoring-sub'], status: 'Active' },
          { name: 'data-events', subscriptions: ['pipeline-sub', 'audit-sub'], status: 'Active' }
        ].map(t => `
          <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #f3f2f1">
            <span style="font-size:20px">📢</span>
            <div style="flex:1">
              <div style="font-weight:600;font-size:13px">${t.name}</div>
              <div style="font-size:12px;color:var(--text-muted)">Subscriptions: ${t.subscriptions.join(', ')}</div>
            </div>
            ${statusBadge(t.status)}
            <button class="btn btn-ghost btn-sm" onclick="showToast('Publishing to topic...','info');setTimeout(()=>showToast('Published to ${t.subscriptions.length} subscriptions','success'),600)">Publish</button>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Python SDK Example — Send & Receive</div></div>
      <div class="card-body">
        <div class="log-query-box">
<span class="comment"># pip install azure-servicebus azure-identity</span>
<span class="kw">from</span> azure.servicebus <span class="kw">import</span> ServiceBusClient, ServiceBusMessage
<span class="kw">from</span> azure.identity <span class="kw">import</span> DefaultAzureCredential

NAMESPACE = <span class="str">"adewale-servicebus.servicebus.windows.net"</span>
QUEUE = <span class="str">"ml-inference-jobs"</span>

<span class="comment"># Send a message (producer)</span>
<span class="kw">with</span> ServiceBusClient(NAMESPACE, DefaultAzureCredential()) <span class="kw">as</span> client:
    sender = client.get_queue_sender(QUEUE)
    <span class="kw">with</span> sender:
        msg = ServiceBusMessage(<span class="str">'{"job_id": "abc123", "features": [1500, 3, 2, 1985]}'</span>)
        sender.send_messages(msg)
        print(<span class="str">"Message sent!"</span>)

<span class="comment"># Receive and process (consumer / worker)</span>
<span class="kw">with</span> ServiceBusClient(NAMESPACE, DefaultAzureCredential()) <span class="kw">as</span> client:
    receiver = client.get_queue_receiver(QUEUE, max_wait_time=<span class="num">5</span>)
    <span class="kw">with</span> receiver:
        <span class="kw">for</span> msg <span class="kw">in</span> receiver:
            print(<span class="str">f"Processing: {str(msg)}"</span>)
            receiver.complete_message(msg)
        </div>
      </div>
    </div>
  `;
});

function openCreateSBModal() {
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>📨 Create Service Bus Namespace</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Namespace Name *</label><input class="form-control" placeholder="e.g. adewale-servicebus"/><div style="font-size:11px;color:var(--text-muted);margin-top:4px">Must be globally unique. URL: name.servicebus.windows.net</div></div>
        <div class="form-group"><label class="form-label">Resource Group *</label><select class="form-control">${AzureData.resourceGroups.map(r=>`<option>${r.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Pricing Tier</label>
          <select class="form-control">
            <option>Basic — Queues only, 10M operations/month free</option>
            <option>Standard — Queues + Topics, pay-per-message</option>
            <option>Premium — Dedicated capacity, VNet integration</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Region</label><select class="form-control">${AzureData.regions.map(r=>`<option>${r}</option>`).join('')}</select></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="showToast('Service Bus namespace created!','success');logActivity('create','Created Service Bus Namespace','adewale-servicebus','rg-data-science-lab');closeModal()">Create</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

// ---- API MANAGEMENT ----
registerPage('api-management', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › API Management</div>
      <div class="page-title"><div class="page-title-icon">🔌</div><span>Azure API Management</span></div>
      <div class="page-subtitle">Publish, secure, transform, maintain, and monitor APIs across all environments.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure API Management (APIM)?</strong> A gateway that sits in front of your backend APIs (your ML endpoints, App Service APIs, Functions) and provides:<br>
      • <strong>Authentication</strong> — API keys, OAuth 2.0, JWT validation<br>
      • <strong>Rate Limiting</strong> — Prevent abuse (e.g. max 100 calls/minute per consumer)<br>
      • <strong>Transformation</strong> — Modify request/response headers and body without changing the backend<br>
      • <strong>Developer Portal</strong> — Auto-generated API documentation (like Swagger UI)<br>
      • <strong>Analytics</strong> — Track API usage, latency, and errors<br>
      • <strong>Caching</strong> — Cache responses to reduce backend load<br><br>
      <strong>Data Science use case:</strong> Wrap your Azure ML endpoint behind APIM so consumers get a stable URL, authentication, and rate limiting — protecting your ML model from being overloaded.</div>
    </div>
    <div class="grid-4" style="margin-bottom:20px">
      <div class="metric-card"><div class="metric-label">APIs</div><div class="metric-value">3</div></div>
      <div class="metric-card"><div class="metric-label">Calls Today</div><div class="metric-value">1,247</div></div>
      <div class="metric-card"><div class="metric-label">Avg Latency</div><div class="metric-value" style="font-size:20px">84ms</div></div>
      <div class="metric-card"><div class="metric-label">Error Rate</div><div class="metric-value" style="color:#107c10">0.3%</div></div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">Registered APIs</div><button class="btn btn-primary btn-sm" onclick="showToast('Opening API import wizard...','info')">+ Add API</button></div>
      <table class="data-table">
        <thead><tr><th>API Name</th><th>Version</th><th>Backend URL</th><th>Auth</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${[
            { name: 'ML Predictions API', version: 'v2', backend: 'https://house-price-endpoint.eastus.inference.ml.azure.com', auth: 'API Key', status: 'Published' },
            { name: 'Data Processing API', version: 'v1', backend: 'https://data-preprocessing-fn.azurewebsites.net/api', auth: 'OAuth 2.0', status: 'Published' },
            { name: 'Analytics API', version: 'v1', backend: 'https://adewale-ml-api.azurewebsites.net', auth: 'API Key', status: 'Draft' }
          ].map(a => `
            <tr>
              <td><strong>${a.name}</strong></td>
              <td><span class="badge badge-info">${a.version}</span></td>
              <td style="font-size:11px;font-family:monospace">${a.backend.substring(0,40)}...</td>
              <td><span class="badge badge-running">${a.auth}</span></td>
              <td>${statusBadge(a.status)}</td>
              <td>
                <button class="btn btn-ghost btn-sm" onclick="showToast('Opening API designer...','info')">Design</button>
                <button class="btn btn-ghost btn-sm" onclick="showToast('Opening test console...','info')">Test</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Policy Example — Rate Limiting</div></div>
      <div class="card-body">
        <div class="log-query-box">
<span class="comment">&lt;!-- APIM Inbound Policy: Rate limit + API key validation --&gt;</span>
<span class="kw">&lt;policies&gt;</span>
  <span class="kw">&lt;inbound&gt;</span>
    <span class="kw">&lt;rate-limit</span> calls=<span class="str">"100"</span> renewal-period=<span class="str">"60"</span> /&gt;
    <span class="kw">&lt;validate-jwt</span> header-name=<span class="str">"Authorization"</span> require-expiration-time=<span class="str">"true"</span>&gt;
      <span class="kw">&lt;openid-config</span> url=<span class="str">"https://login.microsoftonline.com/tenant/.well-known/openid"</span> /&gt;
    <span class="kw">&lt;/validate-jwt&gt;</span>
    <span class="kw">&lt;set-header</span> name=<span class="str">"X-ML-Version"</span> exists-action=<span class="str">"override"</span>&gt;
      <span class="kw">&lt;value&gt;</span>house-price-v2<span class="kw">&lt;/value&gt;</span>
    <span class="kw">&lt;/set-header&gt;</span>
  <span class="kw">&lt;/inbound&gt;</span>
  <span class="kw">&lt;backend&gt;&lt;forward-request /&gt;&lt;/backend&gt;</span>
  <span class="kw">&lt;outbound&gt;</span>
    <span class="kw">&lt;cache-store</span> duration=<span class="str">"60"</span> /&gt;
  <span class="kw">&lt;/outbound&gt;</span>
<span class="kw">&lt;/policies&gt;</span>
        </div>
      </div>
    </div>
  `;
});

// ---- STREAM ANALYTICS ----
registerPage('stream-analytics', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Stream Analytics</div>
      <div class="page-title"><div class="page-title-icon">⚡</div><span>Azure Stream Analytics</span></div>
      <div class="page-subtitle">Real-time analytics and event processing for streaming data from IoT devices, apps, and event hubs.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="showToast('Creating Stream Analytics job...','info');setTimeout(()=>showToast('Job created!','success'),1500)">+ Create Job</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Stream Analytics?</strong> A real-time stream processing engine using an SQL-like query language. It connects to inputs (Event Hubs, IoT Hub, Blob Storage), transforms the streaming data with SQL queries, and outputs results to sinks (Power BI, Azure SQL, Blob Storage, Azure Functions).<br><br>
      <strong>Data Science use case:</strong> Stream sensor data from IoT devices → Event Hubs → Stream Analytics (detect anomalies in real time using SQL) → trigger an Azure Function to call your ML model → output predictions to Power BI dashboard. This is real-time ML scoring at scale.</div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">Stream Analytics Jobs</div></div>
      <div class="card-body" style="padding:0">
        ${[
          { name: 'iot-anomaly-detection', input: 'Event Hubs (telemetry-stream)', output: 'Azure SQL + Power BI', events: '12,450/sec', status: 'Running' },
          { name: 'realtime-model-scoring', input: 'Event Hubs (user-events)', output: 'Azure Functions', events: '340/sec', status: 'Running' },
          { name: 'data-aggregation-job', input: 'Blob Storage', output: 'Synapse Analytics', events: '0/sec', status: 'Stopped' }
        ].map(j => `
          <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid var(--card-border)">
            <span style="font-size:22px">⚡</span>
            <div style="flex:1">
              <div style="font-weight:700;font-size:13px">${j.name}</div>
              <div style="font-size:12px;color:var(--text-muted)">In: ${j.input}</div>
              <div style="font-size:12px;color:var(--text-muted)">Out: ${j.output} · ${j.events}</div>
            </div>
            ${statusBadge(j.status)}
            <button class="btn btn-ghost btn-sm" onclick="openSAQuery('${j.name}')">Edit Query</button>
            <button class="btn btn-ghost btn-sm" onclick="showToast('${j.status==='Running'?'Stopping':'Starting'} job...','info')">${j.status==='Running'?'Stop':'Start'}</button>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Stream Analytics Query (SQL-like)</div></div>
      <div class="card-body">
        <div class="log-query-box">
<span class="comment">-- Detect sensor readings above threshold in 5-minute windows</span>
<span class="kw">SELECT</span>
    System.Timestamp() <span class="kw">AS</span> WindowEnd,
    deviceId,
    AVG(temperature) <span class="kw">AS</span> AvgTemp,
    MAX(temperature) <span class="kw">AS</span> MaxTemp,
    COUNT(*) <span class="kw">AS</span> ReadingCount
<span class="kw">INTO</span> [sql-anomalies-output]
<span class="kw">FROM</span> [telemetry-eventhub] TIMESTAMP <span class="kw">BY</span> EventEnqueuedUtcTime
<span class="kw">GROUP BY</span> deviceId, TumblingWindow(minute, <span class="num">5</span>)
<span class="kw">HAVING</span> AVG(temperature) > <span class="num">85.0</span>
        </div>
        <button class="btn btn-primary btn-sm" style="margin-top:10px" onclick="showToast('Query tested: 3 anomalies detected in sample data','success')">▶ Test Query</button>
      </div>
    </div>
  `;
});

function openSAQuery(name) {
  showToast(`Opening query editor for ${name}...`, 'info');
}

// ---- AZURE ADVISOR ----
registerPage('advisor', (container) => {
  const recommendations = [
    { category: 'Cost', icon: '💰', sev: 'high', title: 'Rightsize or shut down underused virtual machines', desc: 'ds-workstation-01 has average CPU utilisation below 5% over the past 14 days. Resize to Standard_B1s to save ~$88/month.', impact: 'Estimated savings: $88.92/month', action: 'Resize VM' },
    { category: 'Security', icon: '🛡️', sev: 'high', title: 'Enable MFA for all privileged accounts', desc: 'Your Global Administrator account does not have Multi-Factor Authentication enabled. This is a critical security risk.', impact: 'Reduces account compromise risk by 99.9%', action: 'Enable MFA' },
    { category: 'Reliability', icon: '🔁', sev: 'medium', title: 'Enable soft delete for Key Vault secrets', desc: 'adewale-key-vault does not have soft delete enabled. Accidental secret deletion would be unrecoverable.', impact: 'Prevents accidental permanent deletion', action: 'Enable Soft Delete' },
    { category: 'Performance', icon: '⚡', sev: 'medium', title: 'Enable read replicas for SQL Database', desc: 'experiments-db has high read traffic. Add a read replica to distribute load and improve query performance.', impact: 'Reduce read latency by up to 40%', action: 'Add Read Replica' },
    { category: 'Cost', icon: '💰', sev: 'medium', title: 'Delete unused public IP addresses', desc: '2 public IP addresses are not associated with any running resources. They still cost $3.65/month each.', impact: 'Estimated savings: $7.30/month', action: 'Review IPs' },
    { category: 'Operational Excellence', icon: '📋', sev: 'low', title: 'Enable diagnostic logs on all services', desc: 'adewale-synapse, adewale-cosmos, and adewale-data-factory have diagnostic logs disabled. Logs are essential for troubleshooting.', impact: 'Improves observability and auditability', action: 'Enable Logs' },
    { category: 'Security', icon: '🛡️', sev: 'medium', title: 'Restrict SSH access on Network Security Groups', desc: 'ds-workstation-01 NSG allows SSH (port 22) from 0.0.0.0/0 (all internet). Restrict to your IP address only.', impact: 'Eliminates exposure to SSH brute-force attacks', action: 'Update NSG Rule' },
    { category: 'Cost', icon: '💰', sev: 'low', title: 'Move infrequent Blob data to Cool tier', desc: '68% of data in datasciencefiles01 has not been accessed in 30+ days. Moving to Cool tier saves ~$0.008/GB/month.', impact: 'Estimated savings: $3.20/month', action: 'Set Lifecycle Policy' }
  ];

  const byCat = {};
  recommendations.forEach(r => {
    if (!byCat[r.category]) byCat[r.category] = [];
    byCat[r.category].push(r);
  });

  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Azure Advisor</div>
      <div class="page-title"><div class="page-title-icon">💡</div><span>Azure Advisor</span></div>
      <div class="page-subtitle">Personalised best practices to optimise your Azure deployments.</div>
      <div class="page-actions">
        <button class="btn btn-secondary" onclick="showToast('Refreshing recommendations...','info');setTimeout(()=>showToast('Recommendations refreshed!','success'),1200)">Refresh</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Advisor?</strong> Advisor continuously analyses your resource configuration and usage telemetry, then gives specific, actionable recommendations across 5 categories:<br>
      • <strong>💰 Cost</strong> — Eliminate waste, rightsize resources, delete unused items<br>
      • <strong>🛡️ Security</strong> — Integrated with Microsoft Defender for Cloud<br>
      • <strong>🔁 Reliability</strong> — Ensure business continuity (backups, redundancy, soft delete)<br>
      • <strong>⚡ Performance</strong> — Improve application speed and responsiveness<br>
      • <strong>📋 Operational Excellence</strong> — Improve process and workflow efficiency<br>
      Every recommendation includes the estimated impact so you can prioritise what to fix first.</div>
    </div>
    <div class="metric-scroll-row" style="margin-bottom:20px">
      ${[
        { cat: 'Cost', icon: '💰', count: recommendations.filter(r=>r.category==='Cost').length, color: '#0078D4' },
        { cat: 'Security', icon: '🛡️', count: recommendations.filter(r=>r.category==='Security').length, color: '#a4262c' },
        { cat: 'Reliability', icon: '🔁', count: recommendations.filter(r=>r.category==='Reliability').length, color: '#d83b01' },
        { cat: 'Performance', icon: '⚡', count: recommendations.filter(r=>r.category==='Performance').length, color: '#107c10' },
        { cat: 'Operational Excellence', icon: '📋', count: recommendations.filter(r=>r.category==='Operational Excellence').length, color: '#8764b8' }
      ].map(c => `
        <div class="metric-card" style="border-top:4px solid ${c.color}">
          <div class="metric-label">${c.icon} ${c.cat}</div>
          <div class="metric-value" style="color:${c.color}">${c.count}</div>
          <div class="metric-sub">recommendation${c.count!==1?'s':''}</div>
        </div>
      `).join('')}
    </div>
    ${Object.entries(byCat).map(([cat, recs]) => `
      <div style="margin-bottom:20px">
        <div style="font-size:14px;font-weight:700;margin-bottom:10px;display:flex;align-items:center;gap:8px">
          ${recs[0].icon} ${cat} Recommendations
          <span class="badge badge-info">${recs.length}</span>
        </div>
        ${recs.map(r => `
          <div class="advisor-card ${r.sev}">
            <div class="advisor-card-header">
              <span style="font-size:18px">${r.sev==='high'?'🔴':r.sev==='medium'?'🟡':'🟢'}</span>
              <div class="advisor-card-title">${r.title}</div>
              <span class="badge badge-${r.sev==='high'?'stopped':r.sev==='medium'?'warning':'running'}">${r.sev}</span>
            </div>
            <div class="advisor-card-body">${r.desc}</div>
            <div class="advisor-impact">
              <span>📊 ${r.impact}</span>
            </div>
            <div style="margin-top:10px;display:flex;gap:6px">
              <button class="btn btn-primary btn-sm" onclick="showToast('Applying recommendation: ${r.action}...','info');setTimeout(()=>showToast('${r.action} applied successfully!','success'),1500)">${r.action}</button>
              <button class="btn btn-ghost btn-sm" onclick="showToast('Recommendation dismissed','info')">Dismiss</button>
            </div>
          </div>
        `).join('')}
      </div>
    `).join('')}
  `;
});

// ---- ARCHITECTURE DIAGRAM BUILDER ----
registerPage('architecture', (container) => {
  let nodes = [
    { id: 1, icon: '🌐', label: 'App Service', x: 40, y: 40 },
    { id: 2, icon: '⚡', label: 'Functions', x: 200, y: 40 },
    { id: 3, icon: '💾', label: 'Storage', x: 120, y: 160 },
    { id: 4, icon: '🗃️', label: 'SQL DB', x: 300, y: 160 },
    { id: 5, icon: '🔑', label: 'Key Vault', x: 40, y: 280 }
  ];
  let nextId = 6;

  function renderCanvas() {
    document.getElementById('archCanvas').innerHTML =
      nodes.map(n => `
        <div class="arch-node" id="arch-node-${n.id}" style="left:${n.x}px;top:${n.y}px" draggable="true"
             ondragstart="event.dataTransfer.setData('nodeId','${n.id}')"
             title="Drag to move · Click to rename">
          <div class="arch-node-box" ondblclick="renameArchNode(${n.id})">${n.icon}</div>
          <div class="arch-node-label">${n.label}</div>
          <button onclick="removeArchNode(${n.id})" style="position:absolute;top:-6px;right:-6px;width:16px;height:16px;border-radius:50%;background:#a4262c;color:white;border:none;cursor:pointer;font-size:9px;display:flex;align-items:center;justify-content:center;line-height:1">✕</button>
        </div>
      `).join('');

    // Make canvas a drop target
    const canvas = document.getElementById('archCanvas');
    canvas.ondragover = e => e.preventDefault();
    canvas.ondrop = e => {
      e.preventDefault();
      const id = parseInt(e.dataTransfer.getData('nodeId'));
      const rect = canvas.getBoundingClientRect();
      const node = nodes.find(n => n.id === id);
      if (node) {
        node.x = Math.max(0, Math.min(e.clientX - rect.left - 32, canvas.clientWidth - 70));
        node.y = Math.max(0, Math.min(e.clientY - rect.top - 32, canvas.clientHeight - 80));
        renderCanvas();
      }
    };
  }

  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Architecture Diagrams</div>
      <div class="page-title"><div class="page-title-icon">🏗️</div><span>Architecture Diagram Builder</span></div>
      <div class="page-subtitle">Build and visualise Azure architecture diagrams interactively. Drag components to design your solution.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is an Architecture Diagram?</strong> A visual map of how Azure services connect in your solution. Before building, architects draw these to communicate the design to the team. The Azure Architecture Center (learn.microsoft.com/azure/architecture) has hundreds of reference patterns. This builder lets you drag-and-drop Azure services and arrange them to learn common patterns.</div>
    </div>
    <div class="arch-toolbar">
      <button class="btn btn-secondary btn-sm" onclick="clearArchDiagram()">🗑 Clear</button>
      <button class="btn btn-secondary btn-sm" onclick="loadArchTemplate('data-science')">📊 Load: Data Science Pipeline</button>
      <button class="btn btn-secondary btn-sm" onclick="loadArchTemplate('web-app')">🌐 Load: Web App Pattern</button>
      <button class="btn btn-primary btn-sm" onclick="exportArchDiagram()">⬇ Export List</button>
    </div>
    <div class="arch-component-palette" id="archPalette">
      ${[
        ['🖥️','VM'],['🌐','App Service'],['⚡','Functions'],['💾','Storage'],
        ['🗃️','SQL DB'],['🌌','Cosmos DB'],['🕸️','VNet'],['⚖️','Load Balancer'],
        ['🔑','Key Vault'],['🛡️','Firewall'],['🤖','ML Studio'],['📊','Synapse'],
        ['🔷','Databricks'],['🔄','Data Factory'],['📡','Event Hubs'],['👥','Entra ID'],
        ['📢','Service Bus'],['🔌','API Mgmt'],['☸️','AKS'],['🐳','Container Reg'],
        ['📈','Monitor'],['🌍','DNS'],['🔒','VPN GW'],['📡','Stream Analytics']
      ].map(([icon, label]) => `
        <button class="arch-component-btn" onclick="addArchNode('${icon}','${label}')">
          <span>${icon}</span><span>${label}</span>
        </button>
      `).join('')}
    </div>
    <div class="arch-canvas" id="archCanvas" style="min-height:420px;position:relative"></div>
    <div class="info-box" style="margin-top:12px">
      <span>💡</span>
      <span>Drag components on the canvas to reposition them. Double-click a node to rename it. Click ✕ to remove it. Use the preset templates to load common Azure architecture patterns.</span>
    </div>
  `;

  renderCanvas();

  window._archNodes = nodes;
  window._archNextId = nextId;
  window._archRenderCanvas = renderCanvas;
});

function addArchNode(icon, label) {
  if (!window._archNodes) return;
  const id = window._archNextId++;
  window._archNodes.push({ id, icon, label, x: 20 + Math.random() * 200, y: 20 + Math.random() * 300 });
  window._archRenderCanvas();
}

function removeArchNode(id) {
  if (!window._archNodes) return;
  window._archNodes = window._archNodes.filter(n => n.id !== id);
  window._archRenderCanvas();
}

function renameArchNode(id) {
  const node = window._archNodes?.find(n => n.id === id);
  if (!node) return;
  const name = prompt('Rename this component:', node.label);
  if (name) { node.label = name; window._archRenderCanvas(); }
}

function clearArchDiagram() {
  if (!window._archNodes) return;
  window._archNodes = [];
  window._archRenderCanvas();
}

function loadArchTemplate(type) {
  if (!window._archNodes) return;
  const templates = {
    'data-science': [
      { id:1, icon:'💾', label:'ADLS Gen2', x:20, y:180 },
      { id:2, icon:'🔄', label:'Data Factory', x:130, y:180 },
      { id:3, icon:'📊', label:'Synapse', x:250, y:100 },
      { id:4, icon:'🔷', label:'Databricks', x:250, y:260 },
      { id:5, icon:'🤖', label:'ML Studio', x:390, y:180 },
      { id:6, icon:'🌐', label:'ML Endpoint', x:510, y:100 },
      { id:7, icon:'🔑', label:'Key Vault', x:510, y:260 },
      { id:8, icon:'📈', label:'Monitor', x:390, y:330 }
    ],
    'web-app': [
      { id:1, icon:'🌍', label:'DNS Zone', x:20, y:180 },
      { id:2, icon:'⚖️', label:'Load Balancer', x:140, y:180 },
      { id:3, icon:'🌐', label:'App Service', x:270, y:100 },
      { id:4, icon:'⚡', label:'Functions', x:270, y:260 },
      { id:5, icon:'🗃️', label:'SQL Database', x:400, y:100 },
      { id:6, icon:'🌌', label:'Cosmos DB', x:400, y:260 },
      { id:7, icon:'💾', label:'Blob Storage', x:520, y:180 },
      { id:8, icon:'🔑', label:'Key Vault', x:140, y:330 },
      { id:9, icon:'🛡️', label:'Security Center', x:270, y:330 }
    ]
  };
  window._archNodes = templates[type] || [];
  window._archNextId = Math.max(...(window._archNodes.map(n=>n.id)), 0) + 1;
  window._archRenderCanvas();
  showToast(`Loaded ${type.replace('-',' ')} template`, 'success');
}

function exportArchDiagram() {
  if (!window._archNodes?.length) { showToast('Add components first', 'error'); return; }
  const list = window._archNodes.map(n => `${n.icon} ${n.label}`).join('\n');
  const blob = new Blob([`Azure Architecture Diagram\nBy: Adewale Adeagbo\n\nComponents:\n${list}`], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'architecture-diagram.txt'; a.click();
  URL.revokeObjectURL(url);
  showToast('Architecture exported!', 'success');
}
