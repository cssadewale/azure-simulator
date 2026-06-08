/* =====================================================
   ARM-BUILDER.JS — Azure Resource Manager Template Builder
   Generates real, valid ARM JSON templates from the UI.

   What is an ARM Template?
   An ARM (Azure Resource Manager) template is a JSON file
   that declaratively defines what Azure resources to create.
   Instead of clicking through the portal each time, you
   write the template once and deploy it repeatedly —
   this is called Infrastructure as Code (IaC).
   ARM templates are the native Azure IaC format.
   Bicep is a newer, cleaner language that compiles to ARM.
   Terraform is a cross-cloud alternative.
   ===================================================== */

// Resources currently added to the ARM builder
let ARMResources = [];

const ARMTemplates = {
  vm: (name, region) => ({
    type: 'Microsoft.Compute/virtualMachines',
    apiVersion: '2023-03-01',
    name: name || 'myVM',
    location: region || '[resourceGroup().location]',
    properties: {
      hardwareProfile: { vmSize: 'Standard_B2ms' },
      storageProfile: {
        imageReference: {
          publisher: 'Canonical',
          offer: 'UbuntuServer',
          sku: '22_04-lts',
          version: 'latest'
        },
        osDisk: { createOption: 'FromImage', diskSizeGB: 64 }
      },
      osProfile: {
        computerName: name || 'myVM',
        adminUsername: 'azureuser',
        linuxConfiguration: { disablePasswordAuthentication: true }
      },
      networkProfile: {
        networkInterfaces: [{ id: '[resourceId(\'Microsoft.Network/networkInterfaces\', \'myNIC\')]' }]
      }
    }
  }),

  storage: (name, region) => ({
    type: 'Microsoft.Storage/storageAccounts',
    apiVersion: '2023-01-01',
    name: (name || 'mystorage').toLowerCase().replace(/[^a-z0-9]/g, ''),
    location: region || '[resourceGroup().location]',
    sku: { name: 'Standard_LRS' },
    kind: 'StorageV2',
    properties: {
      accessTier: 'Hot',
      allowBlobPublicAccess: false,
      supportsHttpsTrafficOnly: true,
      minimumTlsVersion: 'TLS1_2'
    }
  }),

  webapp: (name, region) => ({
    type: 'Microsoft.Web/sites',
    apiVersion: '2022-09-01',
    name: name || 'my-web-app',
    location: region || '[resourceGroup().location]',
    kind: 'app,linux',
    properties: {
      serverFarmId: '[resourceId(\'Microsoft.Web/serverfarms\', \'myAppServicePlan\')]',
      siteConfig: {
        linuxFxVersion: 'PYTHON|3.11',
        alwaysOn: false
      },
      httpsOnly: true
    }
  }),

  keyvault: (name, region) => ({
    type: 'Microsoft.KeyVault/vaults',
    apiVersion: '2023-02-01',
    name: name || 'my-key-vault',
    location: region || '[resourceGroup().location]',
    properties: {
      sku: { family: 'A', name: 'standard' },
      tenantId: '[subscription().tenantId]',
      enabledForDeployment: false,
      enabledForTemplateDeployment: true,
      enableSoftDelete: true,
      softDeleteRetentionInDays: 90,
      accessPolicies: []
    }
  }),

  vnet: (name, region) => ({
    type: 'Microsoft.Network/virtualNetworks',
    apiVersion: '2023-04-01',
    name: name || 'my-vnet',
    location: region || '[resourceGroup().location]',
    properties: {
      addressSpace: { addressPrefixes: ['10.0.0.0/16'] },
      subnets: [
        { name: 'default', properties: { addressPrefix: '10.0.0.0/24' } },
        { name: 'subnet-compute', properties: { addressPrefix: '10.0.1.0/24' } }
      ]
    }
  }),

  sqlserver: (name, region) => ({
    type: 'Microsoft.Sql/servers',
    apiVersion: '2022-11-01-preview',
    name: name || 'my-sql-server',
    location: region || '[resourceGroup().location]',
    properties: {
      administratorLogin: 'sqladmin',
      administratorLoginPassword: '[parameters(\'sqlAdminPassword\')]',
      version: '12.0',
      publicNetworkAccess: 'Disabled'
    }
  }),

  functionapp: (name, region) => ({
    type: 'Microsoft.Web/sites',
    apiVersion: '2022-09-01',
    name: name || 'my-function-app',
    location: region || '[resourceGroup().location]',
    kind: 'functionapp,linux',
    properties: {
      serverFarmId: '[resourceId(\'Microsoft.Web/serverfarms\', \'myFunctionPlan\')]',
      siteConfig: {
        linuxFxVersion: 'PYTHON|3.10',
        appSettings: [
          { name: 'FUNCTIONS_EXTENSION_VERSION', value: '~4' },
          { name: 'FUNCTIONS_WORKER_RUNTIME', value: 'python' }
        ]
      },
      httpsOnly: true
    }
  }),

  cosmos: (name, region) => ({
    type: 'Microsoft.DocumentDB/databaseAccounts',
    apiVersion: '2023-04-15',
    name: name || 'my-cosmos-db',
    location: region || '[resourceGroup().location]',
    kind: 'GlobalDocumentDB',
    properties: {
      databaseAccountOfferType: 'Standard',
      consistencyPolicy: { defaultConsistencyLevel: 'Session' },
      locations: [{ locationName: region || 'eastus', failoverPriority: 0 }],
      capabilities: [{ name: 'EnableServerless' }]
    }
  }),

  mlworkspace: (name, region) => ({
    type: 'Microsoft.MachineLearningServices/workspaces',
    apiVersion: '2023-06-01-preview',
    name: name || 'my-ml-workspace',
    location: region || '[resourceGroup().location]',
    identity: { type: 'SystemAssigned' },
    properties: {
      friendlyName: name || 'My ML Workspace',
      storageAccount: '[resourceId(\'Microsoft.Storage/storageAccounts\', \'mystorage\')]',
      keyVault: '[resourceId(\'Microsoft.KeyVault/vaults\', \'my-key-vault\')]',
      applicationInsights: '[resourceId(\'Microsoft.Insights/components\', \'my-app-insights\')]',
      publicNetworkAccess: 'Enabled'
    }
  })
};

