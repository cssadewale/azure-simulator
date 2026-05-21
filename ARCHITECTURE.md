# 🏗️ Azure Learning Simulator — Technical Architecture

**Author:** Adewale Samson Adeagbo  
**GitHub:** [@cssadewale](https://github.com/cssadewale)  
**Version:** 2.0.0

---

## Overview

The Azure Learning Simulator is a zero-dependency, static single-page application (SPA) built with vanilla HTML5, CSS3, and ES6 JavaScript. It simulates the Microsoft Azure Portal in the browser with no backend, no build step, and no external runtime dependencies.

---

## Architectural Principles

| Principle | Implementation |
|---|---|
| **Zero Dependencies** | No npm, no webpack, no React, no jQuery. Pure browser APIs only. |
| **Mobile-First** | Built and tested on itel Vista Tab 30s. Responsive down to 360px. |
| **Progressive Enhancement** | Works without Service Worker, localStorage, or PWA support. All features degrade gracefully. |
| **Offline-First** | Service Worker caches all 51 files on first visit. Works without internet. |
| **Free to Run** | No AI API, no backend server, no database. $0 operational cost. |
| **No Build Step** | Open `index.html` in any browser. No compilation, transpilation, or bundling. |

---

## File Loading Order

The browser loads and executes scripts in this strict order (defined in `index.html`):

```
1.  data.js           ← Central data store (AzureData object) — must load FIRST
2.  state.js          ← Shared utilities (toast, modal, tabs) — depends on data.js
3.  router.js         ← Page registry (navigateTo, registerPage) — depends on state.js
4.  terminal.js       ← Cloud Shell — depends on data.js, state.js
5.  notifications.js  ← Notification panel — depends on data.js
6.  search.js         ← Search index — depends on data.js, router.js
7.  pages/dashboard.js          ← Registers 'dashboard' page
8.  pages/resource-groups.js    ← Registers 'resource-groups' page
9.  pages/compute.js            ← Registers 'virtual-machines', 'app-service', etc.
10. pages/storage.js            ← Registers 'storage-accounts', 'sql-database', etc.
11. pages/networking.js         ← Registers 'virtual-network', 'dns', etc.
12. pages/security.js           ← Registers 'key-vault', 'security-center', etc.
13. pages/data-analytics.js     ← Registers 'synapse', 'ml-studio', 'databricks', etc.
14. pages/devops.js             ← Registers 'devops', 'pipelines', etc.
15. pages/monitor.js            ← Registers 'monitor', 'log-analytics', 'cost-management'
16. pages/cost.js               ← Stub (cost page defined in monitor.js)
17. pages/all-resources.js      ← Registers 'all-resources', 'subscriptions'
18. pages/subscriptions.js      ← Stub (subscriptions defined in all-resources.js)
19. pages/new-services.js       ← Registers 'service-bus', 'api-management', 'advisor', etc.
20. learning.js                 ← Learning path system — depends on router.js
21. quiz.js                     ← Quiz simulator — depends on state.js, data.js
22. arm-builder.js              ← ARM Template Builder — depends on state.js
23. activity-log.js             ← Activity tracking — depends on state.js, data.js
24. dark-mode.js                ← Theme toggle — standalone, reads localStorage
25. whatif.js                   ← Cost estimator — depends on state.js
26. persistence.js              ← localStorage save/restore — depends on data.js
27. main.js                     ← Bootstrap — runs after all above are loaded
```

---

## Core Module Architecture

### `data.js` — Central Data Store

The single source of truth for all simulated Azure resources. Contains the `AzureData` object:

```javascript
const AzureData = {
  user: { name, email, github, role, tenant, ... },
  subscriptions: [ { id, name, state, budget, ... } ],
  resourceGroups: [ { id, name, region, resources, tags, ... } ],
  virtualMachines: [ { id, name, status, cpu, ram, ... } ],
  storageAccounts: [ ... ],
  appServices: [ ... ],
  functions: [ ... ],
  sqlDatabases: [ ... ],
  cosmosDb: [ ... ],
  synapseWorkspaces: [ ... ],
  databricks: [ ... ],
  mlStudio: { workspaces, experiments, models },
  dataFactory: [ ... ],
  eventHubs: [ ... ],
  virtualNetworks: [ ... ],
  keyVaults: [ ... ],
  securityCenter: { secureScore, recommendations, alerts },
  activeDirectory: { users, groups, apps },
  devops: { pipelines, repos, projects },
  monitor: { alerts, metrics, workspaces },
  costManagement: { currentMonth, history, budgets },
  notifications: [ ... ],
  regions: [ ... ],
  vmSizes: [ ... ]
}
```

All pages read from and write to `AzureData` directly. There is no separate state management library.

---

### `router.js` — Client-Side Router

A minimal page registry and navigation system:

```javascript
// Page registration (called in each page file)
registerPage('virtual-machines', (container) => {
  container.innerHTML = `...`;
});

// Navigation (called from sidebar links and breadcrumbs)
navigateTo('virtual-machines');
```

The router renders the active page by calling the registered render function with a reference to the `#mainContent` DOM element. There is no URL routing — navigation is purely in-memory.

---

### `state.js` — Shared Utilities

Provides utilities used by every other module:

- `showToast(message, type, duration)` — Toast notifications
- `openModal(html)` / `closeModal()` — Modal system
- `confirmAction(title, msg, callback)` — Confirmation dialogs
- `setActiveTab(containerId, tabName)` — Tab switching
- `statusBadge(status)` — Consistent status badge HTML
- `formatBytes(gb)` — Size formatting
- `openProfile()`, `openSettings()`, `openHelp()` — Topbar panel functions

---

### `persistence.js` — localStorage Layer

Reads and writes `AzureData` to `localStorage` under the key `azure-sim-state-v2`:

```
On load:   initPersistence() → loadState() → AzureData mutated in-place
On action: logActivity() → _flashSaveIndicator()
Every 30s: setInterval → saveState()
On unload: window.beforeunload → saveState()
```

Storage schema:
```json
{
  "savedAt": "2024-03-15T10:30:00.000Z",
  "resourceGroups": [...],
  "virtualMachines": [...],
  "storageAccounts": [...],
  ...
}
```

---

### `activity-log.js` — Event Tracking

All portal actions are tracked via `logActivity(type, title, resource, rg)`:

```javascript
// Called automatically when resources are created
logActivity('create', 'Created Virtual Machine', 'ds-workstation-01', 'rg-data-science-lab');

// Types: 'create' | 'delete' | 'update' | 'action'
```

Events are stored in `ActivityLog[]` array and persisted to `localStorage` under `azure-sim-activity`.

---

### `quiz.js` — Exam Simulator

State machine with five states:

```
IDLE → MENU → QUESTION → ANSWERED → (next question) → RESULTS → MENU
```

`QuizState` object tracks: active exam, questions array, current index, scores, timer, results array.

No AI API is used. All questions are in the `QuizBanks` object in `quiz.js`.

---

### `arm-builder.js` — Template Generator

`ARMResources[]` array holds resource definition objects.
`ARMTemplates` object maps resource keys to factory functions that return valid ARM resource definitions.
`buildFullARMTemplate()` wraps resources in the full ARM schema and returns a JSON object.

---

### `dark-mode.js` — Theme System

Uses a `data-theme` attribute on `<html>`:

```javascript
// Light mode (default)
document.documentElement.setAttribute('data-theme', 'light');

// Dark mode
document.documentElement.setAttribute('data-theme', 'dark');
```

`enhancements.css` uses `[data-theme="dark"]` CSS attribute selectors to override all variables and styles.

---

### `sw.js` — Service Worker

Cache strategy: **Cache-First with Network Fallback**

```
Request → Cache hit? → Return cached response
                  ↓ miss
             Fetch from network → Cache response → Return response
                  ↓ network error
             Return index.html (for navigation requests)
```

Cache name: `azure-sim-v2.0`. On activation, all caches with different names are deleted (version management).

---

## CSS Architecture

CSS is split into 7 files loaded in order:

| File | Responsibility |
|---|---|
| `main.css` | CSS variables, reset, layout (topbar height, sidebar width), shared components (buttons, cards, badges, tables, forms, toast, grid) |
| `sidebar.css` | Sidebar nav, collapse animation, notification panel, learning panel |
| `dashboard.css` | Dashboard-specific components (welcome banner, service tiles, quick actions, subscription cards) |
| `services.css` | Service-specific components (VM cards, pipeline stages, blob browser, cost bars, ML experiments, log query boxes) |
| `modals.css` | Modal overlay, wizard steps, ARM/JSON viewer, terminal panel |
| `terminal.css` | Cloud Shell terminal (stub — actual styles in modals.css) |
| `enhancements.css` | Dark mode variables + component overrides, quiz UI, ARM builder panel, activity log, cost estimator panel, architecture diagram, PWA save indicator, responsive enhancements |

CSS custom properties (variables) are defined in `:root` in `main.css` and overridden in `[data-theme="dark"]` in `enhancements.css`.

---

## Data Flow

```
User Action (e.g. "Create VM")
    ↓
Page JS (e.g. createVM() in compute.js)
    ↓
Mutates AzureData.virtualMachines[]
    ↓
showToast('VM created!', 'success')
    ↓
logActivity('create', 'Created VM', name, rg)
    ↓
_flashSaveIndicator() + _persistActivityLog()
    ↓
navigateTo('virtual-machines') → re-renders page from updated AzureData
    ↓
saveState() (every 30s or on unload)
```

---

## PWA Architecture

```
index.html
    ↓ (loads manifest.json)
manifest.json        ← App name, icons, shortcuts, theme colour
    ↓ (main.js registers SW)
sw.js                ← Caches 51 files on install
    ↓ (subsequent visits)
All assets served from browser cache
    ↓ (user adds to home screen)
Installed as standalone app (no browser chrome)
```

---

## Browser Compatibility

| Browser | Status | Notes |
|---|---|---|
| Chrome 90+ | ✅ Full support | Recommended |
| Samsung Internet 14+ | ✅ Full support | Good for Android |
| Firefox 88+ | ✅ Full support | |
| Edge 90+ | ✅ Full support | |
| Safari 14+ | ✅ Full support | PWA install limited on iOS |
| Android Chrome | ✅ Full support | Tested on itel Vista Tab 30s |
| IE 11 | ❌ Not supported | Uses ES6 template literals |

---

## Performance Characteristics

| Metric | Value |
|---|---|
| Total files | 51 |
| Total size (uncompressed) | ~644 KB |
| Initial HTML size | ~40 KB |
| First load (fast connection) | < 2 seconds |
| Repeat load (from SW cache) | < 200ms |
| Offline load time | < 200ms |
| localStorage usage (typical) | ~50–200 KB |
| No images (except SVG icon) | ✅ |
| No web fonts blocking render | ✅ (Google Fonts async) |

---

## Security Considerations

- No user data is transmitted anywhere — all data stays in the browser
- No cookies are set
- localStorage data never leaves the device
- No external scripts except Google Fonts
- Content Security Policy compatible (no `eval()`, no `innerHTML` with user-provided unsanitised input)
- Service Worker only handles same-origin requests

---

*Maintained by Adewale Samson Adeagbo — [@cssadewale](https://github.com/cssadewale)*
