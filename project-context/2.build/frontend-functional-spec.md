# Frontend Functional Specification: Bagana AI Campaign Planning Dashboard

## Context & Instructions
- **Purpose**: Define the frontend implementation for Bagana AI MVP campaign planning dashboard per SAD requirements.
- **Status**: MVP - Initial implementation with campaign brief form, workflow execution, results display, and history.
- **Framework**: React 18+ with TypeScript, Vite build tool, Tailwind CSS styling.
- **State Management**: Lightweight FSM for campaign planning workflow state (idle → running → done).
- **Inputs**: `project-context/1.define/sad.md` (Section 4.1 Frontend Layer, Section 4.2 Data Models)

## Overview

The Bagana AI Campaign Planning Dashboard is a single-page application that enables agency managers to:
1. **Input**: Submit campaign briefs with objectives, target audience, budget, KPIs, platforms
2. **Run**: Execute multi-agent campaign planning workflow (Trend → Audience → Influencer → Performance agents)
3. **Results**: View ranked influencer recommendations with fit scores, performance forecasts, and explainable rationale
4. **History**: Access past campaign planning runs for reference

**Traceability**: SAD Section 4.1 (Frontend Layer), PRD Section 4 (AI Campaign Planner), PRD Section 6 (User Experience Design)

## Functional Requirements

### 1. Input Section: Campaign Brief Form

**Purpose**: Collect campaign planning parameters from agency managers.

**Fields** (per SAD Section 4.2 CampaignBrief model):
- **Objectives**: Textarea (required, max 1000 chars) - Campaign goals and objectives
- **Target Audience**: Textarea (required, max 500 chars) - Audience demographics, interests, psychographics
- **Budget**: Number input (optional) - Campaign budget in USD
- **KPIs**: Multi-select checkboxes (required, at least one) - ["engagement", "conversions", "roi", "reach", "brand_awareness"]
- **Platforms**: Multi-select checkboxes (required, at least one) - ["instagram", "tiktok"] (MVP only)
- **Scope**: Select dropdown (required) - ["Market Analysis", "Technical Feasibility", "User Research", "Competitive Analysis"]
- **Depth**: Radio buttons (required) - ["Quick" (5 min), "Standard" (15 min), "Deep" (30 min)]
- **Submit Button**: Triggers campaign planning workflow start

**Validation**:
- All required fields must be filled before submission
- Objectives must be between 20-1000 characters
- Target Audience must be between 10-500 characters
- Budget must be positive number if provided
- At least one KPI and one platform must be selected
- Show validation errors inline with clear messages

**Behavior**:
- Form is disabled when workflow is in "running" state
- Form resets after successful submission (prepares for new campaign)
- Form persists draft state in localStorage (optional MVP enhancement)

**Traceability**: SAD Section 4.2 (CampaignBrief model), PRD Section 4 (AI Campaign Planner - Acceptance Criteria 1)

### 2. Run Section: Workflow Execution Status

**Purpose**: Display campaign planning workflow execution status and progress.

**States** (FSM):
- **Idle**: Default state, form ready for input
- **Running**: Workflow executing (Trend → Audience → Influencer → Performance agents)
- **Done**: Workflow complete, results available
- **Error**: Workflow failed (API error, agent failure, timeout)

**UI Elements**:
- **Status Badge**: Visual indicator of current state (color-coded: gray/idle, blue/running, green/done, red/error)
- **Progress Indicator**: Step-by-step progress showing current agent execution
  - "Analyzing trends..." (Trend Agent)
  - "Modeling audience..." (Audience Agent)
  - "Scoring influencers..." (Influencer Agent)
  - "Forecasting performance..." (Performance Agent)
- **Status Message**: Human-readable status text with elapsed time
- **Cancel Button**: (Future) Allow cancellation of running workflow

**State Transitions**:
```
idle → [user submits campaign brief] → running → [workflow completes] → done → [user starts new campaign] → idle
idle → [user submits] → running → [workflow fails] → error → [user retries/resets] → idle
```

**Traceability**: SAD Section 5.1 (Campaign Planning Workflow), PRD Section 4 (AI Campaign Planner)

### 3. Results Section: Recommendations Display

**Purpose**: Display completed campaign planning results with ranked influencers and forecasts.

**Content Structure** (per SAD Section 4.2 Recommendation and PerformanceForecast models):

**Campaign Summary**:
- Campaign ID, creation timestamp, execution duration
- Campaign objectives and target audience summary
- Selected platforms and KPIs

**Ranked Influencer Shortlist** (top 10-20, per PRD Section 4):
- **Influencer Card** for each recommendation:
  - Influencer ID/username, platform badge (Instagram/TikTok)
  - **Fit Score**: 0-100 with visual indicator (progress bar, color-coded)
  - **Confidence**: 0-1 with confidence level badge (High/Medium/Low)
  - **Rationale**: Explainable reason for recommendation (key signals: audience overlap, engagement quality, historical patterns)
  - **Predicted Engagement**: Engagement metrics (likes, comments, shares, views) with confidence intervals
  - **Content Strategy**: Recommended format, messaging, timing (if available)
  - **Expandable Details**: Drill-down into contributing factors (audience overlap %, engagement rate, historical performance)

