import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { WorkflowContextState, WorkflowAction, ResearchResults } from '../types/workflow';
import { getRunStatus } from '../services/workflowService';

const initialState: WorkflowContextState = {
  state: 'idle',
  runId: null,
  input: null,
  results: null,
  error: null,
};

function workflowReducer(
  state: WorkflowContextState,
  action: WorkflowAction
): WorkflowContextState {
  switch (action.type) {
    case 'START_RUN':
      return {
        ...state,
        state: 'running',
        runId: action.payload.runId,
        input: action.payload.input,
        error: null,
      };
    case 'RUN_COMPLETE':
      return {
        ...state,
        state: 'done',
        results: action.payload.results,
        error: null,
      };
    case 'RUN_ERROR':
      return {
        ...state,
        state: 'error',
        error: action.payload.error,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface WorkflowContextType {
  state: WorkflowContextState;
  dispatch: React.Dispatch<WorkflowAction>;
  pollRunStatus: (runId: string) => Promise<void>;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, initialState);

  // Poll for run status when in 'running' state
  const pollRunStatus = async (runId: string) => {
    try {
      const response = await getRunStatus(runId);
      
      if (response.status === 'done' && response.results) {
        dispatch({ type: 'RUN_COMPLETE', payload: { results: response.results } });
        // Save to history
        saveToHistory(response.results);
      } else if (response.status === 'error') {
        dispatch({ type: 'RUN_ERROR', payload: { error: 'Workflow execution failed' } });
      }
    } catch (error) {
      dispatch({ 
        type: 'RUN_ERROR', 
        payload: { error: error instanceof Error ? error.message : 'Unknown error' } 
      });
    }
  };

  // Auto-poll when state is 'running'
  useEffect(() => {
    if (state.state === 'running' && state.runId) {
      const timeoutId = setTimeout(() => {
        pollRunStatus(state.runId!);
      }, 1000); // Poll after 1 second delay (simulated workflow time)

      return () => clearTimeout(timeoutId);
    }
  }, [state.state, state.runId]);

  return (
    <WorkflowContext.Provider value={{ state, dispatch, pollRunStatus }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
}

// Helper: Save results to history (localStorage)
function saveToHistory(results: ResearchResults) {
  const historyKey = 'workflow_history';
  const existing = localStorage.getItem(historyKey);
  const history = existing ? JSON.parse(existing) : [];
  
  // Add new result to beginning of history
  history.unshift(results);
  
  // Keep only last 10 runs
  const limitedHistory = history.slice(0, 10);
  
  localStorage.setItem(historyKey, JSON.stringify(limitedHistory));
}

// Helper: Get history from localStorage
export function getHistory(): ResearchResults[] {
  const historyKey = 'workflow_history';
  const existing = localStorage.getItem(historyKey);
  return existing ? JSON.parse(existing) : [];
}
