import React from 'react';

export interface StyleType {
  id: string;
  label: string;
  suffix: string;
}

interface StyleSelectorProps {
  styles: StyleType[];
  selectedStyle: StyleType;
  onStyleChange: (style: StyleType) => void;
}

export default function StyleSelector({
  styles,
  selectedStyle,
  onStyleChange,
}: StyleSelectorProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-space text-[10px] font-bold tracking-widest text-text-muted uppercase">
          Art Direction Engine
        </span>
        <span className="text-[10px] bg-cyber-orange/10 text-cyber-orange border border-cyber-orange/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
          {selectedStyle.id}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {styles.map((style) => {
          const isActive = selectedStyle.id === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onStyleChange(style)}
              className={`relative px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide text-left cursor-pointer transition-premium border ${
                isActive
                  ? 'bg-cyber-orange/[0.04] border-cyber-orange/30 text-text-primary shadow-[0_0_20px_rgba(255,94,0,0.05)]'
                  : 'bg-transparent border-card-border text-text-muted hover:text-text-primary hover:bg-card-bg-hover hover:border-card-border-hover'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-sans font-medium">{style.label}</span>
                {isActive && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-orange opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyber-orange"></span>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
