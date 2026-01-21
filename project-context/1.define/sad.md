# System Architecture Document (SAD) - Bagana AI MVP

## Context & Instructions
- **Purpose**: Define the minimal viable architecture for Bagana AI MVP to validate core value proposition (predictive influencer campaign planning) with 2-3 pilot agencies.
- **Inputs**: 
  - `project-context/1.define/mrd-bagana-ai.md` (market research, technical feasibility)
  - `project-context/1.define/prd-bagana-ai.md` (functional requirements, P0 features)
- **Scope**: MVP Phase 1 (0-90 days) - Core campaign planning workflow with 4 essential agents, 2 platform integrations, basic dashboard
- **Adapter**: CrewAI (default AAMAD_ADAPTER)
- **Constraint**: Defer complex NFRs, enterprise features, and advanced AI capabilities to Future Work; document all deferrals explicitly

---

## 1. Introduction

### 1.1 Purpose and Scope

This System Architecture Document (SAD) defines the architecture for Bagana AI MVP, a multi-agent content intelligence platform that predicts influencer campaign performance before execution. The MVP focuses on delivering core value: ranked influencer recommendations with performance forecasts and explainable rationale.

**MVP Scope Boundaries** (from PRD Section 8):
- **Core Agents**: Trend Agent, Audience Agent, Influencer Agent, Performance Agent (basic)
- **Platforms**: Instagram and TikTok integration only (YouTube deferred to Phase 2)
- **Features**: Campaign planning workflow, influencer ranking, basic performance forecasting
- **UI**: Web dashboard with campaign input, recommendations, and export
- **Infrastructure**: Basic multi-agent orchestration, vector DB, analytics DB, monitoring

**Explicitly Deferred to Future Work**:
- Learning Agent (closed-loop learning) → Phase 2
- YouTube integration → Phase 2
- A/B scenario simulation → Phase 2
- CRM integrations (HubSpot, Salesforce) → Phase 2
- Multi-platform optimization → Phase 2
- Enterprise features (SSO, advanced RBAC, white-label) → Phase 3
- SOC 2 Type II certification → Phase 3
- Advanced monitoring and cost optimization → Phase 2

### 1.2 Stakeholders and Concerns

| Stakeholder | Primary Concern | MVP Priority |
|------------|----------------|--------------|
| **Agency Managers** | Predict which influencers/content will work before spending budget | P0 - Core value |
| **Performance Marketers** | ROI predictions tied to business objectives (CPA, CPL, revenue) | P0 - Core value |
| **Account Strategists** | Client-ready reports with explainable predictions | P0 - Export feature |
| **Development Team** | Rapid iteration and validation with pilot customers | P0 - MVP delivery |
| **Operations Team** | Basic monitoring and error handling | P1 - Essential |
| **Security/Compliance** | Data privacy and secure API access | P1 - Basic security |
| **Enterprise Customers** | SSO, advanced RBAC, SOC 2 | P2 - Deferred |

**Traceability**: PRD Section 2 (User Needs Analysis), MRD Section 3 (User Experience & Workflow Analysis)

### 1.3 Architectural Viewpoints

This SAD uses ISO/IEC/IEEE 42010-aligned viewpoints:

1. **Logical Viewpoint**: System decomposition into agents, services, and data models
2. **Process/Runtime Viewpoint**: Agent orchestration, task execution, and data flow
3. **Deployment Viewpoint**: Infrastructure, compute, storage, and network topology
4. **Data Viewpoint**: Data models, storage, and persistence strategies

**Deferred Viewpoints** (for Future Work):
- Security/Compliance Viewpoint (detailed threat modeling, SOC 2 controls)
- Performance Viewpoint (detailed scalability analysis, load testing)
- Evolution Viewpoint (migration paths, versioning strategy)

---

## 2. MVP Architecture Philosophy & Principles

### 2.1 MVP Design Principles

**Customer Feedback First**: Deploy quickly to validate core value proposition with 2-3 pilot agencies (PRD Section 9: Beta Testing Plan). Focus on proving ≥70% prediction accuracy and ≥30% ROI improvement.

**Minimal Viable Multi-Agent System**: Start with 4 essential agents (Trend, Audience, Influencer, Performance) that deliver core predictive planning workflow. Defer Learning Agent to Phase 2 when historical data accumulates.