**Performance Forecast**:
- **Engagement Forecast**: Predicted engagement metrics with confidence intervals (p10, p50, p90)
- **Conversion Forecast**: Predicted conversion metrics (if conversion tracking available)
- **ROI Forecast**: Predicted ROI with risk indicators
- **Benchmark Comparison**: Comparison to historical benchmarks and industry averages (if available)

**Export Options**:
- **Export to CSV**: Influencer list with scores, rationale, forecasts
- **Export to PDF**: Client-ready report with visualizations (charts, tables)
- **Copy Link**: Shareable link to campaign results (future)

**Display Logic**:
- Only visible when state is "done"
- Results persist in history (localStorage initially, backend later)
- Expandable/collapsible sections for readability
- Sortable/filterable influencer list (by score, platform, confidence)

**Traceability**: SAD Section 4.2 (Recommendation, PerformanceForecast models), PRD Section 4 (AI Campaign Planner - Acceptance Criteria 2-7)

### 4. History Section: Past Campaign Runs

**Purpose**: Show previous campaign planning runs for reference and comparison.

**Features**:
- **List View**: Chronological list of past campaigns
  - Campaign objectives (truncated)
  - Date/time created and completed
  - Status (completed/failed)
  - Number of recommendations
  - Quick link to view full results
- **Filter**: Filter by date range, platform, status (future enhancement)
- **Search**: Search by campaign objectives or influencer names (future enhancement)
- **Pagination**: Limit to last 20 campaigns initially (infinite scroll later)

**Storage**:
- **MVP**: Browser localStorage (JSON serialized, key: `bagana_campaign_history`)
- **Future**: Backend API integration for persistent storage

**Traceability**: PRD Section 4 (Campaign Dashboard - Acceptance Criteria 1)

## Technical Specifications

### State Management

**FSM States**:
```typescript
type CampaignState = 'idle' | 'running' | 'done' | 'error';
```

**State Machine**:
```
Initial: idle
Transitions:
  - idle → running: on form submit (startCampaignPlanning)
  - running → done: on workflow completion (polling/getCampaignStatus)
  - running → error: on workflow failure (API error, timeout)
  - done → idle: on reset/new campaign
  - error → idle: on reset/retry
```

**State Store**:
- Use React Context + useReducer for FSM
- Store current state, campaign ID, brief, results, error messages
- Persist state to localStorage for history

**Traceability**: SAD Section 5.1 (Campaign Planning Workflow)

### Services (Stub Implementation)

#### `startCampaignPlanning(brief: CampaignBrief): Promise<{ campaignId: string }>`

**Purpose**: Initiate a campaign planning workflow.

**Implementation** (MVP - Stub):
```typescript
// Returns mock campaignId after simulated delay
async function startCampaignPlanning(brief: CampaignBrief) {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { campaignId: `campaign_${Date.now()}` };
}
```

**Future**: Real API call to backend endpoint `POST /api/v1/campaigns/plan` (SAD Section 3.3)

#### `getCampaignStatus(campaignId: string): Promise<{ status: CampaignState, results?: CampaignResults }>`

**Purpose**: Poll for campaign planning status and results.

**Implementation** (MVP - Stub):
```typescript
// Simulates workflow progression: running → done with mock results
async function getCampaignStatus(campaignId: string) {
  await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate agent execution
  return {
    status: 'done',
    results: {
      campaignId,
      recommendations: [
        // Mock ranked influencer list (top 10-20)
        {
          influencerId: 'influencer_1',
          platform: 'instagram',
          fitScore: 85,
          confidence: 0.9,
          rationale: 'Strong audience overlap (78%), high engagement rate (4.2%), proven track record in similar campaigns',
          predictedEngagement: { likes: 5000, comments: 250, shares: 120, views: 25000 },
          contentStrategy: { format: 'carousel', messaging: 'product showcase', timing: 'peak hours' }
        },
        // ... more recommendations
      ],
      performanceForecast: {
        predictedEngagement: { likes: 45000, comments: 2250, shares: 1080, views: 225000 },
        predictedConversion: { clicks: 5000, leads: 250, sales: 50 },
        predictedROI: 3.2,
        confidenceIntervals: { p10: 2.1, p50: 3.2, p90: 4.5 },
        riskIndicators: ['Moderate audience overlap', 'Seasonal trends may impact performance']
      }
    }
  };
}
```

**Future**: Real API polling to backend endpoint `GET /api/v1/campaigns/{campaignId}/status` (SAD Section 3.3)

**Traceability**: SAD Section 3.3 (Integration Points), SAD Section 5.1 (Request Flow)

### Component Structure

