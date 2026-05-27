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
    orange: 'neon-panel-orange',
    purple: 'neon-panel-purple',
    cyan: 'neon-panel-cyan',
    none: 'glass-panel',
  };

  return (
    <div
      className={`relative rounded-3xl overflow-hidden p-6 md:p-8 flex flex-col justify-between transition-premium ${glowClasses[glow]} ${colSpan} ${className}`}
    >
      {/* Decorative technical accent marks */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-card-border rounded-tr-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-card-border rounded-bl-3xl pointer-events-none" />
      
      {/* Subtle tech corner notch */}
      <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-card-border pointer-events-none" />

      {/* Header section of card if title exists */}
      {(title || subtitle || headerRight) && (
        <div className="flex items-start justify-between w-full mb-6 relative z-10">
          <div className="space-y-1">
            {title && (
              <h3 className="font-space text-xs font-bold tracking-wider uppercase text-text-muted">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[10px] text-text-dim font-semibold tracking-wide uppercase">
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