**API-First Architecture**: Design for integration with Instagram Graph API and TikTok Business API from day one. Abstract platform APIs behind connector layer for future platform additions.

**Explainable by Default**: All recommendations include rationale and confidence scores (PRD Section 6: UX Principles). MVP must demonstrate trustworthiness to agencies.

**Cost-Conscious Design**: Monitor LLM and API usage per tenant. Implement basic cost controls (quota limits) to protect margins during MVP validation.

**Traceability**: PRD Section 1 (Solution Overview), MRD Section 2 (Technical Feasibility)

### 2.2 Core vs. Future Features Decision Framework

| Feature Category | MVP (Phase 1) | Phase 2 | Phase 3 |
|-----------------|---------------|---------|---------|
| **Agents** | 4 core agents | + Learning Agent | + Advanced agents |
| **Platforms** | Instagram, TikTok | + YouTube | + LinkedIn, Twitter/X |
| **Forecasting** | Basic engagement/ROI | Advanced conversion | Multi-objective optimization |
| **UI** | Web dashboard | Scenario comparison | Enterprise dashboards |
| **Integrations** | Platform APIs only | CRM integrations | Full ecosystem |
| **Security** | Basic auth, encryption | SOC 2 Type I prep | SOC 2 Type II, ISO 27001 |
| **Scalability** | Single region, basic scaling | Multi-region, auto-scaling | Enterprise scale |

**Traceability**: PRD Section 8 (Implementation Strategy)

### 2.3 Technical Architecture Decisions

**CrewAI Framework Selection** (MRD Section 2, PRD Section 3):
- **Rationale**: CrewAI provides task decomposition, inter-agent messaging, and tool orchestration required for Bagana AI's workflow. Supports sequential and parallel agent execution patterns.
- **MVP Configuration**: Sequential process type for deterministic workflow (campaign brief → trend analysis → audience modeling → influencer scoring → performance forecasting)
- **Future Evolution**: Evaluate LangGraph for more complex agent graphs in Phase 2

**Web Dashboard (React/Vite) vs Next.js**:
- **Decision**: React/Vite for MVP to reduce complexity and enable rapid iteration
- **Rationale**: MVP focuses on single-page campaign planning workflow; no SSR/SEO requirements initially
- **Future Path**: Migrate to Next.js in Phase 2 if multi-page navigation and SEO become priorities

**Vector Database (Pinecone/Weaviate) for Campaign Memory**:
- **Decision**: Pinecone for MVP (managed service, fast setup)
- **Rationale**: Enables semantic search over past campaigns and influencer histories (MRD Section 2)
- **Future Path**: Evaluate self-hosted Weaviate for cost optimization in Phase 2

**PostgreSQL for Transactional Data**:
- **Decision**: PostgreSQL for campaigns, users, recommendations
- **Rationale**: Relational data model fits campaign planning workflow; supports future analytics warehouse integration
- **Future Path**: Add BigQuery/Snowflake for analytics in Phase 2

**Traceability**: MRD Section 2 (Technical Feasibility), PRD Section 3 (Technical Requirements)

---

## 3. Multi-Agent System Specification

### 3.1 Agent Architecture Requirements (MVP)

**Core Agents** (4 agents for MVP, per PRD Section 3):

| Agent | Role | Goal | Tools (MVP) | Memory (MVP) |
|-------|------|------|-------------|--------------|
| **Trend Agent** | Detects viral formats & topics | Identify emerging content patterns | Instagram Graph API, TikTok Business API | Trend pattern embeddings (vector DB) |
| **Audience Agent** | Analyzes target demographics & interests | Model audience overlap and fit | Platform APIs (demographics), campaign brief | Audience profile vectors (vector DB) |
| **Influencer Agent** | Scores influencer fit | Maximize audience alignment and conversion probability | Instagram/TikTok APIs, historical campaign DB | Influencer performance embeddings (vector DB) |
| **Performance Agent** | Predicts engagement & conversion | Forecast campaign outcomes with confidence intervals | Historical campaign data, ML models | Performance prediction models (PostgreSQL) |

**Deferred Agent**:
- **Learning Agent**: Deferred to Phase 2 when sufficient historical data accumulates for model updates

