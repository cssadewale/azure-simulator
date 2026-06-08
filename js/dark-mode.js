/* =====================================================
   DARK-MODE.JS
   Dark/Light mode toggle with localStorage persistence.
   Explanation: When a user toggles dark mode, the
   preference is saved to localStorage so it persists
   across browser refreshes and sessions.
   ===================================================== */

(function initDarkMode() {
  // On load, read the saved preference from localStorage.
  // localStorage is a browser API that stores key-value pairs
  // with no expiry — data survives page refreshes.
  const saved = localStorage.getItem('azure-sim-theme') || 'light';
  applyTheme(saved);
})();

function toggleDarkMode() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('azure-sim-theme', next);
  showToast(`${next === 'dark' ? '🌙 Dark' : '☀️ Light'} mode enabled`, 'info', 2000);
  logActivity('update', 'Portal Theme', `Switched to ${next} mode`, 'Portal Settings');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('darkModeIcon');
  if (!icon) return;
  if (theme === 'dark') {
    // Show sun icon (to switch back to light)
    icon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
    document.getElementById('darkModeBtn').title = 'Switch to Light Mode';
  } else {
    // Show moon icon (to switch to dark)
    icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    document.getElementById('darkModeBtn').title = 'Switch to Dark Mode';
  }
  // Update terminal if open
  const terminal = document.getElementById('terminalPanel');
  if (terminal) {
    terminal.style.background = theme === 'dark' ? '#090909' : '#0c0c0c';
  }
}
