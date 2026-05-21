/* =====================================================
   DEVOPS PAGE
   ===================================================== */

registerPage('devops', (container) => {
  const dv = AzureData.devops;
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Azure DevOps</div>
      <div class="page-title"><div class="page-title-icon">🚀</div><span>Azure DevOps</span></div>
      <div class="page-subtitle">Plan smarter, collaborate better, and ship faster with a set of modern dev services.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="showToast('Opening DevOps portal...','info');setTimeout(()=>showToast('DevOps loaded!','success'),1000)">Go to DevOps Portal</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure DevOps?</strong> A complete DevOps toolchain with five services:<br>
      • <strong>Azure Boards</strong> — Agile project management (Kanban, Sprints, Backlogs, Work Items)<br>
      • <strong>Azure Repos</strong> — Git repositories for your source code (like GitHub)<br>
      • <strong>Azure Pipelines</strong> — CI/CD: automatically build, test, and deploy code on every push<br>
      • <strong>Azure Test Plans</strong> — Manual and automated testing<br>
      • <strong>Azure Artifacts</strong> — Package management (pip, npm, Maven, NuGet feeds)<br>
      As a data scientist: use Pipelines to automate model training, testing, and deployment whenever you push code to your repo.</div>
    </div>
    <div class="grid-3" style="margin-bottom:20px">
      <div class="metric-card"><div class="metric-label">Organisation</div><div class="metric-value" style="font-size:18px">${dv.organization}</div><div class="metric-sub">dev.azure.com/${dv.organization}</div></div>
      <div class="metric-card"><div class="metric-label">Projects</div><div class="metric-value">${dv.projects.length}</div></div>
      <div class="metric-card"><div class="metric-label">Pipelines</div><div class="metric-value">${dv.pipelines.length}</div><div class="metric-sub">active CI/CD pipelines</div></div>
    </div>
    <div id="dvTabs">
      <div class="tab-bar">
        <button class="tab-item active" data-tab="projects" onclick="setActiveTab('dvTabs','projects')">Projects</button>
        <button class="tab-item" data-tab="pipelines" onclick="setActiveTab('dvTabs','pipelines')">Pipelines</button>
        <button class="tab-item" data-tab="repos" onclick="setActiveTab('dvTabs','repos')">Repos</button>
      </div>
      <div data-pane="projects">
        ${dv.projects.map(p => `
          <div class="card" style="margin-bottom:12px">
            <div class="card-header">
              <div style="display:flex;align-items:center;gap:10px">
                <span style="font-size:24px">🚀</span>
                <div>
                  <div style="font-weight:700;font-size:15px">${p.name}</div>
                  <div style="font-size:12px;color:#8a8886">${p.description}</div>
                </div>
              </div>
              <span class="badge badge-info">${p.visibility}</span>
            </div>
            <div class="card-body">
              <div class="grid-4" style="gap:12px">
                <div class="metric-card"><div class="metric-label">Repos</div><div class="metric-value">${p.repos}</div></div>
                <div class="metric-card"><div class="metric-label">Pipelines</div><div class="metric-value">${p.pipelines}</div></div>
                <div class="metric-card"><div class="metric-label">Boards</div><div class="metric-value">${p.boards}</div></div>
                <div class="metric-card"><div class="metric-label">Last Activity</div><div class="metric-value" style="font-size:16px">${p.lastActivity}</div></div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div data-pane="pipelines" style="display:none">
        ${dv.pipelines.map(pipe => `
          <div class="card" style="margin-bottom:12px">
            <div class="card-header">
              <div>
                <div style="font-weight:600;font-size:14px">${pipe.name}</div>
                <div style="font-size:12px;color:#8a8886">Trigger: ${pipe.trigger} · Branch: ${pipe.branch} · Last run: ${pipe.lastRun}</div>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                ${statusBadge(pipe.status)}
                <button class="btn btn-primary btn-sm" onclick="showToast('Running pipeline...','info');setTimeout(()=>showToast('Pipeline run queued!','success'),800)">▶ Run</button>
              </div>
            </div>
            <div class="card-body">
              <div style="display:flex;flex-direction:column;gap:6px">
                ${pipe.stages.map(s => `
                  <div class="pipeline-stage">
                    <div class="stage-icon stage-${s.status==='success'?'success':s.status==='running'?'running':s.status==='failed'?'failed':'pending'}">
                      ${s.status==='success'?'✓':s.status==='running'?'⟳':s.status==='failed'?'✗':'○'}
                    </div>
                    <div class="stage-info">
                      <div class="stage-name">${s.name}</div>
                      <div class="stage-dur">${s.duration}</div>
                    </div>
                    <span class="badge badge-${s.status==='success'?'running':s.status==='running'?'pending':s.status==='failed'?'stopped':'info'}">${s.status}</span>
                  </div>
                `).join('<div class="pipeline-connector">↓</div>')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div data-pane="repos" style="display:none">
        <div class="card">
          <div class="card-header"><div class="card-title">Repositories</div></div>
          <table class="data-table">
            <thead><tr><th>Repository</th><th>Language</th><th>Branches</th><th>Commits</th><th>Last Commit</th><th>Actions</th></tr></thead>
            <tbody>
              ${dv.repos.map(r => `
                <tr>
                  <td><div style="display:flex;align-items:center;gap:8px"><span>📂</span><strong>${r.name}</strong></div></td>
                  <td>${r.language}</td>
                  <td>${r.branches}</td>
                  <td>${r.commits}</td>
                  <td>${r.lastCommit}</td>
                  <td><button class="btn btn-ghost btn-sm" onclick="showToast('Opening repo...','info')">Clone</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
});

registerPage('pipelines', (container) => { navigateTo('devops'); });
registerPage('repos', (container) => { navigateTo('devops'); });

// ---- CONTAINER REGISTRY ----
registerPage('container-registry', (container) => {
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Container Registry</div>
      <div class="page-title"><div class="page-title-icon">🐳</div><span>Azure Container Registry</span></div>
      <div class="page-subtitle">Build, store, and manage container images and artifacts in a private registry.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Container Registry (ACR)?</strong> Like Docker Hub, but private and inside Azure. You push Docker images here and pull them from AKS, App Service, or Container Instances. For ML: package your model + inference code as a Docker image, push to ACR, and deploy anywhere. Integrates with Azure Pipelines for automated builds.</div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Registries</div><button class="btn btn-primary btn-sm" onclick="showToast('Registry created!','success')">+ Create Registry</button></div>
      <div class="card-body" style="padding:0">
        <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid #f3f2f1">
          <span style="font-size:22px">🐳</span>
          <div style="flex:1">
            <div style="font-weight:600">adewaleregistry.azurecr.io</div>
            <div style="font-size:12px;color:#8a8886">Basic tier · East US · 3 repositories</div>
          </div>
          <span class="badge badge-running">Active</span>
        </div>
        <div style="padding:12px 16px">
          <div style="font-size:12px;font-weight:600;color:#605e5c;margin-bottom:8px">Repositories</div>
          ${['ml-inference:v2.1', 'data-pipeline:latest', 'api-server:v1.3'].map(img => `
            <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f3f2f1;font-size:13px">
              <span>📦</span>
              <span style="flex:1;font-family:monospace">${img}</span>
              <button class="btn btn-ghost btn-sm" onclick="showToast('docker pull adewaleregistry.azurecr.io/${img}','info')">Pull</button>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
});
