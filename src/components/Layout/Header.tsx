import React from 'react';
import { Calendar, CheckCircle, AlertCircle, RotateCcw, Pause, TrendingUp, TrendingDown } from 'lucide-react';
import { MilestoneStats } from '../../types';

interface HeaderProps {
  selectedSprint: string;
  onSprintChange: (sprint: string) => void;
  sprints: string[];
  milestones: MilestoneStats;
}

export const Header: React.FC<HeaderProps> = ({
  selectedSprint,
  onSprintChange,
  sprints,
  milestones
}) => {
  // Mock trend data - in real app, this would come from comparing with previous sprint
  const trends = {
    ticketsClosed: Math.random() > 0.5 ? 'up' : 'down',
    blockedTickets: Math.random() > 0.5 ? 'up' : 'down',
    clarificationLoops: Math.random() > 0.5 ? 'up' : 'down',
    deprioritized: Math.random() > 0.5 ? 'up' : 'down'
  };

  const milestoneItems = [
    { 
      label: 'Tickets Closed', 
      value: milestones.ticketsClosed, 
      icon: CheckCircle, 
      color: 'text-green-600 bg-green-50 border-green-200',
      trend: trends.ticketsClosed
    },
    { 
      label: 'Blocked Tickets', 
      value: milestones.blockedTickets, 
      icon: AlertCircle, 
      color: 'text-red-600 bg-red-50 border-red-200',
      trend: trends.blockedTickets
    },
    { 
      label: 'Clarification Loops', 
      value: milestones.clarificationLoops, 
      icon: RotateCcw, 
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      trend: trends.clarificationLoops
    },
    { 
      label: 'Deprioritized', 
      value: milestones.deprioritized, 
      icon: Pause, 
      color: 'text-gray-600 bg-gray-50 border-gray-200',
      trend: trends.deprioritized
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <select
              value={selectedSprint}
              onChange={(e) => onSprintChange(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            >
              {sprints.map((sprint) => (
                <option key={sprint} value={sprint}>
                  {sprint}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-500">Real-time execution insights</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {milestoneItems.map((item) => {
          const Icon = item.icon;
          const TrendIcon = item.trend === 'up' ? TrendingUp : TrendingDown;
          const trendColor = item.trend === 'up' ? 'text-green-500' : 'text-red-500';
          
          return (
            <div
              key={item.label}
              className={`relative overflow-hidden rounded-xl border-2 ${item.color} p-4 transition-all duration-200 hover:shadow-lg hover:scale-105`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${item.color.replace('border-', 'bg-').replace('bg-', 'bg-opacity-20 bg-')}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{item.value}</div>
                    <div className="text-xs font-medium opacity-75">{item.label}</div>
                  </div>
                </div>
                <div className={`${trendColor}`}>
                  <TrendIcon className="w-4 h-4" />
                </div>
              </div>
              
              {/* Subtle background pattern */}
              <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                <Icon className="w-full h-full" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};