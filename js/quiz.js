/* =====================================================
   QUIZ.JS — Azure Exam Quiz Simulator
   Covers AZ-900, DP-900, AZ-104, DP-100 exam content.
   No AI API used — all questions are hardcoded.

   What is this feature?
   A timed, scored multiple-choice quiz simulator modelled
   on real Microsoft certification exams. It gives instant
   feedback per question, explains why each answer is
   correct, and shows a full results summary at the end.
   ===================================================== */

const QuizBanks = {
  'AZ-900': [
    {
      q: 'Which cloud service model gives you the most control over the operating system and middleware?',
      scenario: 'Your company needs to deploy a custom application that requires a specific version of a Linux kernel. Which model is most appropriate?',
      options: ['SaaS (Software as a Service)', 'PaaS (Platform as a Service)', 'IaaS (Infrastructure as a Service)', 'FaaS (Function as a Service)'],
      correct: 2,
      explanation: 'IaaS provides virtual machines where you control the OS, middleware, and runtime. SaaS is fully managed (e.g. Office 365). PaaS manages the OS for you. FaaS is event-driven serverless compute.'
    },
    {
      q: 'What Azure service allows you to store unstructured binary data like images, videos, and datasets?',
      options: ['Azure SQL Database', 'Azure Blob Storage', 'Azure Table Storage', 'Azure Files'],
      correct: 1,
      explanation: 'Azure Blob Storage is designed for unstructured binary data (Binary Large Objects). SQL Database is for structured relational data. Table Storage is for NoSQL key-value data. Azure Files provides managed file shares.'
    },
    {
      q: 'Which Azure concept describes the geographical location where Azure data centres are physically located?',
      options: ['Resource Group', 'Availability Zone', 'Region', 'Subscription'],
      correct: 2,
      explanation: 'A Region is a geographical area containing one or more data centres (e.g. East US, West Europe). Availability Zones are physically separate data centres within a region for high availability. Resource Groups are logical containers. Subscriptions are billing boundaries.'
    },
    {
      q: 'What is the purpose of an Azure Resource Group?',
      options: ['To bill resources separately', 'To logically organise and manage related Azure resources as a single unit', 'To provide network isolation between VMs', 'To replicate data across regions'],
      correct: 1,
      explanation: 'A Resource Group is a logical container for related Azure resources. You can manage, monitor, and delete all resources in a group together. It does not provide billing isolation (that is the Subscription) or network isolation (that is a VNet).'
    },
    {
      q: 'Which Azure service provides identity and access management (IAM) for cloud resources?',
      options: ['Azure Key Vault', 'Microsoft Entra ID (Azure Active Directory)', 'Azure Security Center', 'Azure Policy'],
      correct: 1,
      explanation: 'Microsoft Entra ID (formerly Azure Active Directory) is the cloud identity service. It manages users, groups, app registrations, and access to Azure resources via RBAC. Key Vault stores secrets. Security Center monitors threats. Azure Policy enforces governance rules.'
    },
    {
      q: 'What is the Azure free account student credit amount?',
      options: ['$50', '$100', '$200', '$500'],
      correct: 1,
      explanation: 'Azure for Students provides $100 in free credits for 12 months, without requiring a credit card. The standard Azure free account provides $200 for 30 days.'
    },
    {
      q: 'Which service provides a managed Kubernetes cluster in Azure?',
      options: ['Azure Container Instances (ACI)', 'Azure Kubernetes Service (AKS)', 'Azure App Service', 'Azure Batch'],
      correct: 1,
      explanation: 'AKS (Azure Kubernetes Service) provides a fully managed Kubernetes cluster. ACI is for running individual containers without a cluster. App Service is for web applications. Azure Batch is for large-scale parallel compute jobs.'
    },
    {
      q: 'What does CapEx stand for in the context of cloud economics?',
      options: ['Capital Expenditure — upfront hardware investment', 'Capacity Expenditure — scaling costs', 'Cloud Application Extension', 'Compute and Processing Exchange'],
      correct: 0,
      explanation: 'CapEx (Capital Expenditure) refers to upfront spending on physical infrastructure (servers, data centres). Cloud shifts this to OpEx (Operational Expenditure) — pay-as-you-go costs with no large upfront investment. This is one of the key financial benefits of cloud.'
    },
    {
      q: 'Which Azure service monitors your resources and sends alerts when metrics exceed thresholds?',
      options: ['Azure Advisor', 'Azure Monitor', 'Azure Security Center', 'Azure Policy'],
      correct: 1,
      explanation: 'Azure Monitor collects metrics and logs from Azure resources and can trigger alerts (email, SMS, webhook) when conditions are met. Azure Advisor gives best-practice recommendations. Security Center focuses on security threats. Azure Policy enforces compliance rules.'
    },
    {
      q: 'What is the shared responsibility model in cloud computing?',
      options: ['Microsoft is responsible for all security', 'The customer is responsible for all security', 'Security responsibility is split between the cloud provider and the customer depending on the service model', 'Security is handled by a third-party vendor'],
      correct: 2,
      explanation: 'In the shared responsibility model, Microsoft manages physical security, hardware, and (for PaaS/SaaS) the OS and platform. Customers are always responsible for their data, accounts, and access management. The split varies: IaaS requires more customer responsibility than SaaS.'
    },
    {
      q: 'Which Azure tool gives personalised recommendations to optimise cost, security, reliability, and performance?',
      options: ['Azure Monitor', 'Azure Policy', 'Azure Advisor', 'Azure Cost Management'],
      correct: 2,
      explanation: 'Azure Advisor analyses your resource configuration and usage and provides actionable recommendations across four categories: Cost (e.g. downsize underused VMs), Security (e.g. enable MFA), Reliability (e.g. enable soft delete), and Performance (e.g. increase throughput).'
    },
    {
      q: 'What is an Availability Zone in Azure?',
      options: ['A global CDN point of presence', 'A physically separate data centre within an Azure region with independent power, cooling, and networking', 'A logical grouping of subscriptions', 'A disaster recovery site in another country'],
      correct: 1,
      explanation: 'Availability Zones are physically separate data centres within a single region. They protect against single data centre failures. If you deploy a VM in Zone 1 and it fails, Zone 2 and 3 continue operating. Not all Azure regions support Availability Zones.'
    }
  ],

  'DP-900': [
    {
      q: 'What type of database is Azure Cosmos DB?',
      options: ['Relational (SQL) database', 'Multi-model NoSQL database', 'In-memory cache', 'Time-series database only'],
      correct: 1,
      explanation: 'Cosmos DB is a globally distributed, multi-model NoSQL database supporting Core SQL (documents), MongoDB, Cassandra, Gremlin (graphs), and Table APIs. It is not a traditional relational database — use Azure SQL Database for relational data.'
    },
    {
      q: 'Which Azure service is used to build ETL (Extract, Transform, Load) data pipelines?',
      options: ['Azure Databricks', 'Azure Data Factory', 'Azure Synapse Analytics', 'Azure Event Hubs'],
      correct: 1,
      explanation: 'Azure Data Factory (ADF) is the cloud ETL service. It has 90+ connectors for ingesting data from diverse sources, visual pipeline designer, and scheduling. Databricks is for Spark-based transformations. Synapse is the unified analytics platform. Event Hubs is for real-time streaming ingestion.'
    },
    {
      q: 'What does OLAP stand for and which Azure service best supports it?',
      options: ['Online Analytical Processing — Azure Synapse Analytics', 'Online Application Processing — Azure App Service', 'Operational Linked Analytics Platform — Azure Monitor', 'Open Language Access Protocol — Azure SQL'],
      correct: 0,
      explanation: 'OLAP (Online Analytical Processing) is for complex queries across large historical datasets — data warehousing. Azure Synapse Analytics (formerly SQL Data Warehouse) is optimised for OLAP. OLTP (Online Transaction Processing) is for frequent small transactions — use Azure SQL Database.'
    },
    {
      q: 'What is the difference between structured, semi-structured, and unstructured data?',
      options: ['They are all the same — just different names', 'Structured has a fixed schema (tables), semi-structured has flexible schema (JSON/XML), unstructured has no schema (images, video)', 'Structured is for databases only, others are for files', 'Unstructured data cannot be stored in Azure'],
      correct: 1,
      explanation: 'Structured data follows a rigid schema — rows and columns in a relational database (Azure SQL). Semi-structured data has flexible schema — JSON documents (Cosmos DB), XML. Unstructured data has no predefined format — images, videos, PDFs (Blob Storage).'
    },
    {
      q: 'Which Azure service enables real-time data streaming and event ingestion at massive scale?',
      options: ['Azure Data Factory', 'Azure Queue Storage', 'Azure Event Hubs', 'Azure Blob Storage'],
      correct: 2,
      explanation: 'Azure Event Hubs is a big data streaming platform that can ingest millions of events per second. It is like Apache Kafka, fully managed. ADF is batch ETL. Queue Storage is for small messages. Blob Storage is for file storage.'
    },
    {
      q: 'What is a data lakehouse architecture?',
      options: ['A physical building that stores data tapes', 'A combination of a data lake (raw storage) and data warehouse (analytics) in one platform', 'A type of NoSQL database', 'An Azure-only proprietary storage format'],
      correct: 1,
      explanation: 'A data lakehouse combines the scalable storage of a data lake (cheap, raw data in any format) with the analytics capabilities of a data warehouse (structured queries, ACID transactions). Azure Synapse Analytics and Databricks Delta Lake implement this architecture.'
    }
  ],

  'DP-100': [
    {
      q: 'What is the purpose of the Azure ML Model Registry?',
      options: ['To store training datasets', 'To version, track, and manage trained ML models for deployment', 'To schedule compute clusters', 'To monitor endpoint latency'],
      correct: 1,
      explanation: 'The Model Registry is a centralised store for versioning trained models. Each model has a name, version, tags, and lineage back to the experiment and dataset used. You promote models through stages (Staging → Production) and deploy from the registry to endpoints.'
    },
    {
      q: 'What is MLflow and how does it integrate with Azure ML?',
      options: ['A Python web framework for building ML APIs', 'An open-source platform for experiment tracking, model packaging, and deployment — natively integrated into Azure ML and Databricks', 'A Microsoft-proprietary tool for AutoML', 'A data pipeline scheduler'],
      correct: 1,
      explanation: 'MLflow is an open-source ML lifecycle management platform. Azure ML has native MLflow integration — you can log metrics with mlflow.log_metric(), register models with mlflow.sklearn.log_model(), and view experiments in the Azure ML Studio UI. Databricks also uses MLflow natively.'
    },
    {
      q: 'What is the difference between a managed online endpoint and a batch endpoint in Azure ML?',
      options: ['They are identical', 'Online endpoints serve real-time predictions (low latency), batch endpoints process large datasets asynchronously (high throughput)', 'Batch endpoints are cheaper but online endpoints are free', 'Online endpoints only support Python'],
      correct: 1,
      explanation: 'Managed online endpoints are REST APIs that return predictions in milliseconds — use for real-time scoring (e.g. a web app calling your model). Batch endpoints process thousands/millions of records asynchronously using compute clusters — use for overnight scoring jobs. Online = low latency, high cost. Batch = high throughput, low cost.'
    },
    {
      q: 'What is the min_nodes parameter in an Azure ML compute cluster and why should it be 0 for student subscriptions?',
      options: ['It sets the maximum GPU memory', 'It is the minimum number of running nodes — set to 0 so the cluster scales down to zero when idle, avoiding unnecessary charges', 'It determines the number of experiments to run in parallel', 'It is the minimum Python version required'],
      correct: 1,
      explanation: 'min_nodes defines the minimum cluster size when idle. Setting min_nodes=0 means the cluster automatically deallocates all nodes when no job is running — you pay nothing. Setting min_nodes=1 means at least 1 VM is always running and charging you, even between training jobs.'
    },
    {
      q: 'Which Python SDK is used to interact with Azure ML workspaces programmatically?',
      options: ['azure-mgmt-ml', 'azureml-sdk (v1) or azure-ai-ml (v2)', 'tensorflow-azure', 'sklearn-azure'],
      correct: 1,
      explanation: 'The Azure ML SDK v2 (azure-ai-ml) is the current recommended SDK for Python. Install with: pip install azure-ai-ml azure-identity. The older SDK v1 (azureml-sdk) is still used in many tutorials. Use MLClient from azure.ai.ml to connect to your workspace.'
    },
    {
      q: 'What is AutoML in Azure Machine Learning?',
      options: ['A tool that writes Python code automatically', 'A feature that automatically trains and evaluates multiple ML algorithms and hyperparameter combinations to find the best model', 'A way to automatically deploy models without testing', 'An automatic data cleaning pipeline'],
      correct: 1,
      explanation: 'AutoML (Automated Machine Learning) iterates over multiple algorithms (XGBoost, LightGBM, Random Forest, etc.) and hyperparameter combinations, evaluating each run\'s performance. It returns the best model with full explainability. Ideal for quickly establishing a baseline before manual tuning.'
    },
    {
      q: 'What is feature engineering in the context of machine learning?',
      options: ['Building the server infrastructure for ML training', 'The process of transforming raw data into informative inputs (features) that improve model performance', 'Selecting which cloud region to train models in', 'Writing the training loop in Python'],
      correct: 1,
      explanation: 'Feature engineering transforms raw data into meaningful inputs. Examples: encoding categorical variables (one-hot encoding), normalising numeric features (StandardScaler), creating interaction terms (price × quantity), extracting time features (hour, day-of-week from timestamp). Good features are more important than algorithm choice.'
    },
    {
      q: 'What is the purpose of cross-validation in model evaluation?',
      options: ['To train multiple models simultaneously on different GPUs', 'To evaluate model performance across multiple data splits to get a reliable, unbiased estimate of generalisation ability', 'To validate Python syntax in training scripts', 'To cross-check billing costs between experiments'],
      correct: 1,
      explanation: 'Cross-validation (e.g. 5-fold CV) splits data into K folds, trains on K-1 folds, and evaluates on the remaining fold — repeated K times. This gives a more reliable accuracy estimate than a single train/test split, especially with small datasets. It reduces the variance of the performance estimate.'
    }
  ],

  'AZ-104': [
    {
      q: 'What is the maximum number of resource groups per Azure subscription by default?',
      options: ['100', '500', '980', 'Unlimited'],
      correct: 2,
      explanation: 'The default limit is 980 resource groups per subscription. This is a soft limit that can be increased by contacting Microsoft Support. Other important limits: 800 resource types per resource group, and quotas on vCPUs per region (e.g. 10 for student subscriptions).'
    },
    {
      q: 'Which Azure RBAC role has full access to all resources but cannot assign roles to others?',
      options: ['Owner', 'Contributor', 'Reader', 'User Access Administrator'],
      correct: 1,
      explanation: 'Contributor has full create/read/update/delete access to resources but cannot manage RBAC role assignments. Owner can do everything including assigning roles. Reader is read-only. User Access Administrator can only manage role assignments.'
    },
    {
      q: 'What does VNet peering enable in Azure networking?',
      options: ['Internet access for VMs', 'Private connectivity between two virtual networks using the Microsoft backbone, without traffic traversing the internet', 'DNS resolution across subscriptions', 'Load balancing between regions'],
      correct: 1,
      explanation: 'VNet peering connects two Azure VNets so resources can communicate privately as if they were on the same network. Traffic uses the Microsoft backbone — not the public internet — so it is fast and secure. Peerings can be within a region (local peering) or across regions (global peering).'
    },
    {
      q: 'What is an NSG (Network Security Group) in Azure?',
      options: ['A service for encrypting storage', 'A firewall-like set of rules controlling inbound and outbound network traffic to Azure resources at subnet or NIC level', 'A monitoring tool for network performance', 'A VPN connection between on-premises and Azure'],
      correct: 1,
      explanation: 'An NSG contains security rules (allow/deny) based on source/destination IP, port, and protocol. You can associate NSGs with subnets or individual VM network interfaces. Rules are evaluated by priority (lowest number = highest priority). Default rules allow VNet-to-VNet traffic and deny all internet inbound.'
    },
    {
      q: 'What is Azure Bastion and why should you use it?',
      options: ['A backup service for VMs', 'A managed PaaS service providing secure RDP/SSH connectivity to VMs directly from the Azure portal over TLS, without exposing public IPs', 'A DDoS protection service', 'A CDN for static websites'],
      correct: 1,
      explanation: 'Azure Bastion provides browser-based RDP/SSH to VMs without requiring a public IP on the VM. This eliminates exposure of port 22 (SSH) and 3389 (RDP) to the internet — a major security risk. Traffic goes through the Azure portal via HTTPS port 443, which is typically allowed through corporate firewalls.'
    }
  ]
};

