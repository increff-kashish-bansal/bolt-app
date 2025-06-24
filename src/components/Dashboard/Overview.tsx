import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Ticket, Developer } from '../../types';
import { getTypeColor, getStatusColor } from '../../utils/dateUtils';

interface OverviewProps {
  tickets: Ticket[];
  developers: Developer[];
}

export const DashboardOverview: React.FC<OverviewProps> = ({ tickets, developers }) => {
  // Enhanced developer data with time breakdown
  const developerTimeData = developers.map(dev => {
    const devTickets = tickets.filter(t => t.owner === dev.name);
    
    const timeBreakdown = devTickets.reduce((acc, ticket) => {
      ticket.stages.forEach(stage => {
        if (stage.status === 'Development') acc.devTime += stage.duration;
        else if (stage.status === 'Clarification') acc.clarificationTime += stage.duration;
        else if (stage.status.includes('QC')) acc.qcTime += stage.duration;
      });
      
      ticket.blockers.forEach(blocker => {
        acc.blockedTime += blocker.duration;
      });
      
      return acc;
    }, { devTime: 0, blockedTime: 0, qcTime: 0, clarificationTime: 0 });

    return {
      name: dev.name.split(' ')[0],
      devTime: timeBreakdown.devTime,
      blockedTime: timeBreakdown.blockedTime,
      qcTime: timeBreakdown.qcTime,
      clarificationTime: timeBreakdown.clarificationTime,
      total: Object.values(timeBreakdown).reduce((sum, val) => sum + val, 0)
    };
  });

  // Sprint trend data (mock - would be real historical data)
  const sprintTrendData = [
    { sprint: 'Sprint 22', avgCycleTime: 12, avgBlockedTime: 3 },
    { sprint: 'Sprint 23', avgCycleTime: 10, avgBlockedTime: 4 },
    { sprint: 'Sprint 24', avgCycleTime: 8, avgBlockedTime: 2 },
    { sprint: 'Sprint 25', avgCycleTime: 11, avgBlockedTime: 5 },
    { sprint: 'Sprint 26', avgCycleTime: 9, avgBlockedTime: 3 }
  ];

  // Clarification loop distribution
  const clarificationDistribution = [
    { loops: '0', count: tickets.filter(t => t.clarificationLoops === 0).length },
    { loops: '1', count: tickets.filter(t => t.clarificationLoops === 1).length },
    { loops: '2', count: tickets.filter(t => t.clarificationLoops === 2).length },
    { loops: '3+', count: tickets.filter(t => t.clarificationLoops >= 3).length }
  ];

  // Enhanced blocker data
  const blockerSourceData = tickets.flatMap(t => t.blockers).reduce((acc, blocker) => {
    const existing = acc.find(item => item.name === blocker.type);
    if (existing) {
      existing.value += blocker.duration;
    } else {
      acc.push({
        name: blocker.type,
        value: blocker.duration,
        color: {
          'Success': '#ef4444',
          'Reliance': '#f97316', 
          'Infra': '#8b5cf6',
          'External': '#06b6d4'
        }[blocker.type] || '#6b7280'
      });
    }
    return acc;
  }, [] as Array<{ name: string; value: number; color: string }>);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          📊 {tickets.length} tickets analyzed
        </div>
      </div>

      {/* Enhanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stacked Time Breakdown per Developer */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            ⏱️ Time Breakdown per Developer
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={developerTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [`${value} days`, name]}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="devTime" stackId="time" fill="#10b981" name="Development" radius={[0, 0, 0, 0]} />
              <Bar dataKey="qcTime" stackId="time" fill="#3b82f6" name="QC" radius={[0, 0, 0, 0]} />
              <Bar dataKey="clarificationTime" stackId="time" fill="#f59e0b" name="Clarification" radius={[0, 0, 0, 0]} />
              <Bar dataKey="blockedTime" stackId="time" fill="#ef4444" name="Blocked" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sprint Trend Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            📈 Sprint Performance Trends
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={sprintTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="sprint" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value, name) => [`${value} days`, name]}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="avgCycleTime" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                name="Avg Cycle Time"
              />
              <Line 
                type="monotone" 
                dataKey="avgBlockedTime" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 6 }}
                name="Avg Blocked Time"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Blocker Source Analysis */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            🧱 Blocker Impact Analysis
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={blockerSourceData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value, percent }) => `${name}: ${value}d (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {blockerSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} days`, 'Blocked Time']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Clarification Loop Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            🔁 Clarification Loop Distribution
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={clarificationDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="loops" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value) => [`${value} tickets`, 'Count']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enhanced Summary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Tickets', value: tickets.length, icon: '📋', color: 'bg-blue-50 text-blue-700 border-blue-200' },
          { label: 'Completed', value: tickets.filter(t => t.currentStatus === 'Released').length, icon: '✅', color: 'bg-green-50 text-green-700 border-green-200' },
          { label: 'In Progress', value: tickets.filter(t => t.currentStatus === 'Development').length, icon: '⚡', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
          { label: 'Blocked', value: tickets.filter(t => t.blockers.length > 0).length, icon: '🧱', color: 'bg-red-50 text-red-700 border-red-200' },
          { label: 'Avg Loops', value: Math.round(tickets.reduce((sum, t) => sum + t.clarificationLoops, 0) / tickets.length * 10) / 10, icon: '🔁', color: 'bg-orange-50 text-orange-700 border-orange-200' },
          { label: 'Avg Days', value: Math.round(tickets.filter(t => t.stages.length > 0).reduce((sum, t) => {
            const totalDays = t.stages.reduce((stageSum, stage) => stageSum + stage.duration, 0);
            return sum + totalDays;
          }, 0) / tickets.length), icon: '⏱️', color: 'bg-purple-50 text-purple-700 border-purple-200' }
        ].map((stat, index) => (
          <div key={index} className={`p-4 rounded-xl border-2 ${stat.color} transition-all duration-200 hover:scale-105 hover:shadow-md`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
            <div className="text-sm font-medium opacity-75">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};