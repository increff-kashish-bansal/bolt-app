import React from 'react';
import { X, Clock, User, Flag, AlertCircle, CheckCircle } from 'lucide-react';
import { Ticket } from '../../types';
import { formatDate, formatRelativeTime, getStatusColor, getStatusIcon, getBlockerIcon } from '../../utils/dateUtils';

interface TicketModalProps {
  ticket: Ticket;
  onClose: () => void;
}

export const TicketModal: React.FC<TicketModalProps> = ({ ticket, onClose }) => {
  const totalBlockedTime = ticket.blockers.reduce((sum, blocker) => sum + blocker.duration, 0);
  const totalDays = ticket.stages.reduce((sum, stage) => sum + stage.duration, 0);
  
  const generateCommentary = (ticket: Ticket): string => {
    const parts = [];
    
    if (ticket.blockers.length > 0) {
      const blockersByType = ticket.blockers.reduce((acc, blocker) => {
        acc[blocker.type] = (acc[blocker.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const topBlockerType = Object.entries(blockersByType)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (topBlockerType) {
        parts.push(`Blocked ${ticket.blockers.length} time${ticket.blockers.length > 1 ? 's' : ''}, primarily by ${topBlockerType[0]} team`);
      }
    }
    
    if (ticket.clarificationLoops > 0) {
      parts.push(`underwent ${ticket.clarificationLoops} clarification round${ticket.clarificationLoops > 1 ? 's' : ''}`);
    }
    
    const devStage = ticket.stages.find(s => s.status === 'Development');
    if (devStage) {
      parts.push(`spent ${devStage.duration} days in active development`);
    }
    
    parts.push(`total pipeline time: ${totalDays} days`);
    
    if (parts.length === 1) {
      return 'Smooth execution with minimal blockers and efficient progression through the development pipeline.';
    }
    
    return parts.join(', ') + '.';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-4">
            <div
              className="w-6 h-6 rounded-full shadow-sm"
              style={{ backgroundColor: getStatusColor(ticket.currentStatus) }}
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{ticket.id}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-2xl">{getStatusIcon(ticket.currentStatus)}</span>
                <span className="text-sm font-medium text-gray-600">{ticket.currentStatus}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Enhanced Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{ticket.title}</h3>
            <p className="text-gray-700 mb-4">{ticket.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">Owner</div>
                  <div className="font-medium text-gray-900">{ticket.owner}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Flag className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">Priority</div>
                  <div className="font-medium text-gray-900">{ticket.priority}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getStatusColor(ticket.type) }} />
                <div>
                  <div className="text-xs text-gray-500">Type</div>
                  <div className="font-medium text-gray-900 capitalize">{ticket.type}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="text-xs text-gray-500">Sprint</div>
                  <div className="font-medium text-gray-900">{ticket.sprint}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Event Log */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              📅 Timeline Event Log
            </h4>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              
              <div className="space-y-4">
                {ticket.stages.map((stage, index) => (
                  <div key={index} className="relative flex items-start space-x-4">
                    {/* Timeline dot */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10"
                      style={{ backgroundColor: getStatusColor(stage.status) }}
                    >
                      <span className="text-lg">{getStatusIcon(stage.status)}</span>
                    </div>
                    
                    <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-900">{stage.status}</h5>
                        <div className="text-sm text-gray-500">
                          {formatRelativeTime(stage.startDate)}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>{formatDate(stage.startDate)} - {stage.endDate ? formatDate(stage.endDate) : 'Present'}</div>
                        <div className="font-medium text-gray-900 mt-1">Duration: {stage.duration} days</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Blockers Section */}
          {ticket.blockers.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span>Blockers ({totalBlockedTime} days total impact)</span>
              </h4>
              <div className="grid gap-4">
                {ticket.blockers.map((blocker, index) => (
                  <div key={index} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{getBlockerIcon(blocker.type)}</span>
                        <span className="font-semibold text-red-900">{blocker.type} Blocker</span>
                      </div>
                      <div className="text-sm font-medium text-red-700 bg-red-200 px-2 py-1 rounded">
                        {blocker.duration} days
                      </div>
                    </div>
                    <div className="text-sm text-red-800 space-y-1">
                      <div><strong>Blocked by:</strong> {blocker.blockedBy}</div>
                      <div><strong>Reason:</strong> {blocker.reason}</div>
                      <div><strong>Started:</strong> {formatDate(blocker.startDate)} ({formatRelativeTime(blocker.startDate)})</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Commentary */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              🤖 AI-Generated Summary
            </h4>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900 leading-relaxed">{generateCommentary(ticket)}</p>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{totalDays}</div>
              <div className="text-sm font-medium text-blue-800">Total Days</div>
              <div className="text-xs text-blue-600 mt-1">In Pipeline</div>
            </div>
            <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-3xl font-bold text-red-600">{totalBlockedTime}</div>
              <div className="text-sm font-medium text-red-800">Days Blocked</div>
              <div className="text-xs text-red-600 mt-1">{totalBlockedTime > 0 ? `${Math.round((totalBlockedTime / totalDays) * 100)}% of time` : 'No blocks'}</div>
            </div>
            <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{ticket.clarificationLoops}</div>
              <div className="text-sm font-medium text-orange-800">Clarifications</div>
              <div className="text-xs text-orange-600 mt-1">{ticket.clarificationLoops === 0 ? 'Clear requirements' : 'Needed clarity'}</div>
            </div>
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {ticket.currentStatus === 'Released' ? '100' : Math.round((ticket.stages.length / 6) * 100)}
              </div>
              <div className="text-sm font-medium text-green-800">% Complete</div>
              <div className="text-xs text-green-600 mt-1">
                {ticket.currentStatus === 'Released' ? 'Delivered' : 'In Progress'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};