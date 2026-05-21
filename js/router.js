/* =====================================================
   ROUTER.JS — Page navigation
   ===================================================== */

const PageRegistry = {};

function registerPage(name, renderFn) {
  PageRegistry[name] = renderFn;
}

function navigateTo(page) {
  AppState.currentPage = page;
  setActiveNav(page);

  const main = document.getElementById('mainContent');
  main.innerHTML = '<div style="padding:40px;text-align:center;color:#8a8886">Loading...</div>';

  // Small delay for UX feel
  setTimeout(() => {
    const render = PageRegistry[page];
    if (render) {
      main.innerHTML = '';
      render(main);
    } else {
      main.innerHTML = `
        <div class="empty-state" style="padding:80px 20px">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h3>Page Under Construction</h3>
          <p>The <strong>${page}</strong> page is being built. Check back soon!</p>
          <button class="btn btn-primary" style="margin-top:16px" onclick="navigateTo('dashboard')">Back to Home</button>
        </div>
      `;
    }
  }, 80);
}
