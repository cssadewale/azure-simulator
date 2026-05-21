/* =====================================================
   TERMINAL.JS — Azure Cloud Shell Simulator
   ===================================================== */

const TerminalHistory = [];
let historyIdx = -1;

function openTerminal() {
  const panel = document.getElementById('terminalPanel');
  panel.classList.add('open');
  AppState.terminalOpen = true;
  document.getElementById('terminalInput').focus();
  if (document.getElementById('terminalOutput').innerHTML === '') {
    printWelcome();
  }
}

function closeTerminal() {
  document.getElementById('terminalPanel').classList.remove('open');
  AppState.terminalOpen = false;
}

function setShell(shell) {
  AppState.shell = shell;
  document.querySelectorAll('.terminal-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  const prompt = shell === 'bash'
    ? `${AzureData.user.github}@Azure:~$`
    : `PS /home/${AzureData.user.github}>`;
  document.getElementById('terminalPrompt').textContent = prompt;
  printLine(`Switched to ${shell === 'bash' ? 'Bash' : 'PowerShell'} shell.`, 'info');
}

function printWelcome() {
  const lines = [
    { t: 'comment', v: '  ___  ______   __  ____  ____   ____  _____  __ ____ __ __   __  __  __  __  __  ____ ' },
    { t: 'comment', v: ' / _ |/_  /\\ \\ / / / __/ /  _/  / _  \\/ / _ \\ / // / // /  / / / // // /  / /  / __/' },
    { t: 'comment', v: '/ __ |_/ /_ >\\ < / _/  _/ /   / /  \\/ /\\_, \\/ // / // /__/ /_/ // // /__/ /__/\\ \\ ' },
    { t: 'comment', v: '/_/ |_/___/ /_/\\_\\/_/ /___/    \\____/_//____/___/_//____/____/___/_/______/____/___/' },
    { t: 'info', v: '' },
    { t: 'info', v: `  Azure Cloud Shell Simulator  |  User: ${AzureData.user.name}  |  Tenant: ${AzureData.user.tenant}` },
    { t: 'info', v: `  Subscription: Azure for Students  |  Shell: Bash` },
    { t: 'info', v: '' },
    { t: 'comment', v: '  Type "help" to see available commands, or "az --help" for Azure CLI reference.' },
    { t: 'info', v: '' }
  ];
  lines.forEach(l => printLine(l.v, l.t));
}

function printLine(text, type = 'out') {
  const out = document.getElementById('terminalOutput');
  const div = document.createElement('div');
  div.className = `terminal-line ${type}`;
  div.textContent = text;
  out.appendChild(div);
  scrollTerminal();
}

function printLines(lines, type = 'out') {
  lines.forEach(l => printLine(l, type));
}

function scrollTerminal() {
  const body = document.getElementById('terminalBody');
  body.scrollTop = body.scrollHeight;
}

// ---- COMMAND INPUT ----
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('terminalInput');
  if (!input) return;

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      if (!cmd) return;
      TerminalHistory.unshift(cmd);
      historyIdx = -1;
      printLine(`${document.getElementById('terminalPrompt').textContent} ${cmd}`, 'cmd');
      input.value = '';
      executeCommand(cmd);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx < TerminalHistory.length - 1) historyIdx++;
      input.value = TerminalHistory[historyIdx] || '';
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) historyIdx--;
      input.value = TerminalHistory[historyIdx] || '';
    }
  });
});

// ---- COMMAND EXECUTION ENGINE ----
function executeCommand(raw) {
  const parts = raw.trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  const handlers = {
    help: cmdHelp,
    clear: cmdClear,
    cls: cmdClear,
    az: cmdAz,
    ls: cmdLs,
    pwd: () => printLine('/home/adewale', 'out'),
    whoami: () => printLine('adewale', 'out'),
    echo: () => printLine(args.join(' '), 'out'),
    date: () => printLine(new Date().toString(), 'out'),
    history: () => TerminalHistory.forEach((h, i) => printLine(`  ${i + 1}  ${h}`)),
    cat: cmdCat,
    mkdir: (a) => { printLine(`Created directory '${a[0] || 'newdir'}'`,'success'); },
    exit: () => closeTerminal()
  };

  const handler = handlers[cmd];
  if (handler) {
    handler(args);
  } else {
    printLine(`Command not found: ${cmd}. Type 'help' for available commands.`, 'err');
  }
}

