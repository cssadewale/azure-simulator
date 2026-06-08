/* =====================================================
   DATA & ANALYTICS PAGES
   ===================================================== */

// ---- SYNAPSE ANALYTICS ----
registerPage('synapse', (container) => {
  const ws = AzureData.synapseWorkspaces[0];
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Synapse Analytics</div>
      <div class="page-title"><div class="page-title-icon">📊</div><span>Azure Synapse Analytics</span></div>
      <div class="page-subtitle">Limitless analytics service that brings together data integration, enterprise data warehousing, and big data analytics.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="showToast('Opening Synapse Studio...','info');setTimeout(()=>showToast('Synapse Studio ready!','success'),1200)">Open Synapse Studio</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Synapse Analytics?</strong> Think of Synapse as your unified data platform. It combines:<br>
      • <strong>SQL Pools</strong> — Data warehouse for structured big data queries (T-SQL)<br>
      • <strong>Spark Pools</strong> — Apache Spark for processing large datasets with Python/Scala<br>
      • <strong>Data Integration</strong> — Built-in pipelines (same as Data Factory)<br>
      • <strong>Synapse Link</strong> — Real-time analytics on operational data from Cosmos DB or SQL<br>
      As a data scientist, Synapse replaces having separate tools for ETL, warehousing, and notebook-based exploration.</div>
    </div>
    <div class="grid-4" style="margin-bottom:20px">
      <div class="metric-card"><div class="metric-label">SQL Pools</div><div class="metric-value">${ws.sqlPools}</div><div class="metric-sub">dedicated compute</div></div>
      <div class="metric-card"><div class="metric-label">Spark Pools</div><div class="metric-value">${ws.sparkPools}</div><div class="metric-sub">big data compute</div></div>
      <div class="metric-card"><div class="metric-label">Pipelines</div><div class="metric-value">${ws.pipelines}</div><div class="metric-sub">integration pipelines</div></div>
      <div class="metric-card"><div class="metric-label">Linked Services</div><div class="metric-value">${ws.linkedServices}</div><div class="metric-sub">connected data sources</div></div>
    </div>
    <div class="grid-2" style="margin-bottom:16px">
      <div class="card">
        <div class="card-header"><div class="card-title">SQL Pools</div><button class="btn btn-primary btn-sm" onclick="showToast('Creating SQL pool...','info')">+ New Pool</button></div>
        <div class="card-body">
          <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f3f2f1">
            <span style="font-size:22px">🗄️</span>
            <div style="flex:1">
              <div style="font-weight:600;font-size:13px">DataWarehouseDW100c</div>
              <div style="font-size:12px;color:#8a8886">DW100c — Paused (Free while not in use)</div>
            </div>
            <span class="badge badge-pending">Paused</span>
          </div>
          <div class="info-box" style="margin-top:10px;font-size:12px">
            <span>💡</span><span>SQL pools are billed per hour when active. Always pause when not in use to avoid charges on your student subscription!</span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Spark Pools</div><button class="btn btn-primary btn-sm" onclick="showToast('Creating Spark pool...','info')">+ New Pool</button></div>
        <div class="card-body">
          <div style="display:flex;align-items:center;gap:12px;padding:10px 0">
            <span style="font-size:22px">⚡</span>
            <div style="flex:1">
              <div style="font-weight:600;font-size:13px">SparkPool-Small</div>
              <div style="font-size:12px;color:#8a8886">Node size: Small (4 vCores, 28 GB) · Auto-pause: 15 min</div>
            </div>
            <span class="badge badge-running">Ready</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Sample Synapse Spark Notebook (Python)</div></div>
      <div class="card-body">
        <div class="log-query-box">
<span class="comment"># Synapse Spark — Load data from Azure Storage and run analytics</span>
<span class="kw">from</span> pyspark.sql <span class="kw">import</span> SparkSession
<span class="kw">from</span> pyspark.sql.functions <span class="kw">import</span> col, avg, count

spark = SparkSession.builder.getOrCreate()

<span class="comment"># Read parquet from Azure Data Lake Storage Gen2</span>
df = spark.read.parquet(
    <span class="str">"abfss://processed-data@adewalemlstorage.dfs.core.windows.net/features_train.parquet"</span>
)

<span class="comment"># Explore data</span>
df.printSchema()
df.show(<span class="num">5</span>)
print(<span class="str">f"Rows: {df.count():,}  | Columns: {len(df.columns)}"</span>)

<span class="comment"># Summary statistics</span>
df.describe().show()
        </div>
      </div>
    </div>
  `;
});

// ---- DATABRICKS ----
registerPage('databricks', (container) => {
  const dbr = AzureData.databricks[0];
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Databricks</div>
      <div class="page-title"><div class="page-title-icon">🔷</div><span>Azure Databricks</span></div>
      <div class="page-subtitle">Apache Spark-based analytics platform optimized for Azure, with collaborative notebooks and MLflow integration.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="showToast('Opening Databricks workspace...','info');setTimeout(()=>showToast('Workspace ready!','success'),1200)">Launch Workspace</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Databricks?</strong> A fast, collaborative Apache Spark-based analytics platform. Key features for data scientists:<br>
      • <strong>Notebooks</strong> — Python/R/Scala/SQL interactive notebooks like Jupyter but collaborative<br>
      • <strong>Clusters</strong> — Managed Spark clusters that autoscale and terminate automatically<br>
      • <strong>MLflow</strong> — Built-in experiment tracking, model registry, and deployment<br>
      • <strong>Delta Lake</strong> — ACID transactions on data lakes (data reliability for ML pipelines)<br>
      • <strong>AutoML</strong> — Automated machine learning built in<br>
      Databricks is the industry-standard tool for production ML at scale.</div>
    </div>
    <div class="grid-4" style="margin-bottom:20px">
      <div class="metric-card"><div class="metric-label">Clusters</div><div class="metric-value">${dbr.clusters}</div><div class="metric-sub">active spark clusters</div></div>
      <div class="metric-card"><div class="metric-label">Notebooks</div><div class="metric-value">${dbr.notebooks}</div><div class="metric-sub">in workspace</div></div>
      <div class="metric-card"><div class="metric-label">Jobs</div><div class="metric-value">${dbr.jobs}</div><div class="metric-sub">scheduled workflows</div></div>
      <div class="metric-card"><div class="metric-label">Tier</div><div class="metric-value" style="font-size:18px">${dbr.tier}</div><div class="metric-sub">workspace tier</div></div>
    </div>
    <div class="grid-2" style="margin-bottom:16px">
      <div class="card">
        <div class="card-header"><div class="card-title">Clusters</div><button class="btn btn-primary btn-sm" onclick="showToast('Creating cluster...','info')">+ Create Cluster</button></div>
        <div class="card-body" style="padding:0">
          ${[
            { name: 'ML-Training-Cluster', state: 'Running', workers: '4 Standard_D4s_v3', autoscale: true },
            { name: 'ETL-Cluster', state: 'Terminated', workers: '2 Standard_D2s_v3', autoscale: false }
          ].map(c => `
            <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #f3f2f1">
              <span style="font-size:18px">⚡</span>
              <div style="flex:1">
                <div style="font-weight:600;font-size:13px">${c.name}</div>
                <div style="font-size:12px;color:#8a8886">${c.workers} ${c.autoscale ? '· Autoscale ON' : ''}</div>
              </div>
              ${statusBadge(c.state)}
              <button class="btn btn-ghost btn-sm" onclick="showToast('${c.state==='Running'?'Terminating':'Starting'} cluster...','info')">${c.state==='Running'?'Terminate':'Start'}</button>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Recent Notebooks</div><button class="btn btn-ghost btn-sm" onclick="showToast('Opening notebook editor...','info')">New Notebook</button></div>
        <div class="card-body" style="padding:0">
          ${[
            { name: '01_data_exploration.py', lang: 'Python', modified: '2h ago' },
            { name: '02_feature_engineering.py', lang: 'Python', modified: '5h ago' },
            { name: '03_model_training_mlflow.py', lang: 'Python', modified: '1d ago' },
            { name: '04_hyperparameter_tuning.py', lang: 'Python', modified: '2d ago' },
            { name: 'delta_lake_setup.sql', lang: 'SQL', modified: '3d ago' }
          ].map(nb => `
            <div style="display:flex;align-items:center;gap:10px;padding:10px 16px;border-bottom:1px solid #f3f2f1;cursor:pointer" onclick="openDbrNotebook('${nb.name}')">
              <span style="font-size:16px">📓</span>
              <div style="flex:1">
                <div style="font-size:13px;color:#0078D4">${nb.name}</div>
                <div style="font-size:11px;color:#8a8886">${nb.lang} · ${nb.modified}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Sample Databricks Notebook — MLflow Experiment</div></div>
      <div class="card-body">
        <div class="log-query-box">
<span class="comment"># Azure Databricks + MLflow — Model Training with Experiment Tracking</span>
<span class="kw">import</span> mlflow
<span class="kw">import</span> mlflow.sklearn
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score, f1_score
<span class="kw">import</span> pandas <span class="kw">as</span> pd

mlflow.set_experiment(<span class="str">"/Users/adewale/customer-churn"</span>)

<span class="kw">with</span> mlflow.start_run():
    <span class="comment"># Log parameters</span>
    params = {<span class="str">"n_estimators"</span>: <span class="num">200</span>, <span class="str">"max_depth"</span>: <span class="num">8</span>, <span class="str">"random_state"</span>: <span class="num">42</span>}
    mlflow.log_params(params)

    model = RandomForestClassifier(**params)
    model.fit(X_train, y_train)
    preds = model.predict(X_test)

    <span class="comment"># Log metrics</span>
    mlflow.log_metric(<span class="str">"accuracy"</span>, accuracy_score(y_test, preds))
    mlflow.log_metric(<span class="str">"f1_score"</span>, f1_score(y_test, preds))

    <span class="comment"># Log model to MLflow Model Registry</span>
    mlflow.sklearn.log_model(model, <span class="str">"churn-classifier"</span>,
        registered_model_name=<span class="str">"CustomerChurnModel"</span>)
        </div>
      </div>
    </div>
  `;
});

function openDbrNotebook(name) {
  showToast(`Opening notebook: ${name}`, 'info');
}

// ---- ML STUDIO ----
registerPage('ml-studio', (container) => {
  const ws = AzureData.mlStudio.workspaces[0];
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Machine Learning</div>
      <div class="page-title"><div class="page-title-icon">🤖</div><span>Azure Machine Learning Studio</span></div>
      <div class="page-subtitle">An enterprise-grade service for the end-to-end machine learning lifecycle.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="showToast('Opening ML Studio...','info');setTimeout(()=>showToast('Studio is ready!','success'),1000)">Launch Studio</button>
        <button class="btn btn-secondary" onclick="openNewExperimentModal()">+ New Experiment</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure ML Studio?</strong> The complete ML platform for professional data scientists. It covers:<br>
      • <strong>Designer</strong> — Drag-and-drop ML pipeline builder (no code)<br>
      • <strong>Automated ML</strong> — Auto-selects the best algorithm and hyperparameters<br>
      • <strong>Notebooks</strong> — JupyterLab with Azure ML SDK pre-installed<br>
      • <strong>Experiments</strong> — Track runs, metrics, artifacts, and compare models<br>
      • <strong>Model Registry</strong> — Version and manage trained models<br>
      • <strong>Endpoints</strong> — Deploy models as REST APIs in one click<br>
      • <strong>Compute</strong> — CPU/GPU clusters and compute instances for training</div>
    </div>
    <div class="grid-4" style="margin-bottom:20px">
      <div class="metric-card"><div class="metric-label">Experiments</div><div class="metric-value">${ws.experiments}</div><div class="metric-sub">total experiments</div></div>
      <div class="metric-card"><div class="metric-label">Registered Models</div><div class="metric-value">${ws.models}</div><div class="metric-sub">in model registry</div></div>
      <div class="metric-card"><div class="metric-label">Endpoints</div><div class="metric-value">${ws.endpoints}</div><div class="metric-sub">deployed REST APIs</div></div>
      <div class="metric-card"><div class="metric-label">Compute</div><div class="metric-value">${ws.computes.length}</div><div class="metric-sub">clusters attached</div></div>
    </div>
    <div id="mlTabs">
      <div class="tab-bar">
        <button class="tab-item active" data-tab="experiments" onclick="setActiveTab('mlTabs','experiments')">Experiments</button>
        <button class="tab-item" data-tab="models" onclick="setActiveTab('mlTabs','models')">Model Registry</button>
        <button class="tab-item" data-tab="compute" onclick="setActiveTab('mlTabs','compute')">Compute</button>
        <button class="tab-item" data-tab="endpoints" onclick="setActiveTab('mlTabs','endpoints')">Endpoints</button>
        <button class="tab-item" data-tab="notebook" onclick="setActiveTab('mlTabs','notebook')">Notebooks</button>
      </div>
      <div data-pane="experiments">
        <div class="card">
          <div class="card-header"><div class="card-title">Experiments</div><button class="btn btn-primary btn-sm" onclick="openNewExperimentModal()">+ New Run</button></div>
          <table class="data-table">
            <thead><tr><th>Name</th><th>Status</th><th>Best Accuracy</th><th>Algorithm</th><th>Runs</th><th>Duration</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>
              ${AzureData.mlStudio.experiments.map(e => `
                <tr>
                  <td><a class="link" onclick="openExperimentDetail('${e.id}')">${e.name}</a></td>
                  <td>${statusBadge(e.status)}</td>
                  <td style="font-weight:600;color:${e.bestAccuracy!=='—'?'#107c10':'#8a8886'}">${e.bestAccuracy}</td>
                  <td>${e.algorithm}</td>
                  <td>${e.runs}</td>
                  <td>${e.duration}</td>
                  <td>${e.created}</td>
                  <td><button class="btn btn-ghost btn-sm" onclick="openExperimentDetail('${e.id}')">View</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div data-pane="models" style="display:none">
        <div class="card">
          <div class="card-header"><div class="card-title">Registered Models</div></div>
          <table class="data-table">
            <thead><tr><th>Model Name</th><th>Framework</th><th>Accuracy</th><th>Size</th><th>Deployed</th><th>Actions</th></tr></thead>
            <tbody>
              ${AzureData.mlStudio.models.map(m => `
                <tr>
                  <td><strong>${m.name}</strong></td>
                  <td>${m.framework}</td>
                  <td style="color:#107c10;font-weight:600">${m.accuracy}</td>
                  <td>${m.size}</td>
                  <td>${m.deployed ? '<span class="badge badge-running">Deployed</span>' : '<span class="badge badge-info">Staged</span>'}</td>
                  <td>
                    <button class="btn btn-ghost btn-sm" onclick="showToast('Deploying model...','info');setTimeout(()=>showToast('Model deployed as REST endpoint!','success'),2000)">Deploy</button>
                    <button class="btn btn-ghost btn-sm" onclick="showToast('Downloading model artifact...','info')">Download</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div data-pane="compute" style="display:none">
        <div class="card">
          <div class="card-header"><div class="card-title">Compute Clusters</div><button class="btn btn-primary btn-sm" onclick="showToast('Creating compute cluster...','info')">+ New Compute</button></div>
          <div class="card-body" style="padding:0">
            ${ws.computes.map(c => `
              <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #f3f2f1">
                <span style="font-size:20px">🖥️</span>
                <div style="flex:1">
                  <div style="font-weight:600;font-size:13px">${c}</div>
                  <div style="font-size:12px;color:#8a8886">${c.includes('gpu') ? 'GPU cluster · NC6s_v3 · 0/6 nodes (idle)' : 'CPU cluster · D2s_v3 · 0/4 nodes (idle)'}</div>
                </div>
                <span class="badge badge-info">Idle</span>
                <button class="btn btn-ghost btn-sm" onclick="showToast('Resizing cluster...','info')">Resize</button>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="info-box" style="margin-top:12px">
          <span>💡</span><span>Compute clusters automatically scale to 0 nodes when idle — you are not charged when no jobs are running. Always set min_nodes=0 to avoid costs!</span>
        </div>
      </div>
      <div data-pane="endpoints" style="display:none">
        <div class="card">
          <div class="card-header"><div class="card-title">Online Endpoints (REST APIs)</div></div>
          <div class="card-body" style="padding:0">
            ${[
              { name: 'house-price-endpoint', model: 'house-price-v2', status: 'Healthy', url: 'https://house-price-endpoint.eastus.inference.ml.azure.com/score', rps: '12 req/min' },
              { name: 'churn-api-endpoint', model: 'churn-classifier-v1', status: 'Healthy', url: 'https://churn-api-endpoint.eastus.inference.ml.azure.com/score', rps: '5 req/min' }
            ].map(ep => `
              <div style="padding:14px 16px;border-bottom:1px solid #f3f2f1">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
                  <span style="font-size:18px">🌐</span>
                  <strong>${ep.name}</strong>
                  ${statusBadge(ep.status)}
                  <span style="font-size:12px;color:#8a8886;margin-left:auto">${ep.rps}</span>
                </div>
                <div style="font-size:12px;color:#8a8886">Model: ${ep.model}</div>
                <div style="font-size:11px;font-family:monospace;color:#0078D4;margin-top:4px">${ep.url}</div>
                <div style="margin-top:8px;display:flex;gap:6px">
                  <button class="btn btn-ghost btn-sm" onclick="openEndpointTest('${ep.name}','${ep.url}')">Test</button>
                  <button class="btn btn-ghost btn-sm" onclick="showToast('Viewing logs...','info')">Logs</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <div data-pane="notebook" style="display:none">
        <div class="card">
          <div class="card-header"><div class="card-title">Azure ML SDK Quickstart (Python)</div></div>
          <div class="card-body">
            <div class="log-query-box">
<span class="comment"># Install: pip install azure-ai-ml azure-identity</span>
<span class="kw">from</span> azure.ai.ml <span class="kw">import</span> MLClient
<span class="kw">from</span> azure.identity <span class="kw">import</span> DefaultAzureCredential
<span class="kw">from</span> azure.ai.ml.entities <span class="kw">import</span> AmlCompute, Model

<span class="comment"># Connect to workspace</span>
ml_client = MLClient(
    DefaultAzureCredential(),
    subscription_id=<span class="str">"a1b2c3d4-e5f6-7890-abcd-ef1234567890"</span>,
    resource_group_name=<span class="str">"rg-ml-experiments"</span>,
    workspace_name=<span class="str">"adewale-ml-workspace"</span>
)

<span class="comment"># List experiments</span>
<span class="kw">for</span> exp <span class="kw">in</span> ml_client.jobs.list():
    print(exp.name, exp.status)

<span class="comment"># Register a model</span>
model = Model(path=<span class="str">"./outputs/model.pkl"</span>, name=<span class="str">"house-price"</span>)
ml_client.models.create_or_update(model)
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
});

function openExperimentDetail(id) {
  const e = AzureData.mlStudio.experiments.find(x => x.id === id);
  if (!e) return;
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>🧪 ${e.name}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="grid-2" style="gap:12px;margin-bottom:16px">
          <div class="card"><div class="card-body">
            <div class="detail-prop"><div class="detail-prop-label">Status</div><div class="detail-prop-value">${statusBadge(e.status)}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">Algorithm</div><div class="detail-prop-value">${e.algorithm}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">Total Runs</div><div class="detail-prop-value">${e.runs}</div></div>
            <div class="detail-prop"><div class="detail-prop-label">Duration</div><div class="detail-prop-value">${e.duration}</div></div>
          </div></div>
          <div class="card"><div class="card-body">
            <div class="metric-label">Best Accuracy</div>
            <div class="metric-value" style="color:#107c10">${e.bestAccuracy}</div>
            <div class="metric-sub">across all runs</div>
            ${e.bestAccuracy !== '—' ? `<div class="progress-bar" style="margin-top:10px"><div class="progress-fill success" style="width:${e.bestAccuracy}"></div></div>` : ''}
          </div></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">Run History</div></div>
          <table class="data-table">
            <thead><tr><th>Run #</th><th>Accuracy</th><th>F1 Score</th><th>Parameters</th><th>Duration</th></tr></thead>
            <tbody>
              ${Array.from({length: Math.min(e.runs, 5)}, (_, i) => {
                const acc = (parseFloat(e.bestAccuracy) - i * 0.012).toFixed(3);
                const f1 = (parseFloat(e.bestAccuracy) - i * 0.018 - 0.02).toFixed(3);
                return `<tr>
                  <td>Run ${e.runs - i}</td>
                  <td style="color:#107c10;font-weight:600">${acc}%</td>
                  <td>${f1}</td>
                  <td style="font-size:11px">n_estimators=${100+i*50}, max_depth=${6+i}</td>
                  <td>${Math.floor(Math.random()*30+10)}m ${Math.floor(Math.random()*60)}s</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="showToast('Registering best model...','info');setTimeout(()=>showToast('Model registered!','success'),1500);closeModal()">Register Best Model</button>
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      </div>
    </div>
  `);
}

function openNewExperimentModal() {
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>🧪 Create New Experiment</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Experiment Name *</label><input id="expName" class="form-control" placeholder="e.g. sales-forecast-v1"/></div>
        <div class="form-group"><label class="form-label">Algorithm</label>
          <select id="expAlgo" class="form-control">
            <option>AutoML (Automated)</option><option>XGBoost</option><option>Random Forest</option><option>LightGBM</option><option>Neural Network</option><option>Linear Regression</option><option>Logistic Regression</option><option>LSTM (Time Series)</option>
          </select>
        </div>
        <div class="form-group"><label class="form-label">Task Type</label>
          <select class="form-control"><option>Classification</option><option>Regression</option><option>Time Series Forecasting</option><option>Clustering</option></select>
        </div>
        <div class="form-group"><label class="form-label">Compute Target</label>
          <select class="form-control"><option>cpu-cluster-sm (4 nodes)</option><option>gpu-cluster-nc6 (1 node)</option></select>
        </div>
        <div class="form-group"><label class="form-label">Primary Metric</label>
          <select class="form-control"><option>Accuracy</option><option>AUC Weighted</option><option>F1 Score</option><option>RMSE</option><option>R² Score</option></select>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="createExperiment()">Submit Run</button>
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>
  `);
}

function createExperiment() {
  const name = document.getElementById('expName').value.trim();
  const algo = document.getElementById('expAlgo').value;
  if (!name) { showToast('Experiment name required.', 'error'); return; }
  AzureData.mlStudio.experiments.unshift({ id: newGuid(), name, status: 'Running', runs: 1, bestAccuracy: '—', algorithm: algo, duration: 'running...', created: todayStr() });
  showToast(`Experiment "${name}" submitted!`, 'success');
  closeModal();
  navigateTo('ml-studio');
}

function openEndpointTest(name, url) {
  openModal(`
    <div class="modal">
      <div class="modal-header"><h2>🧪 Test Endpoint — ${name}</h2><button class="modal-close" onclick="closeModal()">✕</button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Endpoint URL</label><input class="form-control" value="${url}" readonly/></div>
        <div class="form-group"><label class="form-label">Request Body (JSON)</label>
          <div class="log-query-box" contenteditable="true" id="endpointBody" style="min-height:80px">
{ <span class="json-key">"data"</span>: [[<span class="json-number">1500</span>, <span class="json-number">3</span>, <span class="json-number">2</span>, <span class="json-number">1985</span>, <span class="json-number">7200</span>]] }
          </div>
        </div>
        <button class="btn btn-primary" onclick="testEndpoint()" style="margin-bottom:12px">▶ Send Request</button>
        <div id="endpointResponse" style="display:none">
          <div class="form-label">Response (200 OK — 42ms)</div>
          <div class="json-viewer">{ <span class="json-key">"predictions"</span>: [<span class="json-number">285400.50</span>] }</div>
        </div>
      </div>
      <div class="modal-footer"><button class="btn btn-secondary" onclick="closeModal()">Close</button></div>
    </div>
  `);
}

function testEndpoint() {
  showToast('Sending request to endpoint...', 'info');
  setTimeout(() => {
    const el = document.getElementById('endpointResponse');
    if (el) el.style.display = '';
    showToast('Response received: 200 OK', 'success');
  }, 800);
}

// ---- DATA FACTORY ----
registerPage('data-factory', (container) => {
  const adf = AzureData.dataFactory[0];
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Data Factory</div>
      <div class="page-title"><div class="page-title-icon">🔄</div><span>Azure Data Factory</span></div>
      <div class="page-subtitle">Cloud-based ETL and data integration service for building data pipelines at scale.</div>
      <div class="page-actions">
        <button class="btn btn-primary" onclick="showToast('Opening ADF Studio...','info');setTimeout(()=>showToast('ADF Studio loaded!','success'),1000)">Launch ADF Studio</button>
      </div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Data Factory?</strong> ADF is a serverless ETL (Extract, Transform, Load) service. You build pipelines to:<br>
      • <strong>Ingest</strong> data from 90+ connectors (SQL Server, Blob, HTTP APIs, SAP, Salesforce...)<br>
      • <strong>Transform</strong> data using data flows (visual) or Spark/SQL compute<br>
      • <strong>Load</strong> results into Azure SQL, Synapse, Cosmos DB, or Blob Storage<br>
      As a data scientist, ADF feeds your ML models with clean, fresh data on a schedule.</div>
    </div>
    <div class="grid-4" style="margin-bottom:20px">
      <div class="metric-card"><div class="metric-label">Pipelines</div><div class="metric-value">${adf.pipelines.length}</div></div>
      <div class="metric-card"><div class="metric-label">Triggers</div><div class="metric-value">${adf.triggers}</div></div>
      <div class="metric-card"><div class="metric-label">Linked Services</div><div class="metric-value">${adf.linkedServices}</div></div>
      <div class="metric-card"><div class="metric-label">Succeeded Today</div><div class="metric-value" style="color:#107c10">${adf.pipelines.filter(p=>p.status==='Succeeded').length}</div></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Pipelines</div><button class="btn btn-primary btn-sm" onclick="showToast('Opening pipeline designer...','info')">+ New Pipeline</button></div>
      <div>
        ${adf.pipelines.map(p => `
          <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid #f3f2f1">
            <span style="font-size:20px">🔄</span>
            <div style="flex:1">
              <div style="font-weight:600;font-size:13px">${p.name}</div>
              <div style="font-size:12px;color:#8a8886">Last run: ${p.lastRun} · Duration: ${p.duration}</div>
            </div>
            ${statusBadge(p.status)}
            <button class="btn btn-ghost btn-sm" onclick="showToast('Triggering pipeline now...','info');setTimeout(()=>showToast('Pipeline run complete!','success'),2000)">▶ Run</button>
            <button class="btn btn-ghost btn-sm" onclick="showToast('Opening pipeline editor...','info')">Edit</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
});

// ---- EVENT HUBS ----
registerPage('event-hubs', (container) => {
  const eh = AzureData.eventHubs[0];
  container.innerHTML = `
    <div class="page-header">
      <div class="page-breadcrumb"><span onclick="navigateTo('dashboard')">Home</span> › Event Hubs</div>
      <div class="page-title"><div class="page-title-icon">📡</div><span>Azure Event Hubs</span></div>
      <div class="page-subtitle">Real-time data streaming and event ingestion service capable of receiving millions of events per second.</div>
    </div>
    <div class="info-box" style="margin-bottom:16px">
      <span>📘</span>
      <div><strong>What is Azure Event Hubs?</strong> A big data streaming platform. Think of it as a message bus or a real-time pipe. Producers send events (IoT sensor data, clickstream, model predictions) into Event Hubs, and consumers (Azure Functions, Databricks, Stream Analytics) process them. It's like Apache Kafka, fully managed. Useful for real-time ML model serving and telemetry pipelines.</div>
    </div>
    <div class="grid-3" style="margin-bottom:16px">
      <div class="metric-card"><div class="metric-label">Event Hubs</div><div class="metric-value">${eh.hubs.length}</div></div>
      <div class="metric-card"><div class="metric-label">Throughput Units</div><div class="metric-value">${eh.throughput}</div><div class="metric-sub">1 TU = 1MB/s in, 2MB/s out</div></div>
      <div class="metric-card"><div class="metric-label">Retention</div><div class="metric-value" style="font-size:18px">${eh.messageRetention}</div></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Event Hubs in ${eh.name}</div><button class="btn btn-primary btn-sm" onclick="showToast('Creating Event Hub...','info')">+ New Event Hub</button></div>
      <div>
        ${eh.hubs.map(h => `
          <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #f3f2f1">
            <span style="font-size:20px">📡</span>
            <div style="flex:1">
              <div style="font-weight:600;font-size:13px">${h}</div>
              <div style="font-size:12px;color:#8a8886">Partitions: 4 · Consumer groups: 1</div>
            </div>
            <span class="badge badge-running">Active</span>
            <button class="btn btn-ghost btn-sm" onclick="showToast('Sending test event...','info');setTimeout(()=>showToast('Event sent! 200 OK','success'),500)">Send Event</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
});
