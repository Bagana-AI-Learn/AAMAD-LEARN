import React from 'react';
import { CampaignProvider } from './context/CampaignContext';
import CampaignBriefForm from './components/CampaignBriefForm';
import WorkflowStatusDisplay from './components/WorkflowStatusDisplay';
import RecommendationsDisplay from './components/RecommendationsDisplay';
import CampaignHistory from './components/CampaignHistory';

function App() {
  return (
    <CampaignProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Bagana AI - Campaign Planning Dashboard
            </h1>
            <p className="text-gray-600">
              Predict influencer campaign performance before spending budget. Get ranked recommendations with explainable rationale and performance forecasts.
            </p>
          </header>

          <main className="space-y-6">
            <CampaignBriefForm />
            <WorkflowStatusDisplay />
            <RecommendationsDisplay />
            <CampaignHistory />
          </main>

          <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>Bagana AI MVP v0.1.0 - Campaign Planning Dashboard</p>
          </footer>
        </div>
      </div>
    </CampaignProvider>
  );
}

export default App;