**Agent Definitions** (CrewAI YAML format):

```yaml
agents:
  trend_agent:
    role: "Trend Intelligence Specialist"
    goal: "Identify emerging content patterns, viral formats, and trending topics across Instagram and TikTok that align with campaign objectives"
    backstory: "Expert in social media trend analysis with 5+ years tracking viral content patterns. Specializes in identifying format trends (short-form video, carousel posts, stories) and topic trends relevant to influencer marketing."
    tools: [instagram_api, tiktok_api, vector_search]
    memory: true
    allow_delegation: false
    max_iter: 3
    
  audience_agent:
    role: "Audience Intelligence Analyst"
    goal: "Model target audience demographics, interests, and overlap between brands and influencers to assess fit"
    backstory: "Data scientist specializing in audience modeling and demographic analysis. Expert in calculating audience overlap, identifying psychographic segments, and matching brand personas to influencer audiences."
    tools: [platform_demographics_api, audience_overlap_calculator, vector_search]
    memory: true
    allow_delegation: false
    max_iter: 3
    
  influencer_agent:
    role: "Influencer Matching Specialist"
    goal: "Score and rank influencers based on audience fit, engagement quality, content alignment, and historical performance"
    backstory: "Influencer marketing strategist with 7+ years matching creators to campaigns. Expert in analyzing engagement rates, audience authenticity, content quality, and performance history to identify optimal influencer-campaign matches."
    tools: [instagram_api, tiktok_api, campaign_db, vector_search, engagement_analyzer]
    memory: true
    allow_delegation: true  # Can request data from Audience Agent
    max_iter: 5
    
  performance_agent:
    role: "Performance Forecasting Analyst"
    goal: "Predict campaign outcomes (engagement, conversion, ROI) with confidence intervals and risk indicators"
    backstory: "Performance marketing analyst specializing in predictive modeling. Expert in forecasting engagement metrics, conversion rates, and ROI based on historical campaign data, influencer performance, and audience fit."
    tools: [campaign_db, ml_prediction_models, benchmark_data]
    memory: true
    allow_delegation: true  # Can request influencer scores from Influencer Agent
    max_iter: 4
```

**Traceability**: PRD Section 3 (CrewAI Framework Specifications), PRD Section 4 (Functional Requirements - AI Campaign Planner)

### 3.2 Task Orchestration Specification

**Campaign Planning Workflow** (Sequential Process):

```
1. Campaign Brief Intake (User Input)
   ↓
2. Trend Agent: Analyze trending formats/topics
   Output: Trend insights, recommended formats
   ↓
3. Audience Agent: Model target audience
   Output: Audience profile, demographics, interests
   ↓
4. Influencer Agent: Score and rank influencers
   Input: Audience profile (from Audience Agent), trend insights (from Trend Agent)
   Output: Ranked influencer shortlist (top 10-20) with fit scores (0-100) and rationale
   ↓
5. Performance Agent: Forecast outcomes
   Input: Influencer rankings (from Influencer Agent)
   Output: Performance forecast (engagement, conversion, ROI) with confidence intervals
   ↓
6. Results Compilation and Export
   Output: Client-ready report (CSV/PDF) with recommendations, forecasts, rationale
```

**Task Dependencies**:
- Influencer Agent depends on Audience Agent and Trend Agent outputs
- Performance Agent depends on Influencer Agent output
- All agents can access vector DB for historical context

**Expected Outputs** (per PRD Section 4):
- Ranked influencer shortlist (top 10-20) with fit scores (0-100)
- Content strategy recommendations (format, messaging, timing)
- Performance forecast (engagement, conversion, ROI) with confidence intervals
- Explainable rationale for each recommendation

**Error Handling**:
- If platform API fails: Retry with exponential backoff (max 3 retries), fallback to cached data if available
- If agent fails: Log error, return partial results with error message, allow user to retry
- If LLM inference fails: Retry once, then return error to user

**Performance Requirements** (MVP):
- Max execution time: 60 seconds per campaign planning request
- Token limits: 8K context window per agent (GPT-3.5-turbo for MVP, GPT-4 for Phase 2)
- Response time target: < 5 seconds (p95) per PRD Section 5

**Traceability**: PRD Section 4 (Functional Requirements), PRD Section 5 (Non-Functional Requirements)

