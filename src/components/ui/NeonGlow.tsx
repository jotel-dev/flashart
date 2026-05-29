import React from 'react';
import { useParallax } from '../../hooks/useScrollAnimation';

export default function NeonGlow() {
  const parallaxSlow = useParallax(0.1);
  const parallaxMedium = useParallax(0.2);
  const parallaxFast = useParallax(0.3);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Violet ambient wash top-left - sharp rectangle */}
      <div
        className="absolute -top-[15%] -left-[15%] w-[60vw] h-[60vw] bg-[#7C6AF5] blur-[150px] parallax-slow"
        style={{ opacity: 0.055, transform: `translateY(${parallaxSlow}px)` }}
      />
      {/* Orange ambient wash bottom-right - sharp rectangle */}
      <div
        className="absolute -bottom-[15%] -right-[15%] w-[60vw] h-[60vw] bg-[#F4722B] blur-[150px] parallax-medium"
        style={{ opacity: 0.035, transform: `translateY(${-parallaxMedium}px)` }}
      />
      {/* Orange accent center glow - sharp rectangle */}
      <div
        className="absolute top-[40%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[80vw] h-[40vh] bg-gradient-to-tr from-[#F4722B]/10 to-[#7C6AF5]/10 blur-[120px] parallax-fast"
        style={{ opacity: 0.32, transform: `translateY(${parallaxFast * 0.5}px)` }}
      />
    </div>
  );
}
