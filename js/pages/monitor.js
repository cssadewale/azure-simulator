/* =====================================================
   MONITOR PAGE
   ===================================================== */

registerPage('monitor', (container) => {
  const mon = AzureData.monitor;
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Azure Monitor</div>
      <div class="page-title"><div class="page-title-icon">📈</div><span>Azure Monitor</span></div>
      <div class="page-subtitle">Maximise the availability and performance of your applications and services.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openCreateAlertModal()">+ New Alert Rule</button>
        <button class="btn btn-secondary" onclick="navigateTo('log-analytics')">Log Analytics</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Monitor?</strong> The central monitoring hub for all Azure resources. It collects and analyses telemetry from your cloud and on-premises environments:<br>
      • <strong>Metrics</strong> — Numerical time-series data (CPU %, memory, requests/second, latency)<br>
      • <strong>Logs</strong> — Detailed event and diagnostic data stored in Log Analytics (query with KQL)<br>
      • <strong>Alerts</strong> — Notify you (email, SMS, webhook) when a metric crosses a threshold<br>
      • <strong>Dashboards</strong> — Visualise metrics in customisable charts<br>
      • <strong>Application Insights</strong> — APM for web apps (request tracing, exceptions, dependencies)<br>
      As a data scientist: monitor your ML endpoints for latency spikes, your VMs for high CPU during training, and set alerts for anomalies.</div>
    </div>
    <div class="grid-4" style="margin-bottom:20px">
      <div class="metric-card"><div class="metric-label">Alert Rules</div><div class="metric-value">${mon.alerts.length}</div></div>
      <div class="metric-card"><div class="metric-label">Active Alerts</div><div class="metric-value" style="color:#107c10">0</div><div class="metric-sub">no thresholds exceeded</div></div>
      <div class="metric-card"><div class="metric-label">Log Workspaces</div><div class="metric-value">${mon.workspaces.length}</div></div>
      <div class="metric-card"><div class="metric-label">Data Retention</div><div class="metric-value" style="font-size:18px">30 days</div></div>
    </div>
    <div class="grid-2" style="margin-bottom:16px">
      <div class="card">
        <div class="card-header"><div class="card-title">📊 CPU Usage — ds-workstation-01 (Last 12h)</div></div>
        <div class="card-body">
          <div style="display:flex;align-items:flex-end;gap:4px;height:120px;padding-top:20px" id="cpuChart">
            ${mon.metrics.cpuUsage.map((v,i) => `
              <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
                <div style="font-size:9px;color:#8a8886">${v}%</div>
                <div style="width:100%;background:#0078D4;border-radius:2px 2px 0 0;height:${Math.max(v,4)}px;opacity:0.8;transition:height 0.3s" title="${v}%"></div>
                <div style="font-size:9px;color:#8a8886">${i+1}h</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">💾 Memory Usage — ds-workstation-01 (Last 12h)</div></div>
        <div class="card-body">
          <div style="display:flex;align-items:flex-end;gap:4px;height:120px;padding-top:20px">
            ${mon.metrics.memUsage.map((v,i) => `
              <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
                <div style="font-size:9px;color:#8a8886">${v}%</div>
                <div style="width:100%;background:#00B4D8;border-radius:2px 2px 0 0;height:${Math.max(v,4)}px;opacity:0.8" title="${v}%"></div>
                <div style="font-size:9px;color:#8a8886">${i+1}h</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">🔔 Alert Rules</div><button class="btn btn-primary btn-sm" onclick="openCreateAlertModal()">+ New Alert</button></div>
      <table class="data-table">
        <thead><tr><th>Alert Name</th><th>Resource</th><th>Condition</th><th>Severity</th><th>Status</th><th>Last Fired</th><th>Actions</th></tr></thead>
        <tbody>
          ${mon.alerts.map(a => `
            <tr>
              <td><strong>${a.name}</strong></td>
              <td>${a.resource}</td>
              <td><code style="font-size:11px">${a.condition}</code></td>
              <td><span class="badge badge-${a.severity==='Critical'?'stopped':'warning'}">${a.severity}</span></td>
              <td>${statusBadge(a.status)}</td>
              <td style="color:#8a8886">${a.fired}</td>
              <td>
                <button class="btn btn-ghost btn-sm" onclick="showToast('Alert edited','info')">Edit</button>
                <button class="btn btn-ghost btn-sm" style="color:#a4262c" onclick="showToast('Alert deleted','success')">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
});

function openCreateAlertModal() {
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>🔔 Create Alert Rule</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Alert Name *</label><input id="alertName" class="form-control" placeholder="e.g. High CPU Alert"/></div>
        <div class="form-group"><label class="form-label">Resource to Monitor *</label>
          <select id="alertResource" class="form-control">
            ${AzureData.virtualMachines.map(v=>`<option>${v.name}</option>`).join('')}
            ${AzureData.storageAccounts.map(s=>`<option>${s.name}</option>`).join('')}
            ${AzureData.functions.map(f=>`<option>${f.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label class="form-label">Metric</label>
          <select class="form-control"><option>Percentage CPU</option><option>Available Memory Bytes</option><option>Network In Total</option><option>Disk Read Bytes</option><option>Function Execution Count</option></select>
        </div>
        <div class="form-group"><label class="form-label">Condition</label>
          <select class="form-control"><option>Greater than</option><option>Less than</option><option>Equal to</option></select>
        </div>
        <div class="form-group"><label class="form-label">Threshold Value</label><input class="form-control" placeholder="e.g. 80" type="number"/></div>
        <div class="form-group"><label class="form-label">Severity</label>
          <select id="alertSeverity" class="form-control"><option>Critical</option><option>Warning</option><option>Informational</option></select>
        </div>
        <div class="form-group"><label class="form-label">Action (Notification)</label>
          <select class="form-control"><option>Email — adewale@cssadewale.dev</option><option>SMS</option><option>Webhook</option></select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="createAlert()">Create Alert</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function createAlert() {
  const name = document.getElementById('alertName').value.trim();
  const resource = document.getElementById('alertResource').value;
  const severity = document.getElementById('alertSeverity').value;
  if (!name) { showToast('Alert name required.', 'error'); return; }
  AzureData.monitor.alerts.push({ name, resource, condition: 'Custom condition', severity, status: 'Active', fired: 'Never' });
  showToast(`Alert rule "${name}" created!`, 'success');
  closeModal();
  navigateTo('monitor');
}

/* =====================================================
   LOG ANALYTICS PAGE
   ===================================================== */

registerPage('log-analytics', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › <span onclick="navigateTo('monitor')">Monitor</span> › Log Analytics</div>
      <div class="page-title"><div class="page-title-icon">📜</div><span>Log Analytics Workspace</span></div>
      <div class="page-subtitle">Query and analyse logs from Azure resources using Kusto Query Language (KQL).</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Log Analytics?</strong> A tool within Azure Monitor to write and run log queries using <strong>KQL (Kusto Query Language)</strong>. All your Azure resource logs, VM performance data, security events, and custom application logs stream into a Log Analytics Workspace and you can query them in real time. KQL is similar to SQL but optimised for time-series log data.</div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">Query Editor — adewale-log-workspace</div></div>
      <div class="card-body">
        <div class="log-query-box" contenteditable="true" id="kqlQuery">
<span class="comment">// KQL Example: Find all errors in the last 24 hours</span>
<span class="kw">AzureActivity</span>
<span class="kw">| where</span> TimeGenerated > ago(<span class="num">24h</span>)
<span class="kw">| where</span> ActivityStatus == <span class="str">"Failed"</span>
<span class="kw">| project</span> TimeGenerated, OperationName, ResourceGroup, Caller, Properties
<span class="kw">| order by</span> TimeGenerated <span class="kw">desc</span>
<span class="kw">| limit</span> <span class="num">50</span>
        </div>
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn btn-primary" onclick="runKQLQuery()">▶ Run Query</button>
          <button class="btn btn-secondary btn-sm" onclick="loadKQLExample('vm')">VM Performance</button>
          <button class="btn btn-secondary btn-sm" onclick="loadKQLExample('errors')">Error Analysis</button>
          <button class="btn btn-secondary btn-sm" onclick="loadKQLExample('security')">Security Events</button>
        </div>
        <div id="kqlResults" style="display:none;margin-top:16px">
          <div style="font-size:12px;color:#107c10;margin-bottom:8px">✓ Query returned 3 results (0.234s) — Time range: Last 24 hours</div>
          <div class="log-result-table">
            <table class="data-table">
              <thead><tr><th>TimeGenerated</th><th>OperationName</th><th>ResourceGroup</th><th>Caller</th></tr></thead>
              <tbody>
                <tr><td>2024-03-12 14:22:01</td><td>Delete Virtual Machine</td><td>rg-ml-experiments</td><td>adewale@cssadewale.dev</td></tr>
                <tr><td>2024-03-12 10:15:44</td><td>Start Virtual Machine</td><td>rg-data-science-lab</td><td>adewale@cssadewale.dev</td></tr>
                <tr><td>2024-03-11 22:08:12</td><td>Update Storage Account</td><td>rg-data-science-lab</td><td>ml-svc@cssadewale.dev</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Useful KQL Queries for Data Scientists</div></div>
      <div class="card-body">
        ${[
          { title: 'VM CPU over 80%', query: 'Perf | where ObjectName == "Processor" | where CounterName == "% Processor Time" | where CounterValue > 80 | summarize avg(CounterValue) by Computer, bin(TimeGenerated, 5m)' },
          { title: 'Function App Errors', query: 'FunctionAppLogs | where Level == "Error" | project TimeGenerated, FunctionName, Message, ExceptionDetails | order by TimeGenerated desc' },
          { title: 'Failed Login Attempts', query: 'SigninLogs | where ResultType != 0 | summarize count() by UserPrincipalName, Location, AppDisplayName | order by count_ desc' },
          { title: 'Storage Account Writes', query: 'StorageBlobLogs | where OperationName == "PutBlob" | summarize count() by AccountName, bin(TimeGenerated, 1h) | render timechart' }
        ].map(q => `
          <div style="margin-bottom:12px">
            <div style="font-size:12px;font-weight:600;margin-bottom:4px">${q.title}</div>
            <div style="background:#f3f2f1;padding:8px 12px;border-radius:4px;font-family:monospace;font-size:11px;color:#605e5c;cursor:pointer" onclick="showToast('Query copied!','success')" title="Click to copy">${q.query}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
});

function runKQLQuery() {
  showToast('Running KQL query...', 'info');
  setTimeout(() => {
    const el = document.getElementById('kqlResults');
    if (el) el.style.display = '';
    showToast('Query completed: 3 results', 'success');
  }, 700);
}

function loadKQLExample(type) {
  const examples = {
    vm: `// VM CPU Performance\nPerf\n| where ObjectName == "Processor"\n| where CounterName == "% Processor Time"\n| summarize avg(CounterValue) by Computer, bin(TimeGenerated, 5m)\n| render timechart`,
    errors: `// Application Errors Last 7 Days\nAppExceptions\n| where TimeGenerated > ago(7d)\n| summarize count() by type, bin(TimeGenerated, 1d)\n| order by count_ desc`,
    security: `// Security Events — Failed Logins\nSecurityEvent\n| where EventID == 4625\n| summarize count() by Account, Computer, IpAddress\n| order by count_ desc | limit 20`
  };
  const box = document.getElementById('kqlQuery');
  if (box) box.textContent = examples[type] || '';
  showToast(`Loaded ${type} query example`, 'info');
}

/* =====================================================
   COST MANAGEMENT PAGE
   ===================================================== */

registerPage('cost-management', (container) => {
  const cm = AzureData.costManagement;
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Cost Management</div>
      <div class="page-title"><div class="page-title-icon">💰</div><span>Cost Management + Billing</span></div>
      <div class="page-subtitle">Monitor, allocate, and optimise your Azure spending with full cost visibility.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openCreateBudgetModal()">+ Create Budget</button>
        <button class="btn btn-secondary" onclick="showToast('Downloading cost report...','info')">Export</button>
      </div>
    </div>
    <div class="info-box success" style="margin-bottom:16px">
      <span>🎉</span>
      <div><strong>Great news!</strong> Your current spend is <strong>$0.00</strong> this month. You're on Azure for Students with a $100 credit. This simulator helps you understand costs <em>before</em> deploying real resources. Always check the <a class="link" href="https://azure.microsoft.com/en-us/pricing/calculator/" target="_blank">Azure Pricing Calculator</a> before creating expensive resources like GPU VMs or SQL Data Warehouses.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>Azure Cost Management Tips for Students:</strong><br>
      • <strong>Always stop VMs</strong> when not using them (stopped VMs still incur disk costs — deallocate them!)<br>
      • <strong>Use Free Tier services</strong>: Azure Functions (1M free executions/month), App Service (F1 free plan), Blob Storage (first 5GB free)<br>
      • <strong>Set a budget alert</strong> at $50 and $90 to avoid surprise charges<br>
      • <strong>Delete unused resources</strong> — old VMs, disks, and public IPs all cost money<br>
      • <strong>Use Azure Cost Calculator</strong> to estimate costs before deployment<br>
      • <strong>Right-size your VMs</strong> — use the smallest size that meets your needs</div>
    </div>
    <div class="grid-4" style="margin-bottom:20px">
      <div class="metric-card" style="border-left:4px solid #107c10">
        <div class="metric-label">Spent This Month</div>
        <div class="metric-value" style="color:#107c10">$${cm.currentMonth.total.toFixed(2)}</div>
        <div class="metric-sub">of $${cm.budget} budget</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Budget Remaining</div>
        <div class="metric-value">$${(cm.budget - cm.currentMonth.total).toFixed(2)}</div>
        <div class="metric-sub">${((1 - cm.currentMonth.total/cm.budget)*100).toFixed(0)}% remaining</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Monthly Forecast</div>
        <div class="metric-value">$${cm.currentMonth.forecast.toFixed(2)}</div>
        <div class="metric-sub">projected spend</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Budget Status</div>
        <div class="metric-value" style="font-size:18px;color:#107c10">✓ On Track</div>
      </div>
    </div>
    <div class="grid-2" style="margin-bottom:16px">
      <div class="card">
        <div class="card-header"><div class="card-title">Cost by Service</div></div>
        <div class="card-body">
          ${cm.currentMonth.breakdown.map(s => `
            <div class="cost-bar">
              <div class="cost-bar-label">${s.service}</div>
              <div class="cost-bar-track">
                <div class="cost-bar-fill" style="background:${s.color};width:${cm.currentMonth.total>0?(s.cost/cm.currentMonth.total*100).toFixed(1):0}%"></div>
              </div>
              <div class="cost-bar-val">$${s.cost.toFixed(2)}</div>
            </div>
          `).join('')}
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid #f3f2f1;display:flex;justify-content:space-between;font-weight:700">
            <span>Total</span>
            <span>$${cm.currentMonth.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Budget Tracker</div></div>
        <div class="card-body">
          ${cm.budgets.map(b => `
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                <strong>${b.name}</strong>
                <span class="badge badge-running">${b.status}</span>
              </div>
              <div class="progress-bar" style="height:12px;margin-bottom:6px">
                <div class="progress-fill success" style="width:${(b.spent/b.amount*100).toFixed(1)}%"></div>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:12px;color:#8a8886">
                <span>$${b.spent.toFixed(2)} spent</span>
                <span>$${b.amount.toFixed(2)} budget</span>
              </div>
            </div>
          `).join('')}
          <div class="info-box" style="margin-top:16px;font-size:12px">
            <span>💡</span><span>You'll receive email alerts when you reach 80% and 100% of your budget threshold.</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Azure Pricing Reference (Common Services)</div></div>
      <div class="card-body">
        <table class="data-table">
          <thead><tr><th>Service</th><th>Tier/Size</th><th>Approx. Cost</th><th>Free Tier</th><th>Student Tip</th></tr></thead>
          <tbody>
            ${[
              { svc:'Virtual Machine', tier:'Standard_B1s (1 vCPU, 1GB)', cost:'~$7.30/month', free:'No', tip:'Stop when not in use! Deallocate = no compute cost' },
              { svc:'Virtual Machine', tier:'Standard_D2s_v3 (2 vCPU, 8GB)', cost:'~$96/month', free:'No', tip:'Expensive — use only when needed, always stop after' },
              { svc:'App Service', tier:'Free F1', cost:'$0/month', free:'Yes', tip:'Start here for web apps — 60 min/day compute' },
              { svc:'Azure Functions', tier:'Consumption', cost:'First 1M free', free:'Yes', tip:'Great for event-driven code — almost always free' },
              { svc:'Storage Account', tier:'LRS Standard', cost:'~$0.018/GB/month', free:'5GB free', tip:'Store datasets here — very cheap' },
              { svc:'SQL Database', tier:'Basic (5 DTU)', cost:'~$4.90/month', free:'No', tip:'Pause or delete when not needed' },
              { svc:'Azure ML Compute', tier:'CPU cluster (min 0 nodes)', cost:'$0 when idle', free:'No', tip:'Always set min_nodes=0 to avoid idle charges' },
              { svc:'Cosmos DB', tier:'Serverless', cost:'Pay per RU', free:'1000 RU/s free', tip:'Use serverless for dev/test workloads' }
            ].map(r => `
              <tr>
                <td><strong>${r.svc}</strong></td>
                <td style="font-size:12px">${r.tier}</td>
                <td style="font-weight:600;color:${r.cost.includes('$0')||r.free==='Yes'?'#107c10':'#d83b01'}">${r.cost}</td>
                <td>${r.free==='Yes'?'<span style="color:#107c10">✓ Yes</span>':'<span style="color:#8a8886">No</span>'}</td>
                <td style="font-size:11px;color:#605e5c">${r.tip}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
});

function openCreateBudgetModal() {
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>💰 Create Budget</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Budget Name *</label><input id="budgetName" class="form-control" placeholder="e.g. Monthly Limit"/></div>
        <div class="form-group"><label class="form-label">Budget Amount ($) *</label><input id="budgetAmount" class="form-control" type="number" placeholder="e.g. 50" value="50"/></div>
        <div class="form-group"><label class="form-label">Reset Period</label><select class="form-control"><option>Monthly</option><option>Quarterly</option><option>Annually</option></select></div>
        <div class="form-group"><label class="form-label">Alert Thresholds</label>
          <div style="display:flex;gap:8px">
            <input class="form-control" value="80" type="number" style="width:80px"/> <span style="line-height:36px">% and</span>
            <input class="form-control" value="100" type="number" style="width:80px"/> <span style="line-height:36px">%</span>
          </div>
        </div>
        <div class="form-group"><label class="form-label">Alert Email</label><input class="form-control" value="adewale@cssadewale.dev"/></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="createBudget()">Create</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function createBudget() {
  const name = document.getElementById('budgetName').value.trim();
  const amount = parseFloat(document.getElementById('budgetAmount').value) || 50;
  if (!name) { showToast('Budget name required.', 'error'); return; }
  AzureData.costManagement.budgets.push({ name, amount, spent: 0, status: 'On track' });
  showToast(`Budget "${name}" created! You'll be alerted at 80% and 100%.`, 'success');
  closeModal();
  navigateTo('cost-management');
}
