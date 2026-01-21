# AAMAD – AI-Assisted Multi-Agent Application Development Framework

**AAMAD** is an open, production-grade framework for building, deploying, and evolving multi-agent applications using best context engineering practices. It systematizes research-driven planning, modular AI agent workflows, and rapid MVP/devops pipelines for enterprise-ready AI solutions.

---

## Table of Contents

- [What is AAMAD?](#what-is-aamad)
- [AAMAD Phases at a Glance](#aamad-phases-at-a-glance)
- [Repository Structure](#repository-structure)
- [Active Projects](#active-projects)
- [How to Use the Framework](#how-to-use-the-framework)
- [Contributing](#contributing)
- [License](#license)

---

## What is AAMAD?

AAMAD is a context engineering framework based on best practices in AI-assisted coding and multi-agent system development methodologies. It enables teams to:

- Launch projects with autonomous or collaborative AI agents
- Rapidly prototype MVPs with clear context boundaries
- Use production-ready architecture/design patterns
- Accelerate delivery, reduce manual overhead, and enable continuous iteration

---

## AAMAD Phases at a Glance

AAMAD organizes work into three phases: **Define**, **Build**, and **Deliver**, each with clear artifacts, personas, and rules to keep development auditable and reusable.

### Phase 1: Define
- Market Research Document (MRD)
- Product Requirements Document (PRD)
- System Architecture Document (SAD)
- Context handoff artifacts

### Phase 2: Build
- Setup and environment configuration
- Frontend/Backend implementation
- Integration and QA

### Phase 3: Deliver
- Deployment artifacts
- Operational documentation
- Handoff materials

---

## Repository Structure

```
AAMAD/
├── .cursor/                 # Cursor IDE configuration
│   ├── agents/             # Agent persona definitions
│   ├── rules/              # Development rules and guidelines
│   ├── templates/          # Document templates (MRD, PRD, SAD)
│   └── prompts/            # Reusable prompt templates
├── project-context/
│   ├── 1.define/           # Phase 1 artifacts (MRD, PRD)
│   ├── 2.build/            # Phase 2 artifacts (implementation docs)
│   └── 3.deliver/          # Phase 3 artifacts (deployment, ops)
├── scripts/                # Utility scripts
└── src/                    # Framework source code
```

---

## Active Projects

### Bagana AI: AI-Driven Content Intelligence Engine for Influencer Agencies

**Bagana AI** is a multi-agent content intelligence platform that predicts influencer campaign performance before money is spent, enabling agencies to make data-driven planning decisions with explainable recommendations.

#### Project Documentation

- **Market Research Document (MRD)**: [`project-context/1.define/mrd-bagana-ai.md`](project-context/1.define/mrd-bagana-ai.md)
  - Comprehensive market analysis and opportunity assessment
  - Technical feasibility and requirements analysis
  - User experience and workflow analysis
  - Production and operations requirements
  - Innovation and differentiation analysis

- **Product Requirements Document (PRD)**: [`project-context/1.define/prd-bagana-ai.md`](project-context/1.define/prd-bagana-ai.md)
  - Executive summary with problem statement and solution overview
  - Market context and user analysis
  - Technical requirements and multi-agent architecture (CrewAI)
  - Functional requirements (P0/P1/P2 priorities)
  - Non-functional requirements, UX design, success metrics
  - Implementation strategy and go-to-market plan

- **System Architecture Document (SAD)**: [`project-context/1.define/sad.md`](project-context/1.define/sad.md)
  - MVP architecture philosophy and principles
  - Multi-agent system specification (4 core agents: Trend, Audience, Influencer, Performance)
  - Logical, process/runtime, deployment, and data architecture views
  - Quality attributes and architectural decisions
  - Explicit deferrals to future phases
  - Traceability to PRD/MRD requirements

- **Frontend Functional Specification**: [`project-context/2.build/frontend-functional-spec.md`](project-context/2.build/frontend-functional-spec.md)
  - Campaign planning dashboard requirements
  - Input, Run, Results, and History sections specification
  - React/TypeScript component structure
  - Lightweight FSM implementation (idle → running → done)
  - Stub services for campaign planning workflow
  - Spec Sync checklist for maintaining documentation

- **Frontend Implementation**: [`project-context/2.build/frontend.md`](project-context/2.build/frontend.md)
  - React/TypeScript application implementation details
  - Component architecture and state management
  - Stub services and integration points
  - Testing notes and known limitations

#### Key Features

- **Multi-Agent Architecture**: Specialized agents for trend detection, audience modeling, influencer scoring, content strategy, performance forecasting, and continuous learning
- **Predictive Intelligence**: Forecast campaign outcomes before execution
- **ROI-Oriented**: Ties recommendations to business outcomes (CPA, CPL, revenue)
- **Explainable Recommendations**: Provides rationale and confidence scores for all suggestions

#### Market Context

- Global influencer marketing spend projected to exceed $24B+ by 2027
- 50-60% of campaigns underperform due to poor planning
- Targets influencer agencies and performance marketing teams
- Focus on ROI-centric campaign planning system

For detailed specifications, see the [MRD](project-context/1.define/mrd-bagana-ai.md), [PRD](project-context/1.define/prd-bagana-ai.md), [SAD](project-context/1.define/sad.md), and [Frontend Functional Spec](project-context/2.build/frontend-functional-spec.md) documents.

---

## How to Use the Framework

### Phase 1: Define Stage (Product Manager)

The Product Manager persona (`@product-mgr`) conducts prompt-driven discovery and context setup:

- **Market Research**: Generate Market Research Document (MRD) using `.cursor/templates/mrd-template.md`
- **Requirements**: Generate Product Requirements Document (PRD) using `.cursor/templates/prd-template.md`

The System Architect persona (`@system-arch`) creates the technical architecture:

- **Architecture**: Generate System Architecture Document (SAD) using `.cursor/templates/sad-template.md`
- **MVP Focus**: Use `*create-sad --mvp` for minimal viable architecture with explicit deferrals

Phase 1 outputs are stored in `project-context/1.define/` and provide the foundation for all subsequent development phases.

### Phase 2: Build Stage (Multi-Agent)

Each role is embodied by an agent persona, defined in `.cursor/agents/`. Phase 2 is executed by running each epic in sequence:

- **Setup**: Scaffold environment, install dependencies, and document (`setup.md`)
- **Frontend**: Build UI + placeholders, document (`frontend.md` and `frontend-functional-spec.md`)
- **Backend**: Implement backend, document (`backend.md`)
- **Integration**: Wire up workflows, verify, document (`integration.md`)
- **Quality Assurance**: Test end-to-end, log results and limitations (`qa.md`)

Artifacts are versioned and stored in `project-context/2.build` for traceability.

### Quick Start

1. Review the [Execution Checklist](CHECKLIST.md) for step-by-step guidance
2. Start with Phase 1: Define your project context using the Product Manager persona
3. Proceed to Phase 2: Build your application using specialized agent personas
4. Follow the modular development workflow for isolated, testable modules

---

## Contributing

Contributions are welcome! Please see our contributing guidelines and code of conduct for details.

---

## License

This project is part of the AAMAD framework. See [LICENSE](LICENSE) for details.
