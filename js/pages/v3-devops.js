/* =====================================================
   V3-PAGES-DEVOPS.JS
   Full DevOps pages: Azure Boards (Kanban), Pipeline
   YAML editor, Repos file browser, Artifacts, Test Plans
   Author: Adewale Samson Adeagbo | cssadewale
   ===================================================== */

/* ---- AZURE BOARDS ---- */
registerPage('boards', (container) => {
  const WorkItems = {
    'New': [
      { id: 12, title: 'Set up Azure ML compute cluster with min_nodes=0', type: '🔵', priority: 'high', assignee: 'AA', tags: ['azure-ml','infrastructure'] },
      { id: 13, title: 'Create ARM template for data science baseline', type: '🔵', priority: 'medium', assignee: 'AA', tags: ['iac','arm'] },
      { id: 14, title: 'Document Databricks MLflow experiment workflow', type: '📄', priority: 'low', assignee: 'AA', tags: ['docs','databricks'] }
    ],
    'Active': [
      { id: 8, title: 'Build feature engineering pipeline in Data Factory', type: '🔵', priority: 'critical', assignee: 'AA', tags: ['adf','pipeline'] },
      { id: 9, title: 'Train XGBoost model — house price prediction v3', type: '🐛', priority: 'high', assignee: 'AA', tags: ['ml','training'] },
      { id: 10, title: 'Configure Key Vault with Managed Identity for ML workspace', type: '🔵', priority: 'high', assignee: 'AA', tags: ['security','keyvault'] }
    ],
    'Resolved': [
      { id: 5, title: 'Register model in Azure ML Model Registry', type: '🔵', priority: 'high', assignee: 'AA', tags: ['ml','registry'] },
      { id: 6, title: 'Deploy model as online endpoint', type: '🔵', priority: 'critical', assignee: 'AA', tags: ['deployment'] },
      { id: 7, title: 'Fix Data Factory pipeline null pointer in transform step', type: '🐛', priority: 'high', assignee: 'AA', tags: ['bug','adf'] }
    ],
    'Closed': [
      { id: 1, title: 'Create resource groups and VNet architecture', type: '🔵', priority: 'high', assignee: 'AA', tags: ['networking'] },
      { id: 2, title: 'Upload training datasets to Blob Storage', type: '🔵', priority: 'medium', assignee: 'AA', tags: ['storage','data'] },
      { id: 3, title: 'Set up Azure DevOps organisation and project', type: '🔵', priority: 'medium', assignee: 'AA', tags: ['devops'] },
      { id: 4, title: 'Configure GitHub Actions CI for model training', type: '🔵', priority: 'high', assignee: 'AA', tags: ['cicd'] }
    ]
  };

  window._workItems = WorkItems;

  function renderKanbanCard(item) {
    return `
      <div class="kanban-card" onclick="openWorkItemDetail(${item.id})" draggable="true">
        <div class="kanban-card-id">AB#${item.id}</div>
        <div class="kanban-card-type">${item.type}</div>
        <div class="kanban-card-title">${item.title}</div>
        <div class="kanban-card-meta">
          <span class="kanban-card-priority ${item.priority}"></span>
          ${item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} ·
          ${item.tags.slice(0,2).map(t=>`<span style="background:#f3f2f1;padding:1px 5px;border-radius:3px;font-size:10px">${t}</span>`).join(' ')}
        </div>
      </div>
    `;
  }

  const totalItems = Object.values(WorkItems).reduce((a,v)=>a+v.length,0);

  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › <span onclick="navigateTo('devops')">Azure DevOps</span> › Boards</div>
      <div class="page-title"><div class="page-title-icon">📋</div><span>Azure Boards — DataSciencePipelines</span></div>
      <div class="page-subtitle">Plan, track, and discuss work across your team using agile tools.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openNewWorkItemModal()">+ New Work Item</button>
        <button class="btn btn-secondary" onclick="navigateTo('sprint')">Sprint View</button>
        <button class="btn btn-secondary" onclick="navigateTo('backlog')">Backlog</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Boards?</strong> An agile project management tool inside Azure DevOps. It provides:<br>
      • <strong>Kanban Board</strong> — Visual cards representing work items, dragged across columns as work progresses<br>
      • <strong>Work Items</strong> — Tasks, User Stories, Bugs, Epics with fields, tags, assignments, and effort estimates<br>
      • <strong>Sprint Planning</strong> — Time-boxed iterations (sprints) with capacity planning<br>
      • <strong>Backlog</strong> — Prioritised list of all pending work<br>
      • <strong>Burndown Charts</strong> — Track sprint progress against remaining work<br>
      As a data scientist, use Boards to track ML experiments, pipeline tasks, and technical debt.</div>
    </div>
    <div class="filter-bar">
      <span class="filter-label">Filter:</span>
      <select class="form-control" style="max-width:160px"><option>All work item types</option><option>Tasks only</option><option>Bugs only</option></select>
      <select class="form-control" style="max-width:160px"><option>Assigned to: All</option><option>Assigned to: Me</option></select>
      <input class="form-control" style="max-width:220px" placeholder="Search work items..."/>
      <span style="font-size:12px;color:var(--text-muted);margin-left:auto">${totalItems} total items</span>
    </div>
    <div class="kanban-board">
      ${Object.entries(WorkItems).map(([col, items]) => `
        <div class="kanban-col">
          <div class="kanban-col-header">
            <span>${col}</span>
            <span style="background:var(--azure-blue);color:white;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px">${items.length}</span>
          </div>
          <div class="kanban-cards" id="kanban-col-${col.toLowerCase().replace(' ','-')}">
            ${items.map(renderKanbanCard).join('')}
          </div>
          <button class="kanban-add-btn" onclick="openNewWorkItemModal('${col}')">+ Add item</button>
        </div>
      `).join('')}
    </div>
  `;

  window.openWorkItemDetail = (id) => {
    const item = Object.values(WorkItems).flat().find(i=>i.id===id);
    if (!item) return;
    openModal(`
      <div class="modal" style="max-width:660px">
        <div class="modal-header">
          <h2>${item.type} Work Item AB#${item.id}</h2>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group"><label class="form-label">Title</label><input class="form-control" value="${item.title}"/></div>
          <div class="grid-2" style="gap:12px">
            <div class="form-group"><label class="form-label">State</label>
              <select class="form-control">
                ${Object.keys(WorkItems).map(s=>`<option ${Object.entries(WorkItems).find(([c,items])=>items.find(i=>i.id===id))?.[0]===s?'selected':''}>${s}</option>`).join('')}
              </select>
            </div>
            <div class="form-group"><label class="form-label">Priority</label>
              <select class="form-control"><option>Critical</option><option ${item.priority==='high'?'selected':''}>High</option><option ${item.priority==='medium'?'selected':''}>Medium</option><option ${item.priority==='low'?'selected':''}>Low</option></select>
            </div>
            <div class="form-group"><label class="form-label">Assigned To</label><input class="form-control" value="Adewale Samson Adeagbo"/></div>
            <div class="form-group"><label class="form-label">Effort (hours)</label><input class="form-control" type="number" placeholder="e.g. 4"/></div>
            <div class="form-group"><label class="form-label">Iteration Path</label><select class="form-control"><option>DataSciencePipelines\\Sprint 1</option><option>DataSciencePipelines\\Sprint 2</option></select></div>
            <div class="form-group"><label class="form-label">Area Path</label><select class="form-control"><option>DataSciencePipelines\\ML Models</option><option>DataSciencePipelines\\Infrastructure</option></select></div>
          </div>
          <div class="form-group"><label class="form-label">Description</label><textarea class="form-control" rows="4" placeholder="Describe this work item in detail...">${item.title}</textarea></div>
          <div class="form-group"><label class="form-label">Tags</label><input class="form-control" value="${item.tags.join(', ')}"/></div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" onclick="showToast('Work item AB#${id} saved!','success');logActivity('update','Updated work item','AB#${id}','Boards');closeModal()">Save</button>
          <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        </div>
      </div>
    `);
  };
});

function openNewWorkItemModal(column) {
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>📋 New Work Item</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Type</label>
          <select class="form-control"><option>🔵 Task</option><option>🐛 Bug</option><option>📖 User Story</option><option>🎯 Feature</option><option>🏔️ Epic</option></select></div>
        <div class="form-group"><label class="form-label">Title *</label><input id="wiTitle" class="form-control" placeholder="Describe the work item concisely"/></div>
        <div class="form-group"><label class="form-label">Assigned To</label><select class="form-control"><option>Adewale Samson Adeagbo</option></select></div>
        <div class="form-group"><label class="form-label">Priority</label><select id="wiPriority" class="form-control"><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></div>
        <div class="form-group"><label class="form-label">Iteration</label><select class="form-control"><option>Sprint 1</option><option>Sprint 2</option><option>Backlog</option></select></div>
        <div class="form-group"><label class="form-label">Tags (comma separated)</label><input class="form-control" placeholder="e.g. azure-ml, training, sprint-2"/></div>
        <div class="form-group"><label class="form-label">Description</label><textarea class="form-control" rows="3" placeholder="Detailed description..."></textarea></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="
          const t=document.getElementById('wiTitle').value.trim();
          if(!t){showToast('Title required','error');return;}
          const col=column||'New';
          const id=Date.now()%10000;
          if(window._workItems&&window._workItems[col]){window._workItems[col].unshift({id,title:t,type:'🔵',priority:'medium',assignee:'AA',tags:[]});}
          showToast('Work item AB#'+id+' created!','success');
          logActivity('create','Created work item',t,'Boards');
          closeModal();navigateTo('boards');">Create</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

/* ---- SPRINT VIEW ---- */
registerPage('sprint', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › <span onclick="navigateTo('boards')">Boards</span> › Sprint</div>
      <div class="page-title"><div class="page-title-icon">🏃</div><span>Sprint 1 — DataSciencePipelines</span></div>
      <div class="page-subtitle">2024-03-01 → 2024-03-14 · 14 days · 3 team members</div>
    </div>
    <div class="grid-4" style="margin-bottom:20px">
      <div class="metric-card"><div class="metric-label">Sprint Capacity</div><div class="metric-value">40h</div></div>
      <div class="metric-card"><div class="metric-label">Committed Work</div><div class="metric-value">36h</div><div class="metric-sub">90% capacity</div></div>
      <div class="metric-card"><div class="metric-label">Completed</div><div class="metric-value" style="color:#107c10">28h</div></div>
      <div class="metric-card"><div class="metric-label">Remaining</div><div class="metric-value" style="color:#d83b01">8h</div></div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">Burndown Chart</div></div>
      <div class="card-body">
        <div id="sprintBurndown" style="height:160px"></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Sprint Backlog</div><button class="btn btn-primary btn-sm" onclick="openNewWorkItemModal('Active')">+ Add</button></div>
      <table class="data-table">
        <thead><tr><th>ID</th><th>Title</th><th>State</th><th>Assignee</th><th>Effort</th><th>Remaining</th></tr></thead>
        <tbody>
          ${[
            { id: 8, title: 'Build feature engineering pipeline in Data Factory', state: 'Active', effort: 8, remaining: 4 },
            { id: 9, title: 'Train XGBoost model — house price prediction v3', state: 'Active', effort: 6, remaining: 4 },
            { id: 10, title: 'Configure Key Vault with Managed Identity', state: 'Active', effort: 4, remaining: 0 },
            { id: 5, title: 'Register model in Azure ML Model Registry', state: 'Resolved', effort: 4, remaining: 0 },
            { id: 6, title: 'Deploy model as online endpoint', state: 'Resolved', effort: 6, remaining: 0 }
          ].map(i => `
            <tr>
              <td><a class="link" onclick="showToast('Opening AB#${i.id}','info')">AB#${i.id}</a></td>
              <td>${i.title}</td>
              <td>${statusBadge(i.state==='Resolved'?'Active':i.state==='Active'?'Pending':'Stopped')}</td>
              <td>Adewale SA</td>
              <td>${i.effort}h</td>
              <td style="color:${i.remaining===0?'#107c10':'#d83b01'}">${i.remaining}h</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  setTimeout(() => {
    renderSVGChart('sprintBurndown', [
      { name: 'Ideal', values: [36,32.6,29.1,25.7,22.3,18.9,15.4,12,8.6,5.1,1.7,0,0,0] },
      { name: 'Actual', values: [36,35,33,30,28,26,22,18,15,12,10,8,null,null].filter(v=>v!==null) }
    ], { labels: 'Day 1,2,3,4,5,6,7,8,9,10,11,12,13,14'.split(','), unit: 'h', height: 160 });
  }, 100);
});