// Quiz state
let QuizState = {
  active: false,
  exam: '',
  questions: [],
  currentIdx: 0,
  score: 0,
  correctCount: 0,
  wrongCount: 0,
  skippedCount: 0,
  answered: false,
  selectedOption: null,
  timer: null,
  timeLeft: 0,
  startTime: null,
  results: []
};

function openQuizMode() {
  const overlay = document.getElementById('quizOverlay');
  const container = document.getElementById('quizContainer');
  overlay.style.display = 'block';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  renderQuizMenu();
}

function closeQuizMode() {
  document.getElementById('quizOverlay').style.display = 'none';
  document.getElementById('quizContainer').style.display = 'none';
  if (QuizState.timer) clearInterval(QuizState.timer);
  QuizState.active = false;
}

function renderQuizMenu() {
  const c = document.getElementById('quizContainer');
  c.innerHTML = `
    <div class="quiz-topbar">
      <h2>🎯 Azure Exam Quiz Simulator</h2>
      <button onclick="closeQuizMode()" style="background:rgba(255,255,255,0.2);border:none;color:white;padding:6px 12px;border-radius:4px;cursor:pointer;font-family:var(--font)">✕ Close</button>
    </div>
    <div class="quiz-body">
      <div class="info-box" style="margin-bottom:20px">
        <span>📘</span>
        <div><strong>Welcome, Adewale!</strong> This quiz simulates real Microsoft certification exams. Each question matches the style, depth, and wording of actual AZ-900, DP-900, DP-100, and AZ-104 exams. Select an exam below to begin.</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
        ${[
          { exam: 'AZ-900', name: 'Azure Fundamentals', icon: '☁️', q: QuizBanks['AZ-900'].length, level: 'Beginner', desc: 'Core Azure concepts, services, pricing, and governance. The starting point for everyone.', time: 45 },
          { exam: 'DP-900', name: 'Data Fundamentals', icon: '📊', q: QuizBanks['DP-900'].length, level: 'Beginner', desc: 'Data concepts, relational and non-relational data, analytics workloads on Azure.', time: 45 },
          { exam: 'DP-100', name: 'Data Scientist Associate', icon: '🤖', q: QuizBanks['DP-100'].length, level: 'Intermediate', desc: 'Azure ML workspace, experiments, model training, AutoML, and deployment.', time: 90 },
          { exam: 'AZ-104', name: 'Azure Administrator', icon: '🔧', q: QuizBanks['AZ-104'].length, level: 'Intermediate', desc: 'Resource management, networking, storage, VMs, and identity.', time: 115 }
        ].map(e => `
          <div style="border:2px solid var(--card-border);border-radius:8px;padding:16px;cursor:pointer;transition:all 0.2s;background:white" 
               onclick="startQuiz('${e.exam}',${e.time})"
               onmouseover="this.style.borderColor='#0078D4';this.style.boxShadow='0 4px 16px rgba(0,120,212,0.15)'"
               onmouseout="this.style.borderColor='var(--card-border)';this.style.boxShadow='none'">
            <div style="font-size:28px;margin-bottom:8px">${e.icon}</div>
            <div style="font-size:11px;font-weight:700;color:#0078D4;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">${e.exam}</div>
            <div style="font-size:14px;font-weight:700;margin-bottom:6px">${e.name}</div>
            <div style="font-size:12px;color:var(--text-muted);margin-bottom:10px;line-height:1.4">${e.desc}</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <span style="font-size:11px;background:#deecf9;color:#0078D4;padding:2px 8px;border-radius:10px;font-weight:600">${e.level}</span>
              <span style="font-size:11px;background:#f3f2f1;padding:2px 8px;border-radius:10px">${e.q} questions</span>
              <span style="font-size:11px;background:#f3f2f1;padding:2px 8px;border-radius:10px">⏱ ${e.time} min</span>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="info-box warning">
        <span>💡</span>
        <div>
          <strong>Exam tips for Adewale:</strong>
          Start with AZ-900 — it is free to sit ($165 voucher available via Microsoft Learn), and passing it gives you the confidence and vocabulary to tackle DP-900 and DP-100.
          Study on <a href="https://learn.microsoft.com" target="_blank" class="link">Microsoft Learn</a> (free official learning paths) alongside this simulator.
        </div>
      </div>
    </div>
  `;
}

function startQuiz(exam, timeMinutes) {
  const bank = QuizBanks[exam];
  if (!bank || bank.length === 0) { showToast('No questions found for ' + exam, 'error'); return; }

  // Shuffle questions for variety
  const shuffled = [...bank].sort(() => Math.random() - 0.5);

  QuizState = {
    active: true, exam,
    questions: shuffled,
    currentIdx: 0, score: 0,
    correctCount: 0, wrongCount: 0, skippedCount: 0,
    answered: false, selectedOption: null,
    timer: null, timeLeft: timeMinutes * 60,
    startTime: Date.now(), results: []
  };

  renderQuizQuestion();
  startQuizTimer();
  logActivity('action', `Started ${exam} Quiz`, `${exam} Exam Simulator`, 'Learning Tools');
}

function renderQuizQuestion() {
  const c = document.getElementById('quizContainer');
  const qs = QuizState.questions;
  const idx = QuizState.currentIdx;
  const q = qs[idx];
  const total = qs.length;
  const pct = Math.round((idx / total) * 100);

  c.innerHTML = `
    <div class="quiz-topbar">
      <div>
        <h2>🎯 ${QuizState.exam}</h2>
        <div style="font-size:11px;opacity:0.8;margin-top:2px">Question ${idx+1} of ${total}</div>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <div class="quiz-timer" id="quizTimer">--:--</div>
        <button onclick="closeQuizMode()" style="background:rgba(255,255,255,0.2);border:none;color:white;padding:4px 10px;border-radius:4px;cursor:pointer;font-family:var(--font);font-size:12px">✕</button>
      </div>
    </div>
    <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>
    <div class="quiz-body">
      <div class="quiz-question-num">Question ${idx+1} · ${QuizState.exam}</div>
      ${q.scenario ? `<div class="quiz-scenario">📋 Scenario: ${q.scenario}</div>` : ''}
      <div class="quiz-question-text">${q.q}</div>
      <div class="quiz-options" id="quizOptions">
        ${q.options.map((opt, i) => `
          <div class="quiz-option" id="qopt-${i}" onclick="selectOption(${i})">
            <div class="quiz-option-letter">${String.fromCharCode(65+i)}</div>
            <div>${opt}</div>
          </div>
        `).join('')}
      </div>
      <div class="quiz-explanation" id="quizExplanation">
        <strong>${q.options[q.correct]}</strong>
        ${q.explanation}
      </div>
    </div>
    <div class="quiz-footer">
      <div class="quiz-score-display">
        ✓ <strong>${QuizState.correctCount}</strong> correct &nbsp;
        ✗ <strong>${QuizState.wrongCount}</strong> wrong &nbsp;
        Score: <strong>${QuizState.score}%</strong>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-secondary btn-sm" onclick="skipQuestion()">Skip</button>
        <button class="btn btn-primary btn-sm" id="quizNextBtn" onclick="nextQuestion()" disabled>Next →</button>
      </div>
    </div>
  `;
}

function selectOption(idx) {
  if (QuizState.answered) return;
  QuizState.answered = true;
  QuizState.selectedOption = idx;

  const q = QuizState.questions[QuizState.currentIdx];
  const correct = q.correct;
  const isRight = idx === correct;

  // Style all options
  q.options.forEach((_, i) => {
    const el = document.getElementById(`qopt-${i}`);
    if (!el) return;
    if (i === correct) el.classList.add('correct');
    else if (i === idx && !isRight) el.classList.add('wrong');
    el.style.cursor = 'default';
  });

  // Show explanation
  const exp = document.getElementById('quizExplanation');
  if (exp) exp.classList.add('visible');

  // Update score
  if (isRight) {
    QuizState.correctCount++;
  } else {
    QuizState.wrongCount++;
  }

  const answered = QuizState.correctCount + QuizState.wrongCount;
  QuizState.score = answered > 0 ? Math.round((QuizState.correctCount / answered) * 100) : 0;

  QuizState.results.push({ question: q.q, selected: idx, correct: correct, isRight });

  // Enable next button
  const btn = document.getElementById('quizNextBtn');
  if (btn) btn.disabled = false;
}

function skipQuestion() {
  QuizState.skippedCount++;
  QuizState.results.push({
    question: QuizState.questions[QuizState.currentIdx].q,
    selected: -1, correct: QuizState.questions[QuizState.currentIdx].correct, isRight: false
  });
  nextQuestion();
}

function nextQuestion() {
  QuizState.currentIdx++;
  QuizState.answered = false;
  QuizState.selectedOption = null;
  if (QuizState.currentIdx >= QuizState.questions.length) {
    endQuiz();
  } else {
    renderQuizQuestion();
    // Re-attach timer display
    updateTimerDisplay();
  }
}

function startQuizTimer() {
  updateTimerDisplay();
  QuizState.timer = setInterval(() => {
    QuizState.timeLeft--;
    updateTimerDisplay();
    if (QuizState.timeLeft <= 0) {
      clearInterval(QuizState.timer);
      showToast('⏱ Time is up!', 'warning');
      endQuiz();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = document.getElementById('quizTimer');
  if (!el) return;
  const m = Math.floor(QuizState.timeLeft / 60);
  const s = QuizState.timeLeft % 60;
  el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  el.className = 'quiz-timer' + (QuizState.timeLeft < 120 ? ' urgent' : '');
}

function endQuiz() {
  if (QuizState.timer) clearInterval(QuizState.timer);
  const elapsed = Math.round((Date.now() - QuizState.startTime) / 1000);
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const total = QuizState.questions.length;
  const correct = QuizState.correctCount;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = pct >= 70;

  logActivity('action', `Completed ${QuizState.exam} Quiz`, `Score: ${pct}% (${passed ? 'PASS' : 'FAIL'})`, 'Learning Tools');

  // Persist best score
  try {
    const key = `quiz-score-${QuizState.exam}`;
    const prev = parseInt(localStorage.getItem(key) || '0');
    if (pct > prev) localStorage.setItem(key, pct);
  } catch(e) {}

  const c = document.getElementById('quizContainer');
  c.innerHTML = `
    <div class="quiz-topbar">
      <h2>🎯 ${QuizState.exam} — Results</h2>
    </div>
    <div class="quiz-body" style="overflow-y:auto">
      <div class="quiz-results">
        <div class="quiz-results-icon">${pct >= 90 ? '🏆' : pct >= 70 ? '✅' : pct >= 50 ? '📚' : '💪'}</div>
        <div class="quiz-results-score" style="color:${pct>=70?'#107c10':'#a4262c'}">${pct}%</div>
        <div class="quiz-results-label">${passed ? '🎉 You PASSED! Great work, Adewale!' : '📚 Keep studying — you\'ll get there!'}</div>
        <div style="font-size:13px;color:var(--text-muted);margin-bottom:20px">Time: ${mins}m ${secs}s · Exam: ${QuizState.exam}</div>
        <div class="quiz-results-breakdown">
          <div class="quiz-results-stat"><div class="quiz-results-stat-val" style="color:#107c10">${correct}</div><div class="quiz-results-stat-label">Correct</div></div>
          <div class="quiz-results-stat"><div class="quiz-results-stat-val" style="color:#a4262c">${QuizState.wrongCount}</div><div class="quiz-results-stat-label">Wrong</div></div>
          <div class="quiz-results-stat"><div class="quiz-results-stat-val">${QuizState.skippedCount}</div><div class="quiz-results-stat-label">Skipped</div></div>
        </div>
        <div class="progress-bar" style="height:16px;margin-bottom:20px">
          <div class="progress-fill ${pct>=70?'success':'danger'}" style="width:${pct}%"></div>
        </div>
        <div class="info-box ${passed?'success':'warning'}" style="text-align:left">
          <span>${passed?'🎓':'📖'}</span>
          <div>
            ${passed
              ? `<strong>Exam Ready!</strong> A score of ${pct}% indicates you are ready for the ${QuizState.exam} exam. Book it on <a href="https://learn.microsoft.com/en-us/certifications/" target="_blank" class="link">Microsoft Learn</a>.`
              : `<strong>Study Tip:</strong> Focus on the questions you got wrong. Review the explanations above and study the related Microsoft Learn module. Aim for 80%+ before booking the real exam.`}
          </div>
        </div>
        <div style="margin-top:16px">
          <div style="font-size:13px;font-weight:700;margin-bottom:10px">Question Review</div>
          ${QuizState.results.map((r,i) => `
            <div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid var(--card-border);font-size:12px">
              <span style="font-size:16px;flex-shrink:0">${r.isRight?'✅':'❌'}</span>
              <div style="flex:1;color:var(--text-secondary);line-height:1.4">${r.question}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="quiz-footer">
      <button class="btn btn-secondary" onclick="renderQuizMenu()">← Back to Exams</button>
      <button class="btn btn-primary" onclick="startQuiz('${QuizState.exam}', 45)">Retake Quiz</button>
    </div>
  `;
}