### 3.3 CrewAI Framework Configuration

**Crew Composition**:
```python
campaign_planning_crew = Crew(
    agents=[trend_agent, audience_agent, influencer_agent, performance_agent],
    tasks=[trend_task, audience_task, influencer_task, performance_task],
    process=Process.sequential,  # Deterministic workflow for MVP
    memory=True,  # Enable agent memory for context
    verbose=True,  # Logging for debugging
    max_iter=15,  # Overall crew iteration limit
    max_execution_time=60  # 60 second timeout
)
```

**Memory Configuration**:
- Short-term memory: Per-session context (campaign brief, intermediate results)
- Long-term memory: Vector DB for historical campaigns and influencer data
- Memory retention: 90 days for MVP (configurable per tenant)

**Integration Points**:
- Python service layer exposes REST API endpoint: `POST /api/v1/campaigns/plan`
- Next.js API route calls Python service (or direct Python integration)
- Streaming responses for real-time updates (optional for MVP, required for Phase 2)

**Traceability**: PRD Section 3 (CrewAI Framework Specifications), MRD Section 2 (Technical Feasibility)

---

## 4. Logical Architecture View

### 4.1 System Decomposition

**Primary Components**:

```
Bagana AI MVP System
├── Frontend Layer
│   ├── Web Dashboard (React/Vite)
│   │   ├── Campaign Brief Form
│   │   ├── Recommendations Display
│   │   ├── Results Export (CSV/PDF)
│   │   └── Basic Analytics Dashboard
│   └── API Client (REST API calls to backend)
│
├── Backend Layer
│   ├── API Gateway (FastAPI/Flask)
│   │   ├── Campaign Planning Endpoint
│   │   ├── Authentication/Authorization
│   │   └── Rate Limiting
│   ├── CrewAI Orchestration Service
│   │   ├── Agent Configuration (YAML)
│   │   ├── Task Orchestration
│   │   └── Context Management
│   └── Tool Integrations
│       ├── Instagram Graph API Connector
│       ├── TikTok Business API Connector
│       └── Vector DB Client (Pinecone)
│
├── Data Layer
│   ├── PostgreSQL (Transactional Data)
│   │   ├── Campaigns
│   │   ├── Users/Tenants
│   │   ├── Recommendations
│   │   └── Performance Metrics
│   ├── Vector DB (Pinecone)
│   │   ├── Campaign Memory Embeddings
│   │   ├── Influencer Performance Embeddings
│   │   └── Trend Pattern Embeddings
│   └── Object Storage (S3/GCS - Future)
│       └── Exported Reports (PDF)
│
└── External Services
    ├── LLM Provider (OpenAI GPT-3.5-turbo)
    ├── Instagram Graph API
    ├── TikTok Business API
    └── Monitoring (Basic logging/metrics)
```

**Deferred Components** (Future Work):
- Learning Agent Service
- Analytics Warehouse (BigQuery/Snowflake)
- CRM Integration Layer
- Advanced Monitoring (Prometheus/Grafana)
- CDN for static assets

**Traceability**: PRD Section 3 (Technical Requirements), MRD Section 2 (Technical Feasibility)

### 4.2 Data Models (MVP)

**Campaign Model**:
```python
class Campaign:
    id: UUID
    tenant_id: UUID
    brief: CampaignBrief
    status: CampaignStatus  # draft, planning, completed, failed
    created_at: datetime
    completed_at: datetime | None
    recommendations: List[Recommendation] | None
    performance_forecast: PerformanceForecast | None

class CampaignBrief:
    objectives: str
    target_audience: AudienceProfile
    budget: float | None
    kpis: List[str]  # e.g., ["engagement", "conversions", "roi"]
    platforms: List[str]  # ["instagram", "tiktok"]
    scope: str  # "Market Analysis", "Technical Feasibility", etc.
    depth: str  # "Quick", "Standard", "Deep"
```

**Recommendation Model**:
```python
class Recommendation:
    campaign_id: UUID
    influencer_id: str  # Platform-specific ID
    platform: str  # "instagram" | "tiktok"
    fit_score: float  # 0-100
    rationale: str  # Explainable reason for recommendation
    confidence: float  # 0-1
    predicted_engagement: EngagementMetrics
    content_strategy: ContentStrategy | None
```

