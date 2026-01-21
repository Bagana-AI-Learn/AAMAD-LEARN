import React, { useState, useEffect } from 'react';
import { getHistory } from '../context/WorkflowContext';
import type { ResearchResults } from '../types/workflow';

export default function HistorySection() {
  const [history, setHistory] = useState<ResearchResults[]>([]);
  const [selectedResult, setSelectedResult] = useState<ResearchResults | null>(null);

  useEffect(() => {
    const loadHistory = () => {
      const stored = getHistory();
      setHistory(stored);
    };

    loadHistory();
    
    // Refresh history every 2 seconds when workflow completes
    const interval = setInterval(loadHistory, 2000);
    return () => clearInterval(interval);
  }, []);

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">History</h3>
        <p className="text-gray-600 text-sm">No previous runs yet. Complete a research workflow to see history here.</p>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">History</h3>
      
      <div className="space-y-3">
        {history.map((result) => (
          <div
            key={result.runId}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedResult?.runId === result.runId
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedResult(result)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm truncate">
                  {result.query}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(result.timestamp)} • {result.sources.length} sources
                </p>
              </div>
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                Completed
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedResult && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800">Selected Result Details</h4>
            <button
              onClick={() => setSelectedResult(null)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
          <div className="text-sm text-gray-700 space-y-2">
            <p><span className="font-medium">Run ID:</span> {selectedResult.runId}</p>
            <p><span className="font-medium">Summary:</span> {selectedResult.summary}</p>
            <p><span className="font-medium">Findings:</span> {selectedResult.findings.length} items</p>
            <p><span className="font-medium">Recommendations:</span> {selectedResult.recommendations.length} items</p>
          </div>
        </div>
      )}
    </div>
  );
}
