
import React from 'react';
import { LayoutDashboard, Database, Cpu, PlayCircle, BarChart3, Settings, Github, RefreshCw } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, path, active }: { icon: any, label: string, path: string, active: boolean }) => (
  <Link to={path} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [syncing, setSyncing] = React.useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex flex-col h-full shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <BarChart3 className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">GRNBench</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/" active={location.pathname === '/'} />
          <SidebarItem icon={Database} label="Datasets" path="/datasets" active={location.pathname === '/datasets'} />
          <SidebarItem icon={Cpu} label="Algorithms" path="/algorithms" active={location.pathname === '/algorithms'} />
          <SidebarItem icon={PlayCircle} label="Runs" path="/runs" active={location.pathname === '/runs'} />
          <SidebarItem icon={BarChart3} label="Comparison" path="/compare" active={location.pathname === '/compare'} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`${syncing ? 'animate-spin' : ''}`} size={16} />
            {syncing ? 'Syncing BEELINE...' : 'Sync BEELINE'}
          </button>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <Github size={12} />
            <span>Murali-group/Beeline</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 z-10">
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
            {location.pathname.substring(1).toUpperCase() || 'DASHBOARD'}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
              Backend Active
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
