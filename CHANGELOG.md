# Changelog

All notable changes to the Azure Learning Simulator are documented here.

Format: [Semantic Versioning](https://semver.org/)

---

## [2.0.0] - 2024-06-01

### 🚀 Major Enhancement Release

**Author:** Adewale Adeagbo ([@cssadewale](https://github.com/cssadewale))

#### ✨ New Feature: Dark Mode
- Full dark theme for every component — topbar, sidebar, cards, tables, modals, terminal
- Toggle via the 🌙 button in the topbar or `Ctrl + D` keyboard shortcut
- Preference saved to `localStorage` — persists across sessions
- WCAG-compliant contrast ratios maintained in dark mode

#### ✨ New Feature: Azure Exam Quiz Simulator
- Full multiple-choice quiz with timed sessions (no AI API used)
- **AZ-900** Azure Fundamentals — 12 questions
- **DP-900** Data Fundamentals — 6 questions
- **DP-100** Data Scientist Associate — 8 questions
- **AZ-104** Azure Administrator — 5 questions
- Real exam question style with scenario-based questions
- Per-question instant feedback with detailed explanations
- Progress tracking, score display, and final results summary
- Pass/fail determination (70% threshold) with study tips
- Question review at end of quiz
- Best score saved to `localStorage`

#### ✨ New Feature: ARM Template Builder
- Visual ARM template generator — click resources, get valid JSON
- Supports: VM, Storage Account, Web App, Function App, Key Vault, VNet, SQL Server, Cosmos DB, ML Workspace
- Syntax-highlighted JSON output
- Copy to clipboard button
- Download as `azuredeploy.json`
- CLI deployment instructions included

#### ✨ New Feature: Activity Log
- Tracks every portal action (create, update, delete, action) with timestamp, resource type, and caller
- Filterable by action type (All, Create, Update, Delete, Action)
- Persisted to `localStorage` — survives page refresh
- Pre-seeded with realistic historical activities

#### ✨ New Feature: What-If Cost Estimator
- Estimate monthly Azure costs before deploying real resources
- Covers: VMs (all sizes), Storage (Hot/Cool/Archive), SQL Database, App Service, Functions, Cosmos DB
- Live cost breakdown table with annual estimate
- Credit sufficiency indicator for Azure for Students $100 budget
- Based on East US Pay-As-You-Go public pricing

#### ✨ New Feature: Session Persistence (localStorage)
- All created resources saved automatically every 30 seconds
- State restored on next browser visit
- Export state as JSON backup file
- Import state from a backup file
- Reset all data option
- Storage usage indicator in Settings

#### ✨ New Feature: PWA / Offline Support
- Service Worker caches all files after first visit
- Works completely offline — no internet needed
- Installable as a mobile app (Add to Home Screen on Android)
- Shortcuts: Dashboard, ML Studio, Exam Quiz

#### ✨ New Services Added
- **Azure Service Bus** — Queues, Topics, Subscriptions; Python SDK example; Create namespace modal
- **Azure API Management** — API gateway with policies, rate limiting, auth; XML policy example
- **Azure Stream Analytics** — Real-time SQL query processing; job management; KQL query editor
- **Azure Advisor** — Personalised recommendations across Cost, Security, Reliability, Performance, Operational Excellence
- **Architecture Diagram Builder** — Drag-and-drop 24 Azure components; preset templates (Data Science Pipeline, Web App Pattern); export

#### ✨ Enhancements to Existing Features
- Dashboard: Live UTC clock, new action buttons (Quiz, Cost Estimator, ARM Builder), Learning Progress stat, 6 new service tiles
- Settings modal: Theme toggle, keyboard shortcuts reference, localStorage usage indicator, Export/Reset state buttons
- Terminal: Added `az servicebus`, `az advisor`, `az stream-analytics`, `az apim` commands
- Learning Path: 3 new modules (Module 11: IaC, Module 12: Messaging, Module 13: Architecture Patterns)
- Notifications: Activity log integration
- Search: New services indexed (Service Bus, API Management, Stream Analytics, Advisor, Architecture, Quiz, ARM Builder)
- All `createX()` functions now log to Activity Log

#### ✨ Keyboard Shortcuts Added
- `Ctrl/Cmd + K` — Focus global search
- `Ctrl/Cmd + \`` — Toggle Cloud Shell terminal
- `Ctrl/Cmd + D` — Toggle dark mode
- `Escape` — Close modal / quiz / panels

---

## [1.0.0] - 2024-03-15

### 🎉 Initial Release

**Author:** Adewale Adeagbo ([@cssadewale](https://github.com/cssadewale))

#### ✨ Added — Core Portal
- Full Azure Portal layout: topbar, collapsible sidebar, main content area
- Global search with live results across all services and resources
- Notification panel with simulated alerts
- User profile modal (Adewale Adeagbo / cssadewale)
- Portal settings modal (subscription, region, language)
- Help & Learning Resources modal with exam path guide
- Toast notification system (success, error, warning, info)
- Modal system (overlay, wizard steps, JSON viewer)
- Responsive design (mobile, tablet, desktop)
- Azure favicon (SVG)

#### ✨ Added — Navigation & Routing
- Client-side router with `registerPage()` system
- Active nav item highlighting
- Tab system (`initTabs`, `setActiveTab`)
- Breadcrumb navigation

#### ✨ Added — Cloud Shell Simulator
- Embedded terminal panel (Bash and PowerShell)
- Command history (Arrow Up/Down)
- Full Azure CLI engine:
  - `az account list/show`
  - `az group list/create`
  - `az vm list/start/stop/create`
  - `az storage account list`
  - `az keyvault list/secret list`
  - `az ml workspace list`
  - `az network vnet list/subnet list`
  - `az functionapp list`
  - `az devops project list`
  - `az monitor metrics list`
  - `az --version/--help`
- Basic shell commands: `help`, `clear`, `ls`, `pwd`, `whoami`, `cat`, `mkdir`, `date`, `echo`, `history`, `exit`

#### ✨ Added — Learning Path
- 10-module structured learning path panel
- Step-by-step tasks per module with checkbox tracking
- Overall progress calculation
- Linked to simulator pages
- Covers: AZ-900, DP-900, AI-900, AZ-104, DP-100, DP-203, AZ-400

#### ✨ Added — Azure Services (30+ services)

**Compute:**
- Virtual Machines (full CRUD, start/stop, CPU/memory gauges, ARM template view)
- App Service (create, browse, restart)
- Azure Functions (create, trigger, code view)
- Container Instances (concept page)
- Kubernetes AKS (concept page)

**Storage & Databases:**
- Storage Accounts (create, container browser, usage metrics)
- Blob Storage (file browser, upload simulation)
- SQL Database (query editor with syntax highlighting)
- Cosmos DB (Data Explorer, JSON viewer)

**Data & Analytics:**
- Azure Synapse Analytics (SQL/Spark pools, sample notebook)
- Azure Databricks (clusters, notebooks, MLflow example)
- Azure ML Studio (experiments, model registry, endpoints, SDK quickstart)
- Azure Data Factory (pipelines, run/status)
- Azure Event Hubs (namespace, hubs, send event)

**Networking:**
- Virtual Network (create, subnet management, topology diagram)
- Load Balancer (concept page)
- VPN Gateway (concept page)
- DNS Zones (record sets)

**Security:**
- Key Vault (secrets reveal/hide, keys, certificates, access policies)
- Microsoft Defender for Cloud / Security Center (secure score, recommendations, alerts)
- Microsoft Entra ID / Active Directory (users, groups, apps, RBAC)
- Azure Firewall (concept page with cost warning)

**DevOps:**
- Azure DevOps (projects, pipeline stages, repos)
- Container Registry (registries, repositories)

**Monitoring & Cost:**
- Azure Monitor (metrics charts, alert rules)
- Log Analytics (KQL editor, sample queries)
- Cost Management (cost breakdown, budget tracker, pricing reference)

**Management:**
- Resource Groups (full CRUD, tags, filter)
- All Resources (flat view with type/RG/name filter)
- Subscriptions (detail view, quota table, credit usage)

#### ✨ Added — Simulated Data
- Pre-populated with realistic data for Adewale Adeagbo's environment:
  - 3 Resource Groups
  - 3 Virtual Machines
  - 2 Storage Accounts
  - 2 App Services
  - 2 Function Apps
  - 1 SQL Database
  - 1 Cosmos DB account
  - 1 Synapse Workspace
  - 1 Databricks Workspace
  - 1 ML Workspace with 4 experiments and 3 registered models
  - 1 Data Factory with 4 pipelines
  - 1 Event Hubs namespace
  - 2 Virtual Networks
  - 1 Key Vault with 4 secrets
  - 1 Azure DevOps project with 2 pipelines and 3 repos
  - Security Center with 5 recommendations and 2 alerts
  - Active Directory with 3 users

#### ✨ Added — GitHub Files
- Comprehensive README.md (14 sections)
- MIT LICENSE
- .gitignore
- CONTRIBUTING.md (full contributor guide)
- SECURITY.md
- CHANGELOG.md
- GitHub Actions: auto-deploy to GitHub Pages
- GitHub Issue Templates: Bug Report, Feature Request
- GitHub Pull Request Template
- netlify.toml (Netlify deployment config)
- vercel.json (Vercel deployment config)
- staticwebapp.config.json (Azure Static Web Apps config)

---

## [Unreleased]

### Planned for v1.1.0
- Dark mode toggle
- ARM template generator for created resources
- Quiz mode for AZ-900 exam practice
- PWA support (offline functionality)
- More CLI commands

### Planned for v1.2.0
- Architecture diagram builder (drag and drop)
- Export learning progress as PDF
- Azure Stream Analytics page
- Azure API Management page
- Azure Service Bus page

---

*Maintained by Adewale Adeagbo — [@cssadewale](https://github.com/cssadewale)*
