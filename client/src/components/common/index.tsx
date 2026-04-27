import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-8">
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-text-primary"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-text-secondary mt-1"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex items-center justify-center p-8">
      <svg className={`animate-spin ${sizes[size]} text-primary`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    </div>
  );
};

export const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-8 text-center"
  >
    <div className="w-16 h-16 rounded-2xl bg-surface-elevated border border-border flex items-center justify-center text-text-muted mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
    <p className="text-text-secondary max-w-sm mb-6">{description}</p>
    {action}
  </motion.div>
);

export const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  subtitle?: string;
}> = ({ title, value, icon, color = 'text-primary-light', subtitle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    className="card-hover"
  >
    <div className="flex items-center justify-between mb-3">
      <span className="text-text-secondary text-sm font-medium">{title}</span>
      <div className={`${color} opacity-80`}>{icon}</div>
    </div>
    <div className="text-3xl font-bold text-text-primary mb-1">{value}</div>
    {subtitle && <div className="text-xs text-text-muted">{subtitle}</div>}
  </motion.div>
);
