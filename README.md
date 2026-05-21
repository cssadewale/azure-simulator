# ☁️ Azure Learning Simulator v2.0

<div align="center">

> **A fully interactive, browser-based replica of the Microsoft Azure Portal — built for learning Azure from scratch, completely free, no subscription required.**

[![Version](https://img.shields.io/badge/Version-2.0.0-0078D4?style=for-the-badge)](CHANGELOG.md)
[![Made by Adewale Samson Adeagbo](https://img.shields.io/badge/Made%20by-Adewale%20Samson%20Adeagbo-0078D4?style=for-the-badge)](https://github.com/cssadewale)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20Ready-purple?style=for-the-badge)]()
[![Framework](https://img.shields.io/badge/Framework-Vanilla%20JS-yellow?style=for-the-badge)]()
[![No Backend](https://img.shields.io/badge/Backend-None%20%28Static%29-lightgrey?style=for-the-badge)]()
[![No AI API](https://img.shields.io/badge/AI%20API-Not%20Used-orange?style=for-the-badge)]()
[![Free](https://img.shields.io/badge/Cost-100%25%20Free-brightgreen?style=for-the-badge)]()

**[🌐 Live Demo](https://cssadewale.github.io/azure-simulator)** &nbsp;·&nbsp;
**[👤 Author](https://linkedin.com/in/adewalesamsonadeagbo)** &nbsp;·&nbsp;
**[🐛 Report Bug](https://github.com/cssadewale/azure-simulator/issues/new?template=bug_report.md)** &nbsp;·&nbsp;
**[✨ Request Feature](https://github.com/cssadewale/azure-simulator/issues/new?template=feature_request.md)**

</div>

---

## 📌 Table of Contents

1. [About the Project](#-about-the-project)
2. [Who This Is For](#-who-this-is-for)
3. [What's New in v2.0](#-whats-new-in-v20)
4. [Live Demo](#-live-demo)
5. [All Features](#-all-features)
6. [Azure Services Covered](#-azure-services-covered-35-services)
7. [Project Structure](#-project-structure)
8. [Getting Started](#-getting-started-zero-setup)
9. [Deployment Guide](#-deployment-guide-step-by-step)
10. [Learning Path](#-structured-learning-path-13-modules)
11. [Keyboard Shortcuts](#-keyboard-shortcuts)
12. [Cloud Shell Commands](#-cloud-shell-simulator)
13. [Roadmap](#-roadmap)
14. [Contributing](#-contributing)
15. [Author](#-author)
16. [License](#-license)

---

## 📖 About the Project

The **Azure Learning Simulator v2.0** is a pixel-faithful, fully interactive simulation of the Microsoft Azure Portal. It is built entirely with **vanilla HTML, CSS, and JavaScript** — no frameworks, no backend server, no AI API, no subscription, and no cost of any kind.

### The Problem It Solves

Learning Microsoft Azure through the real portal is expensive, risky, and anxiety-inducing for beginners:

- Resources left running drain your credit ($100 Azure for Students disappears fast)
- Mistakes on real infrastructure are stressful
- Many learners in Nigeria and other emerging markets have intermittent internet and low-spec devices
- There is no safe sandbox to freely experiment

### The Solution

This simulator removes every single barrier:

| Barrier | How This Simulator Removes It |
|---|---|
| 💸 Cost of real Azure resources | Everything is simulated — $0 spent |
| 😰 Fear of breaking things | Delete VMs freely, nothing real is affected |
| 📶 Intermittent internet | Works fully offline after first visit (PWA + Service Worker) |
| 📱 Low-spec device | Built and tested on an itel Vista Tab 30s — runs on any browser |
| 🤖 AI API cost | Zero AI API used — all content is handcrafted and free |
| 📚 No structured curriculum | 13-module learning path from AZ-900 beginner to DP-100 data scientist |
| 🎯 No exam practice | Built-in quiz simulator for AZ-900, DP-900, DP-100, AZ-104 |

### Technical Philosophy

> **"The best way to learn cloud is to use cloud — even when you can't."**
>
> — Adewale Samson Adeagbo

This project is intentionally zero-dependency. No React, no Vue, no Angular, no Node.js, no npm, no build step. Open `index.html` in any browser and it works. Every design decision prioritises accessibility over sophistication.

---

## 👤 Who This Is For

| Learner Profile | How This Simulator Helps |
|---|---|
| **Complete Azure beginners** | Every page has a plain-English explanation of what the service does, when to use it, and how it connects to other services |
| **Data Scientists learning Azure** | Dedicated focus on ML Studio, Databricks, Synapse, Data Factory — the full data science toolchain |
| **Students on Azure for Students** | Practice freely without burning your $100 credit — estimate costs first with the What-If Estimator |
| **Certification candidates** | Built-in quiz simulator covers AZ-900, DP-900, DP-100, and AZ-104 exam content |
| **Mobile / tablet users** | Fully responsive — built and tested on an itel Vista Tab 30s (Android) |
| **Learners with limited connectivity** | Works completely offline after the first visit via Service Worker caching |
| **Infrastructure as Code learners** | ARM Template Builder generates real, deployable ARM JSON from a UI |
| **Developers on any OS** | Zero setup — just open index.html. No Node.js, npm, or build tools needed |

---

## 🆕 What's New in v2.0

v2.0 adds 8 major feature systems to the v1.0 foundation without removing any existing functionality.

| # | Feature | Description |
|---|---|---|
| 1 | 🌙 **Dark Mode** | Full portal dark theme. Toggled via topbar button or `Ctrl+D`. Saved to localStorage across sessions. |
| 2 | 🎯 **Exam Quiz Simulator** | 31 real-style questions for AZ-900, DP-900, DP-100, AZ-104. Timed, scored, with per-question explanations. No AI API. |
| 3 | 📄 **ARM Template Builder** | Visual resource picker generates real, valid ARM JSON. Supports 9 resource types. Download `azuredeploy.json`. |
| 4 | 📋 **Activity Log** | Every portal action tracked — create, update, delete, action — with timestamp, resource type, and caller. Filterable. Persisted. |
| 5 | 💡 **What-If Cost Estimator** | Real Azure public pricing data for VMs, Storage, SQL, Functions, Cosmos DB. Live monthly + annual estimate. |
| 6 | 💾 **Session Persistence** | All created resources auto-saved to localStorage every 30 seconds. Restored on next visit. Export/import JSON backup. |
| 7 | 📱 **PWA + Offline Support** | Service Worker caches all 51 files. Works without internet. Installable as an app on Android (Add to Home Screen). |
| 8 | 🏗️ **5 New Service Pages** | Service Bus, API Management, Stream Analytics, Azure Advisor, Architecture Diagram Builder |
| 9 | ⌨️ **Keyboard Shortcuts** | `Ctrl+K` search, `Ctrl+\`` terminal, `Ctrl+D` dark mode, `Escape` close |
| 10 | 📚 **3 New Learning Modules** | Module 11: IaC & ARM, Module 12: Messaging & Integration, Module 13: Architecture Patterns |

---

## 🌐 Live Demo

**GitHub Pages:** `https://cssadewale.github.io/azure-simulator`

After deployment (see [Deployment Guide](#-deployment-guide-step-by-step) below), your simulator is live at this URL. No login. No signup. No cost. Works on any device.

---

## ✨ All Features

### 🏠 Portal Experience
- Pixel-faithful Azure Portal layout — topbar, collapsible sidebar, main content, breadcrumbs
- **35+ service pages** accessible from the sidebar
- **Global search** — live results across all services and resources by name or category
- **Notification panel** — simulated alerts, warnings, and activity feed
- **User profile modal** — Adewale Samson Adeagbo, tenant details, GitHub link
- **Portal settings** — theme, default subscription, region, keyboard shortcuts, storage info
- **Responsive design** — mobile, tablet, desktop (tested on itel Vista Tab 30s)
- **Live UTC clock** on the dashboard welcome banner

### 🌙 Dark Mode
- Full dark theme for every component — topbar, sidebar, cards, tables, modals, terminal, all panels
- Toggle: topbar 🌙 button OR `Ctrl + D` keyboard shortcut
- Preference saved to `localStorage` — persists across browser sessions and page refreshes
- WCAG contrast ratios maintained in dark mode

### 🎯 Exam Quiz Simulator
- No AI API — all 31 questions handcrafted and hardcoded
- Four exam tracks with dedicated question banks:
  - **AZ-900** Azure Fundamentals — 12 questions (Beginner)
  - **DP-900** Data Fundamentals — 6 questions (Beginner)
  - **DP-100** Data Scientist Associate — 8 questions (Intermediate)
  - **AZ-104** Azure Administrator — 5 questions (Intermediate)
- Features per quiz session:
  - Questions shuffled randomly on every attempt
  - Countdown timer (45–115 minutes depending on exam)
  - Scenario-based questions matching real exam style
  - Instant per-question feedback (correct/wrong highlighted)
  - Detailed explanation for every answer
  - Live score display during the quiz
  - Skip question option
  - Final results: score %, correct/wrong/skipped breakdown, pass/fail (70% threshold)
  - Full question review at end
  - Best score saved to `localStorage`
  - Study tip and Microsoft Learn link on completion

### 📄 ARM Template Builder
- Visual resource picker — click to add, not to configure manually
- Supports 9 resource types: VM, Storage Account, Web App, Function App, Key Vault, VNet, SQL Server, Cosmos DB, ML Workspace
- Generates real, valid ARM JSON (deployable with Azure CLI)
- Syntax-highlighted JSON output
- Copy to clipboard button
- Download as `azuredeploy.json`
- Remove individual resources from template
- Clear all and start fresh
- CLI deployment command shown inline

### 📋 Activity Log
- Tracks every portal action with: action type, resource name, resource type, resource group, caller email, status, timestamp
- Filterable by type: All, Create, Update, Delete, Action
- Persisted to `localStorage` — survives page refresh
- Pre-seeded with 7 realistic historical activities
- Automatically logs every `createVM()`, `createRG()`, `createStorage()`, quiz completion, ARM download, etc.
- Save indicator flashes on every log entry

### 💡 What-If Cost Estimator
- Real Azure East US Pay-As-You-Go pricing (hardcoded — no API)
- Covers: Virtual Machines (9 sizes), Storage (Hot/Cool/Archive tiers), SQL Database (6 tiers), App Service (6 plans), Azure Functions (3 plans), Cosmos DB (4 throughput options)
- Live calculation updates as you change selections
- Monthly and annual cost totals
- Credit sufficiency indicator for Azure for Students $100 budget
- Pricing reference table on Cost Management page

### 💾 Session Persistence
- Auto-saves all resource data every 30 seconds to `localStorage`
- Saves on page unload (`beforeunload` event)
- Restores all resources on next visit automatically
- Export state as JSON backup file (timestamped)
- Import state from a previously exported backup
- Reset all data with confirmation dialog
- Storage usage indicator in Settings modal

### 📱 PWA + Offline Support
- `manifest.json` makes the simulator installable on Android (Add to Home Screen)
- `sw.js` Service Worker caches all 51 files on first visit
- Cache-first strategy — loads instantly offline
- App shortcuts: Dashboard, ML Studio, Exam Quiz
- Theme colour: Azure blue (#0078D4)

### 🖥️ Cloud Shell Simulator
- Full embedded terminal (Bash and PowerShell modes)
- Command history navigation (Arrow Up/Down)
- 20+ Azure CLI commands fully simulated
- New in v2.0: `az servicebus`, `az advisor`, `az stream-analytics`, `az apim`
- Syntax-coloured output (JSON responses, errors, success messages)

### 📚 Structured Learning Path (13 Modules)
- Accessible from the sidebar (📘 Learning Path button)
- Progress saved to `localStorage`
- Each module has step-by-step tasks that you check off
- Covers: AZ-900 → DP-900 → AI-900 → AZ-104 → DP-100 → DP-203 → AZ-400

---

## ☁️ Azure Services Covered (35+ Services)

### Compute
| Service | Features Simulated |
|---|---|
| **Virtual Machines** | Create wizard (4-step), start/stop/restart, CPU/memory gauges, ARM template view, SSH instructions, VM size selector (9 sizes) |
| **App Service** | Create web app, runtime selector, deployment URL, restart, browse |
| **Azure Functions** | Create, trigger types, execution stats, Python code editor, run simulation |
| **Container Instances** | Concept page with explanation |
| **Kubernetes (AKS)** | Concept page with explanation |

### Storage & Databases
| Service | Features Simulated |
|---|---|
| **Storage Accounts** | Create, container browser, usage metrics, connection string, Hot/Cool/Archive |
| **Blob Storage** | File browser, upload simulation, breadcrumb navigation |
| **SQL Database** | Query editor with syntax highlighting, simulated results |
| **Cosmos DB** | Data Explorer, document query, JSON viewer |

### Data & Analytics
| Service | Features Simulated |
|---|---|
| **Azure Synapse Analytics** | SQL pools, Spark pools, sample PySpark notebook |
| **Azure Databricks** | Clusters, notebooks, MLflow experiment tracking, Delta Lake |
| **Azure ML Studio** | Experiments, model registry, compute clusters, online endpoints, endpoint testing, SDK quickstart |
| **Azure Data Factory** | Pipelines, run/status, trigger simulation |
| **Azure Event Hubs** | Namespace, hub listing, send event simulation |
| **Azure Stream Analytics** | Job management, real-time SQL query editor, start/stop |

### Integration & Messaging (NEW in v2.0)
| Service | Features Simulated |
|---|---|
| **Azure Service Bus** | Queues, Topics, Subscriptions, Python SDK example, create namespace modal |
| **Azure API Management** | API gateway, policies, rate limiting, XML policy editor |

### Networking
| Service | Features Simulated |
|---|---|
| **Virtual Network** | Create, subnet management, visual topology diagram |
| **Load Balancer** | Concept page with explanation |
| **VPN Gateway** | Concept page with Point-to-Site guidance |
| **DNS Zones** | Record sets (A, CNAME, MX), add record set |

### Security & Identity
| Service | Features Simulated |
|---|---|
| **Azure Key Vault** | Secrets (reveal/hide), keys, certificates, access policies, add secret modal |
| **Microsoft Defender for Cloud** | Secure Score gauge, recommendations (mark resolved), security alerts, best practices checklist |
| **Microsoft Entra ID (Azure AD)** | Users, groups, app registrations, RBAC roles |
| **Azure Firewall** | Concept page with cost warning |

### DevOps
| Service | Features Simulated |
|---|---|
| **Azure DevOps** | Projects, pipeline stages with status, repos, run pipeline |
| **Container Registry** | Registry, repository listing, pull command |

### Monitoring & Cost
| Service | Features Simulated |
|---|---|
| **Azure Monitor** | Metrics charts (CPU, memory), alert rules, create alert modal |
| **Log Analytics** | KQL query editor, sample queries, run query simulation |
| **Cost Management** | Cost breakdown, budget tracker, pricing reference table |

### Governance & Tools (NEW in v2.0)
| Service | Features Simulated |
|---|---|
| **Azure Advisor** | 8 recommendations across 5 categories (Cost, Security, Reliability, Performance, Operational Excellence), 1-click fix simulation |
| **Architecture Diagram Builder** | 24 drag-and-drop Azure components, preset templates (Data Science Pipeline, Web App), export |
| **ARM Template Builder** | Visual ARM JSON generator for 9 resource types, download `azuredeploy.json` |

### Management
| Service | Features Simulated |
|---|---|
| **Resource Groups** | Full CRUD, tags, filter |
| **All Resources** | Flat view, filter by type/RG/name |
| **Subscriptions** | Detail view, quota table, credit usage |

---

## 📁 Project Structure

```
azure-simulator/                         ← Root (open index.html to run)
│
├── index.html                           ← Main entry point — full portal shell
├── manifest.json                        ← PWA manifest (installable on Android)
├── sw.js                                ← Service Worker (offline caching)
├── netlify.toml                         ← Netlify deployment config
├── vercel.json                          ← Vercel deployment config
├── staticwebapp.config.json             ← Azure Static Web Apps config
│
├── styles/                              ← All CSS (no external libraries)
│   ├── main.css                         ← Core layout, typography, utilities, toasts, buttons
│   ├── sidebar.css                      ← Sidebar, nav items, notification & learning panels
│   ├── dashboard.css                    ← Dashboard cards, service tiles, subscription cards
│   ├── services.css                     ← VM cards, pipelines, blob browser, cost bars, etc.
│   ├── modals.css                       ← Modal system, wizard steps, JSON/ARM viewer
│   ├── terminal.css                     ← Cloud Shell terminal styles
│   └── enhancements.css                 ← Dark mode, quiz, ARM panel, activity log, PWA, animations
│
├── js/                                  ← All JavaScript (vanilla, no frameworks)
│   ├── data.js                          ← Central data store — all simulated Azure resources
│   ├── state.js                         ← App state, toast, modal, tab system, helpers
│   ├── router.js                        ← Page registration and client-side navigation
│   ├── terminal.js                      ← Cloud Shell simulator with full Azure CLI engine
│   ├── notifications.js                 ← Notification panel
│   ├── search.js                        ← Global search with live results
│   ├── learning.js                      ← 13-module learning path system
│   ├── quiz.js                          ← Exam quiz simulator (AZ-900, DP-900, DP-100, AZ-104)
│   ├── arm-builder.js                   ← ARM Template Builder (generates real ARM JSON)
│   ├── activity-log.js                  ← Activity log (tracks all portal actions)
│   ├── dark-mode.js                     ← Dark/light mode toggle with localStorage
│   ├── whatif.js                        ← What-If Cost Estimator with real pricing data
│   ├── persistence.js                   ← localStorage auto-save, export/import state
│   ├── main.js                          ← App bootstrap, keyboard shortcuts, service worker
│   │
│   └── pages/                           ← One JS file per service group
│       ├── dashboard.js                 ← Home dashboard
│       ├── resource-groups.js           ← Resource Groups (full CRUD)
│       ├── compute.js                   ← VMs, App Service, Functions, AKS, Containers
│       ├── storage.js                   ← Storage Accounts, Blob, SQL Database, Cosmos DB
│       ├── data-analytics.js            ← Synapse, Databricks, ML Studio, Data Factory, Event Hubs
│       ├── networking.js                ← VNet, Load Balancer, VPN Gateway, DNS
│       ├── security.js                  ← Key Vault, Security Center, Active Directory, Firewall
│       ├── devops.js                    ← Azure DevOps, Pipelines, Repos, Container Registry
│       ├── monitor.js                   ← Azure Monitor, Log Analytics, Cost Management
│       ├── all-resources.js             ← All Resources + Subscriptions
│       ├── new-services.js              ← Service Bus, API Mgmt, Stream Analytics, Advisor, Architecture
│       ├── subscriptions.js             ← (included in all-resources.js)
│       └── cost.js                      ← (included in monitor.js)
│
├── assets/
│   └── azure-icon.svg                   ← Azure logo favicon
│
├── .github/
│   ├── workflows/
│   │   └── deploy.yml                   ← GitHub Actions: auto-deploy to GitHub Pages
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md                ← Bug report issue template
│   │   └── feature_request.md           ← Feature request issue template
│   └── PULL_REQUEST_TEMPLATE.md         ← PR template
│
├── README.md                            ← This file
├── CHANGELOG.md                         ← Full version history
├── CONTRIBUTING.md                      ← Contributor guidelines
├── SECURITY.md                          ← Security policy
├── LICENSE                              ← MIT License
└── .gitignore                           ← Git ignore rules
```

**Total: 51 files · ~644 KB · Zero dependencies · Zero build step**

---

## 🚀 Getting Started (Zero Setup)

### Option 1 — Open Directly in Browser

This is the simplest method. No installation of any kind is needed.

```bash
# Step 1: Clone the repository to your device
git clone https://github.com/cssadewale/azure-simulator.git

# Step 2: Go into the folder
cd azure-simulator

# Step 3: Open index.html in your browser
# Windows:
start index.html

# Mac:
open index.html

# Linux:
xdg-open index.html

# Android (itel Vista Tab 30s or any Android device):
# Open your file manager → navigate to the azure-simulator folder → tap index.html
# It opens in Chrome or your default browser automatically
```

### Option 2 — Local Development Server (Recommended for Development)

If you are editing files and want to see changes with hot-reload:

```bash
# Using Python (pre-installed on most systems):
cd azure-simulator
python3 -m http.server 8080
# Open: http://localhost:8080

# Using Node.js (if installed):
npx serve .
# Open: http://localhost:3000

# Using VS Code Live Server extension:
# 1. Install the "Live Server" extension in VS Code
# 2. Right-click index.html in the explorer
# 3. Select "Open with Live Server"
# Opens: http://127.0.0.1:5500

# Using PHP (if installed):
php -S localhost:8080
# Open: http://localhost:8080
```

> **Important:** The Service Worker (offline caching) only works when served over HTTP or HTTPS — not from `file://`. Use one of the server options above to test PWA/offline features.

---

## 📤 Deployment Guide (Step-by-Step)

### Method 1 — GitHub Pages (Recommended: Free, Automatic, Fast)

GitHub Pages is the recommended deployment method. It is completely free, auto-deploys every time you push code, and gives you a permanent public URL.

#### Prerequisites
- A GitHub account at [github.com](https://github.com)
- Git installed on your device
- The project files on your device

#### Step 1 — Create a GitHub Repository

1. Open your browser and go to [github.com/new](https://github.com/new)
2. Fill in the form:
   - **Repository name:** `azure-simulator` (exactly this, no spaces)
   - **Description:** `Azure Learning Simulator — Interactive Azure Portal replica by Adewale Samson Adeagbo`
   - **Visibility:** Select **Public** (required for free GitHub Pages)
   - **Do NOT** tick "Add a README file" — you already have one
   - **Do NOT** tick "Add .gitignore" — you already have one
3. Click the green **Create repository** button
4. Leave the next page open — you will need the repository URL

#### Step 2 — Push Your Code to GitHub

Open a terminal (Command Prompt, PowerShell, Git Bash, or Android terminal emulator) inside the `azure-simulator` folder and run these commands **one at a time**:

```bash
# Initialise a git repository in the folder
git init

# Stage all 51 files for commit
git add .

# Create the first commit with a descriptive message
git commit -m "feat: Azure Learning Simulator v2.0 by Adewale Samson Adeagbo

- Full Azure Portal replica (35+ services)
- Dark mode, Exam Quiz, ARM Builder, Activity Log
- What-If Cost Estimator, Session Persistence, PWA/Offline
- 13-module Learning Path, Cloud Shell simulator
- Service Bus, API Management, Stream Analytics, Advisor"

# Set the default branch name to 'main'
git branch -M main

# Connect your local folder to the GitHub repository
# Replace 'cssadewale' with your actual GitHub username if different
git remote add origin https://github.com/cssadewale/azure-simulator.git

# Push all files to GitHub
git push -u origin main
```

When prompted for credentials:
- **Username:** your GitHub username (e.g., `cssadewale`)
- **Password:** your GitHub Personal Access Token (NOT your account password)
  - To create a token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token → tick `repo` → Generate → copy the token

#### Step 3 — Enable GitHub Pages

1. Go to your repository: `https://github.com/cssadewale/azure-simulator`
2. Click the **Settings** tab (top of the repository page)
3. In the left sidebar, scroll down and click **Pages**
4. Under **Build and deployment**:
   - **Source:** Select `Deploy from a branch`
   - **Branch:** Select `main`
   - **Folder:** Select `/ (root)`
5. Click **Save**
6. Wait **1 to 3 minutes** for the first deployment to complete
7. Refresh the Pages settings page — you will see a green banner saying:
   `Your site is live at https://cssadewale.github.io/azure-simulator`

#### Step 4 — Verify Your Deployment

1. Visit `https://cssadewale.github.io/azure-simulator` in your browser
2. The Azure Simulator dashboard should load fully
3. Click through several services to confirm navigation works
4. Open Cloud Shell (the `>_` button in the topbar) and type `az account list`
5. Toggle dark mode with the 🌙 button

#### Step 5 — Future Updates (Push to Auto-Deploy)

Every time you make changes to files, deploy them with three commands:

```bash
git add .
git commit -m "your description of what changed"
git push
```

GitHub Pages automatically redeploys within 1–2 minutes. No manual steps needed.

---

### Method 2 — Netlify (Alternative: Even Faster, More Features)

#### Option A — Drag and Drop (Fastest, No CLI Needed)

1. Go to [netlify.com](https://netlify.com) and sign up for a free account
2. From your Netlify dashboard, find the area that says **"Want to deploy a new site without connecting to Git? Drag and drop your site output folder here"**
3. Open your file manager, navigate to your `azure-simulator` folder
4. Drag the entire `azure-simulator` folder and drop it onto the Netlify dashboard
5. Netlify deploys in about 10 seconds and gives you a URL like `https://graceful-flower-abc123.netlify.app`
6. Optionally rename it: Site settings → Change site name → type `azure-simulator-adewale` → Save
7. Your URL becomes: `https://azure-simulator-adewale.netlify.app`

#### Option B — Connect to GitHub (Auto-deploy on Push)

1. Go to [netlify.com](https://netlify.com) → Log in → Click **Add new site** → **Import an existing project**
2. Click **Deploy with GitHub** → Authorise Netlify to access your GitHub account
3. Search for and select your `azure-simulator` repository
4. Configure build settings:
   - **Base directory:** *(leave empty)*
   - **Build command:** *(leave empty — no build step)*
   - **Publish directory:** `.` (a single dot, meaning the root folder)
5. Click **Deploy site**
6. Netlify builds and deploys. Every future `git push` automatically redeploys.

---

### Method 3 — Vercel (Alternative)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Inside the azure-simulator folder:
vercel

# Answer the prompts:
# Set up and deploy? → Y
# Which scope? → your username
# Link to existing project? → N
# Project name? → azure-simulator
# In which directory is your code? → ./ (press Enter)
# Want to override settings? → N
# Done! Your URL: https://azure-simulator-cssadewale.vercel.app
```

For all future deployments:
```bash
vercel --prod
```

---

### Method 4 — Azure Static Web Apps (Host on Real Azure!)

Deploy your Azure simulator *on actual Azure* — the ultimate meta-learning experience. This method is free using the Azure for Students subscription.

#### Step 1 — In the Real Azure Portal
1. Sign in to [portal.azure.com](https://portal.azure.com) with your Azure for Students account
2. Click **+ Create a resource**
3. Search for **Static Web Apps** → Click **Create**

#### Step 2 — Fill in the Creation Form

| Field | Value |
|---|---|
| Subscription | Azure for Students |
| Resource Group | `rg-data-science-lab` (or create new) |
| Name | `azure-simulator-adewale` |
| Plan type | **Free** |
| Region | East US 2 (or South Africa North — closer to Nigeria) |
| Deployment source | **GitHub** |

#### Step 3 — Connect to GitHub
1. Click **Sign in with GitHub** → Authorise Azure
2. Organisation: `cssadewale`
3. Repository: `azure-simulator`
4. Branch: `main`

#### Step 4 — Build Configuration
| Field | Value |
|---|---|
| Build preset | **Custom** |
| App location | `/` |
| Api location | *(leave empty)* |
| Output location | *(leave empty)* |

#### Step 5 — Deploy
1. Click **Review + Create** → **Create**
2. Azure creates a GitHub Actions workflow file automatically
3. Go to your GitHub repository → Actions tab → watch the deployment run
4. When complete (about 2 minutes), your URL is shown in the Azure Portal under the Static Web Apps resource
5. URL format: `https://gentle-river-abc123.azurestaticapps.net`

---

### Method 5 — Android Device (Direct File Access)

For use on an itel Vista Tab 30s or any Android device without deployment:

1. Download the repository as a ZIP: GitHub → **Code** → **Download ZIP**
2. Extract the ZIP using your file manager app
3. Navigate into the `azure-simulator` folder
4. Tap `index.html`
5. If it does not open automatically, long-press it → **Open with** → **Chrome** (or any browser)
6. The simulator loads and works fully from local storage

**Install as an App (PWA):**
After opening in Chrome over HTTP (using the Python server method):
1. Tap the three-dot menu in Chrome
2. Tap **Add to Home screen**
3. Tap **Add**
4. The Azure Simulator appears as an app icon on your home screen
5. It opens full-screen and works offline

---

## 📚 Structured Learning Path (13 Modules)

Access the Learning Path from the **📘 Learning Path** button in the sidebar. Progress is saved automatically.

| Module | Topic | Target Exam | Steps |
|---|---|---|---|
| 1 | ☁️ Azure Fundamentals | AZ-900 | 6 steps |
| 2 | 🖥️ Virtual Machines | AZ-900, AZ-104 | 6 steps |
| 3 | 💾 Storage & Data Lake | AZ-900, DP-900 | 6 steps |
| 4 | 🤖 Azure ML Studio | DP-100 | 8 steps |
| 5 | 🔷 Azure Databricks | DP-100, DP-203 | 7 steps |
| 6 | 📊 Synapse Analytics | DP-203, DP-900 | 6 steps |
| 7 | 🔄 Data Factory & Pipelines | DP-203 | 6 steps |
| 8 | 🔐 Security & Identity | AZ-500, AZ-900 | 7 steps |
| 9 | 🚀 DevOps & CI/CD for ML | AZ-400, DP-100 | 7 steps |
| 10 | 💰 Cost Optimisation | AZ-900, AZ-104 | 7 steps |
| 11 | 🏗️ Infrastructure as Code | AZ-104, AZ-400 | 7 steps |
| 12 | 📨 Messaging & Integration | DP-203 | 8 steps |
| 13 | 🏛️ Architecture Patterns | All | 7 steps |

### Recommended Certification Path for Data Scientists

```
Start Here
    ↓
AZ-900 (Azure Fundamentals) — FREE exam voucher via Microsoft Learn
    ↓
DP-900 (Data Fundamentals) — FREE exam voucher available
    ↓
AI-900 (AI Fundamentals) — Good foundation for ML work
    ↓
AZ-104 (Azure Administrator) — Understand the infrastructure you work on
    ↓
DP-100 (Azure Data Scientist Associate) — Your primary professional target
    ↓
DP-203 (Azure Data Engineer Associate) — For end-to-end pipeline work
```

**Free Study Resources:**
- [Microsoft Learn](https://learn.microsoft.com) — Official free learning paths and sandbox labs
- [Azure for Students](https://azure.microsoft.com/en-us/free/students/) — $100 credit, no credit card required
- [Azure Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/) — Reference architectures
- [AZ-900 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/)
- [DP-100 Study Guide](https://learn.microsoft.com/en-us/credentials/certifications/azure-data-scientist/)
- [Free AZ-900 Exam Voucher](https://learn.microsoft.com/en-us/training/courses/az-900t00) — Complete the learning path to get a free exam voucher

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl` / `Cmd` + `K` | Focus the global search bar |
| `Ctrl` / `Cmd` + `` ` `` | Toggle the Cloud Shell terminal open/closed |
| `Ctrl` / `Cmd` + `D` | Toggle dark mode / light mode |
| `Escape` | Close any open modal, quiz session, or side panel |

---

## 💻 Cloud Shell Simulator

Click the `>_` icon in the topbar to open the Cloud Shell. Supports Bash and PowerShell modes.

### Shell Commands
```bash
help              # Show all available commands
clear / cls       # Clear the terminal output
whoami            # Print: adewale
pwd               # Print: /home/adewale
ls                # List working directory files
cat <filename>    # Show file contents (README.md, requirements.txt, config.yaml)
mkdir <name>      # Simulate creating a directory
date              # Show current date and time
echo <text>       # Print text to terminal
history           # Show command history
exit              # Close the Cloud Shell
```

### Azure CLI Commands
```bash
# Account
az account list                                      # List subscriptions
az account show                                      # Show current subscription
az --version                                         # Show Azure CLI version

# Resource Groups
az group list                                        # List all resource groups
az group create -n <name> -l <location>              # Create a resource group

# Virtual Machines
az vm list                                           # List all VMs
az vm start -n <vm-name> -g <resource-group>         # Start a VM
az vm stop -n <vm-name> -g <resource-group>          # Stop a VM
az vm create ...                                     # Simulate creating a VM

# Storage
az storage account list                              # List storage accounts

# Key Vault
az keyvault list                                     # List key vaults
az keyvault secret list --vault-name <name>          # List secrets in a vault

# Machine Learning
az ml workspace list                                 # List ML workspaces

# Networking
az network vnet list                                 # List virtual networks
az network vnet subnet list                          # List subnets

# Functions
az functionapp list                                  # List function apps

# DevOps
az devops project list                               # List DevOps projects

# Monitoring
az monitor metrics list                              # Show resource metrics

# Service Bus (NEW in v2.0)
az servicebus namespace list                         # List namespaces
az servicebus queue list --namespace-name <name>     # List queues

# Advisor (NEW in v2.0)
az advisor recommendation list                       # List recommendations

# Stream Analytics (NEW in v2.0)
az stream-analytics job list                         # List jobs

# API Management (NEW in v2.0)
az apim api list --service-name <name> -g <rg>       # List APIs
```

---

## 🗺️ Roadmap

### ✅ Completed in v1.0
- Full Azure Portal layout, sidebar, topbar, breadcrumbs, notifications
- 30+ Azure service pages with plain-English explanations
- Cloud Shell with Azure CLI simulation
- 10-module structured learning path
- Resource Groups full CRUD, All Resources, Subscriptions pages
- Responsive mobile/tablet design

### ✅ Completed in v2.0
- Dark mode (full portal, persisted, `Ctrl+D` shortcut)
- Exam Quiz (AZ-900, DP-900, DP-100, AZ-104 — 31 questions, no AI API)
- ARM Template Builder (9 resource types, real JSON, download)
- Activity Log (all actions tracked, filterable, persisted)
- What-If Cost Estimator (real Azure pricing, live calculations)
- Session persistence (localStorage, auto-save, export/import)
- PWA + Service Worker (offline support, installable on Android)
- Service Bus, API Management, Stream Analytics pages
- Azure Advisor (8 recommendations across 5 categories)
- Architecture Diagram Builder (24 components, drag-and-drop)
- Keyboard shortcuts system
- 3 new learning modules (11, 12, 13)
- Terminal: 4 new service CLI commands

### 🔜 Planned for v2.1
- More quiz questions (50+ per exam bank)
- Azure Policy simulator
- Bicep template viewer alongside ARM output
- Power BI Embedded dashboard mock
- Multi-language support (Yoruba, Hausa, French, Igbo)
- Printable learning progress certificate

### 🔜 Planned for v3.0
- Scenario-based guided labs with validation
- Share architecture diagrams via URL
- Azure CLI practice sandbox with command validation
- Microsoft Learn integration for course tracking

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-new-feature`
3. Make your changes (see [CONTRIBUTING.md](CONTRIBUTING.md) for coding standards)
4. Commit: `git commit -m "feat: add my new feature"`
5. Push: `git push origin feature/my-new-feature`
6. Open a Pull Request on GitHub

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

---

## 👨‍💻 Author

<div align="center">

### **Adewale Samson Adeagbo**

*Data Scientist · EdTech Builder · Virtual Tutor · AI-Augmented Solutions Developer*

| | |
|---|---|
| 🌍 **Location** | Nigeria |
| 💼 **Roles** | Data Scientist, EdTech Builder, Virtual Tutor, AI-Augmented Solutions Developer |
| 🎓 **Learning** | Azure Cloud (AZ-900 → DP-100 path), MLOps, Data Engineering |
| 🖥️ **Primary Device** | itel Vista Tab 30s (built this entire project on it) |
| 🐙 **GitHub** | [@cssadewale](https://github.com/cssadewale) |
| 💼 **LinkedIn** | [adewalesamsonadeagbo](https://linkedin.com/in/adewalesamsonadeagbo) |
| 🌐 **Website** | [cssadewale.pages.dev](https://cssadewale.pages.dev) |
| 📧 **Email** | adewale@cssadewale.dev |
| 📞 **Phone** | +234 810 086 6322 / +234 809 448 1488 |

</div>

### About the Author

Adewale Samson Adeagbo is a self-driven Data Scientist and EdTech Builder based in Nigeria who builds AI-augmented tools and educational platforms to democratise access to technology education. He specialises in machine learning, data science, and cloud computing, with a strong focus on making Azure and AI skills accessible to learners across Africa and beyond.

This simulator was born out of a personal need: Adewale wanted to deeply understand Azure's ecosystem to advance his data science career, but the real Azure portal posed credit risks and required reliable internet. He built the simulator from scratch — on an itel Vista Tab 30s — so that any learner anywhere, regardless of device quality or internet reliability, could learn Azure confidently and freely.

As a Virtual Tutor and EdTech Builder, Adewale channels his experience into educational tools that others can use to bridge the gap between aspiration and ability. This project is one such tool — free, open source, and built with care for the community.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

```
MIT License — Copyright (c) 2024 Adewale Samson Adeagbo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.
```

---

## ⚠️ Disclaimer

This is an **independent educational simulator** and is not affiliated with, endorsed by, or connected to Microsoft Corporation in any way. "Azure", "Microsoft Azure", and all Azure service names and logos are trademarks of Microsoft Corporation. This project exists purely for educational purposes and contains no real Microsoft code, data, or intellectual property.

---

<div align="center">

**Built with ❤️ in Nigeria by Adewale Samson Adeagbo**

*"The best way to learn cloud is to use cloud — even when you can't."*

[⭐ Star this repo](https://github.com/cssadewale/azure-simulator) · [🐛 Report a Bug](https://github.com/cssadewale/azure-simulator/issues) · [💡 Request a Feature](https://github.com/cssadewale/azure-simulator/issues)

[![GitHub stars](https://img.shields.io/github/stars/cssadewale/azure-simulator?style=social)](https://github.com/cssadewale/azure-simulator)
[![GitHub forks](https://img.shields.io/github/forks/cssadewale/azure-simulator?style=social)](https://github.com/cssadewale/azure-simulator)

</div>
