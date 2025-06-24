import React, { useState } from 'react';
import { BarChart3, Calendar, Users, AlertTriangle, Home, Menu, X } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard Overview', icon: Home, description: 'Key metrics & charts' },
  { id: 'gantt', label: 'Ticket Timelines', icon: Calendar, description: 'Gantt chart view' },
  { id: 'developers', label: 'Developer Insights', icon: Users, description: 'Team performance' },
  { id: 'blockers', label: 'Blocker Analytics', icon: AlertTriangle, description: 'Bottleneck analysis' }
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Tech Dashboard</h1>
            <p className="text-xs text-slate-400">Execution Analytics</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={clsx(
                    'w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                    activeView === item.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white hover:scale-102'
                  )}
                >
                  <Icon className={clsx(
                    'w-5 h-5 transition-transform duration-200',
                    activeView === item.id ? 'scale-110' : 'group-hover:scale-110'
                  )} />
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Real-time data sync active
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-80 bg-slate-900 text-white h-full flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className={clsx(
        'lg:hidden fixed left-0 top-0 h-full w-80 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <SidebarContent />
      </div>
    </>
  );
};