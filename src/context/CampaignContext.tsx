import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { CampaignContextState, CampaignAction, CampaignResults } from '../types/campaign';
import { getCampaignStatus } from '../services/campaignService';

const initialState: CampaignContextState = {
  state: 'idle',
  campaignId: null,
  brief: null,
  results: null,
  error: null,
  currentAgent: undefined,
};

function campaignReducer(
  state: CampaignContextState,
  action: CampaignAction
): CampaignContextState {
  switch (action.type) {
    case 'START_CAMPAIGN':
      return {
        ...state,
        state: 'running',
        campaignId: action.payload.campaignId,
        brief: action.payload.brief,
        error: null,
        currentAgent: undefined,
      };
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        currentAgent: action.payload.agent,
      };
    case 'CAMPAIGN_COMPLETE':
      return {
        ...state,
        state: 'done',
        results: action.payload.results,
        error: null,
        currentAgent: undefined,
      };
    case 'CAMPAIGN_ERROR':
      return {
        ...state,
        state: 'error',
        error: action.payload.error,
        currentAgent: undefined,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface CampaignContextType {
  state: CampaignContextState;
  dispatch: React.Dispatch<CampaignAction>;
  pollCampaignStatus: (campaignId: string) => Promise<void>;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export function CampaignProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(campaignReducer, initialState);

  // Simulate agent progress steps
  const agentSteps = [
    { name: 'Trend Agent', message: 'Analyzing trends...' },
    { name: 'Audience Agent', message: 'Modeling audience...' },
    { name: 'Influencer Agent', message: 'Scoring influencers...' },
    { name: 'Performance Agent', message: 'Forecasting performance...' },
  ];

  // Poll for campaign status when in 'running' state
  const pollCampaignStatus = async (campaignId: string) => {
    try {
      // Simulate agent progress
      for (let i = 0; i < agentSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 750));
        dispatch({ type: 'UPDATE_PROGRESS', payload: { agent: agentSteps[i].name } });
      }

      const response = await getCampaignStatus(campaignId);
      
      if (response.status === 'done' && response.results) {
        dispatch({ type: 'CAMPAIGN_COMPLETE', payload: { results: response.results } });
        // Save to history
        saveToHistory(response.results);
      } else if (response.status === 'error') {
        dispatch({ type: 'CAMPAIGN_ERROR', payload: { error: 'Campaign planning workflow failed' } });
      }
    } catch (error) {
      dispatch({ 
        type: 'CAMPAIGN_ERROR', 
        payload: { error: error instanceof Error ? error.message : 'Unknown error' } 
      });
    }
  };

  // Auto-poll when state is 'running'
  useEffect(() => {
    if (state.state === 'running' && state.campaignId) {
      pollCampaignStatus(state.campaignId);
    }
  }, [state.state, state.campaignId]);

  return (
    <CampaignContext.Provider value={{ state, dispatch, pollCampaignStatus }}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaign() {
  const context = useContext(CampaignContext);
  if (context === undefined) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
}

// Helper: Save results to history (localStorage)
function saveToHistory(results: CampaignResults) {
  const historyKey = 'bagana_campaign_history';
  const existing = localStorage.getItem(historyKey);
  const history = existing ? JSON.parse(existing) : [];
  
  // Add new result to beginning of history
  history.unshift(results);
  
  // Keep only last 20 campaigns
  const limitedHistory = history.slice(0, 20);
  
  localStorage.setItem(historyKey, JSON.stringify(limitedHistory));
}

// Helper: Get history from localStorage
export function getHistory(): CampaignResults[] {
  const historyKey = 'bagana_campaign_history';
  const existing = localStorage.getItem(historyKey);
  return existing ? JSON.parse(existing) : [];
}