/* ---- BACKLOG ---- */
registerPage('backlog', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › <span onclick="navigateTo('boards')">Boards</span> › Backlog</div>
      <div class="page-title"><div class="page-title-icon">📝</div><span>Product Backlog — DataSciencePipelines</span></div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="openNewWorkItemModal()">+ New Item</button>
        <button class="btn btn-secondary" onclick="showToast('Planning sprint from backlog...','info')">Plan Sprint</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>Product Backlog</strong> is the ordered list of all work planned for the project. Items at the top are highest priority. During Sprint Planning, the team pulls items from the top of the backlog into the sprint. In agile, the backlog is never "finished" — it evolves with the project.</div>
    </div>
    <div class="card">
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>#</th><th>Title</th><th>Type</th><th>Priority</th><th>Effort</th><th>Sprint</th><th>Actions</th></tr></thead>
          <tbody>
            ${[
              { id:12, title:'Set up Azure ML compute cluster', type:'🔵 Task', priority:'High', effort:'4h', sprint:'Sprint 2' },
              { id:13, title:'Create ARM template for data science baseline', type:'🔵 Task', priority:'Medium', effort:'8h', sprint:'Sprint 2' },
              { id:14, title:'Document Databricks MLflow workflow', type:'📄 Task', priority:'Low', effort:'3h', sprint:'Backlog' },
              { id:15, title:'Set up monitoring dashboards for ML endpoints', type:'🔵 Task', priority:'High', effort:'6h', sprint:'Backlog' },
              { id:16, title:'Implement data drift detection pipeline', type:'🔵 Feature', priority:'Medium', effort:'12h', sprint:'Backlog' },
              { id:17, title:'Add budget alert at $50 spending threshold', type:'🔵 Task', priority:'High', effort:'1h', sprint:'Sprint 2' }
            ].map(i => `
              <tr>
                <td><a class="link">AB#${i.id}</a></td>
                <td>${i.title}</td>
                <td><span style="font-size:12px">${i.type}</span></td>
                <td><span class="badge badge-${i.priority==='High'||i.priority==='Critical'?'stopped':i.priority==='Medium'?'warning':'info'}">${i.priority}</span></td>
                <td>${i.effort}</td>
                <td style="font-size:12px;color:var(--text-muted)">${i.sprint}</td>
                <td><button class="btn btn-ghost btn-sm" onclick="showToast('Moving to Sprint 2...','info')">→ Sprint</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
});

/* ---- PIPELINE YAML EDITOR ---- */
registerPage('pipeline-editor', (container) => {
  const yamlTemplates = {
    ml: `<span class="y-comment"># Azure Pipelines — ML Model Training & Deployment</span>
<span class="y-key">trigger</span>:
  <span class="y-key">branches</span>:
    <span class="y-key">include</span>: [<span class="y-val">main</span>, <span class="y-val">feature/*</span>]
  <span class="y-key">paths</span>:
    <span class="y-key">include</span>: [<span class="y-val">src/models/*</span>]

<span class="y-key">variables</span>:
  <span class="y-key">pythonVersion</span>: <span class="y-val">'3.10'</span>
  <span class="y-key">amlWorkspace</span>: <span class="y-val">'adewale-ml-workspace'</span>
  <span class="y-key">resourceGroup</span>: <span class="y-val">'rg-ml-experiments'</span>
  <span class="y-key">subscriptionId</span>: <span class="y-val">'a1b2c3d4-e5f6-7890-abcd-ef1234567890'</span>

<span class="y-key">stages</span>:
  - <span class="y-key">stage</span>: <span class="y-val">Validate</span>
    <span class="y-key">displayName</span>: <span class="y-val">'Validate & Test'</span>
    <span class="y-key">jobs</span>:
      - <span class="y-key">job</span>: <span class="y-val">ValidateJob</span>
        <span class="y-key">pool</span>:
          <span class="y-key">vmImage</span>: <span class="y-val">'ubuntu-latest'</span>
        <span class="y-key">steps</span>:
          - <span class="y-key">task</span>: <span class="y-val">UsePythonVersion@0</span>
            <span class="y-key">inputs</span>:
              <span class="y-key">versionSpec</span>: <span class="y-val">'$(pythonVersion)'</span>
          - <span class="y-key">script</span>: |
              pip install -r requirements.txt
              pytest tests/ -v --junitxml=test-results.xml
            <span class="y-key">displayName</span>: <span class="y-val">'Run unit tests'</span>
          - <span class="y-key">task</span>: <span class="y-val">PublishTestResults@2</span>
            <span class="y-key">inputs</span>:
              <span class="y-key">testResultsFormat</span>: <span class="y-val">'JUnit'</span>
              <span class="y-key">testResultsFiles</span>: <span class="y-val">'test-results.xml'</span>

  - <span class="y-key">stage</span>: <span class="y-val">Train</span>
    <span class="y-key">displayName</span>: <span class="y-val">'Train Model on Azure ML'</span>
    <span class="y-key">dependsOn</span>: <span class="y-val">Validate</span>
    <span class="y-key">jobs</span>:
      - <span class="y-key">job</span>: <span class="y-val">TrainJob</span>
        <span class="y-key">steps</span>:
          - <span class="y-key">task</span>: <span class="y-val">AzureCLI@2</span>
            <span class="y-key">inputs</span>:
              <span class="y-key">azureSubscription</span>: <span class="y-val">'azure-service-connection'</span>
              <span class="y-key">scriptType</span>: <span class="y-val">'bash'</span>
              <span class="y-key">scriptLocation</span>: <span class="y-val">'inlineScript'</span>
              <span class="y-key">inlineScript</span>: |
                az ml job create --file train_job.yaml \\
                  --workspace-name $(amlWorkspace) \\
                  --resource-group $(resourceGroup)

  - <span class="y-key">stage</span>: <span class="y-val">Evaluate</span>
    <span class="y-key">displayName</span>: <span class="y-val">'Evaluate & Register Model'</span>
    <span class="y-key">dependsOn</span>: <span class="y-val">Train</span>
    <span class="y-key">jobs</span>:
      - <span class="y-key">deployment</span>: <span class="y-val">EvaluateAndRegister</span>
        <span class="y-key">environment</span>: <span class="y-val">'staging'</span>
        <span class="y-key">strategy</span>:
          <span class="y-key">runOnce</span>:
            <span class="y-key">deploy</span>:
              <span class="y-key">steps</span>:
                - <span class="y-key">script</span>: |
                    python scripts/evaluate_model.py \\
                      --min-accuracy 0.90 \\
                      --register-if-better true
                  <span class="y-key">displayName</span>: <span class="y-val">'Evaluate vs production model'</span>

  - <span class="y-key">stage</span>: <span class="y-val">Deploy</span>
    <span class="y-key">displayName</span>: <span class="y-val">'Deploy to Production Endpoint'</span>
    <span class="y-key">dependsOn</span>: <span class="y-val">Evaluate</span>
    <span class="y-key">condition</span>: <span class="y-val">succeeded()</span>
    <span class="y-key">jobs</span>:
      - <span class="y-key">deployment</span>: <span class="y-val">DeployProduction</span>
        <span class="y-key">environment</span>: <span class="y-val">'production'</span>
        <span class="y-key">strategy</span>:
          <span class="y-key">runOnce</span>:
            <span class="y-key">deploy</span>:
              <span class="y-key">steps</span>:
                - <span class="y-key">task</span>: <span class="y-val">AzureCLI@2</span>
                  <span class="y-key">inputs</span>:
                    <span class="y-key">inlineScript</span>: |
                      az ml online-deployment create \\
                        --file deployment.yaml \\
                        --workspace-name $(amlWorkspace)`
  };

  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › <span onclick="navigateTo('devops')">DevOps</span> › Pipeline Editor</div>
      <div class="page-title"><div class="page-title-icon">🔁</div><span>Pipeline YAML Editor</span></div>
      <div class="page-subtitle">Edit, validate, and run Azure Pipelines YAML definitions.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is an Azure Pipeline YAML?</strong> Azure Pipelines uses YAML files stored in your repository to define CI/CD workflows. Every push triggers the pipeline automatically. The YAML defines <strong>stages</strong> (phases of work), <strong>jobs</strong> (units of work that run on an agent), and <strong>steps</strong> (individual tasks). YAML pipelines are versioned with your code — the gold standard for MLOps.</div>
    </div>
    <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
      <button class="btn btn-primary btn-sm" onclick="showToast('Validating YAML...','info');setTimeout(()=>showToast('✓ YAML is valid — 4 stages detected','success'),800)">▶ Validate</button>
      <button class="btn btn-secondary btn-sm" onclick="showToast('Running pipeline...','info');setTimeout(()=>showToast('Pipeline queued! Run #47','success'),1000)">▶ Run Pipeline</button>
      <button class="btn btn-ghost btn-sm" onclick="loadPipelineTemplate('ml')">Load ML Template</button>
      <button class="btn btn-ghost btn-sm" onclick="showToast('Pipeline YAML saved to repo','success');logActivity('update','Updated pipeline YAML','azure-pipelines.yml','DataSciencePipelines')">💾 Save</button>
    </div>
    <div class="yaml-editor" id="yamlEditor">${yamlTemplates.ml}</div>
    <div style="margin-top:10px;display:flex;gap:8px;align-items:center;font-size:12px;color:var(--text-muted)">
      <span>File: azure-pipelines.yml</span>
      <span>·</span>
      <span>Branch: main</span>
      <span>·</span>
      <span>Repo: DataSciencePipelines</span>
    </div>
  `;
  window.loadPipelineTemplate = (type) => {
    document.getElementById('yamlEditor').innerHTML = yamlTemplates[type] || yamlTemplates.ml;
    showToast('ML pipeline template loaded', 'success');
  };
});

/* ---- ARTIFACTS ---- */
registerPage('artifacts', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › <span onclick="navigateTo('devops')">DevOps</span> › Artifacts</div>
      <div class="page-title"><div class="page-title-icon">📦</div><span>Azure Artifacts</span></div>
      <div class="page-subtitle">Host and share Python packages, npm packages, Maven, NuGet, and Universal Packages.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Artifacts?</strong> A private package registry integrated with Azure Pipelines. Instead of publishing your ML utility packages to public PyPI, host them privately here. Your team installs them with <code>pip install --index-url https://pkgs.dev.azure.com/cssadewale/DataSciencePipelines/_packaging/ml-packages/pypi/simple/ my-package</code>. Supports: pip (Python), npm (JavaScript), Maven (Java), NuGet (.NET), Universal Packages.</div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Feeds</div><button class="btn btn-primary btn-sm" onclick="showToast('Feed created!','success')">+ Create Feed</button></div>
      ${[
        { name: 'ml-packages', type: 'Python (pip)', packages: 4, views: ['Release','Prerelease'], lastPublished: '2024-03-10' },
        { name: 'shared-utils', type: 'Python (pip)', packages: 2, views: ['Release'], lastPublished: '2024-02-28' }
      ].map(feed => `
        <div style="padding:14px 16px;border-bottom:1px solid var(--card-border)">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
            <span style="font-size:20px">📦</span>
            <strong style="font-size:14px">${feed.name}</strong>
            <span class="badge badge-info">${feed.type}</span>
          </div>
          <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">${feed.packages} packages · Views: ${feed.views.join(', ')} · Last published: ${feed.lastPublished}</div>
          <div style="font-size:12px;font-family:monospace;background:#f3f2f1;padding:6px 10px;border-radius:3px">
            pip install --index-url https://pkgs.dev.azure.com/cssadewale/_packaging/${feed.name}/pypi/simple/ [package-name]
            <button class="copy-btn" onclick="showToast('Copied!','success')">📋</button>
          </div>
          <div style="margin-top:8px;display:flex;gap:6px">
            <button class="btn btn-ghost btn-sm" onclick="showToast('Opening feed...','info')">Browse</button>
            <button class="btn btn-ghost btn-sm" onclick="showToast('Publishing package...','info')">Publish</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
});

/* ---- TEST PLANS ---- */
registerPage('test-plans', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › <span onclick="navigateTo('devops')">DevOps</span> › Test Plans</div>
      <div class="page-title"><div class="page-title-icon">🧪</div><span>Test Plans</span></div>
      <div class="page-subtitle">Plan, track, and manage manual and automated testing for your ML models and pipelines.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What are Test Plans?</strong> Azure Test Plans provides tools for manual testing (exploratory and scripted), automated test management, and test progress tracking. For ML projects:<br>
      • <strong>Model acceptance tests</strong> — Does the model meet accuracy thresholds on holdout data?<br>
      • <strong>API contract tests</strong> — Does the endpoint return the expected schema?<br>
      • <strong>Data quality tests</strong> — Does the pipeline output expected row counts and column types?<br>
      • <strong>Regression tests</strong> — Is new model performance better than the production model?</div>
    </div>
    <div class="grid-4" style="margin-bottom:16px">
      <div class="metric-card"><div class="metric-label">Test Cases</div><div class="metric-value">24</div></div>
      <div class="metric-card"><div class="metric-label">Passed</div><div class="metric-value" style="color:#107c10">21</div></div>
      <div class="metric-card"><div class="metric-label">Failed</div><div class="metric-value" style="color:#a4262c">2</div></div>
      <div class="metric-card"><div class="metric-label">Blocked</div><div class="metric-value" style="color:#d83b01">1</div></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Test Suites</div></div>
      ${[
        { name: 'ML Model Acceptance Tests', cases: 8, passed: 7, failed: 1, type: 'Automated' },
        { name: 'API Endpoint Contract Tests', cases: 6, passed: 6, failed: 0, type: 'Automated' },
        { name: 'Data Pipeline Quality Tests', cases: 5, passed: 5, failed: 0, type: 'Automated' },
        { name: 'Manual Exploratory Tests', cases: 5, passed: 3, failed: 1, type: 'Manual' }
      ].map(s => `
        <div style="padding:12px 16px;border-bottom:1px solid var(--card-border)">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
            <strong>${s.name}</strong>
            <span class="badge badge-${s.type==='Automated'?'info':'warning'}">${s.type}</span>
          </div>
          <div class="progress-bar" style="margin-bottom:4px">
            <div class="progress-fill success" style="width:${Math.round(s.passed/s.cases*100)}%"></div>
          </div>
          <div style="font-size:12px;color:var(--text-muted)">${s.passed}/${s.cases} passed · ${s.failed} failed</div>
          <div style="margin-top:6px;display:flex;gap:6px">
            <button class="btn btn-ghost btn-sm" onclick="showToast('Running test suite...','info');setTimeout(()=>showToast('Tests complete: ${s.passed}/${s.cases} passed','success'),2000)">▶ Run</button>
            <button class="btn btn-ghost btn-sm">View Results</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
});
