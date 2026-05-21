/* =====================================================
   LEARNING.JS — Learning Path Panel
   ===================================================== */

const LearningModules = [
  {
    title: '🌤️ Module 1: Azure Fundamentals (AZ-900)',
    progress: 0,
    steps: [
      { text: 'Understand Cloud Computing — What is IaaS, PaaS, SaaS?', done: false },
      { text: 'Explore the Azure Portal and navigate the sidebar', done: false },
      { text: 'Create your first Resource Group', done: false },
      { text: 'Understand Subscriptions and billing', done: false },
      { text: 'Learn the difference between Regions and Availability Zones', done: false },
      { text: 'Explore Azure Pricing Calculator', done: false }
    ],
    description: 'Start here if you are completely new to Azure. Covers the core concepts needed for the AZ-900 exam.'
  },
  {
    title: '🖥️ Module 2: Compute — Virtual Machines',
    progress: 0,
    steps: [
      { text: 'Create a Linux VM (Ubuntu 22.04) in East US', done: false },
      { text: 'Connect via SSH from Cloud Shell', done: false },
      { text: 'Install Python and Jupyter on the VM', done: false },
      { text: 'Stop the VM to save credits', done: false },
      { text: 'Understand VM sizes: B-series (cheap) vs NC-series (GPU)', done: false },
      { text: 'Set up auto-shutdown to prevent forgotten VMs running overnight', done: false }
    ],
    description: 'Learn to create and manage Azure Virtual Machines — the foundational compute service.'
  },
  {
    title: '💾 Module 3: Storage — Blob & Data Lake',
    progress: 0,
    steps: [
      { text: 'Create a Storage Account with LRS replication', done: false },
      { text: 'Create a Blob container called "datasets"', done: false },
      { text: 'Upload a CSV dataset using the portal', done: false },
      { text: 'Access Blob Storage from Python using azure-storage-blob', done: false },
      { text: 'Understand Hot vs Cool vs Archive tiers', done: false },
      { text: 'Enable hierarchical namespace (ADLS Gen2) for big data', done: false }
    ],
    description: 'Master Azure Storage — the backbone of every data science pipeline in Azure.'
  },
  {
    title: '🤖 Module 4: Azure Machine Learning',
    progress: 0,
    steps: [
      { text: 'Create an Azure ML Workspace', done: false },
      { text: 'Create a compute cluster (min_nodes=0 to save cost)', done: false },
      { text: 'Upload a dataset from Blob Storage', done: false },
      { text: 'Run a training script using azure-ai-ml SDK', done: false },
      { text: 'Compare experiment runs in the Studio UI', done: false },
      { text: 'Register the best model to Model Registry', done: false },
      { text: 'Deploy model as a real-time REST endpoint', done: false },
      { text: 'Test the endpoint with a Python POST request', done: false }
    ],
    description: 'The complete Azure ML workflow — from raw data to deployed REST API — the core skill for a data scientist on Azure.'
  },
  {
    title: '🔷 Module 5: Azure Databricks',
    progress: 0,
    steps: [
      { text: 'Create a Databricks workspace', done: false },
      { text: 'Create a small cluster (auto-terminate after 30 mins)', done: false },
      { text: 'Create a Python notebook and load data from ADLS', done: false },
      { text: 'Use PySpark to clean and transform data', done: false },
      { text: 'Write results to Delta Lake table', done: false },
      { text: 'Track ML experiments with MLflow', done: false },
      { text: 'Schedule a Databricks Job to run nightly', done: false }
    ],
    description: 'Learn Databricks — the industry-standard big data and ML platform used at top companies worldwide.'
  },
  {
    title: '📊 Module 6: Synapse Analytics',
    progress: 0,
    steps: [
      { text: 'Create a Synapse Workspace', done: false },
      { text: 'Link your ADLS Gen2 storage account', done: false },
      { text: 'Run a serverless SQL query on Parquet files', done: false },
      { text: 'Create a Spark pool and run a PySpark notebook', done: false },
      { text: 'Build a Data Pipeline to move data from source to lake', done: false },
      { text: 'Create a Power BI report linked to Synapse SQL', done: false }
    ],
    description: 'Synapse combines data warehousing, big data processing, and integration — the unified analytics platform.'
  },
  {
    title: '🔄 Module 7: Data Factory & Pipelines',
    progress: 0,
    steps: [
      { text: 'Create an Azure Data Factory instance', done: false },
      { text: 'Create a Linked Service to your Blob Storage', done: false },
      { text: 'Create a pipeline to copy data from HTTP source to Blob', done: false },
      { text: 'Add a data transformation using Mapping Data Flows', done: false },
      { text: 'Schedule the pipeline to run daily at 2AM', done: false },
      { text: 'Set up email alerts on pipeline failure', done: false }
    ],
    description: 'Build automated ETL pipelines to feed fresh data into your ML models.'
  },
  {
    title: '🔐 Module 8: Security & Identity',
    progress: 0,
    steps: [
      { text: 'Enable MFA on your Azure account', done: false },
      { text: 'Create a Key Vault and store your storage connection string', done: false },
      { text: 'Enable Managed Identity on your VM', done: false },
      { text: 'Grant the VM Managed Identity access to Key Vault', done: false },
      { text: 'Assign RBAC roles to your ML workspace users', done: false },
      { text: 'Review Security Center recommendations and fix high-severity ones', done: false },
      { text: 'Enable diagnostic logs for critical resources', done: false }
    ],
    description: 'Security is everyone\'s responsibility — learn to protect your Azure resources from day one.'
  },
  {
    title: '🚀 Module 9: DevOps & CI/CD for ML',
    progress: 0,
    steps: [
      { text: 'Create an Azure DevOps project', done: false },
      { text: 'Push your ML code to Azure Repos', done: false },
      { text: 'Create a Pipeline that runs tests on every commit', done: false },
      { text: 'Add a training stage to the pipeline', done: false },
      { text: 'Add a model evaluation gate (only deploy if accuracy > threshold)', done: false },
      { text: 'Deploy model to Azure ML endpoint on approval', done: false },
      { text: 'Set up rollback if new model underperforms', done: false }
    ],
    description: 'MLOps: automate the ML lifecycle with CI/CD so models are always up to date and reliable.'
  },
  {
    title: '💰 Module 10: Cost Optimisation',
    progress: 0,
    steps: [
      { text: 'Set a $50 budget alert on your subscription', done: false },
      { text: 'Review all running resources and stop unused ones', done: false },
      { text: 'Configure auto-shutdown on all VMs', done: false },
      { text: 'Set min_nodes=0 on all ML compute clusters', done: false },
      { text: 'Move infrequent Blob data to Cool tier', done: false },
      { text: 'Use the Azure Pricing Calculator to estimate future costs', done: false },
      { text: 'Tag all resources with project and owner for cost tracking', done: false }
    ],
    description: 'Master cost management to get the most out of your $100 student credit and avoid surprise charges.'
  },
  {
    title: '🏗️ Module 11: Infrastructure as Code (ARM & Bicep)',
    progress: 0,
    steps: [
      { text: 'Understand what ARM templates are and why IaC matters', done: false },
      { text: 'Use the ARM Builder to generate a template with a VM + Storage Account', done: false },
      { text: 'Deploy with: az deployment group create --template-file azuredeploy.json -g my-rg', done: false },
      { text: 'Learn Bicep syntax — the cleaner alternative to JSON ARM templates', done: false },
      { text: 'Add parameters and variables to make templates reusable', done: false },
      { text: 'Export an existing resource group as an ARM template from the portal', done: false },
      { text: 'Understand the difference between ARM templates, Bicep, and Terraform', done: false }
    ],
    description: 'IaC lets you version-control your Azure environment and deploy it consistently — essential for professional data science pipelines.'
  },
  {
    title: '📨 Module 12: Messaging & Integration',
    progress: 0,
    steps: [
      { text: 'Create an Azure Service Bus namespace (Basic tier)', done: false },
      { text: 'Create a queue called "ml-inference-jobs"', done: false },
      { text: 'Send a message from Python using the azure-servicebus SDK', done: false },
      { text: 'Receive and process messages from a queue', done: false },
      { text: 'Create a Service Bus Topic with two subscriptions', done: false },
      { text: 'Stream data into Event Hubs from Python', done: false },
      { text: 'Connect Event Hubs to Stream Analytics for real-time SQL processing', done: false }
    ],
    description: 'Messaging services decouple your ML models from callers, handle traffic bursts, and enable real-time streaming pipelines.'
  },
  {
    title: '🏛️ Module 13: Architecture Patterns',
    progress: 0,
    steps: [
      { text: 'Use the Architecture Diagram Builder to draw a data science pipeline', done: false },
      { text: 'Study the Lambda Architecture (batch + streaming layers)', done: false },
      { text: 'Study the Medallion Architecture (Bronze → Silver → Gold)', done: false },
      { text: 'Design an end-to-end ML architecture: Ingest → Store → Transform → Train → Serve', done: false },
      { text: 'Learn the Hub-and-Spoke network topology for enterprise Azure', done: false },
      { text: 'Study reference architectures on learn.microsoft.com/azure/architecture', done: false },
      { text: 'Draw your own architecture for your data science project', done: false }
    ],
    description: 'Architecture patterns are reusable solutions to common problems. Understanding them lets you design production-ready data science systems that scale.'
  }
];

