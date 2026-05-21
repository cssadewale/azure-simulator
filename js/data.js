/* =====================================================
   DATA.JS — All simulated Azure resource data
   Author: Adewale Adeagbo | GitHub: cssadewale
   ===================================================== */

const AzureData = {
  user: {
    name: "Adewale Adeagbo",
    email: "adewale@cssadewale.dev",
    github: "cssadewale",
    role: "Data Scientist",
    tenant: "cssadewale.onmicrosoft.com",
    tenantId: "d8f2a1c3-4e5b-4789-9abc-def012345678",
    location: "Nigeria",
    joinedDate: "2024-01-15"
  },

  subscriptions: [
    {
      id: "sub-001",
      name: "Azure for Students",
      subscriptionId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      state: "Active",
      offerId: "MS-AZR-0170P",
      offerName: "Azure for Students",
      spendingLimit: "$100",
      budget: 100,
      spent: 0,
      resourceGroups: 3,
      resources: 12,
      region: "East US",
      type: "Free",
      createdDate: "2024-01-15"
    }
  ],

  resourceGroups: [
    {
      id: "rg-001",
      name: "rg-data-science-lab",
      subscription: "Azure for Students",
      region: "East US",
      resources: 5,
      tags: { environment: "dev", owner: "adewale", project: "data-science" },
      status: "Active",
      created: "2024-01-20"
    },
    {
      id: "rg-002",
      name: "rg-ml-experiments",
      subscription: "Azure for Students",
      region: "West Europe",
      resources: 4,
      tags: { environment: "dev", owner: "adewale", project: "ml" },
      status: "Active",
      created: "2024-02-10"
    },
    {
      id: "rg-003",
      name: "rg-networking-lab",
      subscription: "Azure for Students",
      region: "East US",
      resources: 3,
      tags: { environment: "test", owner: "adewale", project: "networking" },
      status: "Active",
      created: "2024-03-05"
    }
  ],

  virtualMachines: [
    {
      id: "vm-001",
      name: "ds-workstation-01",
      resourceGroup: "rg-data-science-lab",
      region: "East US",
      status: "Running",
      size: "Standard_D2s_v3",
      os: "Ubuntu 22.04 LTS",
      cpu: 2,
      ram: 8,
      disk: 64,
      publicIp: "20.121.45.12",
      privateIp: "10.0.1.4",
      image: "🐧",
      vnet: "vnet-data-science",
      subnet: "subnet-compute",
      cpuUsage: 34,
      memUsage: 62,
      diskUsage: 28,
      created: "2024-01-21",
      tags: { env: "dev", role: "workstation" }
    },
    {
      id: "vm-002",
      name: "ml-training-server",
      resourceGroup: "rg-ml-experiments",
      region: "West Europe",
      status: "Stopped",
      size: "Standard_NC6s_v3",
      os: "Ubuntu 20.04 LTS",
      cpu: 6,
      ram: 112,
      disk: 128,
      publicIp: "—",
      privateIp: "10.1.0.5",
      image: "🐧",
      vnet: "vnet-ml-lab",
      subnet: "subnet-gpu",
      cpuUsage: 0,
      memUsage: 0,
      diskUsage: 55,
      created: "2024-02-12",
      tags: { env: "dev", role: "training" }
    },
    {
      id: "vm-003",
      name: "windows-dev-box",
      resourceGroup: "rg-data-science-lab",
      region: "East US",
      status: "Running",
      size: "Standard_B2ms",
      os: "Windows Server 2022",
      cpu: 2,
      ram: 8,
      disk: 128,
      publicIp: "20.121.88.44",
      privateIp: "10.0.1.10",
      image: "🪟",
      vnet: "vnet-data-science",
      subnet: "subnet-compute",
      cpuUsage: 12,
      memUsage: 45,
      diskUsage: 72,
      created: "2024-03-01",
      tags: { env: "dev", role: "developer-box" }
    }
  ],

  appServices: [
    {
      id: "app-001",
      name: "adewale-ml-api",
      resourceGroup: "rg-ml-experiments",
      region: "East US",
      status: "Running",
      runtime: "Python 3.11",
      plan: "Free F1",
      url: "https://adewale-ml-api.azurewebsites.net",
      deployments: 8,
      requests: "1.2K / day",
      created: "2024-02-20"
    },
    {
      id: "app-002",
      name: "data-dashboard-app",
      resourceGroup: "rg-data-science-lab",
      region: "East US",
      status: "Running",
      runtime: "Node.js 18 LTS",
      plan: "Basic B1",
      url: "https://data-dashboard-app.azurewebsites.net",
      deployments: 15,
      requests: "3.4K / day",
      created: "2024-01-25"
    }
  ],

  functions: [
    {
      id: "fn-001",
      name: "data-preprocessing-fn",
      resourceGroup: "rg-data-science-lab",
      region: "East US",
      runtime: "Python 3.10",
      trigger: "HTTP Trigger",
      status: "Active",
      executions: "45.2K / month",
      avgDuration: "1.2s",
      errors: "0.1%",
      created: "2024-02-01"
    },
    {
      id: "fn-002",
      name: "model-inference-trigger",
      resourceGroup: "rg-ml-experiments",
      region: "West Europe",
      runtime: "Python 3.10",
      trigger: "Timer Trigger",
      status: "Active",
      executions: "8.7K / month",
      avgDuration: "4.3s",
      errors: "0.0%",
      created: "2024-02-28"
    }
  ],

  storageAccounts: [
    {
      id: "st-001",
      name: "adewalemlstorage",
      resourceGroup: "rg-ml-experiments",
      region: "East US",
      type: "StorageV2",
      replication: "LRS",
      tier: "Standard",
      status: "Active",
      usedGB: 24.7,
      capacity: 5120,
      containers: ["raw-data", "processed-data", "models", "outputs"],
      accessTier: "Hot",
      created: "2024-01-22"
    },
    {
      id: "st-002",
      name: "datasciencefiles01",
      resourceGroup: "rg-data-science-lab",
      region: "East US",
      type: "StorageV2",
      replication: "GRS",
      tier: "Standard",
      status: "Active",
      usedGB: 8.3,
      capacity: 5120,
      containers: ["notebooks", "datasets", "experiments"],
      accessTier: "Cool",
      created: "2024-01-23"
    }
  ],

  sqlDatabases: [
    {
      id: "sql-001",
      name: "experiments-db",
      server: "adewale-sql-server.database.windows.net",
      resourceGroup: "rg-ml-experiments",
      region: "East US",
      tier: "Basic",
      status: "Online",
      size: "2 GB",
      usedMB: 312,
      maxGB: 2,
      connections: 4,
      created: "2024-02-15"
    }
  ],

  cosmosDb: [
    {
      id: "cosmos-001",
      name: "adewale-cosmos",
      api: "Core (SQL)",
      resourceGroup: "rg-data-science-lab",
      region: "East US",
      status: "Running",
      databases: ["MetricsDB", "LogsDB"],
      containers: 5,
      throughput: "400 RU/s",
      replication: "Single region",
      created: "2024-03-10"
    }
  ],

  synapseWorkspaces: [
    {
      id: "syn-001",
      name: "adewale-synapse",
      resourceGroup: "rg-data-science-lab",
      region: "East US",
      status: "Online",
      sqlPools: 1,
      sparkPools: 1,
      pipelines: 3,
      linkedServices: 4,
      created: "2024-02-01",
      sqlEndpoint: "adewale-synapse.sql.azuresynapse.net",
      devEndpoint: "https://web.azuresynapse.net?workspace=adewale-synapse"
    }
  ],

  databricks: [
    {
      id: "dbr-001",
      name: "adewale-databricks",
      resourceGroup: "rg-ml-experiments",
      region: "West Europe",
      status: "Active",
      tier: "Standard",
      clusters: 2,
      notebooks: 12,
      jobs: 5,
      url: "https://adb-1234567890.azuredatabricks.net",
      created: "2024-02-05"
    }
  ],

  mlStudio: {
    workspaces: [
      {
        id: "mlws-001",
        name: "adewale-ml-workspace",
        resourceGroup: "rg-ml-experiments",
        region: "East US",
        status: "Active",
        experiments: 8,
        models: 5,
        endpoints: 2,
        computes: ["cpu-cluster-sm", "gpu-cluster-nc6"],
        created: "2024-02-10"
      }
    ],
    experiments: [
      { id: "exp-001", name: "house-price-prediction", status: "Completed", runs: 24, bestAccuracy: "94.3%", algorithm: "XGBoost", duration: "1h 23m", created: "2024-02-15" },
      { id: "exp-002", name: "customer-churn-classifier", status: "Completed", runs: 18, bestAccuracy: "91.7%", algorithm: "Random Forest", duration: "42m", created: "2024-02-28" },
      { id: "exp-003", name: "time-series-sales", status: "Running", runs: 7, bestAccuracy: "88.1%", algorithm: "LSTM", duration: "28m (running)", created: "2024-03-12" },
      { id: "exp-004", name: "nlp-sentiment-analysis", status: "Draft", runs: 0, bestAccuracy: "—", algorithm: "BERT", duration: "—", created: "2024-03-15" }
    ],
    models: [
      { name: "house-price-v2", framework: "Scikit-learn", accuracy: "94.3%", size: "12 MB", deployed: true },
      { name: "churn-classifier-v1", framework: "Scikit-learn", accuracy: "91.7%", size: "8 MB", deployed: true },
      { name: "time-series-v1", framework: "TensorFlow", accuracy: "88.1%", size: "45 MB", deployed: false }
    ]
  },

  dataFactory: [
    {
      id: "adf-001",
      name: "adewale-data-factory",
      resourceGroup: "rg-data-science-lab",
      region: "East US",
      status: "Active",
      pipelines: [
        { name: "ingest-raw-data", status: "Succeeded", lastRun: "2h ago", duration: "4m 12s" },
        { name: "transform-features", status: "Succeeded", lastRun: "2h ago", duration: "1m 55s" },
        { name: "export-to-synapse", status: "Running", lastRun: "now", duration: "ongoing" },
        { name: "model-refresh", status: "Failed", lastRun: "6h ago", duration: "30s" }
      ],
      triggers: 5,
      linkedServices: 6,
      created: "2024-01-28"
    }
  ],

  eventHubs: [
    {
      id: "eh-001",
      name: "adewale-event-hub-ns",
      resourceGroup: "rg-data-science-lab",
      region: "East US",
      status: "Active",
      tier: "Basic",
      hubs: ["telemetry-stream", "model-predictions", "user-events"],
      throughput: 1,
      messageRetention: "1 day",
      created: "2024-03-01"
    }
  ],

  virtualNetworks: [
    {
      id: "vnet-001",
      name: "vnet-data-science",
      resourceGroup: "rg-data-science-lab",
      region: "East US",
      addressSpace: "10.0.0.0/16",
      subnets: [
        { name: "subnet-compute", range: "10.0.1.0/24", devices: 3 },
        { name: "subnet-data", range: "10.0.2.0/24", devices: 2 },
        { name: "AzureBastionSubnet", range: "10.0.3.0/27", devices: 0 }
      ],
      peerings: 1,
      dnsServers: ["Azure Default"],
      status: "Active",
      created: "2024-01-20"
    },
    {
      id: "vnet-002",
      name: "vnet-ml-lab",
      resourceGroup: "rg-ml-experiments",
      region: "West Europe",
      addressSpace: "10.1.0.0/16",
      subnets: [
        { name: "subnet-gpu", range: "10.1.0.0/24", devices: 1 },
        { name: "subnet-storage", range: "10.1.1.0/24", devices: 2 }
      ],
      peerings: 1,
      dnsServers: ["Azure Default"],
      status: "Active",
      created: "2024-02-10"
    }
  ],

  keyVaults: [
    {
      id: "kv-001",
      name: "adewale-key-vault",
      resourceGroup: "rg-data-science-lab",
      region: "East US",
      status: "Active",
      tier: "Standard",
      secrets: [
        { name: "storage-connection-string", type: "Secret", version: "v3", enabled: true, value: "DefaultEndpointsProtocol=https;AccountName=***" },
        { name: "sql-connection-string", type: "Secret", version: "v1", enabled: true, value: "Server=***;Database=experiments-db;User=***;Password=***" },
        { name: "databricks-token", type: "Secret", version: "v2", enabled: true, value: "dapi1234567890abcdef***" },
        { name: "cosmos-key", type: "Secret", version: "v1", enabled: true, value: "AbCd1234EfGh5678IjKl***==" }
      ],
      keys: [{ name: "data-encryption-key", type: "RSA-HSM", size: 2048, status: "Active" }],
      certificates: [],
      accessPolicies: ["adewale-service-principal"],
      created: "2024-01-22"
    }
  ],

  securityCenter: {
    secureScore: 72,
    maxScore: 100,
    recommendations: [
      { title: "Enable MFA for all accounts", severity: "High", status: "Open", resource: "Active Directory" },
      { title: "Apply system updates to VMs", severity: "Medium", status: "Open", resource: "ds-workstation-01" },
      { title: "Enable disk encryption", severity: "Medium", status: "Resolved", resource: "ml-training-server" },
      { title: "Restrict SSH port 22", severity: "High", status: "Open", resource: "ds-workstation-01" },
      { title: "Configure diagnostic logs", severity: "Low", status: "Open", resource: "adewale-synapse" }
    ],
    alerts: [
      { title: "Unusual sign-in location detected", severity: "Medium", time: "3h ago", status: "Active" },
      { title: "Brute-force attack on SSH", severity: "High", time: "6h ago", status: "Investigating" }
    ]
  },

  activeDirectory: {
    tenantName: "cssadewale",
    tenantId: "d8f2a1c3-4e5b-4789-9abc-def012345678",
    users: [
      { name: "Adewale Adeagbo", email: "adewale@cssadewale.dev", role: "Global Administrator", mfa: true, status: "Active" },
      { name: "ML Service Principal", email: "ml-svc@cssadewale.dev", role: "Contributor", mfa: false, status: "Active" },
      { name: "Databricks Service", email: "dbr-svc@cssadewale.dev", role: "Reader", mfa: false, status: "Active" }
    ],
    groups: ["Data Scientists", "Developers", "Service Principals"],
    apps: ["Azure ML SDK App", "Databricks SCIM App"]
  },

  devops: {
    organization: "cssadewale",
    projects: [
      {
        id: "proj-001",
        name: "DataSciencePipelines",
        description: "CI/CD for ML model training and deployment",
        repos: 3,
        pipelines: 4,
        boards: 2,
        lastActivity: "1h ago",
        visibility: "Private"
      }
    ],
    pipelines: [
      {
        id: "pipe-001",
        name: "model-training-pipeline",
        project: "DataSciencePipelines",
        stages: [
          { name: "Validate", status: "success", duration: "1m 02s" },
          { name: "Test", status: "success", duration: "3m 45s" },
          { name: "Train", status: "success", duration: "12m 30s" },
          { name: "Evaluate", status: "success", duration: "2m 11s" },
          { name: "Deploy", status: "running", duration: "ongoing" }
        ],
        trigger: "Git push",
        branch: "main",
        lastRun: "10m ago",
        status: "Running"
      },
      {
        id: "pipe-002",
        name: "data-ingestion-pipeline",
        project: "DataSciencePipelines",
        stages: [
          { name: "Lint", status: "success", duration: "22s" },
          { name: "Test", status: "success", duration: "1m 10s" },
          { name: "Deploy", status: "success", duration: "45s" }
        ],
        trigger: "Scheduled (daily 2AM)",
        branch: "main",
        lastRun: "8h ago",
        status: "Succeeded"
      }
    ],
    repos: [
      { name: "ml-models", language: "Python", branches: 5, commits: 142, lastCommit: "2h ago" },
      { name: "data-pipelines", language: "Python", branches: 3, commits: 87, lastCommit: "1d ago" },
      { name: "infrastructure-as-code", language: "Bicep/ARM", branches: 2, commits: 34, lastCommit: "4d ago" }
    ]
  },

  monitor: {
    alerts: [
      { name: "High CPU Alert", resource: "ds-workstation-01", condition: "CPU > 80%", status: "Active", severity: "Warning", fired: "Never" },
      { name: "Storage Capacity", resource: "adewalemlstorage", condition: "Used > 80%", status: "Active", severity: "Critical", fired: "Never" },
      { name: "Function Errors", resource: "data-preprocessing-fn", condition: "Error rate > 5%", status: "Active", severity: "Warning", fired: "Never" }
    ],
    metrics: {
      cpuUsage: [12, 23, 18, 34, 28, 45, 32, 40, 35, 28, 22, 19],
      memUsage: [55, 58, 60, 62, 59, 65, 63, 61, 58, 56, 55, 53],
      networkIn: [1.2, 2.3, 1.8, 3.4, 2.8, 4.5, 3.2, 4.0, 3.5, 2.8, 2.2, 1.9],
      networkOut: [0.5, 0.8, 0.6, 1.2, 0.9, 1.8, 1.1, 1.5, 1.2, 0.9, 0.7, 0.6]
    },
    workspaces: [
      { name: "adewale-log-workspace", resourceGroup: "rg-data-science-lab", region: "East US", retention: "30 days", dailyCapGB: 1, status: "Active" }
    ]
  },

  costManagement: {
    currentMonth: {
      total: 0.00,
      budget: 100,
      forecast: 0.00,
      breakdown: [
        { service: "Virtual Machines", cost: 0.00, color: "#0078D4" },
        { service: "Storage", cost: 0.00, color: "#00B4D8" },
        { service: "SQL Database", cost: 0.00, color: "#005A9E" },
        { service: "App Service", cost: 0.00, color: "#50E6FF" },
        { service: "Functions", cost: 0.00, color: "#2D7D9A" }
      ]
    },
    history: [0, 0, 0, 0, 0, 0],
    budgets: [{ name: "Monthly Limit", amount: 100, spent: 0, status: "On track" }]
  },

  regions: [
    "East US", "East US 2", "West US", "West US 2", "West US 3",
    "Central US", "North Central US", "South Central US",
    "North Europe", "West Europe", "UK South", "UK West",
    "Southeast Asia", "East Asia", "Japan East", "Japan West",
    "Australia East", "Australia Southeast",
    "South Africa North", "UAE North", "Brazil South"
  ],

  vmSizes: [
    { name: "Standard_B1s", cpu: 1, ram: 1, desc: "Burstable, 1 vCPU, 1 GB RAM — Dev/Test" },
    { name: "Standard_B2ms", cpu: 2, ram: 8, desc: "Burstable, 2 vCPUs, 8 GB RAM — General" },
    { name: "Standard_D2s_v3", cpu: 2, ram: 8, desc: "General Purpose, 2 vCPUs, 8 GB RAM" },
    { name: "Standard_D4s_v3", cpu: 4, ram: 16, desc: "General Purpose, 4 vCPUs, 16 GB RAM" },
    { name: "Standard_D8s_v3", cpu: 8, ram: 32, desc: "General Purpose, 8 vCPUs, 32 GB RAM" },
    { name: "Standard_NC6s_v3", cpu: 6, ram: 112, desc: "GPU, 6 vCPUs, 112 GB RAM, V100 GPU" },
    { name: "Standard_NC12s_v3", cpu: 12, ram: 224, desc: "GPU, 12 vCPUs, 224 GB RAM, 2× V100" },
    { name: "Standard_E4s_v3", cpu: 4, ram: 32, desc: "Memory Optimized, 4 vCPUs, 32 GB RAM" },
    { name: "Standard_F8s_v2", cpu: 8, ram: 16, desc: "Compute Optimized, 8 vCPUs, 16 GB RAM" }
  ],

  notifications: [
    { id: 1, title: "ML Training Complete", message: "Experiment 'house-price-prediction' completed with 94.3% accuracy.", type: "success", time: "15 min ago" },
    { id: 2, title: "Security Alert", message: "Unusual sign-in location detected for your account.", type: "warning", time: "3 hours ago" },
    { id: 3, title: "Pipeline Failed", message: "model-refresh pipeline failed. Check logs for details.", type: "error", time: "6 hours ago" }
  ]
};

// Helper to generate a fake GUID
function newGuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// Helper to get today's date string
function todayStr() {
  return new Date().toISOString().split('T')[0];
}