function buildFullARMTemplate() {
  const template = {
    '$schema': 'https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#',
    contentVersion: '1.0.0.0',
    parameters: {
      location: {
        type: 'string',
        defaultValue: '[resourceGroup().location]',
        metadata: { description: 'Location for all resources' }
      }
    },
    variables: {},
    resources: ARMResources,
    outputs: {}
  };

  // Add parameter for SQL if present
  if (ARMResources.some(r => r.type === 'Microsoft.Sql/servers')) {
    template.parameters.sqlAdminPassword = {
      type: 'securestring',
      metadata: { description: 'SQL Server administrator password' }
    };
  }

  return template;
}

function openARMBuilder() {
  closeAllPanels();
  const panel = document.getElementById('armPanel');
  panel.classList.add('open');
  renderARMBuilder();
}

function closeARMBuilder() {
  document.getElementById('armPanel').classList.remove('open');
}

function renderARMBuilder() {
  const body = document.getElementById('armPanelBody');
  body.innerHTML = `
    <div class="info-box" style="margin-bottom:14px">
      <span>📘</span>
      <div><strong>ARM Template Builder</strong> — Click resources to add them to your template. The JSON output can be deployed directly via Azure CLI: <code>az deployment group create --template-file template.json -g my-rg</code></div>
    </div>

    <div style="font-size:12px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Add Resources</div>
    <div class="arm-resource-picker">
      ${[
        { key:'vm', icon:'🖥️', label:'Virtual Machine' },
        { key:'storage', icon:'💾', label:'Storage Account' },
        { key:'webapp', icon:'🌐', label:'Web App' },
        { key:'functionapp', icon:'⚡', label:'Function App' },
        { key:'keyvault', icon:'🔑', label:'Key Vault' },
        { key:'vnet', icon:'🕸️', label:'Virtual Network' },
        { key:'sqlserver', icon:'🗃️', label:'SQL Server' },
        { key:'cosmos', icon:'🌌', label:'Cosmos DB' },
        { key:'mlworkspace', icon:'🤖', label:'ML Workspace' }
      ].map(r => `
        <button class="arm-resource-btn" onclick="addARMResource('${r.key}')">
          <span>${r.icon}</span>${r.label}
        </button>
      `).join('')}
    </div>

    ${ARMResources.length > 0 ? `
      <div style="font-size:12px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin:14px 0 8px">
        Resources in Template (${ARMResources.length})
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px">
        ${ARMResources.map((r,i) => `
          <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:var(--card-bg);border:1px solid var(--card-border);border-radius:4px;font-size:12px">
            <span style="flex:1;font-weight:600">${r.name}</span>
            <span style="color:var(--text-muted);font-size:11px">${r.type.split('/').pop()}</span>
            <button style="background:none;border:none;cursor:pointer;color:#a4262c;font-size:14px" onclick="removeARMResource(${i})">✕</button>
          </div>
        `).join('')}
      </div>
    ` : '<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px">No resources added yet. Click a resource type above to add it.</div>'}

    ${ARMResources.length > 0 ? `
      <div style="font-size:12px;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Generated ARM Template (JSON)</div>
      <div class="arm-output" id="armOutput">${syntaxHighlightJSON(JSON.stringify(buildFullARMTemplate(), null, 2))}</div>
      <div class="arm-toolbar">
        <button class="btn btn-primary btn-sm" onclick="copyARMTemplate()">📋 Copy JSON</button>
        <button class="btn btn-secondary btn-sm" onclick="downloadARMTemplate()">⬇ Download</button>
        <button class="btn btn-ghost btn-sm" onclick="clearARMResources()" style="color:#a4262c">🗑 Clear All</button>
      </div>
      <div class="info-box" style="margin-top:12px">
        <span>💡</span>
        <div>Deploy this template with Azure CLI:<br>
        <code style="font-size:11px;display:block;margin-top:4px">az deployment group create \\<br>
        &nbsp;&nbsp;--resource-group rg-data-science-lab \\<br>
        &nbsp;&nbsp;--template-file template.json</code>
        </div>
      </div>
    ` : ''}
  `;
}