function openLearningPath() {
  const panel = document.getElementById('learningPanel');
  panel.classList.toggle('open');
  renderLearningContent();
}

function closeLearningPath() {
  document.getElementById('learningPanel').classList.remove('open');
}

function renderLearningContent() {
  const content = document.getElementById('learningContent');
  content.innerHTML = `
    <div style="margin-bottom:16px">
      <div style="font-size:13px;color:#605e5c;line-height:1.6;margin-bottom:12px">
        Welcome, <strong>Adewale</strong>! This learning path takes you from Azure beginner to a proficient data scientist on Azure. Complete each module in order. Click any step to mark it complete.
      </div>
      <div style="display:flex;align-items:center;gap:8px;font-size:12px;color:#8a8886">
        <div class="progress-bar" style="flex:1">
          <div class="progress-fill" style="width:${getOverallProgress()}%"></div>
        </div>
        <span>${getOverallProgress()}% overall</span>
      </div>
    </div>
    ${LearningModules.map((mod, mi) => `
      <div class="learning-module">
        <div class="learning-module-header" onclick="toggleModule(${mi})">
          <span>${mod.title}</span>
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:11px;color:#8a8886">${mod.steps.filter(s=>s.done).length}/${mod.steps.length}</span>
            <span id="mod-arrow-${mi}">▼</span>
          </div>
        </div>
        <div class="module-progress">
          <div class="module-progress-fill" style="width:${mod.steps.filter(s=>s.done).length/mod.steps.length*100}%"></div>
        </div>
        <div class="learning-module-body" id="mod-body-${mi}">
          <div style="font-size:12px;color:#605e5c;margin-bottom:10px;line-height:1.5">${mod.description}</div>
          ${mod.steps.map((step, si) => `
            <div class="learning-step" onclick="toggleStep(${mi},${si})" style="cursor:pointer">
              <div style="width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;background:${step.done?'#107c10':'#f3f2f1'};color:${step.done?'white':'#8a8886'};border:2px solid ${step.done?'#107c10':'#e1dfdd'};margin-top:1px;transition:all 0.2s">
                ${step.done ? '✓' : si+1}
              </div>
              <span style="font-size:12px;line-height:1.5;${step.done?'text-decoration:line-through;color:#8a8886':''}">${step.text}</span>
            </div>
          `).join('')}
          <button class="btn btn-ghost btn-sm" style="margin-top:8px;width:100%" onclick="navigateTo('${getModulePage(mi)}');closeLearningPath()">
            → Open in Simulator
          </button>
        </div>
      </div>
    `).join('')}
  `;
}

