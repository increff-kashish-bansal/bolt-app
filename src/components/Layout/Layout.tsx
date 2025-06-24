import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DashboardOverview } from '../Dashboard/Overview';
import { GanttChart } from '../Gantt/GanttChart';
import { DeveloperInsights } from '../Insights/DeveloperInsights';
import { BlockerAnalytics } from '../Insights/BlockerAnalytics';
import { mockTickets, mockDevelopers, mockMilestones, sprints } from '../../data/mockData';

export const Layout: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedSprint, setSelectedSprint] = useState('All');

  const filteredTickets = selectedSprint === 'All' 
    ? mockTickets 
    : mockTickets.filter(ticket => ticket.sprint === selectedSprint);

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardOverview tickets={filteredTickets} developers={mockDevelopers} />;
      case 'gantt':
        return <GanttChart tickets={filteredTickets} />;
      case 'developers':
        return <DeveloperInsights developers={mockDevelopers} tickets={filteredTickets} />;
      case 'blockers':
        return <BlockerAnalytics tickets={filteredTickets} />;
      default:
        return <DashboardOverview tickets={filteredTickets} developers={mockDevelopers} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          selectedSprint={selectedSprint}
          onSprintChange={setSelectedSprint}
          sprints={sprints}
          milestones={mockMilestones}
        />
        
        <main className="flex-1 overflow-auto p-6">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};