function addARMResource(type) {
  const name = prompt(`Enter a name for the ${type} resource:`, `adewale-${type}-01`);
  if (!name) return;
  const region = 'eastus';
  const fn = ARMTemplates[type];
  if (!fn) { showToast('Unknown resource type', 'error'); return; }
  ARMResources.push(fn(name, region));
  showToast(`Added ${type}: ${name}`, 'success');
  logActivity('create', `Added ${type} to ARM Template`, name, 'ARM Builder');
  renderARMBuilder();
}

function removeARMResource(idx) {
  const r = ARMResources[idx];
  ARMResources.splice(idx, 1);
  showToast(`Removed ${r.name}`, 'info');
  renderARMBuilder();
}

function clearARMResources() {
  ARMResources = [];
  renderARMBuilder();
  showToast('ARM template cleared', 'info');
}

function syntaxHighlightJSON(json) {
  return json
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'json-key' : 'json-string';
      } else if (/true|false/.test(match)) {
        cls = 'json-bool';
      }
      return `<span class="${cls}">${match}</span>`;
    });
}

function copyARMTemplate() {
  const json = JSON.stringify(buildFullARMTemplate(), null, 2);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(json).then(() => showToast('ARM template copied to clipboard!', 'success'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = json;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('ARM template copied!', 'success');
  }
}

function downloadARMTemplate() {
  const json = JSON.stringify(buildFullARMTemplate(), null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'azuredeploy.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('template.json downloaded!', 'success');
  logActivity('action', 'Downloaded ARM Template', `azuredeploy.json (${ARMResources.length} resources)`, 'ARM Builder');
}
