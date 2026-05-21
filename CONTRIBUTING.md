# Contributing to Azure Learning Simulator

Thank you for your interest in contributing! This project was built by **Adewale Adeagbo** to help beginners learn Azure without spending money. Every contribution — big or small — makes it better for everyone.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Adding a New Azure Service Page](#adding-a-new-azure-service-page)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## 📜 Code of Conduct

Be respectful, inclusive, and constructive. This is a learning project — all skill levels are welcome.

---

## 🤝 Ways to Contribute

| Type | Examples |
|---|---|
| 🐛 **Bug Fix** | Fix a broken layout, incorrect CLI output, or broken link |
| ✨ **New Feature** | Add a new Azure service page, new CLI command, new quiz question |
| 📘 **Documentation** | Improve README, add code comments, update the learning path |
| 🎨 **Design** | Improve mobile responsiveness, dark mode, accessibility |
| 🌍 **Localisation** | Add support for additional languages (Yoruba, Hausa, French, etc.) |
| 🧪 **Testing** | Test on different browsers/devices and report issues |

---

## 🚀 Getting Started

```bash
# 1. Fork the repository on GitHub
# (Click the Fork button at the top right of the repo page)

# 2. Clone your fork locally
git clone https://github.com/YOUR-USERNAME/azure-simulator.git
cd azure-simulator

# 3. Open in your browser — no build step required
# On Windows: start index.html
# On Mac: open index.html
# On Linux: xdg-open index.html

# 4. Or use a local server
python3 -m http.server 8080
# Then visit http://localhost:8080
```

---

## 🔄 Development Workflow

```bash
# 1. Create a new branch for your work
git checkout -b feature/my-new-feature
# or
git checkout -b fix/broken-vm-modal

# 2. Make your changes

# 3. Test in the browser — check on both desktop and mobile view

# 4. Commit your changes with a clear message
git add .
git commit -m "feat: add Azure Stream Analytics page"
# or
git commit -m "fix: correct az vm stop CLI output format"
# or
git commit -m "docs: update README deployment steps"

# 5. Push your branch
git push origin feature/my-new-feature

# 6. Open a Pull Request on GitHub
```

### Commit Message Format

Use this format for clarity:

```
type: short description (max 60 chars)

Optional longer explanation of what changed and why.
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## 📁 Project Structure

```
azure-simulator/
├── index.html              # All HTML — edit to add sidebar items or topbar elements
├── styles/                 # CSS split by concern — edit the relevant file
│   ├── main.css            # Global styles, layout, utilities, buttons, cards
│   ├── sidebar.css         # Sidebar, notification panel, learning panel
│   ├── dashboard.css       # Dashboard-specific styles
│   ├── services.css        # Service-specific styles (VMs, pipelines, etc.)
│   ├── modals.css          # Modals, wizard steps, JSON viewer
│   └── terminal.css        # Cloud Shell terminal
├── js/
│   ├── data.js             # ALL simulated data lives here — edit to add/modify resources
│   ├── state.js            # Shared utilities (toast, modal, tabs, helpers)
│   ├── router.js           # Page registry and navigation — register pages here
│   ├── terminal.js         # Cloud Shell CLI engine — add new az commands here
│   ├── search.js           # Global search index — add new pages to SearchIndex
│   ├── learning.js         # Learning modules — add new steps/modules here
│   ├── main.js             # Bootstrap — runs on DOMContentLoaded
│   └── pages/              # One file per service group
│       ├── dashboard.js
│       ├── resource-groups.js
│       ├── compute.js      # VMs, App Service, Functions, AKS, Containers
│       ├── storage.js      # Storage, Blob, SQL, Cosmos DB
│       ├── data-analytics.js # Synapse, Databricks, ML Studio, Data Factory, Event Hubs
│       ├── networking.js   # VNet, Load Balancer, VPN, DNS
│       ├── security.js     # Key Vault, Security Center, Active Directory, Firewall
│       ├── devops.js       # Azure DevOps, Pipelines, Repos, Container Registry
│       ├── monitor.js      # Azure Monitor, Log Analytics, Cost Management
│       └── all-resources.js # All Resources, Subscriptions
└── assets/
    └── azure-icon.svg
```

---

## 🎨 Coding Standards

### HTML
- All HTML is generated via JavaScript template literals (no separate HTML files per page)
- Keep `index.html` minimal — it's the shell; pages render into `#mainContent`
- Use semantic elements where possible

### CSS
- Use CSS variables defined in `main.css` (e.g., `var(--azure-blue)`, `var(--card-border)`)
- Follow the existing naming conventions (BEM-like: `.card`, `.card-header`, `.card-body`)
- Mobile-first: test on small screens (360px wide minimum)
- No external CSS libraries — vanilla CSS only

### JavaScript
- **Vanilla JS only** — no React, Vue, Angular, jQuery, or any framework
- All data lives in `AzureData` object in `data.js`
- All pages are registered with `registerPage(name, renderFn)` in `router.js`
- Use `showToast(message, type)` for user feedback
- Use `openModal(html)` / `closeModal()` for dialogs
- Use `statusBadge(status)` helper for consistent status display
- Use `newGuid()` for generating fake resource IDs
- Keep functions small and focused

### Naming Conventions
```javascript
// Pages: kebab-case matching sidebar nav item data-page attribute
registerPage('my-new-service', (container) => { ... });

// Functions: camelCase, verb-first
function openCreateVMModal() { ... }
function renderVMCard(vm) { ... }
function createVM() { ... }

// Data keys: camelCase
AzureData.virtualMachines
AzureData.storageAccounts
```

---

## ➕ Adding a New Azure Service Page

Follow these steps to add a new Azure service page:

### Step 1: Add data to `js/data.js`

```javascript
// In the AzureData object, add your service data:
serviceHubs: [
  {
    id: 'hub-001',
    name: 'adewale-service-hub',
    resourceGroup: 'rg-data-science-lab',
    region: 'East US',
    status: 'Active',
    // ... other properties
  }
]
```

### Step 2: Add sidebar link to `index.html`

```html
<!-- Find the appropriate nav section in the sidebar and add: -->
<a class="nav-item" data-page="service-hub" onclick="navigateTo('service-hub')">
  <svg width="18" height="18" ...><!-- icon SVG --></svg>
  <span>Service Hub</span>
</a>
```

### Step 3: Add to search index in `js/search.js`

```javascript
// Add to the SearchIndex array:
{ name: 'Service Hub', category: 'Messaging', page: 'service-hub', icon: '🔌' },
```

### Step 4: Create the page in the appropriate pages file

```javascript
// In the relevant js/pages/*.js file:
registerPage('service-hub', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb">
        <span onclick="navigateTo('dashboard')">Home</span> › Service Hub
      </div>
      <div class="page-title">
        <div class="page-title-icon">🔌</div>
        <span>Service Hub</span>
      </div>
      <div class="page-subtitle">Brief description of what this service does.</div>
    </div>

    <!-- ALWAYS include a learning info box -->
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div>
        <strong>What is Service Hub?</strong>
        Explain the service clearly for a complete beginner. What problem does it solve?
        When would a data scientist use it? How does it compare to alternatives?
      </div>
    </div>

    <!-- Your page content here -->
  `;
});
```

### Step 5: Add script tag to `index.html` (if you created a new .js file)

```html
<!-- At the bottom of index.html, before </body> -->
<script src="js/pages/my-new-page.js"></script>
```

### Step 6: Add to Learning Path (optional) in `js/learning.js`

```javascript
// Add new steps to an existing module or create a new module:
{
  title: '🔌 Module 11: Service Hub',
  progress: 0,
  steps: [
    { text: 'Create a Service Hub namespace', done: false },
    { text: 'Add your first topic', done: false },
    // ...
  ],
  description: 'Learn to use Service Hub for real-time messaging...'
}
```

---

## 📨 Submitting a Pull Request

1. Ensure your changes work in Chrome, Firefox, and Safari
2. Test on mobile (use browser dev tools to simulate 375px width)
3. Make sure no console errors appear
4. Update README.md if you added a new service to the "Services Covered" table
5. Open your PR with a clear title and description:

```
Title: feat: Add Azure Stream Analytics page

Description:
- Added Stream Analytics page with job management
- Simulated input/output configuration
- Added 3 sample KQL queries
- Added CLI commands: az stream-analytics job list
- Updated search index
- Added to Learning Module 7
```

---

## 🐛 Reporting Bugs

Open a GitHub Issue with:
- **Browser and version** (e.g., Chrome 119 on Android)
- **Device** (e.g., itel Vista Tab 30s)
- **Steps to reproduce**
- **Expected behaviour**
- **Actual behaviour**
- **Screenshot** (if possible)

---

## 💡 Suggesting Features

Open a GitHub Issue with the label `enhancement` and describe:
- What Azure service or feature you want added
- Why it would be useful for learners
- Any reference to Microsoft documentation

---

Thank you for helping make Azure accessible to everyone! 🌍

**— Adewale Adeagbo (@cssadewale)**
