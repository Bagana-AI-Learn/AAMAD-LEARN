export type WorkflowState = 'idle' | 'running' | 'done' | 'error';

export interface ResearchInput {
  query: string;
  scope: string;
  depth: string;
}

export interface ResearchResults {
  summary: string;
  findings: string[];
  recommendations: string[];
  sources: string[];
  runId: string;
  timestamp: number;
  duration: number;
  query: string;
}

export interface WorkflowContextState {
  state: WorkflowState;
  runId: string | null;
  input: ResearchInput | null;
  results: ResearchResults | null;
  error: string | null;
}

export type WorkflowAction =
  | { type: 'START_RUN'; payload: { runId: string; input: ResearchInput } }
  | { type: 'RUN_COMPLETE'; payload: { results: ResearchResults } }
  | { type: 'RUN_ERROR'; payload: { error: string } }
  | { type: 'RESET' };
