import React, { useState } from 'react';
import { useCampaign } from '../context/CampaignContext';
import type { Recommendation } from '../types/campaign';

export default function RecommendationsDisplay() {
  const { state, results, dispatch } = useCampaign();
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const getFitScoreColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getConfidenceBadge = (confidence: number): { label: string; color: string } => {
    if (confidence >= 0.8) return { label: 'High', color: 'bg-green-100 text-green-700' };
    if (confidence >= 0.6) return { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' };
    return { label: 'Low', color: 'bg-orange-100 text-orange-700' };
  };

  const exportToCSV = () => {
    const csvRows = [
      ['Influencer ID', 'Platform', 'Fit Score', 'Confidence', 'Rationale', 'Predicted Likes', 'Predicted Comments', 'Predicted Shares', 'Predicted Views'],
      ...results.recommendations.map(rec => [
        rec.influencerId,
        rec.platform,
        rec.fitScore.toString(),
        rec.confidence.toString(),
        rec.rationale,
        rec.predictedEngagement.likes.toString(),
        rec.predictedEngagement.comments.toString(),
        rec.predictedEngagement.shares.toString(),
        rec.predictedEngagement.views.toString(),
      ])
    ];

    const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bagana-campaign-${results.campaignId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Campaign Results</h3>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Export CSV
          </button>
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            New Campaign
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4 p-4 bg-gray-50 rounded">
          <div>
            <span className="font-medium">Campaign ID:</span> {results.campaignId}
          </div>
          <div>
            <span className="font-medium">Completed:</span> {formatDate(results.completedAt)}
          </div>
          <div>
            <span className="font-medium">Duration:</span> {formatDuration(results.duration)}
          </div>
          <div>
            <span className="font-medium">Recommendations:</span> {results.recommendations.length} influencers
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Ranked Influencer Recommendations</h4>
          <div className="space-y-3">
            {results.recommendations.map((rec, index) => {
              const confidenceBadge = getConfidenceBadge(rec.confidence);
              const isExpanded = expandedId === rec.influencerId;

              return (
                <div
                  key={rec.influencerId}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                        <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700 capitalize">
                          {rec.platform}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${confidenceBadge.color}`}>
                          {confidenceBadge.label} Confidence
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Influencer:</span> {rec.influencerId}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">{rec.rationale}</p>
                      
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">Fit Score</span>
                          <span className="text-sm font-bold text-gray-900">{rec.fitScore}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getFitScoreColor(rec.fitScore)}`}
                            style={{ width: `${rec.fitScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : rec.influencerId)}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-800"
                  >
                    {isExpanded ? 'Hide Details' : 'Show Details'}
                  </button>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Predicted Engagement</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="text-gray-600">Likes</div>
                            <div className="font-semibold">{rec.predictedEngagement.likes.toLocaleString()}</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="text-gray-600">Comments</div>
                            <div className="font-semibold">{rec.predictedEngagement.comments.toLocaleString()}</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="text-gray-600">Shares</div>
                            <div className="font-semibold">{rec.predictedEngagement.shares.toLocaleString()}</div>
                          </div>
                          <div className="p-2 bg-gray-50 rounded">
                            <div className="text-gray-600">Views</div>
                            <div className="font-semibold">{rec.predictedEngagement.views.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>

                      {rec.contentStrategy && (
                        <div>
                          <h5 className="font-medium text-gray-800 mb-2">Content Strategy</h5>
                          <div className="text-sm text-gray-700 space-y-1">
                            <p><span className="font-medium">Format:</span> {rec.contentStrategy.format}</p>
                            <p><span className="font-medium">Messaging:</span> {rec.contentStrategy.messaging}</p>
                            <p><span className="font-medium">Timing:</span> {rec.contentStrategy.timing}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Performance Forecast</h4>
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <h5 className="font-medium text-gray-800 mb-2">Predicted Engagement</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded">
                  <div className="text-sm text-gray-600">Total Likes</div>
                  <div className="text-xl font-bold">{results.performanceForecast.predictedEngagement.likes.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-white rounded">
                  <div className="text-sm text-gray-600">Total Comments</div>
                  <div className="text-xl font-bold">{results.performanceForecast.predictedEngagement.comments.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-white rounded">
                  <div className="text-sm text-gray-600">Total Shares</div>
                  <div className="text-xl font-bold">{results.performanceForecast.predictedEngagement.shares.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-white rounded">
                  <div className="text-sm text-gray-600">Total Views</div>
                  <div className="text-xl font-bold">{results.performanceForecast.predictedEngagement.views.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {results.performanceForecast.predictedConversion && (
              <div>
                <h5 className="font-medium text-gray-800 mb-2">Predicted Conversion</h5>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-white rounded">
                    <div className="text-sm text-gray-600">Clicks</div>
                    <div className="text-xl font-bold">{results.performanceForecast.predictedConversion.clicks.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-white rounded">
                    <div className="text-sm text-gray-600">Leads</div>
                    <div className="text-xl font-bold">{results.performanceForecast.predictedConversion.leads.toLocaleString()}</div>
                  </div>
                  <div className="p-3 bg-white rounded">
                    <div className="text-sm text-gray-600">Sales</div>
                    <div className="text-xl font-bold">{results.performanceForecast.predictedConversion.sales.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}

            {results.performanceForecast.predictedROI && (
              <div>
                <h5 className="font-medium text-gray-800 mb-2">Predicted ROI</h5>
                <div className="p-3 bg-white rounded">
                  <div className="text-3xl font-bold text-green-600">{results.performanceForecast.predictedROI}x</div>
                  {results.performanceForecast.confidenceIntervals && (
                    <div className="text-sm text-gray-600 mt-2">
                      Confidence: {results.performanceForecast.confidenceIntervals.p10}x - {results.performanceForecast.confidenceIntervals.p90}x
                    </div>
                  )}
                </div>
              </div>
            )}

            {results.performanceForecast.riskIndicators.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-800 mb-2">Risk Indicators</h5>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {results.performanceForecast.riskIndicators.map((risk, index) => (
                    <li key={index}>{risk}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
