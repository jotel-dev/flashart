import React, { ReactNode } from 'react';

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 w-full ${className}`}>
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  glow?: 'orange' | 'purple' | 'cyan' | 'none';
  headerRight?: ReactNode;
  colSpan?: string; // e.g. "md:col-span-4", "md:col-span-8"
}

export function BentoCard({
  children,
  title,
  subtitle,
  className = '',
  glow = 'none',
  headerRight,
  colSpan = 'md:col-span-4',
}: BentoCardProps) {
  const glowClasses = {
    orange: 'neon-panel-orange glow-hover',
    purple: 'neon-panel-purple glow-hover',
    cyan: 'neon-panel-cyan glow-hover-cyan',
    none: 'glass-panel',
  };

  return (
<div
    className={`relative overflow-hidden p-5 flex flex-col justify-between transition-premium ${glowClasses[glow]} ${colSpan} ${className}`}
  >
      {/* Header section of card if title exists */}
      {(title || subtitle || headerRight) && (
        <div className="flex items-start justify-between w-full mb-6 relative z-10">
          <div className="space-y-1">
            {title && (
              <h3 className="font-space text-[11px] font-semibold tracking-[0.08em] uppercase text-cyber-purple">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[11px] text-text-muted font-medium tracking-[0.08em] uppercase">
                {subtitle}
              </p>
            )}
          </div>
          {headerRight && <div className="flex items-center">{headerRight}</div>}
        </div>
      )}

      {/* Main card content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
