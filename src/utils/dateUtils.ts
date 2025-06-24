import { format, differenceInDays } from 'date-fns';

export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};

export const formatDateShort = (date: Date): string => {
  return format(date, 'MM/dd');
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffDays = differenceInDays(now, date);
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1d ago';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}m ago`;
};

export const getDaysDifference = (start: Date, end: Date): number => {
  return differenceInDays(end, start);
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'Clarification': '#f59e0b', // Orange
    'In Sprint': '#3b82f6',    // Blue
    'Development': '#10b981',   // Green
    'Tech QC': '#3b82f6',      // Blue
    'Business QC': '#3b82f6',  // Blue
    'Deprioritized': '#6b7280', // Gray
    'Released': '#8b5cf6'      // Purple
  };
  
  return colors[status] || '#6b7280';
};

export const getTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    'bug': '#ef4444',
    'story': '#3b82f6',
    'infra': '#8b5cf6'
  };
  
  return colors[type] || '#6b7280';
};

export const getStatusIcon = (status: string): string => {
  const icons: Record<string, string> = {
    'Clarification': '🔁',
    'In Sprint': '📋',
    'Development': '⚡',
    'Tech QC': '🔍',
    'Business QC': '✅',
    'Deprioritized': '⏸️',
    'Released': '🚀'
  };
  
  return icons[status] || '📝';
};

export const getBlockerIcon = (type: string): string => {
  const icons: Record<string, string> = {
    'Success': '🧱',
    'Reliance': '🔗',
    'Infra': '⚙️',
    'External': '🌐'
  };
  
  return icons[type] || '🚫';
};