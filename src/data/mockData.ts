import { addDays, subDays, format } from 'date-fns';
import { Ticket, Developer, TicketStatus, MilestoneStats } from '../types';

const statuses: TicketStatus[] = [
  'Clarification',
  'In Sprint',
  'Development',
  'Tech QC',
  'Business QC',
  'Deprioritized',
  'Released'
];

const developers = [
  'Alex Chen',
  'Sarah Johnson',
  'Mike Rodriguez',
  'Emily Davis',
  'David Kim',
  'Lisa Wang'
];

const ticketTypes = ['bug', 'story', 'infra'] as const;
const priorities = ['High', 'Medium', 'Low'] as const;
const blockerTypes = ['Success', 'Reliance', 'Infra', 'External'] as const;

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateTicketStages(startDate: Date): any[] {
  const stages = [];
  let currentDate = startDate;
  
  const statusFlow = ['Clarification', 'In Sprint', 'Development', 'Tech QC', 'Business QC', 'Released'];
  
  for (let i = 0; i < Math.floor(Math.random() * 6) + 3; i++) {
    const duration = Math.floor(Math.random() * 7) + 1;
    const endDate = addDays(currentDate, duration);
    
    stages.push({
      status: statusFlow[Math.min(i, statusFlow.length - 1)],
      startDate: currentDate,
      endDate: i === statusFlow.length - 1 ? endDate : endDate,
      duration
    });
    
    currentDate = addDays(endDate, Math.floor(Math.random() * 2));
  }
  
  return stages;
}

export const mockTickets: Ticket[] = Array.from({ length: 24 }, (_, index) => {
  const startDate = subDays(new Date(), Math.floor(Math.random() * 60) + 1);
  const stages = generateTicketStages(startDate);
  const owner = developers[Math.floor(Math.random() * developers.length)];
  
  return {
    id: `TKT-${String(index + 1).padStart(3, '0')}`,
    title: `Implement ${['user authentication', 'dashboard metrics', 'API integration', 'data validation', 'UI components', 'error handling'][Math.floor(Math.random() * 6)]}`,
    description: `Detailed implementation requirements for ticket ${index + 1}`,
    owner,
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    type: ticketTypes[Math.floor(Math.random() * ticketTypes.length)],
    sprint: `Sprint ${24 + Math.floor(Math.random() * 3)}`,
    currentStatus: stages[stages.length - 1]?.status || 'Development',
    createdAt: startDate,
    stages,
    blockers: Math.random() > 0.7 ? [{
      id: `BLK-${index}`,
      type: blockerTypes[Math.floor(Math.random() * blockerTypes.length)],
      blockedBy: developers[Math.floor(Math.random() * developers.length)],
      reason: 'Waiting for external dependency',
      startDate: generateRandomDate(startDate, new Date()),
      duration: Math.floor(Math.random() * 5) + 1
    }] : [],
    clarificationLoops: Math.floor(Math.random() * 3)
  };
});

export const mockDevelopers: Developer[] = developers.map((name, index) => {
  const devTickets = mockTickets.filter(t => t.owner === name);
  
  return {
    id: `dev-${index}`,
    name,
    avatar: `https://images.pexels.com/photos/${1000000 + index}/pexels-photo-${1000000 + index}.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop`,
    tickets: devTickets.map(t => t.id),
    totalTickets: devTickets.length,
    avgBlockTime: Math.floor(Math.random() * 5) + 1,
    timeInDev: Math.floor(Math.random() * 20) + 5,
    timeInClarification: Math.floor(Math.random() * 10) + 2
  };
});

export const mockMilestones: MilestoneStats = {
  ticketsClosed: mockTickets.filter(t => t.currentStatus === 'Released').length,
  blockedTickets: mockTickets.filter(t => t.blockers.length > 0).length,
  clarificationLoops: mockTickets.reduce((sum, t) => sum + t.clarificationLoops, 0),
  deprioritized: mockTickets.filter(t => t.currentStatus === 'Deprioritized').length
};

export const sprints = ['All', 'Sprint 24', 'Sprint 25', 'Sprint 26'];