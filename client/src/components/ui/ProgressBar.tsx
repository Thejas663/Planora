import React from 'react';
import { motion } from 'motion/react';

interface ProgressBarProps {
  value: number; // 0-100
  color?: 'primary' | 'success' | 'warning' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
}

const colorClasses = {
  primary: 'from-primary to-primary-light',
  success: 'from-success to-emerald-400',
  warning: 'from-warning to-yellow-400',
  accent: 'from-accent to-accent-dark',
};

const sizes = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = 'primary',
  size = 'md',
  showLabel = false,
  animate = true,
}) => {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 bg-surface-elevated rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          initial={animate ? { width: 0 } : { width: `${clamped}%` }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${colorClasses[color]}`}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-text-secondary font-medium w-9 text-right">
          {clamped}%
        </span>
      )}
    </div>
  );
};
