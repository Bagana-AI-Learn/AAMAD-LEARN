import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';

export default function RunSection() {
  const { state, input } = useWorkflow();

  if (state !== 'running' && state !== 'done') {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Workflow Status</h3>
      
      {state === 'running' && (
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div>
            <p className="text-lg font-medium text-gray-800">Running Research Workflow...</p>
            <p className="text-sm text-gray-600 mt-1">
              Analyzing: {input?.query || 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Scope: {input?.scope} | Depth: {input?.depth}
            </p>
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
            <p className="text-lg font-medium text-green-800">Workflow Complete!</p>
            <p className="text-sm text-gray-600 mt-1">
              Research results are ready below.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