**Performance Forecast Model**:
```python
class PerformanceForecast:
    campaign_id: UUID
    predicted_engagement: EngagementMetrics
    predicted_conversion: ConversionMetrics | None
    predicted_roi: float | None
    confidence_intervals: ConfidenceIntervals  # p10, p50, p90
    risk_indicators: List[str]
```

**Traceability**: PRD Section 4 (Functional Requirements - AI Campaign Planner, Performance Forecasting)

---

## 5. Process/Runtime Architecture View

### 5.1 Campaign Planning Workflow (Runtime)

**Request Flow**:

```
User submits campaign brief via web dashboard
    ↓
Frontend validates input and calls POST /api/v1/campaigns/plan
    ↓
API Gateway authenticates request, applies rate limiting
    ↓
CrewAI Orchestration Service:
    1. Creates campaign record (status: "planning")
    2. Initializes crew with campaign brief context
    3. Executes sequential agent workflow:
       a. Trend Agent analyzes trends → stores results
       b. Audience Agent models audience → stores results
       c. Influencer Agent scores influencers → stores results
       d. Performance Agent forecasts outcomes → stores results
    4. Compiles final recommendations
    5. Updates campaign status to "completed"
    ↓
Returns recommendations to API Gateway
    ↓
API Gateway returns JSON response to frontend
    ↓
Frontend displays recommendations, enables export
```

**Error Handling Flow**:
- If agent fails: Log error, return partial results with error message
- If API rate limit hit: Queue request, retry after delay
- If LLM timeout: Return error, allow user to retry with simplified query

**Traceability**: PRD Section 4 (Functional Requirements), PRD Section 5 (Error Handling)

### 5.2 Agent Communication Patterns

**Sequential Execution** (MVP):
- Agents execute in order: Trend → Audience → Influencer → Performance
- Each agent receives context from previous agents via CrewAI context passing
- Results stored in shared context for downstream agents

**Delegation** (Limited in MVP):
- Influencer Agent can request audience data from Audience Agent
- Performance Agent can request influencer scores from Influencer Agent
- No circular dependencies

**Future Pattern** (Phase 2):
- Parallel execution for independent agents (Trend + Audience can run in parallel)
- More complex delegation patterns for Learning Agent

**Traceability**: PRD Section 3 (CrewAI Framework Specifications)

---

## 6. Deployment Architecture View

### 6.1 Infrastructure Components (MVP)

**Compute**:
- **Backend**: Single container/VM running Python CrewAI service + API Gateway
- **Frontend**: Static site (React/Vite) deployed to S3 + CloudFront (or Vercel/Netlify)
- **Scaling**: Manual scaling for MVP (single instance), auto-scaling deferred to Phase 2

**Storage**:
- **PostgreSQL**: Managed database (AWS RDS or GCP Cloud SQL) - single instance, basic backup
- **Vector DB**: Pinecone (managed service) - starter tier
- **Object Storage**: S3/GCS bucket for exported PDFs (optional for MVP)

**Network**:
- **API Gateway**: Exposes REST API endpoint
- **Security**: HTTPS/TLS, basic firewall rules
- **CDN**: Deferred to Phase 2

**Deferred Infrastructure** (Future Work):
- Multi-region deployment
- Read replicas for PostgreSQL
- Kubernetes orchestration
- Advanced monitoring (Prometheus/Grafana)
- Load balancing

**Traceability**: PRD Section 3 (Infrastructure Specifications), MRD Section 4 (Production & Operations)

### 6.2 Deployment Topology (MVP)

```
[Users] → [CloudFront/CDN] → [Frontend (S3/Vercel)]
                              ↓
                         [API Gateway (FastAPI)]
                              ↓
                    [CrewAI Service (Container/VM)]
                              ↓
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
  [PostgreSQL]        [Pinecone]        [External APIs]
  (RDS/Cloud SQL)     (Managed)         (Instagram, TikTok, OpenAI)
```

**Single-Region Deployment** (MVP):
- All components in single AWS region (us-east-1) or GCP region (us-central1)
- Multi-region deferred to Phase 2

**Traceability**: PRD Section 8 (Implementation Strategy - Phase 1)

---

## 7. Data Architecture View