function toggleModule(mi) {
  const body = document.getElementById(`mod-body-${mi}`);
  const arrow = document.getElementById(`mod-arrow-${mi}`);
  body.classList.toggle('open');
  if (arrow) arrow.textContent = body.classList.contains('open') ? '▲' : '▼';
}

function toggleStep(mi, si) {
  LearningModules[mi].steps[si].done = !LearningModules[mi].steps[si].done;
  const completed = LearningModules[mi].steps[si].done;
  if (completed) showToast(`Step completed! Keep going, Adewale! 🎉`, 'success');
  renderLearningContent();
  // Re-open the module that was open
  const body = document.getElementById(`mod-body-${mi}`);
  if (body) body.classList.add('open');
  const arrow = document.getElementById(`mod-arrow-${mi}`);
  if (arrow) arrow.textContent = '▲';
}

function getOverallProgress() {
  const total = LearningModules.reduce((a, m) => a + m.steps.length, 0);
  const done = LearningModules.reduce((a, m) => a + m.steps.filter(s => s.done).length, 0);
  return total > 0 ? Math.round(done / total * 100) : 0;
}

function getModulePage(mi) {
  const pages = ['dashboard', 'virtual-machines', 'storage-accounts', 'ml-studio', 'databricks', 'synapse', 'data-factory', 'security-center', 'devops', 'cost-management', 'architecture', 'service-bus', 'architecture'];
  return pages[mi] || 'dashboard';
}
