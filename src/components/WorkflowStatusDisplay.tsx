import React from 'react';
import { useCampaign } from '../context/CampaignContext';

const agentSteps = [
  { name: 'Trend Agent', message: 'Analyzing trends...' },
  { name: 'Audience Agent', message: 'Modeling audience...' },
  { name: 'Influencer Agent', message: 'Scoring influencers...' },
  { name: 'Performance Agent', message: 'Forecasting performance...' },
];

export default function WorkflowStatusDisplay() {
  const { state, currentAgent, brief } = useCampaign();

  if (state !== 'running' && state !== 'done' && state !== 'error') {
    return null;
  }

  const getCurrentStepIndex = () => {
    if (!currentAgent) return -1;
    return agentSteps.findIndex(step => step.name === currentAgent);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Workflow Status</h3>
      
      {state === 'running' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div>
              <p className="text-lg font-medium text-gray-800">Planning Campaign...</p>
              <p className="text-sm text-gray-600 mt-1">
                {brief?.objectives ? `Objectives: ${brief.objectives.substring(0, 60)}...` : 'Processing campaign brief'}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {agentSteps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isCompleted = currentStepIndex > index;
              
              return (
                <div
                  key={step.name}
                  className={`flex items-center space-x-3 p-2 rounded ${
                    isActive ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : isActive ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  )}
                  <span className={`text-sm ${isActive ? 'font-medium text-blue-700' : 'text-gray-600'}`}>
                    {step.message}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {state === 'done' && (
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium text-green-800">Campaign Planning Complete!</p>
            <p className="text-sm text-gray-600 mt-1">
              Recommendations and forecasts are ready below.
            </p>
          </div>
        </div>
      )}

      {state === 'error' && (
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium text-red-800">Campaign Planning Failed</p>
            <p className="text-sm text-gray-600 mt-1">
              Please try again or contact support if the issue persists.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
