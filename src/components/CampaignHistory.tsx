import React, { useState, useEffect } from 'react';
import { getHistory } from '../context/CampaignContext';
import type { CampaignResults } from '../types/campaign';

export default function CampaignHistory() {
  const [history, setHistory] = useState<CampaignResults[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignResults | null>(null);

  useEffect(() => {
    const loadHistory = () => {
      const stored = getHistory();
      setHistory(stored);
    };

    loadHistory();
    
    // Refresh history every 2 seconds when new campaign completes
    const interval = setInterval(loadHistory, 2000);
    return () => clearInterval(interval);
  }, []);

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Campaign History</h3>
        <p className="text-gray-600 text-sm">No previous campaigns yet. Complete a campaign planning workflow to see history here.</p>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Campaign History</h3>
      
      <div className="space-y-3">
        {history.map((campaign) => (
          <div
            key={campaign.campaignId}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedCampaign?.campaignId === campaign.campaignId
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedCampaign(campaign)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">
                  Campaign {campaign.campaignId.substring(0, 20)}...
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(campaign.completedAt)} • {campaign.recommendations.length} recommendations
                </p>
              </div>
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                Completed
              </span>
            </div>
          </div>
        ))}
      </div>

      {selectedCampaign && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800">Selected Campaign Details</h4>
            <button
              onClick={() => setSelectedCampaign(null)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
          <div className="text-sm text-gray-700 space-y-2">
            <p><span className="font-medium">Campaign ID:</span> {selectedCampaign.campaignId}</p>
            <p><span className="font-medium">Recommendations:</span> {selectedCampaign.recommendations.length} influencers</p>
            <p><span className="font-medium">Predicted ROI:</span> {selectedCampaign.performanceForecast.predictedROI || 'N/A'}x</p>
            <p><span className="font-medium">Completed:</span> {formatDate(selectedCampaign.completedAt)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