function cmdHelp() {
  printLines([
    '',
    '  AZURE CLOUD SHELL SIMULATOR — AVAILABLE COMMANDS',
    '  ─────────────────────────────────────────────────',
    '  help              Show this help message',
    '  clear / cls       Clear the terminal',
    '  whoami            Show current user',
    '  date              Show current date/time',
    '  pwd               Print working directory',
    '  ls                List directory contents',
    '  mkdir <name>      Create directory',
    '  cat <file>        Show file contents (simulated)',
    '  history           Show command history',
    '',
    '  AZURE CLI (az) COMMANDS:',
    '  az account list                    List subscriptions',
    '  az account show                    Show current subscription',
    '  az group list                      List resource groups',
    '  az group create -n <name> -l <loc> Create resource group',
    '  az vm list                         List virtual machines',
    '  az vm start -n <name> -g <rg>      Start a VM',
    '  az vm stop -n <name> -g <rg>       Stop a VM',
    '  az vm create ...                   Create a VM (simulated)',
    '  az storage account list            List storage accounts',
    '  az keyvault list                   List key vaults',
    '  az ml workspace list               List ML workspaces',
    '  az functionapp list                List function apps',
    '  az network vnet list               List virtual networks',
    '  az monitor metrics list            Show monitor metrics',
    '  az cost management budget list     Show budgets',
    '  az devops project list             List DevOps projects',
    '  az servicebus namespace list           List Service Bus namespaces',
    '  az servicebus queue list               List queues in a namespace',
    '  az advisor recommendation list         List Azure Advisor recommendations',
    '  az stream-analytics job list           List Stream Analytics jobs',
    '  az apim api list                       List API Management APIs',
    '',
    '  Type any az command to try it!',
    ''
  ]);
}

function cmdClear() {
  document.getElementById('terminalOutput').innerHTML = '';
}

function cmdLs(args) {
  const files = ['data/', 'models/', 'notebooks/', 'outputs/', 'README.md', 'requirements.txt', 'config.yaml'];
  printLines(files.map(f => `  ${f}`));
}

