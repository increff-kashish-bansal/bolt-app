import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, Clock, User, TrendingUp } from 'lucide-react';
import { Ticket } from '../../types';

interface BlockerAnalyticsProps {
  tickets: Ticket[];
}

export const BlockerAnalytics: React.FC<BlockerAnalyticsProps> = ({ tickets }) => {
  // Calculate blocker statistics
  const allBlockers = tickets.flatMap(ticket => 
    ticket.blockers.map(blocker => ({ ...blocker, ticketId: ticket.id }))
  );

  // Blockers by type
  const blockersByType = allBlockers.reduce((acc, blocker) => {
    acc[blocker.type] = (acc[blocker.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const blockerTypeData = Object.entries(blockersByType).map(([type, count]) => ({
    name: type,
    value: count,
    color: {
      'Success': '#ef4444',
      'Reliance': '#f97316',
      'Infra': '#8b5cf6',
      'External': '#06b6d4'
    }[type] || '#6b7280'
  }));

  // Who blocked most frequently
  const blockersByPerson = allBlockers.reduce((acc, blocker) => {
    acc[blocker.blockedBy] = (acc[blocker.blockedBy] || { count: 0, totalDuration: 0 });
    acc[blocker.blockedBy].count += 1;
    acc[blocker.blockedBy].totalDuration += blocker.duration;
    return acc;
  }, {} as Record<string, { count: number; totalDuration: number }>);

  const blockerPersonData = Object.entries(blockersByPerson)
    .map(([person, data]) => ({
      name: person,
      count: data.count,
      avgDuration: Math.round(data.totalDuration / data.count * 10) / 10
    }))
    .sort((a, b) => b.count - a.count);

  // Average delay by blocker type
  const avgDelayByType = Object.entries(
    allBlockers.reduce((acc, blocker) => {
      if (!acc[blocker.type]) {
        acc[blocker.type] = { total: 0, count: 0 };
      }
      acc[blocker.type].total += blocker.duration;
      acc[blocker.type].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>)
  ).map(([type, data]) => ({
    name: type,
    avgDelay: Math.round(data.total / data.count * 10) / 10
  }));

  const totalBlockedTickets = tickets.filter(t => t.blockers.length > 0).length;
  const totalBlockerDays = allBlockers.reduce((sum, blocker) => sum + blocker.duration, 0);
  const avgBlockerDuration = allBlockers.length > 0 ? Math.round(totalBlockerDays / allBlockers.length * 10) / 10 : 0;
  const mostProblematicType = blockerTypeData.reduce((max, current) => 
    current.value > max.value ? current : max, blockerTypeData[0] || { name: 'None', value: 0 }
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Blocker Analytics</h2>
        <div className="text-sm text-gray-500">
          {allBlockers.length} total blockers across {totalBlockedTickets} tickets
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalBlockedTickets}</div>
              <div className="text-sm text-gray-600">Blocked Tickets</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalBlockerDays}</div>
              <div className="text-sm text-gray-600">Total Blocked Days</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{avgBlockerDuration}</div>
              <div className="text-sm text-gray-600">Avg Blocker Duration</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{mostProblematicType.name}</div>
              <div className="text-sm text-gray-600">Top Blocker Type</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blocker Types Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Blocker Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={blockerTypeData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {blockerTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Average Delay by Type */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Delay by Blocker Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={avgDelayByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} days`, 'Average Delay']} />
              <Bar dataKey="avgDelay" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Blockers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Who Blocks Most Frequently</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Blocks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impact Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blockerPersonData.map((person, index) => {
                const impactScore = person.count * person.avgDuration;
                const impactLevel = impactScore > 10 ? 'High' : impactScore > 5 ? 'Medium' : 'Low';
                const impactColor = impactScore > 10 ? 'text-red-600 bg-red-100' : 
                                 impactScore > 5 ? 'text-yellow-600 bg-yellow-100' : 'text-green-600 bg-green-100';
                
                return (
                  <tr key={person.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium text-gray-900">{person.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-gray-900 mr-2">{person.count}</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 bg-red-500 rounded-full"
                            style={{ width: `${Math.min(100, (person.count / Math.max(...blockerPersonData.map(p => p.count))) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {person.avgDuration} days
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${impactColor}`}>
                        {impactLevel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Blocker List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Blockers</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {allBlockers
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
            .slice(0, 10)
            .map((blocker, index) => (
            <div key={index} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: blockerTypeData.find(b => b.name === blocker.type)?.color || '#6b7280' }}
                  />
                  <div>
                    <div className="font-medium text-gray-900">Ticket {blocker.ticketId}</div>
                    <div className="text-sm text-gray-600">{blocker.reason}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{blocker.blockedBy}</div>
                  <div className="text-sm text-gray-600">{blocker.duration} days</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};