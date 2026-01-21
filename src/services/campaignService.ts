import type { CampaignBrief, CampaignState, CampaignResults } from '../types/campaign';

/**
 * Stub service: Initiates a campaign planning workflow
 * 
 * Future: Replace with real API call to backend endpoint
 * POST /api/v1/campaigns/plan
 * 
 * Traceability: SAD Section 3.3 (Integration Points)
 */
export async function startCampaignPlanning(
  brief: CampaignBrief
): Promise<{ campaignId: string }> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate mock campaignId
  const campaignId = `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return { campaignId };
}

/**
 * Stub service: Polls for campaign planning status and results
 * 
 * Future: Replace with real API call to backend endpoint
 * GET /api/v1/campaigns/{campaignId}/status
 * 
 * Traceability: SAD Section 3.3 (Integration Points), SAD Section 5.1 (Request Flow)
 */
export async function getCampaignStatus(
  campaignId: string
): Promise<{ status: CampaignState; results?: CampaignResults; currentAgent?: string }> {
  // Simulate API call delay (simulating agent execution)
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Simulate workflow progression: running → done
  // In real implementation, this would poll until status is 'done' or 'error'
  
  const mockResults: CampaignResults = {
    campaignId,
    recommendations: [
      {
        influencerId: 'influencer_1',
        platform: 'instagram',
        fitScore: 85,
        confidence: 0.9,
        rationale: 'Strong audience overlap (78%), high engagement rate (4.2%), proven track record in similar campaigns',
        predictedEngagement: { likes: 5000, comments: 250, shares: 120, views: 25000 },
        contentStrategy: { format: 'carousel', messaging: 'product showcase', timing: 'peak hours' }
      },
      {
        influencerId: 'influencer_2',
        platform: 'tiktok',
        fitScore: 82,
        confidence: 0.85,
        rationale: 'Excellent audience alignment (75%), viral content potential, strong engagement in target demographic',
        predictedEngagement: { likes: 15000, comments: 800, shares: 500, views: 100000 },
        contentStrategy: { format: 'short-form video', messaging: 'trending challenge', timing: 'evening hours' }
      },
      {
        influencerId: 'influencer_3',
        platform: 'instagram',
        fitScore: 78,
        confidence: 0.8,
        rationale: 'Good audience fit (72%), consistent performance, authentic content style',
        predictedEngagement: { likes: 3500, comments: 180, shares: 90, views: 18000 },
        contentStrategy: { format: 'reels', messaging: 'behind-the-scenes', timing: 'lunch hours' }
      },
      {
        influencerId: 'influencer_4',
        platform: 'tiktok',
        fitScore: 75,
        confidence: 0.75,
        rationale: 'Moderate audience overlap (68%), growing following, strong engagement trends',
        predictedEngagement: { likes: 12000, comments: 600, shares: 350, views: 80000 },
        contentStrategy: { format: 'short-form video', messaging: 'user-generated content', timing: 'afternoon hours' }
      },
      {
        influencerId: 'influencer_5',
        platform: 'instagram',
        fitScore: 72,
        confidence: 0.7,
        rationale: 'Decent audience match (65%), reliable performance, good brand alignment',
        predictedEngagement: { likes: 2800, comments: 140, shares: 70, views: 15000 }
      }
    ],
    performanceForecast: {
      predictedEngagement: { likes: 45000, comments: 2250, shares: 1080, views: 225000 },
      predictedConversion: { clicks: 5000, leads: 250, sales: 50 },
      predictedROI: 3.2,
      confidenceIntervals: { p10: 2.1, p50: 3.2, p90: 4.5 },
      riskIndicators: ['Moderate audience overlap', 'Seasonal trends may impact performance']
    },
    createdAt: Date.now() - 3000,
    completedAt: Date.now(),
    duration: 3000
  };
  
  return {
    status: 'done',
    results: mockResults
  };
}
