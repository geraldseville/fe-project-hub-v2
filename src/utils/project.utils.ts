import { ProjectStatus, ProjectUrgency } from '@/types/project.types';

export const PROJECT_STATUSES = [
  'PLANNING',
  'ACTIVE',
  'REVIEW',
  'COMPLETED',
  'ARCHIVE',
] as const;

export const PROJECT_STATUS_COLORS: Record<
  ProjectStatus,
  { text: string; bg: string; border: string; hex: string }
> = {
  PLANNING: {
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    hex: '#A855F7',
  },
  ACTIVE: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    hex: '#10B981',
  },
  REVIEW: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    hex: '#F59E0B',
  },
  COMPLETED: {
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    hex: '#3B82F6',
  },
  ARCHIVE: {
    text: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/20',
    hex: '#6B7280',
  },
};

export const PROJECT_URGENCIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

export const PROJECT_URGENCY_COLORS: Record<ProjectUrgency, { hex: string }> = {
  LOW: {
    hex: '#10B981',
  },
  MEDIUM: {
    hex: '#F59E0B',
  },
  HIGH: {
    hex: '#F97316',
  },
  CRITICAL: {
    hex: '#EF4444',
  },
};
