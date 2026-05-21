/* =====================================================
   STATE.JS — Application state management
   ===================================================== */

const AppState = {
  currentPage: 'dashboard',
  sidebarCollapsed: false,
  activeTab: {},
  shell: 'bash',
  terminalOpen: false,
  searchQuery: '',
  selectedResources: [],
  lastActivity: new Date()
};

// ---- SIDEBAR TOGGLE ----
document.getElementById('hamburgerBtn').addEventListener('click', () => {
  AppState.sidebarCollapsed = !AppState.sidebarCollapsed;
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('mainContent');
  sidebar.classList.toggle('collapsed', AppState.sidebarCollapsed);
  main.classList.toggle('sidebar-collapsed', AppState.sidebarCollapsed);
});

// ---- TOAST NOTIFICATIONS ----
function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toastContainer');
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span style="font-size:16px;font-weight:700">${icons[type] || 'ℹ'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

// ---- MODAL SYSTEM ----
function openModal(html) {
  const overlay = document.getElementById('modalOverlay');
  const container = document.getElementById('modalContainer');
  container.innerHTML = html;
  overlay.classList.add('active');
  container.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  const container = document.getElementById('modalContainer');
  overlay.classList.remove('active');
  container.classList.remove('active');
  container.innerHTML = '';
  document.body.style.overflow = '';
}

// Prevent clicks inside modal from closing it
document.getElementById('modalContainer').addEventListener('click', e => e.stopPropagation());

// ---- ACTIVE NAV ITEM ----
function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
}

// ---- TAB MANAGEMENT ----
function setActiveTab(containerId, tabName) {
  AppState.activeTab[containerId] = tabName;
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll('.tab-item').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tabName);
  });
  container.querySelectorAll('.tab-pane').forEach(el => {
    el.style.display = el.dataset.pane === tabName ? '' : 'none';
  });
}

function initTabs(containerId, defaultTab) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll('.tab-item').forEach(el => {
    el.addEventListener('click', () => setActiveTab(containerId, el.dataset.tab));
  });
  setActiveTab(containerId, defaultTab || container.querySelector('.tab-item')?.dataset.tab);
}

// ---- PROFILE ----
function openProfile() {
  const u = AzureData.user;
  openModal(`
    <div class="modal">
      <div class="modal-header">
        <h2>👤 My Profile</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
          <div style="width:64px;height:64px;background:#0078D4;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:24px;font-weight:700">AA</div>
          <div>
            <div style="font-size:18px;font-weight:700">${u.name}</div>
            <div style="font-size:13px;color:#605e5c">${u.email}</div>
            <div style="font-size:12px;color:#8a8886;margin-top:2px">${u.role}</div>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="detail-prop"><div class="detail-prop-label">GitHub</div><div class="detail-prop-value"><a href="https://github.com/${u.github}" target="_blank" class="link">github.com/${u.github}</a></div></div>
            <div class="detail-prop"><div class="detail-prop-label">Tenant</div><div class="detail-prop-value">${u.tenant}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">Tenant ID</div><div class="detail-prop-value" style="font-size:12px;font-family:monospace">${u.tenantId}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">Location</div><div class="detail-prop-value">${u.location}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">Member Since</div><div class="detail-prop-value">${u.joinedDate}</div></div>
          </div>
        </div>
        <div class="info-box" style="margin-top:16px">
          <span>ℹ️</span>
          <span>This is your Azure Simulator profile. In a real Azure portal, this section would link to your Microsoft account and manage billing, subscriptions, and identity settings.</span>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      </div>
    </div>
  `);
}

// ---- CLOSE ALL PANELS ----
// Defined here as a fallback; also defined in new-services.js
if (typeof closeAllPanels === 'undefined') {
  window.closeAllPanels = function() {
    ['notificationPanel','learningPanel','activityPanel','armPanel','whatifPanel'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('open');
    });
  };
}

