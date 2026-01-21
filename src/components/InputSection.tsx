import React, { useState, FormEvent } from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { startRun } from '../services/workflowService';
import type { WorkflowState } from '../types/workflow';

export default function InputSection() {
  const { state, dispatch } = useWorkflow();
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('Market Analysis');
  const [depth, setDepth] = useState('Standard');
  const [errors, setErrors] = useState<{ query?: string }>({});

  const isDisabled = state === 'running';

  const validate = (): boolean => {
    const newErrors: { query?: string } = {};
    
    if (!query.trim()) {
      newErrors.query = 'Query is required';
    } else if (query.trim().length < 10) {
      newErrors.query = 'Query must be at least 10 characters';
    } else if (query.length > 500) {
      newErrors.query = 'Query must not exceed 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      const { runId } = await startRun(query, scope, depth);
      dispatch({
        type: 'START_RUN',
        payload: {
          runId,
          input: { query, scope, depth },
        },
      });
      
      // Clear form
      setQuery('');
      setScope('Market Analysis');
      setDepth('Standard');
    } catch (error) {
      dispatch({
        type: 'RUN_ERROR',
        payload: { error: error instanceof Error ? error.message : 'Failed to start workflow' },
      });
    }
  };

  const getStateColor = (currentState: WorkflowState): string => {
    switch (currentState) {
      case 'idle':
        return 'bg-gray-100 text-gray-700';
      case 'running':
        return 'bg-blue-100 text-blue-700';
      case 'done':
        return 'bg-green-100 text-green-700';
      case 'error':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Critical Research Workflow</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStateColor(state)}`}>
          {state.charAt(0).toUpperCase() + state.slice(1)}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
            Research Query *
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isDisabled}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.query ? 'border-red-300' : 'border-gray-300'
            } ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Enter your research question or topic (10-500 characters)..."
          />
          {errors.query && (
            <p className="mt-1 text-sm text-red-600">{errors.query}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">{query.length}/500 characters</p>
        </div>

        <div>
          <label htmlFor="scope" className="block text-sm font-medium text-gray-700 mb-1">
            Scope *
          </label>
          <select
            id="scope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            disabled={isDisabled}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          >
            <option value="Market Analysis">Market Analysis</option>
            <option value="Technical Feasibility">Technical Feasibility</option>
            <option value="User Research">User Research</option>
            <option value="Competitive Analysis">Competitive Analysis</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Depth *
          </label>
          <div className="flex gap-4">
            {['Quick', 'Standard', 'Deep'].map((option) => (
              <label
                key={option}
                className={`flex items-center ${
                  isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                }`}
              >
                <input
                  type="radio"
                  name="depth"
                  value={option}
                  checked={depth === option}
                  onChange={(e) => setDepth(e.target.value)}
                  disabled={isDisabled}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">
                  {option}
                  {option === 'Quick' && ' (5 min)'}
                  {option === 'Standard' && ' (15 min)'}
                  {option === 'Deep' && ' (30 min)'}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isDisabled}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {isDisabled ? 'Running...' : 'Start Research Workflow'}
        </button>
      </form>
    </div>
  );
}
