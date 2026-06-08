# 📖 Azure Services Guide — Complete Beginner Reference

**Author:** Adewale Samson Adeagbo  
**GitHub:** [@cssadewale](https://github.com/cssadewale)  
**Purpose:** Plain-English explanations of every Azure service in the simulator

This guide accompanies the Azure Learning Simulator. Every service here is simulated in the portal.

---

## ☁️ Cloud Computing Fundamentals

### What is Cloud Computing?

Cloud computing is the delivery of computing resources (servers, storage, databases, software) over the internet ("the cloud") on a pay-as-you-go basis. Instead of buying and maintaining physical servers, you rent them from Microsoft Azure.

### IaaS vs PaaS vs SaaS

| Model | You Manage | Azure Manages | Examples |
|---|---|---|---|
| **IaaS** (Infrastructure) | OS, middleware, runtime, applications, data | Hardware, networking, virtualisation | Virtual Machines, Virtual Networks |
| **PaaS** (Platform) | Applications, data | Everything below the application | App Service, Azure Functions, Azure SQL |
| **SaaS** (Software) | Nothing (just use it) | Everything | Microsoft 365, GitHub |

**For data scientists:** Azure ML Studio is PaaS. Your VM for running experiments is IaaS.

---

## 🖥️ COMPUTE SERVICES

### Virtual Machines (VMs)

**What it is:** A software-based computer running inside Azure's physical data centres. You choose the operating system (Windows or Linux), CPU, RAM, and disk size.

**When to use it:**
- You need full control over the OS and software stack
- Running Jupyter notebooks or data processing scripts on a schedule
- Hosting a custom application that won't fit in App Service
- GPU training for deep learning models (NC-series VMs)

**Key concepts:**
- **VM Size:** The combination of CPU, RAM, and disk. Ranges from Standard_B1s (1 vCPU, 1GB RAM, ~$7/month) to Standard_NC6s_v3 (6 vCPUs, 112GB RAM, 1 V100 GPU, ~$745/month)
- **Image:** The operating system template (Ubuntu 22.04 LTS, Windows Server 2022, etc.)
- **Public IP:** The internet-facing address. Always protect it with an NSG.
- **Deallocate vs Stop:** Stopping a VM in the portal may keep the VM allocated (you still pay for compute). Deallocating frees the compute — you only pay for the disk.

**Cost tip:** Always deallocate (not just stop) VMs when not in use. Set auto-shutdown to prevent forgotten overnight charges.

---

### App Service

**What it is:** A fully managed platform for hosting web applications without managing servers. You deploy your code; Azure handles OS patching, scaling, and infrastructure.

**When to use it:**
- Hosting a Flask or FastAPI ML model serving API
- Hosting a React/Node.js data dashboard
- Any web application where you don't need OS-level access

**Key concepts:**
- **App Service Plan:** The underlying VM(s) powering your app. Plans range from Free F1 (shared, limited) to Premium P3v3 (dedicated, powerful).
- **Deployment slots:** Blue/green deployments — swap between staging and production with zero downtime.
- **Deployment Center:** Connect to GitHub and auto-deploy on every push.
- **Runtime stack:** Python 3.11, Node.js 18, .NET 7, Java 17, etc.

**Cost tip:** Use the Free F1 plan for development. It costs $0 but has 60 minutes/day compute limit.

---

### Azure Functions

**What it is:** Serverless compute — you write a function (a small piece of code) and Azure runs it when triggered. You pay only when the code actually runs.

**When to use it:**
- Preprocessing data when a new file arrives in Blob Storage (Blob Trigger)
- Running inference with your ML model on HTTP requests (HTTP Trigger)
- Scheduled data pipeline tasks (Timer Trigger)
- Reacting to new messages in Service Bus (Service Bus Trigger)

**Key concepts:**
- **Triggers:** What causes the function to run (HTTP request, timer, blob upload, message queue)
- **Bindings:** Input and output connections declared in config (read from Blob, write to SQL)
- **Consumption plan:** Scale to zero when idle — you pay per million executions (first 1M free/month)
- **Cold start:** First invocation after idle period takes 1–3 seconds to warm up

**Cost tip:** The Consumption plan's first 1 million executions per month are free — Azure Functions is essentially free for most student workloads.

---

### Azure Kubernetes Service (AKS)

**What it is:** A managed Kubernetes cluster. Kubernetes automatically deploys, scales, and manages containerised applications. Azure manages the Kubernetes control plane for free — you pay only for the worker node VMs.

**When to use it:**
- Running multiple ML model APIs as microservices
- Production ML serving that needs auto-scaling
- Any containerised application requiring orchestration

**Not recommended for:** Beginners on student subscriptions — start with Container Instances or App Service instead.

---

### Container Instances (ACI)

**What it is:** Run a Docker container in Azure without managing VMs or Kubernetes. Start a container in seconds and pay per second of execution.

**When to use it:**
- Running a batch ML scoring job (process 10,000 records, then stop)
- CI/CD task runners
- Burst compute for a data pipeline

---

## 💾 STORAGE & DATABASES

### Storage Accounts

**What it is:** Azure's multi-purpose cloud storage service. One storage account gives you four types of storage:

| Type | Purpose | Use Case |
|---|---|---|
| **Blob** | Unstructured binary data | Datasets (.csv, .parquet), model files (.pkl), images |
| **File** | Managed SMB/NFS file shares | Mount as a network drive on VMs |
| **Queue** | Asynchronous message storage | Simple task queues between services |
| **Table** | NoSQL key-value store | Simple structured data without SQL |

**Key concepts:**
- **Redundancy:** LRS (3 copies in one data centre), GRS (6 copies, 2 regions), ZRS (3 zones). Use LRS for dev (cheapest).
- **Access tiers:** Hot (frequent access, ~$0.018/GB/month), Cool (infrequent, ~$0.01/GB/month), Archive (rarely accessed, ~$0.001/GB/month). You can mix tiers per blob.
- **Containers:** Top-level folders in Blob Storage. Like S3 buckets in AWS.

**Cost tip:** Use Cool tier for datasets you access less than once a month. Use Archive for backups you almost never access.

---

### Azure Blob Storage

**What it is:** Blob = Binary Large OBject. The most-used part of Storage Accounts. Think of it as unlimited Google Drive for files, accessible from anywhere via HTTPS.

**Data scientist use cases:**
- Store raw training datasets
- Store model artifacts (.pkl, .onnx, .h5)
- Store pipeline outputs (predictions, reports)
- Input/output for Azure ML experiments and Data Factory pipelines

**Access methods:**
- Azure Portal (this simulator)
- Azure CLI: `az storage blob upload`
- Python: `from azure.storage.blob import BlobServiceClient`
- Azure Storage Explorer (free desktop app)
- AzCopy (command-line copy tool)

---

### Azure SQL Database

**What it is:** A fully managed relational database based on Microsoft SQL Server. No patching, no backups to schedule, high availability built in.

**When to use it:**
- Storing structured experiment results and metrics
- User data and application data for ML-powered apps
- Serving ML predictions from a REST API backed by a database

**Connect from Python:**
```python
import pyodbc
conn = pyodbc.connect(
    'DRIVER={ODBC Driver 18 for SQL Server};'
    f'SERVER={server};DATABASE={database};'
    'Authentication=ActiveDirectoryMsi'  # Use Managed Identity - no password!
)
```

**Pricing tiers:**
- Basic (5 DTU): ~$4.90/month — good for dev/test
- Standard S3 (100 DTU): ~$150/month — small production workload
- General Purpose (2 vCores): ~$184/month — flexible modern tier

---

### Azure Cosmos DB

**What it is:** A globally distributed, multi-model NoSQL database. Guarantees single-digit millisecond response times anywhere in the world.

**Supported APIs:** Core SQL (documents), MongoDB, Cassandra, Gremlin (graphs), Table

**When to use it:**
- Storing prediction logs as JSON documents
- Real-time telemetry from ML-powered IoT devices
- User profiles and session data for ML applications
- Any schema-flexible data that changes frequently

**Key concepts:**
- **Request Units (RU/s):** The unit of throughput. 1 RU = reads a 1KB document. Provisioned in increments.
- **Serverless:** Pay per RU consumed, not reserved capacity. Best for dev/test.
- **Partition key:** How data is distributed across physical partitions. Choose wisely for even distribution.

---

## 📊 DATA & ANALYTICS

### Azure Synapse Analytics

**What it is:** A unified analytics platform combining data warehousing, big data processing, and data integration in one service.

**Components:**
- **Synapse SQL** (Dedicated Pool): MPP (Massively Parallel Processing) data warehouse. SQL queries on petabytes of structured data.
- **Synapse SQL** (Serverless Pool): Query files in Azure Data Lake directly with SQL — no data movement.
- **Synapse Spark Pool**: Apache Spark for Python/Scala/R data processing at scale.
- **Synapse Pipelines**: Built-in ETL (same functionality as Data Factory).
- **Synapse Link**: Real-time analytics on Cosmos DB and SQL operational data.

**Data scientist use case:**
1. Ingest raw data → Azure Data Lake Storage Gen2
2. Transform with Synapse Spark → write as Delta Lake tables
3. Query with Synapse SQL → build reports in Power BI
4. Feed clean features into Azure ML for model training

**Cost tip:** Dedicated SQL Pools are expensive (~$700/month for DW100c). Always pause them when not in use. Serverless SQL is pay-per-query — much cheaper for ad-hoc analysis.

---

### Azure Databricks

**What it is:** Apache Spark-based analytics platform, collaborative notebooks, and MLflow integration — all in one managed service. The industry-standard tool for production ML at scale.

**Why data scientists love Databricks:**
- Notebooks look like Jupyter but support collaborative real-time editing
- Auto-scaling Spark clusters — process 1TB in minutes, pay only when running
- Delta Lake: ACID transactions on data lakes (data quality for ML pipelines)
- MLflow: built-in experiment tracking, model registry, and deployment
- AutoML: automated model selection and hyperparameter tuning

**Key concepts:**
- **Cluster:** A group of VMs running Spark. Configure driver and worker nodes. Set auto-terminate after 30 minutes idle.
- **Notebook:** Interactive Python/Scala/SQL/R document attached to a cluster.
- **Job:** Scheduled or triggered notebook/script run.
- **Delta Lake:** Storage layer adding ACID transactions to Parquet files. Use it for all production data.

**Cost tip:** Always set a cluster auto-terminate timeout (30–60 minutes). Forgotten running clusters are the #1 cause of surprise bills.

---

### Azure Machine Learning Studio

**What it is:** The complete end-to-end ML platform. Covers the entire lifecycle from data to deployed model.

**Key components:**
- **Notebooks:** JupyterLab with Azure ML SDK pre-installed, attached to compute instances
- **Automated ML:** Tries dozens of algorithms automatically and picks the best one
- **Designer:** Drag-and-drop ML pipeline builder (no code)
- **Experiments:** Track every training run's metrics, parameters, and artifacts
- **Model Registry:** Version and manage trained models with lineage back to training data
- **Compute Clusters:** Managed VM clusters for training (set min_nodes=0 to avoid idle charges)
- **Compute Instances:** Always-on single VM for notebook development
- **Online Endpoints:** Deploy models as scalable REST APIs
- **Batch Endpoints:** Score large datasets asynchronously

**Python SDK v2 quickstart:**
```python
from azure.ai.ml import MLClient
from azure.identity import DefaultAzureCredential

ml_client = MLClient(
    DefaultAzureCredential(),
    subscription_id="a1b2c3d4-...",
    resource_group_name="rg-ml-experiments",
    workspace_name="adewale-ml-workspace"
)
```

---

### Azure Data Factory

**What it is:** Cloud-scale ETL (Extract, Transform, Load) and data integration service. Build pipelines to move and transform data between 90+ data stores.

**Core concepts:**
- **Pipeline:** A logical grouping of activities that perform a unit of work
- **Activity:** A single step in a pipeline (Copy Data, Execute Spark Notebook, Call REST API, etc.)
- **Linked Service:** A connection definition to an external data store (like a connection string)
- **Dataset:** A named reference to data in a linked service
- **Trigger:** What starts the pipeline (schedule, tumbling window, event-based)
- **Mapping Data Flow:** Visual, code-free data transformation engine (powered by Spark)

**Data scientist use case:**
1. Pull new data from operational database (SQL Server) every day at 2AM
2. Copy to Azure Data Lake Storage Gen2
3. Run a Databricks notebook to clean and feature-engineer the data
4. Write processed features to Azure ML Dataset
5. Trigger model retraining if data drift is detected

---

### Azure Event Hubs

**What it is:** A big data streaming platform capable of ingesting millions of events per second. Think Apache Kafka, but fully managed on Azure.

**Key concepts:**
- **Event:** A small packet of data (JSON, binary). Could be an IoT sensor reading, a user click, a prediction result.
- **Partition:** Events are distributed across partitions for parallel processing. More partitions = more parallelism.
- **Consumer Group:** A separate view of the event stream. Multiple consumer groups can read the same events independently.
- **Retention:** Events are stored for 1–7 days (Basic/Standard). Consumers must read within the retention window.

**Data scientist use case:**
IoT devices → Event Hubs → Stream Analytics (real-time anomaly detection with SQL) → Azure Function (trigger ML model) → Cosmos DB (store predictions) → Power BI (real-time dashboard)

---

## 🔗 INTEGRATION & MESSAGING

### Azure Service Bus

**What it is:** Enterprise-grade message broker. Decouples senders and receivers so they don't need to be available at the same time.

**Two messaging patterns:**
- **Queue:** Point-to-point. One sender, one receiver. FIFO delivery. Message persists until processed.
- **Topic + Subscription:** Publish-subscribe. One sender, many receivers. Each subscription gets its own copy of the message.

**When to use Service Bus vs Event Hubs:**
| Scenario | Use |
|---|---|
| Ordered message processing | Service Bus Queue |
| Exactly-once delivery | Service Bus Queue |
| Fan-out to multiple consumers | Service Bus Topic |
| Millions of events per second | Event Hubs |
| Real-time streaming analytics | Event Hubs |

**Data scientist use case:** ML inference request comes in via HTTP → put job in Service Bus Queue → background worker processes it asynchronously → result stored in Cosmos DB. This prevents HTTP timeouts on long-running inference jobs.

---

### Azure API Management (APIM)

**What it is:** A gateway that sits in front of your backend APIs and adds security, rate limiting, caching, transformation, and analytics.

**Key capabilities:**
- **API Gateway:** Single entry point for all your APIs
- **Rate Limiting:** Prevent abuse — e.g., max 100 calls/minute per consumer
- **Authentication:** API keys, OAuth 2.0, JWT validation
- **Caching:** Cache responses to reduce backend load
- **Transformation:** Modify request/response without changing the backend
- **Developer Portal:** Auto-generated interactive API documentation
- **Analytics:** Track usage, latency, errors per API and per consumer

**Data scientist use case:** Wrap your Azure ML endpoint behind APIM → gives consumers a stable, documented URL → protects your ML model from overload with rate limiting → tracks who is calling your model and how often.

---

### Azure Stream Analytics

**What it is:** Real-time stream processing engine. You write SQL-like queries on streaming data from Event Hubs or IoT Hub and output results to databases, dashboards, or functions.

**SQL query example:**
```sql
SELECT
    deviceId,
    AVG(temperature) AS AvgTemp,
    System.Timestamp() AS WindowEnd
INTO [sql-output]
FROM [eventhub-input]
GROUP BY deviceId, TumblingWindow(minute, 5)
HAVING AVG(temperature) > 85
```

**When to use it:** When you need to aggregate, filter, or detect patterns in streaming data in real time — without writing custom Spark Streaming or Kafka Streams code.

---

## 🕸️ NETWORKING

### Virtual Network (VNet)

**What it is:** Your private, isolated network in Azure. All resources you create live inside a VNet and communicate privately using private IP addresses.

**Key concepts:**
- **Address Space:** The range of IP addresses for the entire VNet (e.g., 10.0.0.0/16 = 65,536 addresses)
- **Subnet:** A subdivision of the VNet. You put different resource types in different subnets for organisation and security.
- **NSG (Network Security Group):** A list of firewall rules controlling traffic. Applied to subnets or individual VM NICs.
- **VNet Peering:** Connect two VNets privately across regions — traffic uses the Microsoft backbone, not the internet.
- **Service Endpoints:** Extend VNet identity to Azure services (Storage, SQL) — traffic stays on the Azure backbone.
- **Private Endpoints:** Give an Azure service (Blob, SQL) a private IP address inside your VNet — completely removes it from the public internet.

---

### Load Balancer

**What it is:** Distributes incoming network traffic across multiple VMs. Ensures no single server is overwhelmed and provides high availability.

**Two types:**
- **Azure Load Balancer:** Layer 4 (TCP/UDP). Simple, fast, cheap.
- **Azure Application Gateway:** Layer 7 (HTTP/HTTPS). URL-based routing, SSL termination, WAF.

---

### VPN Gateway

**What it is:** Creates an encrypted VPN tunnel between your office/home network and your Azure VNet.

**Two types:**
- **Site-to-Site VPN:** Your entire office network connects to Azure (always-on)
- **Point-to-Site VPN:** Your individual laptop/tablet connects to Azure

**For Adewale:** A Point-to-Site VPN from your itel Vista Tab 30s lets you securely access private Azure VMs (with no public IP) from anywhere in Nigeria.

---

## 🔐 SECURITY

### Azure Key Vault

**What it is:** A secure cloud store for secrets (passwords, connection strings, API keys), cryptographic keys, and SSL/TLS certificates.

**Why it matters:** Hardcoding secrets in your Python notebooks or GitHub repos is the #1 security mistake developers make. Key Vault eliminates this risk.

**Three object types:**
- **Secrets:** Passwords, connection strings, API keys — stored and versioned
- **Keys:** RSA and Elliptic Curve cryptographic keys for encryption/decryption/signing
- **Certificates:** SSL/TLS certificates for HTTPS — automatic renewal supported

**Best practice — Managed Identity:**
Instead of storing a Key Vault password in your code, enable Managed Identity on your VM or App Service. Azure gives the resource an automatic identity that Key Vault trusts. Your code uses `DefaultAzureCredential()` — no password ever in code.

```python
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential

client = SecretClient("https://adewale-key-vault.vault.azure.net", DefaultAzureCredential())
secret = client.get_secret("storage-connection-string")
print(secret.value)  # Retrieved securely, no hardcoded password
```

---

### Microsoft Defender for Cloud (Security Center)

**What it is:** Unified security management that continuously assesses your Azure resources and gives you a **Secure Score** — a percentage showing how well you follow security best practices.

**Five categories of recommendations:**
1. **Identity & Access:** Enable MFA, disable unused accounts, restrict admin privileges
2. **Network:** Close unused ports, restrict internet exposure
3. **Data & Storage:** Encrypt sensitive data, disable public access to blobs
4. **Application:** Apply OS updates, use HTTPS, enable diagnostic logs
5. **Infrastructure:** Enable Just-in-Time VM access, use Bastion

**Security Score:** Start at 0%. Every recommendation you implement increases your score. Aim for 80%+.

---

### Microsoft Entra ID (Azure Active Directory)

**What it is:** Azure's cloud identity platform. Manages who can authenticate (sign in) and what they are authorised to do (access control).

**Key concepts:**
- **User:** A person with an account (you, your teammates)
- **Service Principal:** An app identity — used by automation scripts, pipelines, and Azure services
- **Managed Identity:** A special service principal that Azure manages automatically — no password to rotate or leak
- **Group:** A collection of users for bulk permission assignment
- **App Registration:** Register an application to use Azure AD for sign-in (OAuth 2.0/OpenID Connect)
- **RBAC:** Role-Based Access Control — assign roles (Owner, Contributor, Reader) to users/groups/service principals on resources

**Four built-in roles (know these for AZ-104):**
| Role | Can Do |
|---|---|
| Owner | Full access + assign roles to others |
| Contributor | Full access to resources — cannot assign roles |
| Reader | View resources only — cannot make changes |
| User Access Administrator | Manage role assignments only |

---

## 🚀 DEVOPS

### Azure DevOps

**What it is:** A complete DevOps platform with five integrated services:

| Service | Purpose |
|---|---|
| **Azure Boards** | Agile project management — Kanban boards, sprints, backlogs, work items |
| **Azure Repos** | Git repositories for your source code (like GitHub) |
| **Azure Pipelines** | CI/CD — build, test, and deploy code automatically on every push |
| **Azure Test Plans** | Manual and automated test management |
| **Azure Artifacts** | Private package registries (pip, npm, Maven, NuGet) |

**ML DevOps (MLOps) pipeline example:**
```
Push code to Azure Repos
    ↓ (triggers pipeline)
Run unit tests (pytest)
    ↓ (if tests pass)
Train ML model on compute cluster
    ↓ (if accuracy > threshold)
Register model in Model Registry
    ↓ (manual approval gate)
Deploy to staging endpoint
    ↓ (smoke test)
Deploy to production endpoint
```

---

## 📈 MONITORING

### Azure Monitor

**What it is:** The central monitoring hub for all Azure resources. Collects and analyses telemetry from cloud and on-premises environments.

**Three pillars:**
- **Metrics:** Numerical time-series data (CPU %, memory, requests/second). Stored for 93 days. Visualised in charts.
- **Logs:** Detailed event and diagnostic data stored in Log Analytics Workspace. Queried with KQL.
- **Alerts:** Notify you when metrics cross thresholds or specific log events occur.

### Log Analytics + KQL

KQL (Kusto Query Language) is the query language for Azure logs. Similar to SQL but optimised for time-series data.

```kql
// Find all VM errors in the last 24 hours
AzureActivity
| where TimeGenerated > ago(24h)
| where ActivityStatus == "Failed"
| project TimeGenerated, OperationName, ResourceGroup, Caller
| order by TimeGenerated desc
```

---

## 💰 COST MANAGEMENT

### Azure Cost Management + Billing

**What it is:** Tools to monitor, allocate, forecast, and optimise your Azure spending.

**Key features:**
- **Cost Analysis:** See spending by service, resource group, tag, or time period
- **Budgets:** Set a spending limit with email alerts at 80% and 100%
- **Advisor Recommendations:** Cost-saving suggestions (rightsize VMs, delete unused resources)
- **Pricing Calculator:** Estimate costs before deploying at [azure.microsoft.com/pricing/calculator](https://azure.microsoft.com/pricing/calculator)

**Top 10 cost-saving habits for students:**
1. Deallocate (not just stop) VMs when not in use
2. Set VM auto-shutdown at 6 PM every day
3. Use Free tier App Service (F1) for development
4. Set min_nodes=0 on all ML compute clusters
5. Use Azure Functions Consumption plan (first 1M executions free)
6. Set a $50 budget alert — get warned before you hit $100
7. Delete unused public IP addresses and disks
8. Move old datasets to Cool or Archive blob tier
9. Use Azure Spot VMs for interruptible training jobs (60–90% discount)
10. Check Azure Advisor weekly for cost recommendations

---

## 💡 AZURE ADVISOR

**What it is:** A personalised consultant that analyses your resource configuration and usage, then provides actionable recommendations to improve your deployment.

**Five categories:**
1. **Cost:** Rightsize underused VMs, eliminate idle resources, use reserved instances
2. **Security:** Integrated with Defender for Cloud — MFA, NSG rules, disk encryption
3. **Reliability:** Soft delete, backup policies, availability zones, health checks
4. **Performance:** Right-size resources, enable caching, use Premium SSDs
5. **Operational Excellence:** Enable diagnostic logs, implement infrastructure as code

---

*This guide is maintained as part of the Azure Learning Simulator project.*  
*Author: Adewale Samson Adeagbo — [cssadewale.pages.dev](https://cssadewale.pages.dev)*
