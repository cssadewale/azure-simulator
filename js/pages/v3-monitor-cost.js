/* =====================================================
   V3-MONITOR-COST.JS
   Enhanced Monitor: real SVG charts, live metrics,
   Application Insights, Workbooks, Alert Groups
   Enhanced Cost: Budgets editor, Cost alerts,
   Billing, Invoices, Usage + Quotas
   Author: Adewale Samson Adeagbo | cssadewale
   ===================================================== */

/* ---- APPLICATION INSIGHTS ---- */
registerPage('app-insights', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Application Insights</div>
      <div class="page-title"><div class="page-title-icon">📡</div><span>Application Insights</span></div>
      <div class="page-subtitle">APM service for monitoring live applications — detect anomalies, diagnose issues, understand usage.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="showToast('Creating Application Insights...','info')">+ Create</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Application Insights?</strong> An APM (Application Performance Monitoring) service that automatically instruments your applications. It tracks:<br>
      • <strong>Request rates, response times, failure rates</strong> — Know when your ML API is slow or failing<br>
      • <strong>Dependency tracking</strong> — See calls to SQL, Blob Storage, Redis, and external APIs<br>
      • <strong>Exception tracking</strong> — Full stack traces for every error<br>
      • <strong>Custom events & metrics</strong> — Track model prediction times, accuracy drifts, feature values<br>
      • <strong>User flows</strong> — See how users navigate your dashboard<br>
      Add 2 lines of Python: <code>from applicationinsights import TelemetryClient; tc = TelemetryClient('[key]')</code></div>
    </div>
    <div class="grid-4" style="margin-bottom:20px">
      ${[
        { label: 'Failed Requests', val: '0.3%', color: '#107c10', trend: '↓' },
        { label: 'Server Response Time', val: '142ms', color: '#0078D4', trend: '→' },
        { label: 'Server Requests', val: '1,247/hr', color: '#0078D4', trend: '↑' },
        { label: 'Availability', val: '99.9%', color: '#107c10', trend: '→' }
      ].map(m => `
        <div class="metric-card">
          <div class="metric-label">${m.label}</div>
          <div class="metric-value" style="color:${m.color}">${m.val}</div>
          <div class="metric-sub" style="color:${m.color}">${m.trend} Last 24h</div>
        </div>
      `).join('')}
    </div>
    <div class="grid-2" style="margin-bottom:16px">
      <div class="metrics-chart-area">
        <div style="font-size:13px;font-weight:700;margin-bottom:8px">Request Rate (per minute)</div>
        <div class="metrics-time-selector">
          ${['1h','6h','24h','7d','30d'].map((t,i) => `<button class="metrics-time-btn ${i===2?'active':''}" onclick="this.parentElement.querySelectorAll('.metrics-time-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active');showToast('Showing last ${t}','info')">${t}</button>`).join('')}
        </div>
        <div id="aiRequestChart"></div>
      </div>
      <div class="metrics-chart-area">
        <div style="font-size:13px;font-weight:700;margin-bottom:8px">Response Time (ms)</div>
        <div class="metrics-time-selector">
          ${['1h','6h','24h','7d','30d'].map((t,i) => `<button class="metrics-time-btn ${i===2?'active':''}">${t}</button>`).join('')}
        </div>
        <div id="aiResponseChart"></div>
      </div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">Top Failing Requests (Last 24h)</div></div>
      <table class="data-table">
        <thead><tr><th>Operation</th><th>Failure Rate</th><th>Count</th><th>Avg Duration</th><th>Last Failure</th></tr></thead>
        <tbody>
          ${[
            { op: 'POST /api/predict', rate: '1.2%', count: 15, dur: '2,341ms', last: '23m ago' },
            { op: 'GET /api/models', rate: '0.3%', count: 4, dur: '89ms', last: '2h ago' }
          ].map(r => `
            <tr>
              <td><strong style="font-family:monospace;font-size:12px">${r.op}</strong></td>
              <td style="color:#a4262c">${r.rate}</td>
              <td>${r.count}</td>
              <td>${r.dur}</td>
              <td style="color:var(--text-muted)">${r.last}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Live Metrics Stream</div><span class="badge badge-running">Live</span></div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:12px">
          ${[
            { label: 'Incoming Requests', val: '3', unit: '/sec' },
            { label: 'Outgoing Requests', val: '7', unit: '/sec' },
            { label: 'Overall Health', val: '100', unit: '%' },
            { label: 'Committed Memory', val: '312', unit: 'MB' }
          ].map(m => `
            <div style="text-align:center;padding:12px;background:#f9f9f8;border-radius:4px;border:1px solid var(--card-border)">
              <div style="font-size:22px;font-weight:800;color:#0078D4" id="live-${m.label.replace(/\s/g,'-')}">${m.val}<span style="font-size:12px">${m.unit}</span></div>
              <div style="font-size:11px;color:var(--text-muted)">${m.label}</div>
            </div>
          `).join('')}
        </div>
        <div class="info-box"><span>💡</span><span>In real Azure, Live Metrics streams telemetry within 1 second of it occurring — no sampling. Invaluable during deployments or incident response.</span></div>
      </div>
    </div>
  `;
  setTimeout(() => {
    renderSVGChart('aiRequestChart', [{
      name: 'Requests/min',
      values: [8,12,15,11,9,14,18,22,19,15,12,10,8,9,11,13,16,20,18,14,10,8,12,15]
    }], { labels: Array.from({length:24},(_,i)=>`${i}:00`), unit: '/min', height: 140 });
    renderSVGChart('aiResponseChart', [{
      name: 'p50 (ms)',
      values: [120,135,142,128,118,145,165,178,155,140,130,122,118,125,132,148,162,175,158,142,128,118,135,142]
    }, {
      name: 'p95 (ms)',
      values: [280,310,340,295,270,345,390,420,365,330,305,285,275,292,315,355,388,415,372,338,308,278,312,340]
    }], { labels: Array.from({length:24},(_,i)=>`${i}:00`), unit: 'ms', height: 140 });
  }, 100);
});

/* ---- WORKBOOKS ---- */
registerPage('workbooks', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › <span onclick="navigateTo('monitor')">Monitor</span> › Workbooks</div>
      <div class="page-title"><div class="page-title-icon">📊</div><span>Azure Monitor Workbooks</span></div>
      <div class="page-subtitle">Interactive report documents combining text, analytics queries, metrics, and parameters.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="showToast('Opening workbook editor...','info')">+ New Workbook</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What are Azure Workbooks?</strong> Interactive dashboards that combine KQL queries, metrics charts, markdown text, and parameter dropdowns into a single report. Unlike static dashboards, Workbooks let users filter by time range, subscription, or resource group dynamically. Great for:<br>
      • ML model performance tracking (accuracy over time, prediction distribution)<br>
      • Cost analysis reports combining multiple subscriptions<br>
      • Security audit reports for compliance</div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">My Workbooks</div></div>
      <div class="card-body" style="padding:0">
        ${[
          { name: 'ML Model Performance Dashboard', category: 'Machine Learning', modified: '2024-03-12', type: 'Custom' },
          { name: 'Data Pipeline Health Monitor', category: 'Data Engineering', modified: '2024-03-10', type: 'Custom' },
          { name: 'Cost Analysis by Resource Group', category: 'Cost Management', modified: '2024-03-08', type: 'Custom' },
          { name: 'VM Performance and Health', category: 'Compute', modified: '2024-03-05', type: 'Gallery Template' },
          { name: 'Security and Audit Logs', category: 'Security', modified: '2024-02-28', type: 'Gallery Template' }
        ].map(w => `
          <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--card-border);cursor:pointer" onclick="showToast('Opening workbook: ${w.name}','info')">
            <span style="font-size:20px">📊</span>
            <div style="flex:1">
              <div style="font-weight:600;font-size:13px;color:#0078D4">${w.name}</div>
              <div style="font-size:12px;color:var(--text-muted)">${w.category} · Modified ${w.modified}</div>
            </div>
            <span class="badge badge-${w.type==='Custom'?'running':'info'}">${w.type}</span>
            <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();showToast('Editing workbook...','info')">Edit</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
});

/* ---- BILLING & INVOICES ---- */
registerPage('billing', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Cost Management › Billing</div>
      <div class="page-title"><div class="page-title-icon">🧾</div><span>Billing & Invoices</span></div>
      <div class="page-subtitle">View your Azure bills, download invoices, and manage your billing account.</div>
    </div>
    <div class="info-box success" style="margin-bottom:16px">
      <span>🎉</span>
      <div><strong>Azure for Students — No charges yet!</strong> Your $100 credit is intact. All resources in this simulator are free-tier or within the student credit. You will receive email notifications at 80% and 100% credit usage.</div>
    </div>
    <div class="grid-3" style="margin-bottom:20px">
      <div class="metric-card" style="border-top:3px solid #107c10">
        <div class="metric-label">Current Balance</div>
        <div class="metric-value" style="color:#107c10">$100.00</div>
        <div class="metric-sub">Azure for Students credit</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Amount Due</div>
        <div class="metric-value">$0.00</div>
        <div class="metric-sub">No payment required</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Next Invoice</div>
        <div class="metric-value" style="font-size:18px">Apr 1, 2024</div>
        <div class="metric-sub">Monthly billing cycle</div>
      </div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">Invoices</div></div>
      <table class="data-table">
        <thead><tr><th>Invoice ID</th><th>Period</th><th>Amount</th><th>Status</th><th>Download</th></tr></thead>
        <tbody>
          ${[
            { id: 'E12345678', period: 'Mar 1 – Mar 31, 2024', amount: '$0.00', status: 'Credit Applied' },
            { id: 'E12345677', period: 'Feb 1 – Feb 29, 2024', amount: '$0.00', status: 'Credit Applied' },
            { id: 'E12345676', period: 'Jan 1 – Jan 31, 2024', amount: '$0.00', status: 'Credit Applied' }
          ].map(inv => `
            <tr>
              <td><strong>${inv.id}</strong></td>
              <td>${inv.period}</td>
              <td style="color:#107c10;font-weight:700">${inv.amount}</td>
              <td>${statusBadge('Active')}</td>
              <td><button class="btn btn-ghost btn-sm" onclick="showToast('Downloading invoice PDF...','info')">⬇ PDF</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Payment Methods</div></div>
      <div class="card-body">
        <div class="info-box">
          <span>ℹ️</span>
          <span>Azure for Students does not require a credit card. Your $100 credit covers all charges. When the credit expires after 12 months, you will need to add a payment method to continue using paid services. Free-tier services (Functions, Storage first 5GB) remain free indefinitely.</span>
        </div>
      </div>
    </div>
  `;
});

/* ---- USAGE + QUOTAS ---- */
registerPage('quotas', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Subscriptions › Usage + Quotas</div>
      <div class="page-title"><div class="page-title-icon">📊</div><span>Usage + Quotas</span></div>
      <div class="page-subtitle">View your current resource usage against subscription limits and request quota increases.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What are Azure Quotas?</strong> Every Azure subscription has limits on how many resources of each type you can create per region. These are called <strong>quotas</strong>. Student subscriptions have lower limits (e.g. 10 vCPUs total per region). If you hit a quota, you cannot create new resources until you either delete existing ones or request a quota increase. Quota increases on student subscriptions are generally not granted for GPU VMs.</div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">Resource Quotas — East US</div>
        <select class="form-control" style="width:180px"><option>East US</option>${AzureData.regions.filter(r=>r!=='East US').map(r=>`<option>${r}</option>`).join('')}</select>
      </div>
      <table class="data-table">
        <thead><tr><th>Resource Type</th><th>Limit</th><th>Current Usage</th><th>Usage %</th><th>Status</th></tr></thead>
        <tbody>
          ${[
            { res: 'Total Regional vCPUs', limit: 10, used: 4 },
            { res: 'Standard BS Family vCPUs', limit: 10, used: 2 },
            { res: 'Standard DS v3 Family vCPUs', limit: 10, used: 2 },
            { res: 'Standard NC Family vCPUs (GPU)', limit: 0, used: 0 },
            { res: 'Public IP Addresses', limit: 10, used: 3 },
            { res: 'Virtual Networks', limit: 50, used: 2 },
            { res: 'Network Security Groups', limit: 100, used: 1 },
            { res: 'Storage Accounts', limit: 250, used: 2 },
            { res: 'Managed Disks', limit: 50000, used: 3 },
            { res: 'Resource Groups', limit: 980, used: AzureData.resourceGroups.length },
            { res: 'Static Public IPs', limit: 10, used: 2 },
            { res: 'Load Balancers', limit: 100, used: 0 }
          ].map(q => {
            const pct = q.limit > 0 ? Math.round((q.used / q.limit) * 100) : 0;
            const color = pct >= 90 ? '#a4262c' : pct >= 70 ? '#d83b01' : '#107c10';
            return `
              <tr>
                <td>${q.res}</td>
                <td>${q.limit === 0 ? 'Not Available' : q.limit.toLocaleString()}</td>
                <td>${q.used}</td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div class="progress-bar" style="width:80px;flex-shrink:0">
                      <div class="progress-fill" style="width:${pct}%;background:${color}"></div>
                    </div>
                    <span style="font-size:12px;color:${color}">${q.limit===0?'N/A':pct+'%'}</span>
                  </div>
                </td>
                <td>
                  ${q.limit === 0 ? '<span class="badge badge-stopped">Not Available</span>' :
                    pct >= 90 ? '<span class="badge badge-stopped">Critical</span>' :
                    '<span class="badge badge-running">OK</span>'}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
      <div class="card-body">
        <button class="btn btn-primary btn-sm" onclick="showToast('Quota increase request submitted (standard VMs only for student subs)','info')">Request Quota Increase</button>
      </div>
    </div>
  `;
});

/* ---- ALERTS DEEP DIVE ---- */
registerPage('alerts', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › <span onclick="navigateTo('monitor')">Monitor</span> › Alerts</div>
      <div class="page-title"><div class="page-title-icon">🔔</div><span>Azure Monitor Alerts</span></div>
      <div class="page-subtitle">Get notified when important conditions are found in your monitoring data.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openCreateAlertModal()">+ Create Alert Rule</button>
        <button class="btn btn-secondary" onclick="showToast('Managing action groups...','info')">Action Groups</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>Azure Alerts Architecture:</strong><br>
      1. <strong>Alert Rule</strong> — Defines the condition (metric threshold, log query result, activity event)<br>
      2. <strong>Action Group</strong> — Who to notify and how (email, SMS, Azure Function, Logic App, webhook)<br>
      3. <strong>Alert Instance</strong> — Fired when condition is met<br>
      4. <strong>Alert States</strong> — New → Acknowledged → Closed<br><br>
      <strong>Alert types:</strong> Metric alerts (CPU > 80%), Log alerts (KQL query returns results), Activity log alerts (VM deleted), Smart detection (Application Insights anomalies)</div>
    </div>
    <div class="grid-4" style="margin-bottom:20px">
      ${[
        { label: 'Total Alert Rules', val: AzureData.monitor.alerts.length, color: '#0078D4' },
        { label: 'Fired (24h)', val: 0, color: '#107c10' },
        { label: 'Suppressed', val: 0, color: '#8a8886' },
        { label: 'Action Groups', val: 2, color: '#0078D4' }
      ].map(m => `
        <div class="metric-card"><div class="metric-label">${m.label}</div><div class="metric-value" style="color:${m.color}">${m.val}</div></div>
      `).join('')}
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">Alert Rules (${AzureData.monitor.alerts.length})</div></div>
      <table class="data-table">
        <thead><tr><th>Name</th><th>Resource</th><th>Condition</th><th>Severity</th><th>Status</th><th>Last Fired</th><th>Actions</th></tr></thead>
        <tbody>
          ${AzureData.monitor.alerts.map((a,i) => `
            <tr>
              <td><strong>${a.name}</strong></td>
              <td style="font-size:12px">${a.resource}</td>
              <td><code style="font-size:11px">${a.condition}</code></td>
              <td><span class="badge badge-${a.severity==='Critical'?'stopped':'warning'}">${a.severity}</span></td>
              <td>${statusBadge(a.status)}</td>
              <td style="color:var(--text-muted);font-size:12px">${a.fired}</td>
              <td>
                <button class="btn btn-ghost btn-sm" onclick="openEditAlertModal(${i})">Edit</button>
                <button class="btn btn-ghost btn-sm" style="color:#a4262c" onclick="deleteAlert(${i})">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Action Groups</div><button class="btn btn-primary btn-sm" onclick="openCreateActionGroupModal()">+ Create</button></div>
      ${[
        { name: 'email-adewale', actions: ['Email: adewale@cssadewale.dev'], resources: AzureData.monitor.alerts.length },
        { name: 'sms-critical', actions: ['SMS: +234 810 086 6322', 'Email: adewale@cssadewale.dev'], resources: 1 }
      ].map(ag => `
        <div style="padding:14px 16px;border-bottom:1px solid var(--card-border)">
          <div style="font-weight:700;font-size:13px;margin-bottom:6px">${ag.name}</div>
          <div style="font-size:12px;color:var(--text-muted)">Actions: ${ag.actions.join(' | ')}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Used by ${ag.resources} alert rule(s)</div>
        </div>
      `).join('')}
    </div>
  `;
  window.deleteAlert = (i) => {
    const a = AzureData.monitor.alerts[i];
    confirmAction('Delete Alert Rule', `Delete alert rule <strong>${a.name}</strong>?`, () => {
      AzureData.monitor.alerts.splice(i,1);
      showToast('Alert rule deleted','success');
      logActivity('delete','Deleted alert rule',a.name,'Monitor');
      navigateTo('alerts');
    });
  };
  window.openEditAlertModal = (i) => {
    const a = AzureData.monitor.alerts[i];
    openModal(`
      <div class="modal">
        <div class="modal-header"><h2>✏️ Edit Alert: ${a.name}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
        <div class="modal-body">
          <div class="form-group"><label class="form-label">Alert Name</label><input id="editAlertName" class="form-control" value="${a.name}"/></div>
          <div class="form-group"><label class="form-label">Condition</label><input class="form-control" value="${a.condition}"/></div>
          <div class="form-group"><label class="form-label">Severity</label><select class="form-control"><option ${a.severity==='Critical'?'selected':''}>Critical</option><option ${a.severity==='Warning'?'selected':''}>Warning</option><option>Informational</option></select></div>
          <div class="form-group"><label class="form-label">Action Group</label><select class="form-control"><option>email-adewale</option><option>sms-critical</option></select></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="
            AzureData.monitor.alerts[${i}].name=document.getElementById('editAlertName').value;
            showToast('Alert updated','success');
            logActivity('update','Updated alert rule',AzureData.monitor.alerts[${i}].name,'Monitor');
            closeModal();navigateTo('alerts');">Save</button>
          <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        </div>
      </div>
    `);
  };
  window.openCreateActionGroupModal = () => {
    openModal(`
      <div class="modal">
        <div class="modal-header"><h2>🔔 Create Action Group</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
        <div class="modal-body">
          <div class="info-box" style="margin-bottom:16px"><span>📘</span><span>An Action Group defines what happens when an alert fires. One group can have multiple notification channels and automated actions.</span></div>
          <div class="form-group"><label class="form-label">Action Group Name *</label><input id="agName" class="form-control" placeholder="e.g. ops-team-notifications"/></div>
          <div class="form-group"><label class="form-label">Display Name * (max 12 chars)</label><input class="form-control" placeholder="e.g. OpsTeam"/></div>
          <div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin:12px 0 8px">Notifications</div>
          <div class="form-group"><label class="form-label">Email</label><input class="form-control" value="adewale@cssadewale.dev"/></div>
          <div class="form-group"><label class="form-label">SMS (with country code)</label><input class="form-control" value="+2348100866322"/></div>
          <div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin:12px 0 8px">Actions</div>
          <div class="form-group"><label class="form-label">Azure Function (optional)</label><select class="form-control"><option>— None —</option><option>data-preprocessing-fn</option><option>model-inference-trigger</option></select></div>
          <div class="form-group"><label class="form-label">Webhook URL (optional)</label><input class="form-control" placeholder="https://your-webhook.example.com"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="
            const n=document.getElementById('agName').value.trim();
            if(!n){showToast('Name required','error');return;}
            showToast('Action group created: '+n,'success');
            logActivity('create','Created action group',n,'Monitor');
            closeModal();">Create</button>
          <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        </div>
      </div>
    `);
  };
});
