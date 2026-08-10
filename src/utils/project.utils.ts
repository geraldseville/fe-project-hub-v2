import momentTimezone from 'moment-timezone';

import { ProjectStatus, ProjectUrgency } from '@/types/project.types';

export const PROJECT_COLOR_PRESETS = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Pink
];

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

export function getProjectTimeline(
  startDate: string | Date,
  endDate: string | Date,
  timezone: string,
): {
  label: string;
  value: string;
} {
  const now = momentTimezone.tz(timezone);

  const start = momentTimezone.tz(startDate, timezone);

  const end = momentTimezone.tz(endDate, timezone);

  // Project hasn't started
  if (now.isBefore(start, 'day')) {
    const days = start.startOf('day').diff(now.startOf('day'), 'days');

    return {
      label: 'Starts In',
      value: days === 0 ? 'Today' : `${days} day${days !== 1 ? 's' : ''}`,
    };
  }

  // Project is active
  if (now.isSameOrBefore(end, 'day')) {
    const days = end.startOf('day').diff(now.startOf('day'), 'days');

    return {
      label: 'Days Remaining',
      value: days === 0 ? 'Today' : `${days} day${days !== 1 ? 's' : ''}`,
    };
  }

  // Project has ended
  const days = now.startOf('day').diff(end.startOf('day'), 'days');

  return {
    label: 'Project Ended',
    value: `${days} day${days !== 1 ? 's' : ''} ago`,
  };
}
