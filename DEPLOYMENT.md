# 🚀 Azure Learning Simulator — Deployment Guide

**Author:** Adewale Samson Adeagbo  
**GitHub:** [@cssadewale](https://github.com/cssadewale)  
**Website:** [cssadewale.pages.dev](https://cssadewale.pages.dev)

This guide covers every deployment method in full detail. Choose the one that matches your situation.

---

## 📋 Before You Start — Prerequisites Checklist

Before deploying, confirm you have the following:

- [ ] All project files downloaded to your device (via `git clone` or ZIP download)
- [ ] The `index.html` file is in the root of your project folder
- [ ] A GitHub account (free) at [github.com](https://github.com) — for Methods 1, 2, 3, 4
- [ ] Git installed on your device — check with `git --version` in terminal
- [ ] A modern browser (Chrome, Firefox, Edge, Samsung Internet)

---

## Method 1 — GitHub Pages (FREE · Recommended · Auto-Deploy)

**Best for:** Permanent public URL, automatic redeploy on push, zero configuration.

**Cost:** Free forever on public repositories.

**Result URL:** `https://cssadewale.github.io/azure-simulator`

---

### Step 1 — Install Git (if not installed)

**On Windows:**
1. Go to [git-scm.com/download/win](https://git-scm.com/download/win)
2. Download and run the installer with all default settings
3. Open **Git Bash** (now installed) and verify: `git --version`

**On Android (itel Vista Tab 30s):**
1. Install **Termux** from F-Droid (not Google Play — the Play version is outdated)
2. Open Termux and run:
   ```bash
   pkg update && pkg upgrade
   pkg install git
   git --version
   ```

**On Linux:**
```bash
sudo apt-get update && sudo apt-get install git
git --version
```

**On Mac:**
```bash
xcode-select --install
git --version
```

---

### Step 2 — Configure Git (First Time Only)

Open your terminal and run these two commands. Replace the values with your details:

```bash
git config --global user.name "Adewale Samson Adeagbo"
git config --global user.email "adewale@cssadewale.dev"
```

Verify the configuration:
```bash
git config --list
```

You should see `user.name` and `user.email` in the output.

---

### Step 3 — Create the GitHub Repository

1. Open [github.com/new](https://github.com/new) in your browser
2. Log in to your GitHub account (`cssadewale`)
3. Fill in the form exactly as follows:

   | Field | Value |
   |---|---|
   | Repository name | `azure-simulator` |
   | Description | Azure Learning Simulator — Interactive Azure Portal replica by Adewale Samson Adeagbo |
   | Visibility | **Public** (required for free GitHub Pages) |
   | Initialize with README | **Leave UNTICKED** |
   | Add .gitignore | **Leave UNTICKED** |
   | Choose a license | **Leave as None** |

4. Click the green **Create repository** button
5. You will see a page titled "Quick setup". Leave it open — you need the repository URL shown there.

---

### Step 4 — Create a Personal Access Token (PAT)

GitHub no longer accepts your account password for pushing code. You need a Personal Access Token (PAT):

1. Click your profile photo (top-right of GitHub) → **Settings**
2. Scroll to the bottom of the left sidebar → click **Developer settings**
3. Click **Personal access tokens** → **Tokens (classic)**
4. Click **Generate new token** → **Generate new token (classic)**
5. Fill in:
   - **Note:** `azure-simulator-deploy`
   - **Expiration:** 90 days (or No expiration for convenience)
   - **Scopes:** Tick **repo** (this covers all repository permissions)
6. Click **Generate token**
7. **IMPORTANT:** Copy the token immediately. It starts with `ghp_`. You will never see it again.
8. Save it somewhere safe (e.g., your Notes app or a password manager)

---

### Step 5 — Push Your Code to GitHub

Open a terminal in your `azure-simulator` project folder and run these commands **one at a time**, waiting for each to complete:

```bash
# 1. Initialise git in the project folder
git init

# 2. Stage all files for the first commit
git add .

# 3. Verify what will be committed (optional but recommended)
git status

# 4. Create the first commit
git commit -m "feat: Azure Learning Simulator v2.0

By Adewale Samson Adeagbo (@cssadewale)
- Full Azure Portal replica with 35+ service pages
- Dark mode, Exam Quiz, ARM Builder, Activity Log
- What-If Cost Estimator, Session Persistence, PWA offline
- 13-module learning path (AZ-900 to DP-100)
- Cloud Shell with Azure CLI simulator
- Service Bus, API Mgmt, Stream Analytics, Advisor pages"

# 5. Rename the branch to 'main'
git branch -M main

# 6. Add your GitHub repository as the remote origin
git remote add origin https://github.com/cssadewale/azure-simulator.git

# 7. Push all files to GitHub
git push -u origin main
```

**When prompted for credentials:**
- Username: `cssadewale`
- Password: paste your Personal Access Token (the `ghp_...` token from Step 4)

If the push succeeds, you will see something like:
```
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

### Step 6 — Enable GitHub Pages

1. Go to `https://github.com/cssadewale/azure-simulator` in your browser
2. Click the **Settings** tab (gear icon, near the top of the page)
3. In the left sidebar, scroll down and click **Pages**
4. Under **Build and deployment**:
   - **Source:** Click the dropdown and select **Deploy from a branch**
   - **Branch:** Click the dropdown and select **main**
   - **Folder:** Click the dropdown and select **/ (root)**
5. Click **Save**
6. A blue banner appears: `GitHub Pages source saved`

---

### Step 7 — Wait for Deployment

1. Stay on the Pages settings page and **refresh after 2 minutes**
2. A green banner will appear saying: `Your site is live at https://cssadewale.github.io/azure-simulator`
3. Click the URL to open your live simulator

If you do not see the green banner after 5 minutes:
- Click the **Actions** tab in your repository
- Look for a workflow run called `pages-build-deployment`
- If it shows a red ✕, click it to see the error details

---

### Step 8 — Verify Everything Works

Open `https://cssadewale.github.io/azure-simulator` and verify:

- [ ] The Azure Portal dashboard loads
- [ ] The sidebar shows all service categories
- [ ] Clicking a service (e.g., Virtual Machines) loads the page
- [ ] Cloud Shell opens with the `>_` button
- [ ] Dark mode toggles with the 🌙 button
- [ ] The 🎯 Exam Quiz button opens the quiz menu
- [ ] Global search (`Ctrl+K`) finds services

---

### Step 9 — Future Updates (Deploy Changes)

Every time you edit files and want to update the live site:

```bash
# Inside the azure-simulator folder:
git add .
git commit -m "describe what you changed"
git push
```

GitHub Pages automatically rebuilds and redeploys within 1–2 minutes. No manual steps needed.

---

## Method 2 — Netlify (FREE · Drag & Drop · No CLI Needed)

**Best for:** Fastest deployment if you don't want to use the command line.

**Cost:** Free on the Starter plan.

**Result URL:** `https://azure-simulator-adewale.netlify.app` (after renaming)

### Option A — Drag and Drop (No Terminal, No Git)

1. Create a free account at [netlify.com](https://netlify.com)
2. Log in and go to your **dashboard**
3. At the bottom of the page you will see: `"Want to deploy a new site without connecting to Git? Drag and drop your site output folder here"`
4. Open your device's file manager
5. Navigate to where you saved the `azure-simulator` folder
6. Drag the entire `azure-simulator` folder onto the Netlify dashboard drop zone
7. Netlify deploys in approximately 10 seconds
8. You receive a random URL like `https://graceful-flower-abc123.netlify.app`

**Rename your site:**
1. Click **Site configuration** (or **Site settings**)
2. Click **Change site name**
3. Type: `azure-simulator-adewale`
4. Click **Save**
5. Your URL is now: `https://azure-simulator-adewale.netlify.app`

### Option B — Connect GitHub for Auto-Deploy

1. Log in to [netlify.com](https://netlify.com)
2. Click **Add new site** → **Import an existing project**
3. Click **Deploy with GitHub**
4. Click **Authorize Netlify** — this lets Netlify read your GitHub repositories
5. In the search box, type `azure-simulator` and select it
6. Configure build settings:
   - **Branch to deploy:** `main`
   - **Base directory:** *(leave completely empty)*
   - **Build command:** *(leave completely empty — no build step needed)*
   - **Publish directory:** `.` (type a single dot)
7. Click **Deploy site**
8. The first deployment takes about 30 seconds

Every future `git push` to GitHub automatically triggers a new Netlify deployment.

---

## Method 3 — Vercel (FREE · Fast Global CDN)

**Best for:** Fast global delivery with a clean URL.

**Cost:** Free on the Hobby plan.

**Result URL:** `https://azure-simulator-cssadewale.vercel.app`

### Using Vercel CLI

```bash
# Step 1: Install Vercel CLI globally
npm install -g vercel

# Step 2: Navigate into your project folder
cd azure-simulator

# Step 3: Deploy
vercel

# Step 4: Answer the interactive prompts:
# Set up and deploy "~/azure-simulator"? → press Y, then Enter
# Which scope do you want to deploy to? → select your username, press Enter
# Link to existing project? → N, then Enter
# What's your project's name? → type: azure-simulator, press Enter
# In which directory is your code located? → press Enter (accepts ./ default)
# Want to modify these settings? → N, then Enter
# Deploying...
# ✓ Production: https://azure-simulator-cssadewale.vercel.app
```

For all future deployments:
```bash
vercel --prod
```

---

## Method 4 — Azure Static Web Apps (FREE · Real Azure · Best for Learning)

This deploys your Azure simulator onto actual Azure infrastructure. Using real Azure to host a simulator of Azure is the ultimate hands-on learning experience.

**Cost:** Free on the Free plan (the only plan you need for this project).

**Prerequisites:**
- An Azure account — sign up at [azure.microsoft.com/free/students](https://azure.microsoft.com/en-us/free/students/) with your university email for $100 free credit

---

### Step 1 — Sign In to the Real Azure Portal

1. Go to [portal.azure.com](https://portal.azure.com)
2. Sign in with your Microsoft account (or student email)

---

### Step 2 — Create a Static Web App

1. In the top search bar, type **Static Web Apps** and click it
2. Click **+ Create**
3. Fill in the **Basics** tab:

   | Field | Value |
   |---|---|
   | Subscription | Azure for Students |
   | Resource Group | `rg-data-science-lab` (click "Create new" if it doesn't exist) |
   | Name | `azure-simulator-adewale` |
   | Plan type | **Free** |
   | Region | **East US 2** (or **South Africa North** — closer to Nigeria, lower latency) |

---

### Step 3 — Connect to GitHub

1. Under **Deployment details**, select **Source: GitHub**
2. Click **Sign in with GitHub** — a popup asks you to authorise Azure
3. Click **Authorize AzureAppService** in the popup
4. Back in the form:
   - **Organization:** `cssadewale`
   - **Repository:** `azure-simulator`
   - **Branch:** `main`

---

### Step 4 — Configure Build Settings

Click the **Build** tab:

| Field | Value |
|---|---|
| Build preset | **Custom** |
| App location | `/` |
| Api location | *(leave completely empty)* |
| Output location | *(leave completely empty)* |

---

### Step 5 — Review and Create

1. Click **Review + Create**
2. Review the summary — confirm Plan type is **Free**
3. Click **Create**
4. Azure shows "Deployment is in progress..." — this takes about 1 minute

---

### Step 6 — Monitor the GitHub Actions Deployment

Azure automatically creates a GitHub Actions workflow file in your repository. To watch the deployment:

1. Go to `https://github.com/cssadewale/azure-simulator`
2. Click the **Actions** tab
3. You will see a workflow run called `Azure Static Web Apps CI/CD`
4. Click it to see the live deployment logs
5. When you see a green ✓, the deployment is complete (usually 2–3 minutes)

---

### Step 7 — Get Your Live URL

1. Go back to the Azure Portal
2. Navigate to your Static Web App resource (`azure-simulator-adewale`)
3. On the **Overview** tab, find **URL**
4. It looks like: `https://gentle-river-abc123.azurestaticapps.net`
5. Click it to open your live simulator

---

## Method 5 — Android Device (Local, No Internet Required)

**Best for:** Learning on an itel Vista Tab 30s or any Android device without deployment.

### Option A — From Cloned Repository

```bash
# In Termux on Android:
pkg install git
git clone https://github.com/cssadewale/azure-simulator.git
cd azure-simulator
python3 -m http.server 8080
```

Then open Chrome and go to `http://localhost:8080`

### Option B — From ZIP Download

1. On your Android device, go to `https://github.com/cssadewale/azure-simulator`
2. Click **Code** → **Download ZIP**
3. Wait for the download to complete
4. Open your file manager → navigate to Downloads
5. Tap the ZIP file → Extract (or Extract here)
6. Open the extracted folder → tap `index.html`
7. Chrome opens the simulator from local storage

### Option C — Install as PWA (Works Offline After Setup)

After opening the simulator in Chrome (via localhost or GitHub Pages):

1. Tap the three-dot menu (⋮) in Chrome → top right
2. Tap **Add to Home screen**
3. Tap **Add** in the confirmation dialog
4. The Azure Simulator icon appears on your home screen
5. Open it — it runs in full-screen mode like a native app
6. **It now works completely offline** — no internet connection needed

---

## 🔄 Keeping Your Deployment Updated

### After Making Code Changes

```bash
# Inside the azure-simulator folder:
git add .
git commit -m "fix: describe what you changed"
git push
```

- **GitHub Pages:** Auto-redeploys within 1–2 minutes
- **Netlify (GitHub connected):** Auto-redeploys within 30 seconds
- **Vercel (GitHub connected):** Auto-redeploys within 30 seconds
- **Azure Static Web Apps:** Auto-redeploys via GitHub Actions within 2–3 minutes

### Checking Deployment Status

| Platform | Where to Check |
|---|---|
| GitHub Pages | Repository → Settings → Pages |
| GitHub Pages | Repository → Actions tab → `pages-build-deployment` workflow |
| Netlify | Netlify dashboard → your site → Deploys tab |
| Vercel | Vercel dashboard → your project → Deployments |
| Azure Static Web Apps | Azure Portal → your resource → Overview → GitHub Actions link |

---

## 🐛 Troubleshooting Common Issues

### "404 Not Found" after GitHub Pages deployment

**Cause:** GitHub Pages is not yet enabled or the branch is wrong.

**Fix:**
1. Go to Settings → Pages
2. Confirm Source is `Deploy from a branch`, Branch is `main`, Folder is `/(root)`
3. Click Save
4. Wait 3 minutes and refresh

### "fatal: remote origin already exists" when running `git remote add`

**Fix:**
```bash
git remote remove origin
git remote add origin https://github.com/cssadewale/azure-simulator.git
git push -u origin main
```

### "Authentication failed" when pushing

**Cause:** Using your account password instead of a Personal Access Token.

**Fix:** Use the PAT you created in Step 4. If it expired, create a new one at GitHub → Settings → Developer settings → Personal access tokens.

### Service Worker not registering / Offline mode not working

**Cause:** Service Workers only work over HTTPS or `localhost`. The `file://` protocol does not support them.

**Fix:** Use a local server:
```bash
python3 -m http.server 8080
# Then open http://localhost:8080 (not file:///...)
```

### Dark mode not persisting across refreshes

**Cause:** The browser may have localStorage disabled.

**Fix:** In Chrome: Settings → Privacy and security → Cookies and other site data → Make sure "Block third-party cookies" is not set to block all cookies.

### Pages load slowly on first visit

**Cause:** On first visit, the Service Worker is caching all 51 files.

**Fix:** This is normal. After the first visit, every page loads instantly from the cache, even offline.

---

## 📞 Support

If you encounter any issue not covered here:

- **GitHub Issues:** [github.com/cssadewale/azure-simulator/issues](https://github.com/cssadewale/azure-simulator/issues)
- **LinkedIn:** [linkedin.com/in/adewalesamsonadeagbo](https://linkedin.com/in/adewalesamsonadeagbo)
- **WhatsApp:** +234 810 086 6322

---

*Built with ❤️ in Nigeria by Adewale Samson Adeagbo*
