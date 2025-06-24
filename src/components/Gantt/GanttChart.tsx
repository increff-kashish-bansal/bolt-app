import React, { useState } from 'react';
import { Ticket } from '../../types';
import { formatDateShort, getStatusColor, getTypeColor, getStatusIcon } from '../../utils/dateUtils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, isToday } from 'date-fns';
import { TicketModal } from '../Modal/TicketModal';
import { Users, Filter, Calendar } from 'lucide-react';

interface GanttChartProps {
  tickets: Ticket[];
}

export const GanttChart: React.FC<GanttChartProps> = ({ tickets }) => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [groupBy, setGroupBy] = useState<'none' | 'developer'>('developer');
  const [filters, setFilters] = useState({
    developer: 'All',
    type: 'All',
    status: 'All'
  });

  // Filter tickets based on current filters
  const filteredTickets = tickets.filter(ticket => {
    return (
      (filters.developer === 'All' || ticket.owner === filters.developer) &&
      (filters.type === 'All' || ticket.type === filters.type) &&
      (filters.status === 'All' || ticket.currentStatus === filters.status)
    );
  });

  // Group tickets by developer if needed
  const groupedTickets = groupBy === 'developer' 
    ? filteredTickets.reduce((groups, ticket) => {
        const dev = ticket.owner;
        if (!groups[dev]) groups[dev] = [];
        groups[dev].push(ticket);
        return groups;
      }, {} as Record<string, Ticket[]>)
    : { 'All Tickets': filteredTickets };

  // Get unique values for filters
  const developers = Array.from(new Set(tickets.map(t => t.owner)));
  const types = Array.from(new Set(tickets.map(t => t.type)));
  const statuses = Array.from(new Set(tickets.map(t => t.currentStatus)));

  // Calculate date range for the chart
  const now = new Date();
  const startDate = startOfMonth(addDays(now, -60));
  const endDate = endOfMonth(addDays(now, 30));
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  const getDayPosition = (date: Date) => {
    const dayIndex = dateRange.findIndex(d => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
    return Math.max(0, dayIndex);
  };

  const getDayWidth = (startDate: Date, endDate: Date) => {
    const start = getDayPosition(startDate);
    const end = getDayPosition(endDate);
    return Math.max(1, end - start);
  };

  const getTodayPosition = () => {
    return (getDayPosition(now) / dateRange.length) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
          <Calendar className="w-8 h-8 mr-3 text-blue-600" />
          Ticket Timelines
        </h2>
        
        {/* Enhanced Controls */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setGroupBy('none')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                groupBy === 'none' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setGroupBy('developer')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all flex items-center ${
                groupBy === 'developer' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4 mr-1" />
              Group by Dev
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filters.developer}
              onChange={(e) => setFilters({ ...filters, developer: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm"
            >
              <option value="All">All Developers</option>
              {developers.map(dev => (
                <option key={dev} value={dev}>{dev}</option>
              ))}
            </select>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm"
            >
              <option value="All">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white shadow-sm"
            >
              <option value="All">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Enhanced Timeline Header */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <div className="w-80 p-4 font-semibold text-gray-900 border-r border-gray-200">
            <div className="flex items-center space-x-2">
              <span>Ticket Details</span>
              <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {Object.values(groupedTickets).flat().length}
              </div>
            </div>
          </div>
          <div className="flex-1 p-2 relative">
            <div className="flex">
              {dateRange.filter((_, index) => index % 7 === 0).map((date, index) => (
                <div
                  key={index}
                  className="flex-1 text-xs text-gray-600 text-center min-w-0 font-medium"
                >
                  {formatDateShort(date)}
                </div>
              ))}
            </div>
            {/* Today indicator line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
              style={{ left: `${getTodayPosition()}%` }}
            >
              <div className="absolute -top-1 -left-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Timeline Body */}
        <div className="max-h-96 overflow-y-auto">
          {Object.entries(groupedTickets).map(([groupName, groupTickets]) => (
            <div key={groupName}>
              {groupBy === 'developer' && (
                <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {groupName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-semibold text-blue-900">{groupName}</span>
                    <div className="text-sm text-blue-700 bg-blue-200 px-2 py-1 rounded-full">
                      {groupTickets.length} tickets
                    </div>
                  </div>
                </div>
              )}
              
              {groupTickets.map((ticket) => (
                <div key={ticket.id} className="flex border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  {/* Enhanced Ticket Info */}
                  <div className="w-80 p-4 border-r border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: getTypeColor(ticket.type) }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm text-gray-900">{ticket.id}</span>
                          <span className="text-lg">{getStatusIcon(ticket.currentStatus)}</span>
                        </div>
                        <div className="text-xs text-gray-600 truncate mb-1">
                          {ticket.title}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">{ticket.owner.split(' ')[0]}</span>
                          {ticket.blockers.length > 0 && (
                            <span className="text-xs bg-red-100 text-red-700 px-1 py-0.5 rounded">
                              🧱 {ticket.blockers.length}
                            </span>
                          )}
                          {ticket.clarificationLoops > 0 && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-1 py-0.5 rounded">
                              🔁 {ticket.clarificationLoops}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Timeline Bars */}
                  <div className="flex-1 p-2 relative">
                    <div className="relative h-10">
                      {ticket.stages.map((stage, index) => {
                        if (!stage.endDate) return null;
                        
                        const leftPercent = (getDayPosition(stage.startDate) / dateRange.length) * 100;
                        const widthPercent = (getDayWidth(stage.startDate, stage.endDate) / dateRange.length) * 100;
                        
                        return (
                          <div
                            key={index}
                            className="absolute h-7 rounded-lg cursor-pointer hover:opacity-80 hover:scale-105 transition-all duration-200 flex items-center justify-center text-xs text-white font-medium shadow-sm border border-white/20"
                            style={{
                              left: `${leftPercent}%`,
                              width: `${Math.max(widthPercent, 2)}%`,
                              backgroundColor: getStatusColor(stage.status),
                              top: '6px',
                              zIndex: ticket.stages.length - index
                            }}
                            onClick={() => setSelectedTicket(ticket)}
                            title={`${stage.status}: ${stage.duration} days`}
                          >
                            {widthPercent > 8 && (
                              <span className="flex items-center space-x-1">
                                <span>{getStatusIcon(stage.status)}</span>
                                {widthPercent > 15 && <span>{stage.status.slice(0, 3)}</span>}
                              </span>
                            )}
                          </div>
                        );
                      })}
                      
                      {/* Blocker indicators */}
                      {ticket.blockers.map((blocker, index) => {
                        const blockerStart = ticket.stages.find(s => s.startDate <= blocker.startDate && (!s.endDate || s.endDate >= blocker.startDate));
                        if (!blockerStart) return null;
                        
                        const leftPercent = (getDayPosition(blocker.startDate) / dateRange.length) * 100;
                        
                        return (
                          <div
                            key={`blocker-${index}`}
                            className="absolute w-2 h-2 bg-red-600 rounded-full border-2 border-white shadow-lg"
                            style={{
                              left: `${leftPercent}%`,
                              top: '2px',
                              zIndex: 20
                            }}
                            title={`Blocked by ${blocker.blockedBy}: ${blocker.reason}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Legend */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          🎨 Legend & Status Guide
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Status Colors & Icons</div>
            <div className="space-y-2">
              {['Clarification', 'In Sprint', 'Development', 'Tech QC', 'Business QC', 'Released'].map(status => (
                <div key={status} className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded shadow-sm"
                    style={{ backgroundColor: getStatusColor(status) }}
                  />
                  <span className="text-lg">{getStatusIcon(status)}</span>
                  <span className="text-sm text-gray-600">{status}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Ticket Types</div>
            <div className="space-y-2">
              {['bug', 'story', 'infra'].map(type => (
                <div key={type} className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: getTypeColor(type) }}
                  />
                  <span className="text-sm text-gray-600 capitalize">{type}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Special Indicators</div>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span className="text-sm text-gray-600">Blocker Event</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-0.5 h-4 bg-red-500"></div>
                <span className="text-sm text-gray-600">Today</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded">🧱 2</span>
                <span className="text-sm text-gray-600">Blocker Count</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};