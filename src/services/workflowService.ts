import type { ResearchResults, WorkflowState } from '../types/workflow';

/**
 * Stub service: Initiates a research workflow
 * 
 * Future: Replace with real API call to backend endpoint
 * POST /api/workflows/start
 */
export async function startRun(
  query: string,
  scope: string,
  depth: string
): Promise<{ runId: string }> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate mock runId
  const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return { runId };
}

/**
 * Stub service: Polls for workflow status and results
 * 
 * Future: Replace with real API call to backend endpoint
 * GET /api/workflows/{runId}/status
 */
export async function getRunStatus(
  runId: string
): Promise<{ status: WorkflowState; results?: ResearchResults }> {
  // Simulate API call delay (simulating workflow execution)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate workflow progression: running → done
  // In real implementation, this would poll until status is 'done' or 'error'
  
  const mockResults: ResearchResults = {
    summary: `This is a mock research summary for the query. The system has completed analysis across multiple dimensions and compiled key insights relevant to the research objectives.`,
    findings: [
      'Key finding 1: Market trends indicate strong growth potential',
      'Key finding 2: Technical feasibility is confirmed with existing infrastructure',
      'Key finding 3: User sentiment analysis shows positive reception indicators',
      'Key finding 4: Competitive landscape analysis reveals opportunity gaps'
    ],
    recommendations: [
      'Recommendation 1: Proceed with phased rollout approach',
      'Recommendation 2: Focus on user experience optimization',
      'Recommendation 3: Establish partnerships in identified opportunity areas'
    ],
    sources: [
      'Industry Report 2024',
      'Technical Analysis Documentation',
      'User Research Study Q4 2023',
      'Competitive Intelligence Database'
    ],
    runId,
    timestamp: Date.now(),
    duration: 2000, // milliseconds
    query: 'Mock query text'
  };
  
  return {
    status: 'done',
    results: mockResults
  };
}
