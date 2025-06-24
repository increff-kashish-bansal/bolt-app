export interface Ticket {
  id: string;
  title: string;
  description: string;
  owner: string;
  priority: 'High' | 'Medium' | 'Low';
  type: 'bug' | 'story' | 'infra';
  sprint: string;
  currentStatus: TicketStatus;
  createdAt: Date;
  stages: TicketStage[];
  blockers: Blocker[];
  clarificationLoops: number;
}

export interface TicketStage {
  status: TicketStatus;
  startDate: Date;
  endDate?: Date;
  duration: number; // in days
}

export interface Blocker {
  id: string;
  type: 'Success' | 'Reliance' | 'Infra' | 'External';
  blockedBy: string;
  reason: string;
  startDate: Date;
  endDate?: Date;
  duration: number; // in days
}

export interface Developer {
  id: string;
  name: string;
  avatar: string;
  tickets: string[];
  totalTickets: number;
  avgBlockTime: number;
  timeInDev: number;
  timeInClarification: number;
}

export type TicketStatus = 
  | 'Clarification'
  | 'In Sprint'
  | 'Development'
  | 'Tech QC'
  | 'Business QC'
  | 'Deprioritized'
  | 'Released';

export interface MilestoneStats {
  ticketsClosed: number;
  blockedTickets: number;
  clarificationLoops: number;
  deprioritized: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}