function cmdCat(args) {
  const file = args[0];
  if (!file) { printLine('Usage: cat <filename>', 'err'); return; }
  const fakeFiles = {
    'README.md': ['# Azure ML Project', '## Adewale Adeagbo', '### Data Science Pipeline', 'See notebooks/ for experiments.'],
    'requirements.txt': ['azure-ml==1.48.0', 'scikit-learn==1.3.0', 'pandas==2.0.3', 'numpy==1.25.2', 'matplotlib==3.7.2'],
    'config.yaml': ['subscription_id: a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'resource_group: rg-ml-experiments', 'workspace: adewale-ml-workspace', 'region: eastus']
  };
  const content = fakeFiles[file];
  if (content) {
    printLines(content);
  } else {
    printLine(`cat: ${file}: No such file or directory`, 'err');
  }
}

function cmdAz(args) {
  const sub = args[0]?.toLowerCase();
  const sub2 = args[1]?.toLowerCase();

  if (!sub) { printLine('Usage: az <command>. Try: az account list', 'info'); return; }

  if (sub === 'account') {
    if (sub2 === 'list') {
      printLines([
        '[',
        '  {',
        `    "id": "${AzureData.subscriptions[0].subscriptionId}",`,
        `    "name": "${AzureData.subscriptions[0].name}",`,
        `    "state": "${AzureData.subscriptions[0].state}",`,
        `    "tenantId": "${AzureData.user.tenantId}"`,
        '  }',
        ']'
      ], 'json');
    } else if (sub2 === 'show') {
      const s = AzureData.subscriptions[0];
      printLines([
        '{',
        `  "id": "${s.subscriptionId}",`,
        `  "name": "${s.name}",`,
        `  "state": "${s.state}",`,
        `  "type": "${s.offerName}",`,
        `  "user": { "name": "${AzureData.user.email}", "type": "user" }`,
        '}'
      ], 'json');
    } else {
      printLine(`az account: unknown subcommand '${sub2}'`, 'err');
    }

  } else if (sub === 'group') {
    if (sub2 === 'list') {
      AzureData.resourceGroups.forEach(rg => {
        printLines([`  Name: ${rg.name}  |  Location: ${rg.region}  |  Resources: ${rg.resources}`]);
      });
    } else if (sub2 === 'create') {
      const n = args.find((_, i) => args[i-1] === '-n' || args[i-1] === '--name');
      const l = args.find((_, i) => args[i-1] === '-l' || args[i-1] === '--location');
      if (n) {
        printLines([
          `Creating resource group '${n}' in '${l || 'eastus'}'...`,
          `{`,
          `  "id": "/subscriptions/${AzureData.subscriptions[0].subscriptionId}/resourceGroups/${n}",`,
          `  "location": "${l || 'eastus'}",`,
          `  "name": "${n}",`,
          `  "properties": { "provisioningState": "Succeeded" }`,
          `}`
        ], 'json');
        AzureData.resourceGroups.push({ id: newGuid(), name: n, region: l || 'East US', resources: 0, status: 'Active', created: todayStr() });
        showToast(`Resource group '${n}' created successfully!`, 'success');
      } else {
        printLine('Error: required argument missing: --name / -n', 'err');
      }
    } else {
      printLine(`Subcommands: list, create, delete, show, exists`, 'info');
    }

  } else if (sub === 'vm') {
    if (sub2 === 'list') {
      AzureData.virtualMachines.forEach(vm => {
        printLine(`  ${vm.name.padEnd(28)} ${vm.status.padEnd(12)} ${vm.size.padEnd(22)} ${vm.region}`, 'out');
      });
    } else if (sub2 === 'start') {
      const n = args.find((_, i) => args[i-1] === '-n');
      const vm = AzureData.virtualMachines.find(v => v.name === n);
      if (vm) { vm.status = 'Running'; printLine(`Starting VM '${n}'... VM started successfully.`, 'success'); showToast(`VM ${n} started`, 'success'); }
      else { printLine(`VM '${n}' not found.`, 'err'); }
    } else if (sub2 === 'stop') {
      const n = args.find((_, i) => args[i-1] === '-n');
      const vm = AzureData.virtualMachines.find(v => v.name === n);
      if (vm) { vm.status = 'Stopped'; printLine(`Stopping VM '${n}'... VM stopped.`, 'success'); showToast(`VM ${n} stopped`, 'info'); }
      else { printLine(`VM '${n}' not found.`, 'err'); }
    } else if (sub2 === 'create') {
      printLine('Simulating VM creation...', 'info');
      setTimeout(() => {
        printLines([
          '  Validating template...',
          '  Deploying virtual machine...',
          '  Configuring OS...',
          '  VM created successfully!',
          `  Public IP: 20.${Math.floor(Math.random()*200)}.${Math.floor(Math.random()*200)}.${Math.floor(Math.random()*200)}`
        ], 'success');
      }, 1000);
    } else {
      printLine('Subcommands: list, start, stop, restart, create, delete, show', 'info');
    }

  } else if (sub === 'storage') {
    if (sub2 === 'account' && args[2] === 'list') {
      AzureData.storageAccounts.forEach(s => printLine(`  ${s.name.padEnd(28)} ${s.type.padEnd(14)} ${s.region}`, 'out'));
    } else {
      printLine('Try: az storage account list', 'info');
    }

  } else if (sub === 'keyvault') {
    if (sub2 === 'list') {
      AzureData.keyVaults.forEach(kv => printLine(`  ${kv.name.padEnd(28)} ${kv.region.padEnd(14)} ${kv.tier}`, 'out'));
    } else if (sub2 === 'secret' && args[2] === 'list') {
      const n = args.find((_, i) => args[i-1] === '--vault-name');
      const kv = AzureData.keyVaults[0];
      kv.secrets.forEach(s => printLine(`  ${s.name}  (v${s.version})`, 'out'));
    } else {
      printLine('Try: az keyvault list | az keyvault secret list --vault-name <name>', 'info');
    }

  } else if (sub === 'ml') {
    if (sub2 === 'workspace' && args[2] === 'list') {
      AzureData.mlStudio.workspaces.forEach(w => printLine(`  ${w.name.padEnd(32)} ${w.region.padEnd(14)} ${w.status}`, 'out'));
    } else {
      printLine('Try: az ml workspace list | az ml experiment list', 'info');
    }

  } else if (sub === 'network') {
    if (sub2 === 'vnet' && args[2] === 'list') {
      AzureData.virtualNetworks.forEach(v => printLine(`  ${v.name.padEnd(28)} ${v.addressSpace.padEnd(18)} ${v.region}`, 'out'));
    } else if (sub2 === 'vnet' && args[2] === 'subnet' && args[3] === 'list') {
      AzureData.virtualNetworks[0].subnets.forEach(s => printLine(`  ${s.name.padEnd(24)} ${s.range.padEnd(18)} Devices: ${s.devices}`, 'out'));
    } else {
      printLine('Try: az network vnet list | az network vnet subnet list', 'info');
    }

  } else if (sub === 'functionapp') {
    if (sub2 === 'list') {
      AzureData.functions.forEach(f => printLine(`  ${f.name.padEnd(30)} ${f.runtime.padEnd(16)} ${f.status}`, 'out'));
    } else {
      printLine('Try: az functionapp list', 'info');
    }

  } else if (sub === 'devops') {
    if (sub2 === 'project' && args[2] === 'list') {
      AzureData.devops.projects.forEach(p => printLine(`  ${p.name.padEnd(28)} ${p.visibility}  Repos: ${p.repos}`, 'out'));
    } else {
      printLine('Try: az devops project list | az devops pipeline list', 'info');
    }

  } else if (sub === 'monitor') {
    if (sub2 === 'metrics' && args[2] === 'list') {
      printLines(['  Metric               Value     Unit', '  ─────────────────────────────────────',
        '  Percentage CPU        34.5      Percent',
        '  Network In            2.3 MB    Bytes',
        '  Network Out           0.8 MB    Bytes',
        '  Disk Read             1.1 MB    Bytes',
        '  Disk Write            0.4 MB    Bytes'
      ]);
    } else {
      printLine('Try: az monitor metrics list --resource <vm-name>', 'info');
    }

  } else if (sub === 'servicebus') {
    if (sub2 === 'namespace' && args[2] === 'list') {
      printLine('  adewale-servicebus.servicebus.windows.net   Basic   East US   Active', 'out');
    } else if (sub2 === 'queue' && args[2] === 'list') {
      const n = args.find((_, i) => args[i-1] === '--namespace-name');
      printLines(['  ml-inference-jobs      42 messages   Active', '  data-pipeline-tasks     7 messages   Active', '  notification-queue      0 messages   Active']);
    } else {
      printLine('Try: az servicebus namespace list | az servicebus queue list --namespace-name <name>', 'info');
    }

  } else if (sub === 'advisor') {
    if (sub2 === 'recommendation' && args[2] === 'list') {
      printLines([
        '  [HIGH]   Rightsize underused VMs — Save ~$88/month',
        '  [HIGH]   Enable MFA for administrator accounts',
        '  [MEDIUM] Enable soft delete on Key Vault',
        '  [MEDIUM] Restrict SSH from 0.0.0.0/0 on NSG',
        '  [LOW]    Enable diagnostic logs on Synapse workspace'
      ]);
    } else {
      printLine('Try: az advisor recommendation list', 'info');
    }

  } else if (sub === 'stream-analytics') {
    if (sub2 === 'job' && args[2] === 'list') {
      printLines(['  iot-anomaly-detection      Running   East US', '  realtime-model-scoring     Running   East US', '  data-aggregation-job       Stopped   East US']);
    } else {
      printLine('Try: az stream-analytics job list | az stream-analytics job start --name <name> -g <rg>', 'info');
    }

  } else if (sub === 'apim') {
    if (sub2 === 'api' && args[2] === 'list') {
      printLines(['  ML Predictions API   v2   Published', '  Data Processing API  v1   Published', '  Analytics API        v1   Draft']);
    } else {
      printLine('Try: az apim api list --service-name <name> -g <rg>', 'info');
    }

  } else if (sub === '--version') {
    printLine('azure-cli  2.55.0 (Azure Simulator Build)', 'info');

  } else if (sub === '--help') {
    cmdHelp();

  } else {
    printLine(`az: '${sub}' is not an az command. See 'help' for a list.`, 'err');
  }
}
