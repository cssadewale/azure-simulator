/* =====================================================
   SECURITY PAGES
   ===================================================== */

// ---- KEY VAULT ----
registerPage('key-vault', (container) => {
  const kv = AzureData.keyVaults[0];
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Key Vault</div>
      <div class="page-title"><div class="page-title-icon">🔑</div><span>Azure Key Vault</span></div>
      <div class="page-subtitle">Securely store and manage secrets, encryption keys, and SSL/TLS certificates.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openAddSecretModal()">+ Add Secret</button>
        <button class="btn btn-secondary" onclick="showToast('Refreshed','info')">Refresh</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Key Vault?</strong> A secure store for sensitive information. Instead of hardcoding database passwords, API keys, or connection strings in your code (a major security risk), you store them in Key Vault and your application fetches them at runtime using Managed Identity or a Service Principal. Three types of objects:<br>
      • <strong>Secrets</strong> — Passwords, connection strings, API keys<br>
      • <strong>Keys</strong> — Cryptographic keys for encrypting/decrypting data (RSA, EC)<br>
      • <strong>Certificates</strong> — SSL/TLS certificates for HTTPS<br>
      As a data scientist: store your storage connection strings, database passwords, and ML API keys in Key Vault — never in your notebooks or code!</div>
    </div>
    <div class="grid-3" style="margin-bottom:20px">
      <div class="metric-card"><div class="metric-label">Secrets</div><div class="metric-value">${kv.secrets.length}</div><div class="metric-sub">stored securely</div></div>
      <div class="metric-card"><div class="metric-label">Keys</div><div class="metric-value">${kv.keys.length}</div><div class="metric-sub">encryption keys</div></div>
      <div class="metric-card"><div class="metric-label">Tier</div><div class="metric-value" style="font-size:18px">${kv.tier}</div><div class="metric-sub">${kv.region}</div></div>
    </div>
    <div id="kvTabs">
      <div class="tab-bar">
        <button class="tab-item active" data-tab="secrets" onclick="setActiveTab('kvTabs','secrets')">Secrets</button>
        <button class="tab-item" data-tab="keys" onclick="setActiveTab('kvTabs','keys')">Keys</button>
        <button class="tab-item" data-tab="certificates" onclick="setActiveTab('kvTabs','certificates')">Certificates</button>
        <button class="tab-item" data-tab="access" onclick="setActiveTab('kvTabs','access')">Access Policies</button>
      </div>
      <div data-pane="secrets">
        <div class="card">
          <div class="card-header"><div class="card-title">Secrets (${kv.secrets.length})</div><button class="btn btn-primary btn-sm" onclick="openAddSecretModal()">+ Generate/Import</button></div>
          <div>
            ${kv.secrets.map(s => `
              <div class="secret-row">
                <div style="font-size:18px">🔐</div>
                <div class="secret-name">
                  <div style="font-weight:600;font-size:13px">${s.name}</div>
                  <div style="font-size:11px;color:#8a8886">Version: ${s.version} · ${s.enabled ? 'Enabled' : 'Disabled'}</div>
                </div>
                <div class="secret-value" id="sv-${s.name}">••••••••••••••••</div>
                <button class="btn btn-ghost btn-sm" onclick="revealSecret('${s.name}','${s.value}')">👁 Show</button>
                <button class="btn btn-ghost btn-sm" onclick="showToast('Secret copied to clipboard!','success')">📋 Copy</button>
                <button class="btn btn-ghost btn-sm" style="color:#a4262c" onclick="showToast('Secret deleted','success')">🗑</button>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="info-box" style="margin-top:12px">
          <span>⚠️</span>
          <span><strong>Best Practice:</strong> Use <strong>Managed Identity</strong> to access Key Vault from your Azure VMs, Functions, and App Services — no passwords needed! Your code uses <code>DefaultAzureCredential()</code> and Azure handles authentication automatically.</span>
        </div>
      </div>
      <div data-pane="keys" style="display:none">
        <div class="card">
          <div class="card-header"><div class="card-title">Keys (${kv.keys.length})</div><button class="btn btn-primary btn-sm" onclick="showToast('Key generated!','success')">+ Generate</button></div>
          <div>
            ${kv.keys.map(k => `
              <div class="secret-row">
                <div style="font-size:18px">🗝️</div>
                <div class="secret-name">
                  <div style="font-weight:600;font-size:13px">${k.name}</div>
                  <div style="font-size:11px;color:#8a8886">Type: ${k.type} · Size: ${k.size} bits</div>
                </div>
                ${statusBadge(k.status)}
                <button class="btn btn-ghost btn-sm" onclick="showToast('Key operations: Encrypt, Decrypt, Sign, Verify','info')">Operations</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div data-pane="certificates" style="display:none">
        <div class="empty-state" style="padding:40px">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
          <h3>No certificates</h3>
          <p>Import or generate SSL/TLS certificates for your custom domains.</p>
          <button class="btn btn-primary" style="margin-top:12px" onclick="showToast('Certificate generated!','success')">Generate Certificate</button>
        </div>
      </div>
      <div data-pane="access" style="display:none">
        <div class="card">
          <div class="card-header"><div class="card-title">Access Policies</div><button class="btn btn-primary btn-sm" onclick="showToast('Access policy added!','success')">+ Add Policy</button></div>
          <div class="card-body">
            <div class="info-box" style="margin-bottom:12px">
              <span>📘</span><span>Access policies define who (user, app, service principal) can perform which operations (Get, Set, Delete) on secrets, keys, and certificates. Azure RBAC is the recommended approach for fine-grained access control.</span>
            </div>
            ${kv.accessPolicies.map(p => `
              <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f9f9f8;border:1px solid #e1dfdd;border-radius:4px;margin-bottom:8px">
                <span style="font-size:20px">👤</span>
                <div style="flex:1">
                  <div style="font-weight:600;font-size:13px">${p}</div>
                  <div style="font-size:12px;color:#8a8886">Permissions: Get, Set, Delete (Secrets) · Get, Sign (Keys)</div>
                </div>
                <button class="btn btn-ghost btn-sm" style="color:#a4262c" onclick="showToast('Policy removed','info')">Remove</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
});

function revealSecret(name, value) {
  const el = document.getElementById(`sv-${name}`);
  if (!el) return;
  if (el.classList.contains('revealed')) {
    el.textContent = '••••••••••••••••';
    el.classList.remove('revealed');
  } else {
    el.textContent = value;
    el.classList.add('revealed');
  }
}

function openAddSecretModal() {
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>🔐 Add Secret</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="info-box" style="margin-bottom:16px">
          <span>⚠️</span><span>Never store secrets in source code or version control. Always use Key Vault and retrieve them at runtime.</span>
        </div>
        <div class="form-group"><label class="form-label">Name *</label><input id="secretName" class="form-control" placeholder="e.g. my-db-password"/><div style="font-size:11px;color:#8a8886;margin-top:4px">Use lowercase letters, numbers, hyphens. No spaces.</div></div>
        <div class="form-group"><label class="form-label">Value *</label><input id="secretValue" class="form-control" type="password" placeholder="Enter secret value"/></div>
        <div class="form-group"><label class="form-label">Content Type (optional)</label><input class="form-control" placeholder="e.g. application/json, text/plain"/></div>
        <div class="form-group"><label class="form-label">Set Activation Date?</label><select class="form-control"><option>No (active immediately)</option><option>Yes</option></select></div>
        <div class="form-group"><label class="form-label">Set Expiration Date?</label><select class="form-control"><option>No (never expires)</option><option>Yes — set expiry date</option></select></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="addSecret()">Create</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function addSecret() {
  const name = document.getElementById('secretName').value.trim();
  const value = document.getElementById('secretValue').value;
  if (!name) { showToast('Secret name is required.', 'error'); return; }
  if (!value) { showToast('Secret value is required.', 'error'); return; }
  AzureData.keyVaults[0].secrets.push({ name, type: 'Secret', version: 'v1', enabled: true, value });
  showToast(`Secret "${name}" created successfully!`, 'success');
  closeModal();
  navigateTo('key-vault');
}

// ---- SECURITY CENTER ----
registerPage('security-center', (container) => {
  const sc = AzureData.securityCenter;
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Microsoft Defender for Cloud</div>
      <div class="page-title"><div class="page-title-icon">🛡️</div><span>Microsoft Defender for Cloud</span></div>
      <div class="page-subtitle">Unified security management and advanced threat protection across your Azure resources.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Microsoft Defender for Cloud?</strong> (formerly Azure Security Center) Continuously assesses your Azure resources for security vulnerabilities and gives you a <strong>Secure Score</strong>. It provides:<br>
      • <strong>Secure Score</strong> — Percentage showing how well you follow security best practices<br>
      • <strong>Recommendations</strong> — Specific actions to improve security (e.g., "Enable MFA", "Restrict SSH")<br>
      • <strong>Security Alerts</strong> — Real-time threat detection (brute-force attacks, malware, anomalies)<br>
      • <strong>Regulatory Compliance</strong> — Track compliance with ISO 27001, PCI DSS, SOC 2, etc.<br>
      Even as a beginner, always aim for a secure score above 80%.</div>
    </div>
    <div class="grid-4" style="margin-bottom:20px">
      <div class="metric-card" style="border-left:4px solid #0078D4">
        <div class="metric-label">Secure Score</div>
        <div class="metric-value" style="color:#0078D4">${sc.secureScore}%</div>
        <div class="metric-sub">of ${sc.maxScore} points</div>
        <div class="progress-bar" style="margin-top:8px"><div class="progress-fill warning" style="width:${sc.secureScore}%"></div></div>
      </div>
      <div class="metric-card" style="border-left:4px solid #a4262c">
        <div class="metric-label">High Severity</div>
        <div class="metric-value" style="color:#a4262c">${sc.recommendations.filter(r=>r.severity==='High'&&r.status==='Open').length}</div>
        <div class="metric-sub">open recommendations</div>
      </div>
      <div class="metric-card" style="border-left:4px solid #d83b01">
        <div class="metric-label">Medium Severity</div>
        <div class="metric-value" style="color:#d83b01">${sc.recommendations.filter(r=>r.severity==='Medium'&&r.status==='Open').length}</div>
        <div class="metric-sub">open recommendations</div>
      </div>
      <div class="metric-card" style="border-left:4px solid #107c10">
        <div class="metric-label">Active Alerts</div>
        <div class="metric-value" style="color:#a4262c">${sc.alerts.length}</div>
        <div class="metric-sub">security alerts</div>
      </div>
    </div>
    <div class="grid-2" style="gap:16px">
      <div class="card">
        <div class="card-header"><div class="card-title">🔴 Security Recommendations</div></div>
        <div>
          ${sc.recommendations.map(r => `
            <div style="display:flex;align-items:flex-start;gap:12px;padding:12px 16px;border-bottom:1px solid #f3f2f1">
              <span style="font-size:16px;margin-top:2px">${r.severity==='High'?'🔴':r.severity==='Medium'?'🟡':'🟢'}</span>
              <div style="flex:1">
                <div style="font-size:13px;font-weight:${r.status==='Open'?'600':'400'};color:${r.status==='Resolved'?'#8a8886':'#201f1e'}">${r.title}</div>
                <div style="font-size:11px;color:#8a8886;margin-top:2px">${r.resource} · ${r.severity}</div>
              </div>
              <span class="badge ${r.status==='Resolved'?'badge-running':'badge-stopped'}">${r.status}</span>
              ${r.status==='Open'?`<button class="btn btn-ghost btn-sm" onclick="resolveRecommendation('${r.title}')">Fix</button>`:''}
            </div>
          `).join('')}
        </div>
      </div>
      <div>
        <div class="card" style="margin-bottom:16px">
          <div class="card-header"><div class="card-title">⚠️ Security Alerts</div></div>
          <div>
            ${sc.alerts.map(a => `
              <div style="padding:12px 16px;border-bottom:1px solid #f3f2f1">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                  <span>${a.severity==='High'?'🔴':'🟡'}</span>
                  <strong style="font-size:13px">${a.title}</strong>
                  <span class="badge ${a.status==='Active'?'badge-stopped':'badge-warning'}" style="margin-left:auto">${a.status}</span>
                </div>
                <div style="font-size:12px;color:#8a8886">${a.severity} severity · Detected ${a.time}</div>
                <div style="display:flex;gap:6px;margin-top:8px">
                  <button class="btn btn-ghost btn-sm" onclick="showToast('Investigating alert...','info')">Investigate</button>
                  <button class="btn btn-ghost btn-sm" onclick="showToast('Alert dismissed','success')">Dismiss</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">📋 Security Best Practices</div></div>
          <div class="card-body">
            ${[
              { tip: 'Enable MFA on all accounts', done: false },
              { tip: 'Use Managed Identity instead of credentials in code', done: true },
              { tip: 'Store secrets in Key Vault, not in code', done: true },
              { tip: 'Restrict SSH (port 22) to your IP only via NSG', done: false },
              { tip: 'Enable Azure Defender for SQL databases', done: false },
              { tip: 'Encrypt VM disks with Azure Disk Encryption', done: false },
              { tip: 'Enable diagnostic logs for all services', done: false },
              { tip: 'Use private endpoints for Storage and SQL', done: false }
            ].map(t => `
              <div style="display:flex;align-items:center;gap:10px;padding:6px 0;font-size:12px">
                <span style="font-size:14px">${t.done?'✅':'⬜'}</span>
                <span style="${t.done?'color:#8a8886;text-decoration:line-through':'color:#201f1e'}">${t.tip}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
});

function resolveRecommendation(title) {
  const rec = AzureData.securityCenter.recommendations.find(r => r.title === title);
  if (rec) {
    rec.status = 'Resolved';
    AzureData.securityCenter.secureScore = Math.min(100, AzureData.securityCenter.secureScore + 5);
    showToast(`Recommendation resolved! Secure score improved.`, 'success');
    navigateTo('security-center');
  }
}

// ---- ACTIVE DIRECTORY ----
registerPage('active-directory', (container) => {
  const ad = AzureData.activeDirectory;
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Microsoft Entra ID</div>
      <div class="page-title"><div class="page-title-icon">👥</div><span>Microsoft Entra ID (Azure Active Directory)</span></div>
      <div class="page-subtitle">Cloud-based identity and access management service for your organisation and resources.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Microsoft Entra ID (Azure AD)?</strong> Azure's identity platform — it manages who can access what. Key concepts:<br>
      • <strong>Users</strong> — Human accounts (you, your team)<br>
      • <strong>Service Principals</strong> — App identities (e.g., your ML pipeline authenticating to Storage)<br>
      • <strong>Managed Identity</strong> — Auto-managed service principals for Azure services (no password to manage!)<br>
      • <strong>Groups</strong> — Bundles of users for bulk permission assignment<br>
      • <strong>App Registrations</strong> — Register apps to use Azure AD for authentication (OAuth 2.0, OpenID)<br>
      • <strong>RBAC</strong> — Role-Based Access Control: assign roles (Owner, Contributor, Reader) to users/groups on resources</div>
    </div>
    <div class="grid-3" style="margin-bottom:20px">
      <div class="metric-card"><div class="metric-label">Tenant</div><div class="metric-value" style="font-size:16px">${ad.tenantName}</div><div class="metric-sub" style="font-size:10px">${ad.tenantId}</div></div>
      <div class="metric-card"><div class="metric-label">Users</div><div class="metric-value">${ad.users.length}</div></div>
      <div class="metric-card"><div class="metric-label">Groups</div><div class="metric-value">${ad.groups.length}</div></div>
    </div>
    <div id="adTabs">
      <div class="tab-bar">
        <button class="tab-item active" data-tab="users" onclick="setActiveTab('adTabs','users')">Users</button>
        <button class="tab-item" data-tab="groups" onclick="setActiveTab('adTabs','groups')">Groups</button>
        <button class="tab-item" data-tab="apps" onclick="setActiveTab('adTabs','apps')">App Registrations</button>
        <button class="tab-item" data-tab="roles" onclick="setActiveTab('adTabs','roles')">Roles & Admins</button>
      </div>
      <div data-pane="users">
        <div class="card">
          <div class="card-header"><div class="card-title">Users (${ad.users.length})</div><button class="btn btn-primary btn-sm" onclick="showToast('New user created!','success')">+ New User</button></div>
          <table class="data-table">
            <thead><tr><th>Display Name</th><th>Email</th><th>Role</th><th>MFA</th><th>Status</th></tr></thead>
            <tbody>
              ${ad.users.map(u => `
                <tr>
                  <td><div style="display:flex;align-items:center;gap:8px">
                    <div style="width:30px;height:30px;background:#0078D4;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:11px;font-weight:700">${u.name.split(' ').map(n=>n[0]).join('')}</div>
                    <strong>${u.name}</strong>
                  </div></td>
                  <td>${u.email}</td>
                  <td><span class="badge badge-info">${u.role}</span></td>
                  <td>${u.mfa?'<span style="color:#107c10">✓ Enabled</span>':'<span style="color:#a4262c">✗ Disabled</span>'}</td>
                  <td>${statusBadge(u.status)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div data-pane="groups" style="display:none">
        <div class="card">
          <div class="card-header"><div class="card-title">Groups</div><button class="btn btn-primary btn-sm" onclick="showToast('Group created!','success')">+ New Group</button></div>
          <div class="card-body" style="padding:0">
            ${ad.groups.map(g => `
              <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #f3f2f1">
                <span style="font-size:20px">👥</span>
                <div style="flex:1"><div style="font-weight:600;font-size:13px">${g}</div><div style="font-size:12px;color:#8a8886">Security Group · Azure AD</div></div>
                <button class="btn btn-ghost btn-sm" onclick="showToast('Managing group members...','info')">Members</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div data-pane="apps" style="display:none">
        <div class="card">
          <div class="card-header"><div class="card-title">App Registrations</div><button class="btn btn-primary btn-sm" onclick="showToast('App registered!','success')">+ New Registration</button></div>
          <div class="card-body" style="padding:0">
            ${ad.apps.map(a => `
              <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #f3f2f1">
                <span style="font-size:20px">📱</span>
                <div style="flex:1"><div style="font-weight:600;font-size:13px">${a}</div><div style="font-size:12px;color:#8a8886">App ID: ${newGuid().substring(0,8)}...</div></div>
                <button class="btn btn-ghost btn-sm" onclick="showToast('Opening app details...','info')">Manage</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div data-pane="roles" style="display:none">
        <div class="card">
          <div class="card-header"><div class="card-title">Built-in Azure Roles</div></div>
          <div class="card-body">
            <div class="info-box" style="margin-bottom:12px"><span>📘</span><span>RBAC roles control what actions users can perform. Assign roles at subscription, resource group, or resource level.</span></div>
            ${[
              { role: 'Owner', desc: 'Full access to all resources including the ability to assign roles', scope: 'Subscription' },
              { role: 'Contributor', desc: 'Create and manage all types of Azure resources but cannot assign roles', scope: 'Subscription' },
              { role: 'Reader', desc: 'View all resources but cannot make changes', scope: 'Resource Group' },
              { role: 'Storage Blob Data Contributor', desc: 'Read, write, delete blob containers and data', scope: 'Storage Account' },
              { role: 'AzureML Data Scientist', desc: 'Perform all actions in an AML workspace except managing compute', scope: 'ML Workspace' }
            ].map(r => `
              <div style="padding:10px 0;border-bottom:1px solid #f3f2f1">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                  <strong style="font-size:13px">${r.role}</strong>
                  <span class="badge badge-info" style="font-size:10px">${r.scope}</span>
                </div>
                <div style="font-size:12px;color:#605e5c">${r.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
});

// ---- FIREWALL ----
registerPage('firewall', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Azure Firewall</div>
      <div class="page-title"><div class="page-title-icon">🔥</div><span>Azure Firewall</span></div>
      <div class="page-subtitle">Managed, cloud-native network security service protecting your Azure Virtual Network resources.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Firewall?</strong> A fully stateful, managed firewall-as-a-service. It filters traffic at the network and application layer. Unlike NSGs (which operate at subnet/NIC level), Azure Firewall sits at the perimeter of your entire VNet. Key capabilities:<br>
      • <strong>Network Rules</strong> — Allow/deny traffic based on IP, port, protocol<br>
      • <strong>Application Rules</strong> — Filter HTTP/S traffic by FQDN (e.g., allow *.pypi.org for pip installs)<br>
      • <strong>DNAT Rules</strong> — Route inbound internet traffic to internal VMs<br>
      • <strong>Threat Intelligence</strong> — Block known malicious IPs and domains automatically<br>
      For beginners: NSGs are free and sufficient for most scenarios. Azure Firewall is for enterprise-scale deployments.</div>
    </div>
    <div class="info-box warning" style="margin-bottom:16px">
      <span>⚠️</span>
      <span>Azure Firewall costs approximately $1.25/hour (~$900/month) — not recommended on a student subscription. Use <strong>Network Security Groups (NSGs)</strong> as a free alternative for controlling traffic at the subnet level.</span>
    </div>
    <div class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      <h3>No Azure Firewall deployed</h3>
      <p>Use Network Security Groups (NSGs) for free traffic filtering on your student subscription.</p>
      <button class="btn btn-secondary" style="margin-top:16px" onclick="navigateTo('virtual-network')">Manage NSGs via VNet</button>
    </div>
  `;
});