// ---- SETTINGS (enhanced) ----
function openSettings() {
  const info = getStorageInfo ? getStorageInfo() : { usedKB: 0, limitKB: 5120, pct: 0 };
  openModal(`
    <div class="modal">
      <div class="modal-header">
        <h2>⚙️ Portal Settings</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Default Subscription</label>
          <select class="form-control">
            <option>Azure for Students (a1b2c3d4...)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Default Region</label>
          <select class="form-control">
            ${AzureData.regions.map(r => `<option ${r==='East US'?'selected':''}>${r}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Theme</label>
          <select class="form-control" onchange="applyTheme(this.value);localStorage.setItem('azure-sim-theme',this.value)">
            <option value="light" ${document.documentElement.getAttribute('data-theme')==='light'?'selected':''}>☀️ Light</option>
            <option value="dark" ${document.documentElement.getAttribute('data-theme')==='dark'?'selected':''}>🌙 Dark</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Language</label>
          <select class="form-control"><option>English (US)</option></select>
        </div>
        <div style="font-size:12px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin:16px 0 8px">Keyboard Shortcuts</div>
        <div style="display:grid;grid-template-columns:auto 1fr;gap:8px 16px;font-size:13px;margin-bottom:16px">
          <span class="kbd">Ctrl + K</span><span>Focus global search</span>
          <span class="kbd">Ctrl + \`</span><span>Toggle Cloud Shell</span>
          <span class="kbd">Ctrl + D</span><span>Toggle dark mode</span>
          <span class="kbd">Esc</span><span>Close modal / quiz / panels</span>
        </div>
        <div style="font-size:12px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin:16px 0 8px">Session Storage</div>
        <div class="progress-bar" style="margin-bottom:6px"><div class="progress-fill" style="width:${info.pct}%"></div></div>
        <div style="font-size:12px;color:var(--text-muted)">${info.usedKB} KB used of ~${info.limitKB} KB localStorage limit (${info.pct}%)</div>
        <div style="display:flex;gap:8px;margin-top:12px">
          <button class="btn btn-secondary btn-sm" onclick="exportState()">⬇ Export State</button>
          <button class="btn btn-danger btn-sm" onclick="resetAllState();closeModal()">🗑 Reset All Data</button>
        </div>
        <div class="info-box" style="margin-top:16px">
          <span>ℹ️</span>
          <span>In the real Azure portal, settings also include directory switching, timeout preferences, and accessibility options.</span>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="showToast('Settings saved!','success');closeModal()">Save</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

// ---- HELP ----
function openHelp() {
  openModal(`
    <div class="modal">
      <div class="modal-header">
        <h2>❓ Help & Learning Resources</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="info-box success">
          <span>🎓</span>
          <div>
            <strong>Welcome, Adewale!</strong> This simulator is built to help you learn Azure from scratch.
            Every service has explanations, tooltips, and hands-on simulation.
          </div>
        </div>
        <h3 style="margin:16px 0 10px;font-size:14px">Quick Start Resources</h3>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${[
            ['📘 Learning Path', 'Follow the structured beginner-to-advanced modules', () => 'openLearningPath();closeModal()'],
            ['🖥️ Cloud Shell', 'Practice Azure CLI and PowerShell commands', () => 'openTerminal();closeModal()'],
            ['📊 Dashboard', 'See all your resources at a glance', () => "navigateTo('dashboard');closeModal()"],
            ['🔐 Security Center', 'Learn about Azure security best practices', () => "navigateTo('security-center');closeModal()"]
          ].map(([icon, desc, action]) => `
            <div style="display:flex;align-items:center;gap:12px;padding:12px;background:#f9f9f8;border:1px solid #e1dfdd;border-radius:4px;cursor:pointer" onclick="${action()}">
              <span style="font-size:20px">${icon}</span>
              <span style="font-size:13px">${desc}</span>
            </div>
          `).join('')}
        </div>
        <h3 style="margin:16px 0 10px;font-size:14px">Azure Exam Paths for Beginners</h3>
        <div style="font-size:13px;color:#605e5c;line-height:1.6">
          <div>🎯 <strong>AZ-900</strong> — Microsoft Azure Fundamentals (Start here!)</div>
          <div>🎯 <strong>DP-900</strong> — Azure Data Fundamentals (Perfect for Data Scientists)</div>
          <div>🎯 <strong>AI-900</strong> — Azure AI Fundamentals</div>
          <div>🎯 <strong>AZ-104</strong> — Azure Administrator (Intermediate)</div>
          <div>🎯 <strong>DP-100</strong> — Azure Data Scientist Associate (Advanced)</div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="openLearningPath();closeModal()">Open Learning Path</button>
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      </div>
    </div>
  `);
}

// ---- CONFIRM DIALOG ----
function confirmAction(title, message, onConfirm, danger = true) {
  openModal(`
    <div class="modal">
      <div class="modal-header">
        <h2>${danger ? '⚠️' : '❓'} ${title}</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <p style="font-size:14px;line-height:1.6">${message}</p>
      </div>
      <div class="modal-footer">
        <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" onclick="(${onConfirm.toString()})();closeModal()">Confirm</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

// ---- FORMAT HELPERS ----
function formatBytes(gb) {
  if (gb < 1) return `${(gb * 1024).toFixed(0)} MB`;
  if (gb >= 1024) return `${(gb / 1024).toFixed(1)} TB`;
  return `${gb.toFixed(1)} GB`;
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
}

function statusBadge(status) {
  const map = {
    'Running': 'running', 'Active': 'running', 'Online': 'running', 'Succeeded': 'running',
    'Stopped': 'stopped', 'Failed': 'stopped', 'Offline': 'stopped',
    'Pending': 'pending', 'Running...': 'pending', 'Deallocated': 'stopped',
    'Draft': 'info', 'Completed': 'running'
  };
  const cls = map[status] || 'info';
  return `<span class="badge badge-${cls}">${status}</span>`;
}

// ---- MINI BAR CHART ----
function renderMiniChart(values, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const max = Math.max(...values, 1);
  el.innerHTML = values.map(v => {
    const pct = Math.max((v / max) * 100, 4);
    return `<div class="mini-bar" style="height:${pct}%" title="${v}"></div>`;
  }).join('');
}
