import React, { useState } from 'react';
import { User, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Developer, Ticket } from '../../types';

interface DeveloperInsightsProps {
  developers: Developer[];
  tickets: Ticket[];
}

export const DeveloperInsights: React.FC<DeveloperInsightsProps> = ({ developers, tickets }) => {
  const [selectedDeveloper, setSelectedDeveloper] = useState<string | null>(null);

  const getDeveloperStats = (developer: Developer) => {
    const devTickets = tickets.filter(t => t.owner === developer.name);
    const completedTickets = devTickets.filter(t => t.currentStatus === 'Released');
    const blockedTickets = devTickets.filter(t => t.blockers.length > 0);
    
    const avgCompletionTime = devTickets.length > 0 
      ? Math.round(devTickets.reduce((sum, ticket) => {
          const totalDays = ticket.stages.reduce((stageSum, stage) => stageSum + stage.duration, 0);
          return sum + totalDays;
        }, 0) / devTickets.length)
      : 0;

    const totalBlockedTime = devTickets.reduce((sum, ticket) => {
      return sum + ticket.blockers.reduce((blockerSum, blocker) => blockerSum + blocker.duration, 0);
    }, 0);

    return {
      ...developer,
      devTickets,
      completedTickets: completedTickets.length,
      blockedTickets: blockedTickets.length,
      avgCompletionTime,
      totalBlockedTime,
      productivityScore: Math.max(0, 100 - (totalBlockedTime * 2) - (devTickets.reduce((sum, t) => sum + t.clarificationLoops, 0) * 5))
    };
  };

  const enrichedDevelopers = developers.map(getDeveloperStats);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Developer Insights</h2>
        <div className="text-sm text-gray-500">
          Click on a developer to filter timeline view
        </div>
      </div>

      {/* Developer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrichedDevelopers.map((developer) => (
          <div
            key={developer.id}
            className={`bg-white p-6 rounded-lg shadow-sm border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedDeveloper === developer.name
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedDeveloper(
              selectedDeveloper === developer.name ? null : developer.name
            )}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {developer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{developer.name}</h3>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-gray-600">Productivity Score:</div>
                  <div className={`text-sm font-bold ${
                    developer.productivityScore >= 80 ? 'text-green-600' :
                    developer.productivityScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {Math.round(developer.productivityScore)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-xl font-bold text-gray-900">{developer.completedTickets}</div>
                <div className="text-xs text-gray-600">Completed</div>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-xl font-bold text-gray-900">{developer.blockedTickets}</div>
                <div className="text-xs text-gray-600">Blocked</div>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-xl font-bold text-gray-900">{developer.avgCompletionTime}</div>
                <div className="text-xs text-gray-600">Avg Days</div>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-xl font-bold text-gray-900">{developer.devTickets.length}</div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
            </div>

            {developer.totalBlockedTime > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-900">Total Blocked Time</span>
                  <span className="text-sm font-bold text-red-700">{developer.totalBlockedTime} days</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Developer Comparison Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Developer Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Developer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Tickets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Completion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Blocked Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Productivity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrichedDevelopers
                .sort((a, b) => b.productivityScore - a.productivityScore)
                .map((developer) => (
                <tr key={developer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                        {developer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-gray-900">{developer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {developer.devTickets.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {developer.completedTickets}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {developer.avgCompletionTime} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {developer.totalBlockedTime} days
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            developer.productivityScore >= 80 ? 'bg-green-500' :
                            developer.productivityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.max(0, Math.min(100, developer.productivityScore))}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.round(developer.productivityScore)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDeveloper && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-900">
              Timeline filtered to show tickets for {selectedDeveloper}
            </span>
          </div>
          <button
            onClick={() => setSelectedDeveloper(null)}
            className="mt-2 text-sm text-blue-700 hover:text-blue-900 underline"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
};