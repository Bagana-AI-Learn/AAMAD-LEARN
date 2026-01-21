export type CampaignState = 'idle' | 'running' | 'done' | 'error';

export interface CampaignBrief {
  objectives: string;
  targetAudience: string;
  budget?: number;
  kpis: string[];
  platforms: string[];
  scope: string;
  depth: string;
}

export interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
  views: number;
}

export interface ConversionMetrics {
  clicks: number;
  leads: number;
  sales: number;
}

export interface ConfidenceIntervals {
  p10: number;
  p50: number;
  p90: number;
}

export interface ContentStrategy {
  format: string;
  messaging: string;
  timing: string;
}

export interface Recommendation {
  influencerId: string;
  platform: 'instagram' | 'tiktok';
  fitScore: number; // 0-100
  confidence: number; // 0-1
  rationale: string;
  predictedEngagement: EngagementMetrics;
  contentStrategy?: ContentStrategy;
}

export interface PerformanceForecast {
  predictedEngagement: EngagementMetrics;
  predictedConversion?: ConversionMetrics;
  predictedROI?: number;
  confidenceIntervals?: ConfidenceIntervals;
  riskIndicators: string[];
}

export interface CampaignResults {
  campaignId: string;
  recommendations: Recommendation[];
  performanceForecast: PerformanceForecast;
  createdAt: number;
  completedAt: number;
  duration: number;
}

export interface CampaignContextState {
  state: CampaignState;
  campaignId: string | null;
  brief: CampaignBrief | null;
  results: CampaignResults | null;
  error: string | null;
  currentAgent?: string; // For progress display
}

export type CampaignAction =
  | { type: 'START_CAMPAIGN'; payload: { campaignId: string; brief: CampaignBrief } }
  | { type: 'UPDATE_PROGRESS'; payload: { agent: string } }
  | { type: 'CAMPAIGN_COMPLETE'; payload: { results: CampaignResults } }
  | { type: 'CAMPAIGN_ERROR'; payload: { error: string } }
  | { type: 'RESET' };
