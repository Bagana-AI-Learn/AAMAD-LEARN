import React from 'react';
import { WorkflowProvider } from './context/WorkflowContext';
import InputSection from './components/InputSection';
import RunSection from './components/RunSection';
import ResultsSection from './components/ResultsSection';
import HistorySection from './components/HistorySection';

function App() {
  return (
    <WorkflowProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Critical Research Workflow
            </h1>
            <p className="text-gray-600">
              Submit research queries and view results with workflow state management
            </p>
          </header>

          <main className="space-y-6">
            <InputSection />
            <RunSection />
            <ResultsSection />
            <HistorySection />
          </main>

          <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>Critical Research Workflow v0.1.0 - MVP Implementation</p>
          </footer>
        </div>
      </div>
    </WorkflowProvider>
  );
}

export default App;