### 7.1 Data Storage Strategy

**Transactional Data (PostgreSQL)**:
- Campaigns, users, recommendations, performance metrics
- Relational schema for ACID compliance
- Basic indexing on tenant_id, campaign_id, created_at

**Semantic Data (Vector DB - Pinecone)**:
- Campaign memory embeddings (for similarity search)
- Influencer performance embeddings
- Trend pattern embeddings
- Indexed by tenant_id for isolation

**Data Retention** (MVP):
- Campaigns: 90 days (configurable)
- Recommendations: 90 days
- Performance metrics: 90 days
- Vector embeddings: 90 days

**Deferred** (Future Work):
- Analytics warehouse (BigQuery/Snowflake) for long-term analytics
- Data archival strategy
- GDPR data deletion automation

**Traceability**: PRD Section 3 (Data Infrastructure), MRD Section 2 (Technical Feasibility)

### 7.2 Data Flow

**Campaign Planning Data Flow**:
```
Campaign Brief (User Input)
    ↓
PostgreSQL: Create campaign record
    ↓
CrewAI Context: Pass to agents
    ↓
Trend Agent → Vector DB: Store trend embeddings
Audience Agent → Vector DB: Store audience embeddings
Influencer Agent → PostgreSQL: Store influencer scores
Performance Agent → PostgreSQL: Store forecasts
    ↓
PostgreSQL: Update campaign with recommendations
    ↓
Frontend: Display results
```

**Historical Data Access**:
- Agents query vector DB for similar past campaigns
- Agents query PostgreSQL for influencer performance history
- Results used to inform recommendations

**Traceability**: PRD Section 4 (Functional Requirements)

---

## 8. Quality Attributes (MVP Focus)

### 8.1 Performance

**Response Time** (per PRD Section 5):
- Campaign planning: < 5 seconds (p95)
- Dashboard loads: < 2 seconds (p95)
- **MVP Approach**: Optimize agent execution, basic caching of platform API responses

**Deferred** (Future Work):
- Advanced caching strategies
- CDN for static assets
- Database query optimization
- Load testing and performance tuning

**Traceability**: PRD Section 5 (Non-Functional Requirements), PRD Section 7 (Success Metrics)

### 8.2 Reliability

**Availability** (MVP):
- Target: 95% uptime (single instance, basic monitoring)
- **Deferred**: 99.9% SLA, multi-region failover → Phase 2

**Error Handling**:
- Retry logic for external API failures (max 3 retries)
- Graceful degradation (return partial results if agent fails)
- Basic error logging

**Deferred** (Future Work):
- Comprehensive error monitoring (Sentry, Datadog)
- Automated failover
- Health checks and auto-recovery

**Traceability**: PRD Section 5 (Reliability & Scalability)

### 8.3 Security (MVP - Basic)

**Authentication**:
- API key authentication for MVP (per-tenant API keys)
- **Deferred**: OAuth 2.0, SSO/SAML → Phase 2

**Authorization**:
- Tenant isolation at database level (tenant_id filtering)
- Basic RBAC (admin, user roles)
- **Deferred**: Advanced RBAC, fine-grained permissions → Phase 2

**Data Protection**:
- TLS in transit (HTTPS)
- Encryption at rest (managed database encryption)
- Secrets management (environment variables for MVP, AWS Secrets Manager for Phase 2)

**Deferred** (Future Work):
- SOC 2 Type I/II preparation
- Advanced threat modeling
- Security scanning and vulnerability management
- Audit logging for compliance

**Traceability**: PRD Section 5 (Security & Privacy), MRD Section 4 (Production & Operations)

### 8.4 Scalability (MVP - Basic)

**Concurrent Users**:
- Target: 10-20 concurrent campaign planning requests
- **Deferred**: 100+ concurrent workflows, auto-scaling → Phase 2

**Data Scaling**:
- PostgreSQL: Single instance, basic connection pooling
- Vector DB: Pinecone starter tier (scales automatically)
- **Deferred**: Read replicas, sharding → Phase 2

**Traceability**: PRD Section 5 (Reliability & Scalability)

---

## 9. Architectural Decisions and Rationale

### 9.1 Key Decisions

