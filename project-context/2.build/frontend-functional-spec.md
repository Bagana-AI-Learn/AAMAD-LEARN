# Frontend Functional Specification: Critical Research Workflow

## Context & Instructions
- **Purpose**: Define the frontend implementation for the Critical Research Workflow feature.
- **Status**: MVP - Initial implementation with basic workflow states and stub services.
- **Framework**: React 18+ with TypeScript, using functional components and hooks.
- **State Management**: Lightweight FSM for workflow state (idle → running → done).

## Overview

The Critical Research Workflow is a single-page application that enables users to:
1. **Input**: Submit research parameters via a form
2. **Run**: Execute a research workflow (backend orchestrated)
3. **Results**: View completed research results
4. **History**: Access past research runs

## Functional Requirements

### 1. Input Section

**Purpose**: Collect research parameters from the user.

**Fields**:
- **Query**: Text input for research question/topic (required, max 500 chars)
- **Scope**: Select dropdown (required)
  - Options: "Market Analysis", "Technical Feasibility", "User Research", "Competitive Analysis"
- **Depth**: Radio buttons (required)
  - Options: "Quick" (5 min), "Standard" (15 min), "Deep" (30 min)
- **Submit Button**: Triggers workflow start

**Validation**:
- All fields required before submission
- Query must be between 10-500 characters
- Show validation errors inline

**Behavior**:
- Form is disabled when workflow is in "running" state
- Form resets after successful submission (prepares for new run)

### 2. Run Section

**Purpose**: Display workflow execution status and progress.

**States**:
- **Idle**: Default state, form ready for input
- **Running**: Workflow executing, show progress indicator
- **Done**: Workflow complete, show completion message and results link

**UI Elements**:
- **Status Badge**: Visual indicator of current state (color-coded)
- **Progress Indicator**: Spinner/loader when running
- **Status Message**: Human-readable status text
- **Cancel Button**: (Future) Allow cancellation of running workflow

**State Transitions**:
```
idle → [user submits] → running → [workflow completes] → done → [user resets/new run] → idle
```

### 3. Results Section

**Purpose**: Display completed research results.

**Content**:
- **Summary**: Executive summary of research findings
- **Key Findings**: Bulleted list of main insights
- **Recommendations**: Actionable recommendations based on research
- **Sources**: List of references/data sources used
- **Metadata**: 
  - Run ID
  - Completion timestamp
  - Duration
  - Query used

**Display Logic**:
- Only visible when state is "done"
- Results persist in history (localStorage initially, backend later)
- Expandable/collapsible sections for readability

### 4. History Section

**Purpose**: Show previous research runs for reference.

**Features**:
- **List View**: Chronological list of past runs
  - Query/topic
  - Date/time
  - Status (completed/failed)
  - Quick link to view results
- **Filter**: Filter by date range, scope, or query text (future)
- **Pagination**: Limit to last 10 runs initially (infinite scroll later)

**Storage**:
- **MVP**: Browser localStorage (JSON serialized)
- **Future**: Backend API integration

## Technical Specifications

### State Management

**FSM States**:
```typescript
type WorkflowState = 'idle' | 'running' | 'done' | 'error';
```

**State Machine**:
```
Initial: idle
Transitions:
  - idle → running: on form submit (startRun)
  - running → done: on workflow completion (polling/getRunStatus)
  - running → error: on workflow failure
  - done → idle: on reset/new run
  - error → idle: on reset/retry
```

**State Store**:
- Use React Context + useReducer for FSM
- Store current state, run ID, results, error messages
- Persist state to localStorage for history

### Services (Stub Implementation)

#### `startRun(query: string, scope: string, depth: string): Promise<{ runId: string }>`

**Purpose**: Initiate a research workflow.

**Implementation** (MVP - Stub):
```typescript
// Returns mock runId after simulated delay
async function startRun(query: string, scope: string, depth: string) {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { runId: `run_${Date.now()}` };
}
```

**Future**: Real API call to backend endpoint.

#### `getRunStatus(runId: string): Promise<{ status: WorkflowState, results?: ResearchResults }>`

**Purpose**: Poll for workflow status and results.

**Implementation** (MVP - Stub):
```typescript
// Simulates workflow progression: running → done with mock results
async function getRunStatus(runId: string) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    status: 'done',
    results: {
      summary: 'Mock research summary...',
      findings: ['Finding 1', 'Finding 2'],
      recommendations: ['Recommendation 1'],
      sources: ['Source 1', 'Source 2']
    }
  };
}
```

**Future**: Real API polling to backend endpoint.

### Component Structure

```
App
├── WorkflowContainer (FSM provider)
│   ├── InputSection (form)
│   ├── RunSection (status display)
│   ├── ResultsSection (results display)
│   └── HistorySection (history list)
```

### Routing

**Single Route**: `/` (home page)
- No routing library needed for MVP
- All sections on same page, conditionally rendered based on state

### Styling

- **Framework**: Tailwind CSS (utility-first)
- **Responsive**: Mobile-first design, breakpoints: sm, md, lg
- **Components**: Reusable button, input, card components
- **Theme**: Light mode default (dark mode future)

## User Experience Flow

1. **User lands on page** → State: `idle`, Form visible
2. **User fills form and submits** → State: `running`, Form disabled, Progress shown
3. **Workflow executes** → Polling starts, Status updates
4. **Workflow completes** → State: `done`, Results displayed, History updated
5. **User views results** → Results expanded, History shows new entry
6. **User starts new run** → Reset to `idle`, Form cleared

## Acceptance Criteria

- [ ] Form accepts all required inputs and validates correctly
- [ ] Form submission triggers `startRun` service
- [ ] FSM transitions correctly: idle → running → done
- [ ] Running state shows progress indicator
- [ ] Done state displays results
- [ ] History section persists and displays past runs
- [ ] All sections are responsive (mobile, tablet, desktop)
- [ ] Error states are handled gracefully
- [ ] Loading states prevent duplicate submissions

## Future Enhancements (Post-MVP)

- [ ] Backend API integration (replace stub services)
- [ ] Real-time status updates (WebSocket/SSE)
- [ ] Workflow cancellation
- [ ] Results export (PDF, CSV)
- [ ] Advanced filtering and search in history
- [ ] Pagination for history
- [ ] Dark mode toggle
- [ ] Multiple concurrent runs
- [ ] Workflow templates/presets

## Spec Sync Checklist

After each commit that changes functionality, update this checklist:

### Component Changes
- [ ] Update component structure if changed
- [ ] Document new props/state if added
- [ ] Update state machine diagram if FSM changed

### Service Changes
- [ ] Update service signatures if changed
- [ ] Document new endpoints if added
- [ ] Update mock data structure if changed

### UI/UX Changes
- [ ] Update user flow if workflow changed
- [ ] Document new features if added
- [ ] Update acceptance criteria if scope changed

### Technical Changes
- [ ] Update dependencies if added/removed
- [ ] Document new patterns/architectures if introduced
- [ ] Update performance considerations if applicable

## Audit

- **Timestamp**: 2026-01-19
- **Persona ID**: frontend-eng
- **Action**: create-frontend-functional-spec
- **Artifact**: project-context/2.build/frontend-functional-spec.md
- **Status**: Complete — Ready for implementation
