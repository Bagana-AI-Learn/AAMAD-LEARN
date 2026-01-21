import React, { useState, FormEvent } from 'react';
import { useCampaign } from '../context/CampaignContext';
import { startCampaignPlanning } from '../services/campaignService';
import type { CampaignBrief, CampaignState } from '../types/campaign';

const KPI_OPTIONS = ['engagement', 'conversions', 'roi', 'reach', 'brand_awareness'];
const PLATFORM_OPTIONS = ['instagram', 'tiktok'];
const SCOPE_OPTIONS = ['Market Analysis', 'Technical Feasibility', 'User Research', 'Competitive Analysis'];
const DEPTH_OPTIONS = [
  { value: 'Quick', label: 'Quick (5 min)' },
  { value: 'Standard', label: 'Standard (15 min)' },
  { value: 'Deep', label: 'Deep (30 min)' },
];

export default function CampaignBriefForm() {
  const { state, dispatch } = useCampaign();
  const [objectives, setObjectives] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [budget, setBudget] = useState('');
  const [kpis, setKpis] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [scope, setScope] = useState('Market Analysis');
  const [depth, setDepth] = useState('Standard');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isDisabled = state === 'running';

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!objectives.trim()) {
      newErrors.objectives = 'Objectives are required';
    } else if (objectives.trim().length < 20) {
      newErrors.objectives = 'Objectives must be at least 20 characters';
    } else if (objectives.length > 1000) {
      newErrors.objectives = 'Objectives must not exceed 1000 characters';
    }
    
    if (!targetAudience.trim()) {
      newErrors.targetAudience = 'Target audience is required';
    } else if (targetAudience.trim().length < 10) {
      newErrors.targetAudience = 'Target audience must be at least 10 characters';
    } else if (targetAudience.length > 500) {
      newErrors.targetAudience = 'Target audience must not exceed 500 characters';
    }

    if (budget && parseFloat(budget) <= 0) {
      newErrors.budget = 'Budget must be a positive number';
    }

    if (kpis.length === 0) {
      newErrors.kpis = 'At least one KPI must be selected';
    }

    if (platforms.length === 0) {
      newErrors.platforms = 'At least one platform must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleKpiChange = (kpi: string) => {
    setKpis(prev => 
      prev.includes(kpi) 
        ? prev.filter(k => k !== kpi)
        : [...prev, kpi]
    );
  };

  const handlePlatformChange = (platform: string) => {
    setPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    try {
      const brief: CampaignBrief = {
        objectives,
        targetAudience,
        budget: budget ? parseFloat(budget) : undefined,
        kpis,
        platforms,
        scope,
        depth,
      };

      const { campaignId } = await startCampaignPlanning(brief);
      dispatch({
        type: 'START_CAMPAIGN',
        payload: {
          campaignId,
          brief,
        },
      });
      
      // Clear form
      setObjectives('');
      setTargetAudience('');
      setBudget('');
      setKpis([]);
      setPlatforms([]);
      setScope('Market Analysis');
      setDepth('Standard');
    } catch (error) {
      dispatch({
        type: 'CAMPAIGN_ERROR',
        payload: { error: error instanceof Error ? error.message : 'Failed to start campaign planning' },
      });
    }
  };

  const getStateColor = (currentState: CampaignState): string => {
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
        <h2 className="text-2xl font-bold text-gray-800">Campaign Planning</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStateColor(state)}`}>
          {state.charAt(0).toUpperCase() + state.slice(1)}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-1">
            Campaign Objectives *
          </label>
          <textarea
            id="objectives"
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
            disabled={isDisabled}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.objectives ? 'border-red-300' : 'border-gray-300'
            } ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Describe your campaign goals and objectives (20-1000 characters)..."
          />
          {errors.objectives && (
            <p className="mt-1 text-sm text-red-600">{errors.objectives}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">{objectives.length}/1000 characters</p>
        </div>

        <div>
          <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-1">
            Target Audience *
          </label>
          <textarea
            id="targetAudience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            disabled={isDisabled}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.targetAudience ? 'border-red-300' : 'border-gray-300'
            } ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Describe your target audience demographics, interests, and psychographics (10-500 characters)..."
          />
          {errors.targetAudience && (
            <p className="mt-1 text-sm text-red-600">{errors.targetAudience}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">{targetAudience.length}/500 characters</p>
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
            Budget (USD)
          </label>
          <input
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            disabled={isDisabled}
            min="0"
            step="0.01"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.budget ? 'border-red-300' : 'border-gray-300'
            } ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Optional: Enter campaign budget"
          />
          {errors.budget && (
            <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Key Performance Indicators (KPIs) *
          </label>
          <div className="flex flex-wrap gap-3">
            {KPI_OPTIONS.map((kpi) => (
              <label
                key={kpi}
                className={`flex items-center px-3 py-2 border rounded-md cursor-pointer transition-colors ${
                  kpis.includes(kpi)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={kpis.includes(kpi)}
                  onChange={() => handleKpiChange(kpi)}
                  disabled={isDisabled}
                  className="mr-2"
                />
                <span className="text-sm capitalize">{kpi}</span>
              </label>
            ))}
          </div>
          {errors.kpis && (
            <p className="mt-1 text-sm text-red-600">{errors.kpis}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platforms *
          </label>
          <div className="flex gap-4">
            {PLATFORM_OPTIONS.map((platform) => (
              <label
                key={platform}
                className={`flex items-center px-4 py-2 border rounded-md cursor-pointer transition-colors ${
                  platforms.includes(platform)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={platforms.includes(platform)}
                  onChange={() => handlePlatformChange(platform)}
                  disabled={isDisabled}
                  className="mr-2"
                />
                <span className="text-sm capitalize">{platform}</span>
              </label>
            ))}
          </div>
          {errors.platforms && (
            <p className="mt-1 text-sm text-red-600">{errors.platforms}</p>
          )}
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
            {SCOPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Depth *
          </label>
          <div className="flex gap-4">
            {DEPTH_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-center ${
                  isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                }`}
              >
                <input
                  type="radio"
                  name="depth"
                  value={option.value}
                  checked={depth === option.value}
                  onChange={(e) => setDepth(e.target.value)}
                  disabled={isDisabled}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
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
          {isDisabled ? 'Planning Campaign...' : 'Start Campaign Planning'}
        </button>
      </form>
    </div>
  );
}
