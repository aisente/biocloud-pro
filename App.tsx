
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { PipelineWizard } from './components/PipelineWizard';
import { ResultsDashboard } from './components/ResultsDashboard';
import { AIAssistant } from './components/AIAssistant';
import { Toolbox } from './components/Toolbox';
import { DataCenter } from './components/DataCenter';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'wizard' | 'results' | 'toolbox' | 'data'>('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const navigateTo = (view: 'dashboard' | 'wizard' | 'results' | 'toolbox' | 'data', id?: string) => {
    setCurrentView(view);
    if (view === 'results' && id) setSelectedProjectId(id);
    if (view === 'toolbox' && id) setSelectedTool(id);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            onNewProject={() => navigateTo('wizard')} 
            onViewResults={(id) => navigateTo('results', id)} 
            onOpenTool={(toolId) => navigateTo('toolbox', toolId)}
          />
        );
      case 'wizard':
        return <PipelineWizard onCancel={() => navigateTo('dashboard')} onStart={() => navigateTo('dashboard')} />;
      case 'results':
        return <ResultsDashboard projectId={selectedProjectId!} onBack={() => navigateTo('dashboard')} />;
      case 'toolbox':
        return <Toolbox initialTool={selectedTool} onBack={() => navigateTo('dashboard')} />;
      case 'data':
        return <DataCenter />;
      default:
        return (
          <Dashboard 
            onNewProject={() => navigateTo('wizard')} 
            onViewResults={(id) => navigateTo('results', id)} 
            onOpenTool={(toolId) => navigateTo('toolbox', toolId)}
          />
        );
    }
  };

  return (
    <Layout activeView={currentView} onNavigate={(view) => navigateTo(view as any)}>
      <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-8 min-h-screen">
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
        
        {/* Floating AI Assistant - Present on all views for guidance */}
        <aside className="w-full lg:w-96 flex-shrink-0">
          <AIAssistant />
        </aside>
      </div>
    </Layout>
  );
};

export default App;
