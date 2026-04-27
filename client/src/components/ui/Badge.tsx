import React from 'react';

interface BadgeProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
  children: React.ReactNode;
  className?: string;
}

const variants = {
  primary: 'badge-primary',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  default: 'badge bg-surface-hover text-text-secondary',
};

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => (
  <span className={`${variants[variant]} ${className}`}>{children}</span>
);

// Priority badge helper
export const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const map: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    high: { variant: 'danger', label: 'High' },
    medium: { variant: 'warning', label: 'Medium' },
    low: { variant: 'success', label: 'Low' },
  };
  const config = map[priority] || map.medium;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

// Status badge helper
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    done: { variant: 'success', label: 'Done' },
    'in-progress': { variant: 'primary', label: 'In Progress' },
    todo: { variant: 'default', label: 'To Do' },
    active: { variant: 'primary', label: 'Active' },
    completed: { variant: 'success', label: 'Completed' },
    paused: { variant: 'warning', label: 'Paused' },
  };
  const config = map[status] || map.todo;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
