import React from 'react';
import { Dna, LayoutGrid, FileText, Activity, Search, Database, Settings, LogOut, Command, Bell } from 'lucide-react';
import { Role } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  role: Role;
  onGoHome: () => void;
  onSwitchRole: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, role, onGoHome, onSwitchRole }) => {
  return (
    <div className="flex h-screen bg-science-950 overflow-hidden font-sans">
      {/* Slim Tech Sidebar */}
      <aside className="w-16 flex flex-col items-center py-6 border-r border-science-800 bg-science-900 z-50">
        <button
          type="button"
          onClick={onGoHome}
          title="Home"
          aria-label="Go to home"
          className="mb-8 p-2 bg-bio-blue/10 rounded-lg hover:bg-bio-blue/20 focus:outline-none focus:ring-1 focus:ring-bio-blue transition-colors"
        >
          <Dna className="w-6 h-6 text-bio-blue" strokeWidth={2.5} />
        </button>
        
        <nav className="flex-1 flex flex-col gap-6 w-full">
          {[
            { icon: LayoutGrid, active: true },
            { icon: Activity, active: false },
            { icon: Database, active: false },
            { icon: FileText, active: false },
          ].map((item, i) => (
            <button 
              key={i}
              className={`w-full flex justify-center py-2 border-l-2 transition-all duration-200 group relative
                ${item.active 
                  ? 'border-bio-blue text-bio-blue' 
                  : 'border-transparent text-science-300 hover:text-science-100 hover:border-science-700'
                }`}
            >
              <item.icon className="w-5 h-5" />
              {/* Tooltip hint could go here */}
            </button>
          ))}
        </nav>

        <div className="flex flex-col gap-6 w-full mb-4">
           <button 
              onClick={onSwitchRole}
              className="w-full flex justify-center py-2 text-science-300 hover:text-science-100 transition-colors"
              title="Switch Role"
           >
              <LogOut className="w-5 h-5 rotate-180" />
           </button>
           <button className="w-full flex justify-center py-2 text-science-300 hover:text-science-100 transition-colors">
              <Settings className="w-5 h-5" />
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Precision Header */}
        <header className="h-14 border-b border-science-800 bg-science-900/50 backdrop-blur-md flex items-center justify-between px-6">
          <div className="flex items-center gap-4 text-science-300 text-sm font-mono">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-bio-green animate-pulse"></span>
              SYSTEM_ONLINE
            </span>
            <span className="text-science-700">|</span>
            <span className="text-science-100 font-bold tracking-wider">BIOLENS_CORE v2.4.1</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-science-300" />
               </div>
               <input 
                  type="text" 
                  placeholder="QUERY_BIOMARKER..." 
                  className="bg-science-950 border border-science-800 text-science-100 text-xs rounded-none focus:ring-1 focus:ring-bio-blue focus:border-bio-blue block w-64 pl-10 p-1.5 font-mono placeholder:text-science-700 transition-all"
               />
               <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                  <span className="text-[10px] text-science-700 font-mono">CTRL+K</span>
               </div>
            </div>
            
            <button className="text-science-300 hover:text-bio-yellow relative">
               <Bell className="w-4 h-4" />
               <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-bio-yellow rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 pl-6 border-l border-science-800">
               <div className="text-right hidden md:block">
                  <div className="text-xs font-bold text-science-100 font-mono">{role === 'patient' ? 'J.DOE' : 'DR.SMITH'}</div>
                  <div className="text-[10px] text-science-300 font-mono uppercase">{role === 'patient' ? 'ID: P-1024' : 'GENETICS_LEAD'}</div>
               </div>
               <div className="w-8 h-8 bg-science-800 border border-science-700 flex items-center justify-center text-xs font-mono font-bold text-bio-blue">
                  {role === 'patient' ? 'JD' : 'DS'}
               </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto bg-science-950 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};
