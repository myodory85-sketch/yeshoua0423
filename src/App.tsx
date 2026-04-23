import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MasterSettings from './components/MasterSettings';
import DailyEntry from './components/DailyEntry';
import ProgramEntry from './components/ProgramEntry';
import Statistics from './components/Statistics';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'master': return <MasterSettings />;
      case 'daily': return <DailyEntry />;
      case 'program': return <ProgramEntry />;
      case 'stats': return <Statistics />;
      default: return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 w-full flex flex-col p-4 md:p-8 pt-20 md:pt-8 min-w-0">
          <div className="w-full max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </AppProvider>
  );
}
