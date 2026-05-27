import React from 'react';

export default function NeonGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Moving tech-grid backdrop overlay */}
      <div className="absolute inset-0 tech-grid-motion pointer-events-none" />

      {/* Cyan ambient blur top-left */}
      <div 
        className="absolute -top-[15%] -left-[15%] w-[60vw] h-[60vw] rounded-full bg-[#06b6d4] blur-[150px] animate-drift-one transition-premium"
        style={{ opacity: 'calc(0.035 * var(--glow-opacity-multiplier, 1))' }}
      />
      {/* Purple ambient blur bottom-right */}
      <div 
        className="absolute -bottom-[15%] -right-[15%] w-[60vw] h-[60vw] rounded-full bg-[#8b5cf6] blur-[150px] animate-drift-two transition-premium"
        style={{ opacity: 'calc(0.035 * var(--glow-opacity-multiplier, 1))' }}
      />
      {/* Orange accent center glow */}
      <div 
        className="absolute top-[40%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[80vw] h-[40vh] rounded-full bg-gradient-to-tr from-[#ff5e00]/5 to-[#8b5cf6]/5 blur-[120px] transition-premium"
        style={{ opacity: 'calc(0.45 * var(--glow-opacity-multiplier, 1))' }}
      />
    </div>
  );
}
