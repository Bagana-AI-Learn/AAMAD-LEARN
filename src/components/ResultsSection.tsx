import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';

export default function ResultsSection() {
  const { state, results } = useWorkflow();

  if (state !== 'done' || !results) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Research Results</h3>
        <button
          onClick={() => window.location.reload()}
          className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          New Run
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
          <div>
            <span className="font-medium">Run ID:</span> {results.runId}
          </div>
          <div>
            <span className="font-medium">Completed:</span> {formatDate(results.timestamp)}
          </div>
          <div>
            <span className="font-medium">Duration:</span> {formatDuration(results.duration)}
          </div>
          <div>
            <span className="font-medium">Query:</span> {results.query}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Executive Summary</h4>
          <p className="text-gray-700 leading-relaxed">{results.summary}</p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Key Findings</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {results.findings.map((finding, index) => (
              <li key={index}>{finding}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Recommendations</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {results.recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Sources</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {results.sources.map((source, index) => (
              <li key={index}>{source}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
