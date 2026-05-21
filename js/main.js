/* =====================================================
   MAIN.JS — App bootstrap
   Author: Adewale Adeagbo | GitHub: cssadewale
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Restore persisted state from localStorage
  initPersistence();

  // 2. Navigate to dashboard
  navigateTo('dashboard');

  // 3. Update notification badge
  document.getElementById('notifBadge').textContent = AzureData.notifications.length;

  // 4. Welcome toast
  setTimeout(() => {
    showToast('Welcome back, Adewale! 👋 Azure Simulator loaded.', 'success', 5000);
  }, 600);

  // 5. Keyboard shortcuts
  document.addEventListener('keydown', e => {
    // Ctrl/Cmd + K = focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('globalSearch').focus();
    }
    // Ctrl + ` = open/close terminal
    if ((e.ctrlKey || e.metaKey) && e.key === '`') {
      e.preventDefault();
      const panel = document.getElementById('terminalPanel');
      panel.classList.contains('open') ? closeTerminal() : openTerminal();
    }
    // Escape = close modal or quiz
    if (e.key === 'Escape') {
      closeModal();
      const quiz = document.getElementById('quizContainer');
      if (quiz && quiz.style.display !== 'none') closeQuizMode();
      closeAllPanels();
    }
    // Ctrl + D = toggle dark mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      toggleDarkMode();
    }
  });

  // 6. Live clock in welcome banner (updated every second)
  function updateClock() {
    const el = document.getElementById('liveClock');
    if (el) {
      const now = new Date();
      el.textContent = now.toUTCString().replace(' GMT', ' UTC');
    }
  }
  setInterval(updateClock, 1000);

  // 7. Add What-If button to cost management sidebar link
  const costBtn = document.querySelector('[data-page="cost-management"]');
  if (costBtn) {
    costBtn.addEventListener('contextmenu', e => {
      e.preventDefault();
      openWhatIf();
    });
  }

  // 8. Log startup to activity log
  logActivity('action', 'Portal Loaded', 'Azure Learning Simulator v2.0', 'Portal');
});