| Decision | Choice | Rationale | Trade-offs |
|----------|--------|-----------|------------|
| **Orchestration Framework** | CrewAI (sequential) | Fast development, supports multi-agent patterns | Less control vs custom event bus |
| **Frontend Framework** | React/Vite | Rapid iteration, simple deployment | No SSR/SEO vs Next.js |
| **Vector DB** | Pinecone (managed) | Fast setup, automatic scaling | Cost vs self-hosted Weaviate |
| **Database** | PostgreSQL | Relational model fits workflow | Single instance vs distributed |
| **LLM Model** | GPT-3.5-turbo | Cost-effective for MVP | Less capable vs GPT-4 |
| **Deployment** | Single region | Simplicity, cost control | No failover vs multi-region |
| **Authentication** | API keys | Simple for MVP | Less secure vs OAuth/SSO |

**Traceability**: MRD Section 2 (Technical Architecture Choices), PRD Section 3 (Technical Requirements)

### 9.2 Deferred Decisions (Future Work)

- **LangGraph vs CrewAI**: Evaluate LangGraph for complex agent graphs in Phase 2
- **Next.js Migration**: Consider Next.js if multi-page navigation needed
- **Self-Hosted Vector DB**: Evaluate Weaviate for cost optimization
- **Multi-Region Deployment**: Plan for Phase 2 when scaling requirements emerge
- **Enterprise Auth**: OAuth 2.0, SSO/SAML for Phase 2

---

## 10. Risks and Mitigation (MVP)

### 10.1 Technical Risks

| Risk | Level | Mitigation (MVP) | Future Mitigation |
|------|-------|------------------|-------------------|
| **Platform API Changes** | Medium | Monitor API changes, abstract behind connector layer | Diversify data sources |
| **Model Accuracy** | Medium | Human review loops, transparent confidence scores | Continuous learning, evaluation pipelines |
| **Cost Overruns** | High | Per-tenant cost monitoring, usage quotas | Advanced cost optimization |
| **Scalability Limits** | Low | Single instance sufficient for MVP | Auto-scaling, load balancing |

**Traceability**: MRD Section (Risk Assessment Matrix), PRD Section 8 (Risk Mitigation)

### 10.2 Operational Risks

| Risk | Level | Mitigation (MVP) | Future Mitigation |
|------|-------|------------------|-------------------|
| **Single Point of Failure** | Medium | Basic monitoring, manual failover | Multi-region, automated failover |
| **Data Loss** | Low | Basic database backups | Automated backups, disaster recovery |
| **Security Breach** | Medium | Basic security practices | SOC 2, advanced threat detection |

---

## 11. Traceability to Requirements

### 11.1 PRD Traceability

| PRD Section | Architecture Component | Status |
|-------------|------------------------|--------|
| Section 3: CrewAI Framework | Multi-Agent System Specification | ✅ MVP |
| Section 4: AI Campaign Planner | Campaign Planning Workflow | ✅ MVP |
| Section 4: Influencer Scoring | Influencer Agent | ✅ MVP |
| Section 4: Performance Forecasting | Performance Agent | ✅ MVP |
| Section 4: Export & Reporting | Frontend Export Feature | ✅ MVP |
| Section 4: A/B Scenario Simulation | Deferred | 🔄 Phase 2 |
| Section 4: Learning Agent | Deferred | 🔄 Phase 2 |
| Section 5: Security (OAuth, SSO) | Deferred | 🔄 Phase 2 |
| Section 5: 99.9% Uptime SLA | Deferred | 🔄 Phase 2 |
| Section 6: Role-Specific Workspaces | Basic Dashboard | ✅ MVP |

### 11.2 MRD Traceability

| MRD Section | Architecture Decision | Status |
|-------------|----------------------|--------|
| Section 2: Multi-Agent Architecture | CrewAI Framework Selection | ✅ MVP |
| Section 2: Vector DB Requirement | Pinecone Selection | ✅ MVP |
| Section 2: API-First Architecture | Platform API Connectors | ✅ MVP |
| Section 2: Phased Delivery | MVP Scope Definition | ✅ MVP |
| Section 4: Multi-Tenant SaaS | Tenant Isolation | ✅ MVP |
| Section 4: SOC 2 Readiness | Deferred | 🔄 Phase 2 |

---

## 12. Assumptions