```
App
├── CampaignPlanningContainer (FSM provider)
│   ├── CampaignBriefForm (input section)
│   ├── WorkflowStatusDisplay (run section)
│   ├── RecommendationsDisplay (results section)
│   └── CampaignHistory (history section)
```

**Component Hierarchy**:
- `App.tsx`: Main application container
- `CampaignPlanningContainer.tsx`: FSM context provider, orchestrates workflow
- `CampaignBriefForm.tsx`: Form component for campaign input
- `WorkflowStatusDisplay.tsx`: Status display with progress indicator
- `RecommendationsDisplay.tsx`: Results display with influencer cards
- `InfluencerCard.tsx`: Individual influencer recommendation card
- `PerformanceForecast.tsx`: Performance forecast visualization
- `CampaignHistory.tsx`: History list component
- `ExportButtons.tsx`: Export functionality (CSV/PDF)

**Traceability**: SAD Section 4.1 (Frontend Layer)

### Routing

**Single Route**: `/` (home page)
- No routing library needed for MVP
- All sections on same page, conditionally rendered based on state
- Future: Add routing for individual campaign detail pages

**Traceability**: SAD Section 2.3 (React/Vite decision)

### Styling

- **Framework**: Tailwind CSS (utility-first)
- **Responsive**: Mobile-first design, breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Components**: Reusable button, input, card components with consistent styling
- **Theme**: Light mode default (dark mode future)
- **Accessibility**: WCAG 2.1 AA compliance (keyboard navigation, screen reader support)

**Traceability**: SAD Section 4.1 (Frontend Layer), PRD Section 6 (Accessibility)

## User Experience Flow

1. **User lands on page** → State: `idle`, Campaign Brief Form visible
2. **User fills form and submits** → State: `running`, Form disabled, Progress shown
3. **Workflow executes** → Polling starts, Status updates with agent progress
4. **Workflow completes** → State: `done`, Results displayed, History updated
5. **User views results** → Recommendations expanded, Performance forecast visible
6. **User exports results** → CSV/PDF download
7. **User starts new campaign** → Reset to `idle`, Form cleared

**Traceability**: SAD Section 5.1 (Campaign Planning Workflow), PRD Section 6 (User Experience Design)

## Acceptance Criteria

- [ ] Form accepts all required inputs and validates correctly
- [ ] Form submission triggers `startCampaignPlanning` service
- [ ] FSM transitions correctly: idle → running → done
- [ ] Running state shows progress indicator with agent steps
- [ ] Done state displays ranked influencer recommendations (top 10-20)
- [ ] Recommendations show fit scores (0-100), confidence, rationale
- [ ] Performance forecast displays with confidence intervals
- [ ] Export to CSV/PDF works correctly
- [ ] History section persists and displays past campaigns
- [ ] All sections are responsive (mobile, tablet, desktop)
- [ ] Error states are handled gracefully
- [ ] Loading states prevent duplicate submissions

**Traceability**: PRD Section 4 (AI Campaign Planner - Acceptance Criteria)

## Future Enhancements (Post-MVP)

- [ ] Backend API integration (replace stub services)
- [ ] Real-time status updates (WebSocket/SSE)
- [ ] Campaign cancellation
- [ ] A/B scenario comparison (deferred to Phase 2 per SAD)
- [ ] Advanced filtering and search in history
- [ ] Campaign templates/presets
- [ ] Multi-campaign dashboard view
- [ ] Dark mode toggle
- [ ] Individual campaign detail pages with routing

**Traceability**: SAD Section 14 (Future Work), PRD Section 4 (Enhanced Features)

## Spec Sync Checklist

After each commit that changes functionality, update this checklist:

### Component Changes
- [ ] Update component structure if changed
- [ ] Document new props/state if added
- [ ] Update state machine diagram if FSM changed
- [ ] Update component hierarchy if structure changed

### Service Changes
- [ ] Update service signatures if changed
- [ ] Document new endpoints if added
- [ ] Update mock data structure if changed
- [ ] Document API integration progress

### UI/UX Changes
- [ ] Update user flow if workflow changed
- [ ] Document new features if added
- [ ] Update acceptance criteria if scope changed
- [ ] Update responsive design notes if breakpoints changed

### Technical Changes
- [ ] Update dependencies if added/removed
- [ ] Document new patterns/architectures if introduced
- [ ] Update performance considerations if applicable
- [ ] Document accessibility improvements

### Integration Progress
- [ ] Update backend integration status
- [ ] Document API contract changes
- [ ] Update error handling if changed
- [ ] Document testing progress

**Traceability**: Frontend Engineer workflow documentation requirements

## Audit

- **Timestamp**: 2026-01-19
- **Persona ID**: frontend-eng
- **Action**: develop-fe
- **Artifact**: project-context/2.build/frontend-functional-spec.md
- **Inputs**: 
  - `project-context/1.define/sad.md`
  - `project-context/1.define/prd-bagana-ai.md`
- **Status**: Complete — Ready for implementation