1. **Platform API Access**: Target agencies have Instagram Business/TikTok Business accounts and can authorize API access (MRD Assumption 1)
2. **LLM Costs**: GPT-3.5-turbo costs remain manageable ($0.002-$0.02 per interaction) for MVP scale (PRD Assumption 6)
3. **CrewAI Maturity**: CrewAI framework is stable enough for MVP production use (PRD Assumption 5)
4. **Pilot Scale**: 2-3 pilot agencies with 10+ campaigns/month is sufficient for MVP validation (PRD Section 9)
5. **Single Region**: Single AWS/GCP region deployment is acceptable for MVP (no latency requirements for global users)
6. **Basic Security**: API key authentication and tenant isolation sufficient for MVP (enterprise security deferred)

**Traceability**: PRD Section (Assumptions), MRD Section (Assumptions)

---

## 13. Open Questions

1. **Pricing Model Impact**: How will seat-based vs usage-based pricing affect architecture? (PRD Open Question 1)
   - **MVP Approach**: Support both models via usage tracking, defer pricing model decision

2. **Workflow Variance**: How configurable must agent workflows be to fit different agency processes? (PRD Open Question 2)
   - **MVP Approach**: Fixed sequential workflow, gather feedback from pilots

3. **Platform API Stability**: To what degree will platforms restrict API access? (PRD Open Question 4)
   - **MVP Approach**: Monitor API changes, abstract behind connector layer

4. **Model Selection**: Should we offer customer-selectable LLMs? (PRD Open Question 5)
   - **MVP Approach**: Single LLM (GPT-3.5-turbo), evaluate multi-model support in Phase 2

**Traceability**: PRD Section (Open Questions)

---

## 14. Future Work (Explicitly Deferred)

### 14.1 Phase 2 Enhancements (90-180 days)

- **Learning Agent**: Closed-loop learning from campaign results
- **YouTube Integration**: Expand platform coverage
- **A/B Scenario Simulation**: Compare multiple influencer/content combinations
- **CRM Integrations**: HubSpot, Salesforce, Asana, Notion
- **Advanced Monitoring**: Prometheus/Grafana, distributed tracing
- **Cost Optimization**: Token usage optimization, caching strategies
- **SOC 2 Type I Preparation**: Security controls, audit logging

### 14.2 Phase 3 Enhancements (180-360 days)

- **Enterprise Features**: SSO, advanced RBAC, white-label options
- **Multi-Region Deployment**: Global latency optimization
- **Advanced AI**: Budget auto-allocation, autonomous optimization
- **SOC 2 Type II Certification**: Full compliance program
- **Analytics Warehouse**: BigQuery/Snowflake for long-term analytics

**Traceability**: PRD Section 8 (Implementation Strategy)

---

## 15. Architecture Validation Checklist

- [x] All P0 PRD requirements mapped to architectural components
- [x] CrewAI agents properly designed for campaign planning domain
- [x] MVP scope explicitly defined with deferrals documented
- [x] Data models support required queries and future scaling path
- [x] API design supports campaign planning workflow
- [x] Security measures appropriate for MVP (basic auth, encryption)
- [x] Deployment architecture supports rapid iteration
- [x] Monitoring and logging provide basic observability
- [x] Architecture supports transition from MVP to Phase 2/3
- [x] All decisions traceable to PRD/MRD requirements

---

## Sources

1. **PRD**: `project-context/1.define/prd-bagana-ai.md` - Functional requirements, technical specifications, implementation strategy
2. **MRD**: `project-context/1.define/mrd-bagana-ai.md` - Market research, technical feasibility, operational requirements
3. **CrewAI Documentation**: Multi-agent orchestration framework specifications
4. **ISO/IEC/IEEE 42010**: Systems and software engineering architecture description standard

---

## Audit

- **Timestamp**: 2026-01-19
- **Persona ID**: system-arch
- **Action**: create-sad --mvp
- **Artifact**: project-context/1.define/sad.md
- **Adapter**: CrewAI (AAMAD_ADAPTER=crewai, default)
- **Model**: GPT-4
- **Temperature**: 0.3
- **Inputs**: 
  - `project-context/1.define/mrd-bagana-ai.md`
  - `project-context/1.define/prd-bagana-ai.md`
- **Status**: Complete — MVP architecture ready for build phase
