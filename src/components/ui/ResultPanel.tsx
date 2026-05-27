import React from 'react';
import Image from 'next/image';
import { StyleType } from './StyleSelector';

interface ResultPanelProps {
  imageUrl: string;
  prompt: string;
  selectedStyle: StyleType;
  txHash: string | null;
  onSave: () => void;
  onReset: () => void;
}

export default function ResultPanel({
  imageUrl,
  prompt,
  selectedStyle,
  txHash,
  onSave,
  onReset,
}: ResultPanelProps) {
  const isSimulated = !txHash || txHash.startsWith('simulated');

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 relative z-10">
      {/* High-tech canvas container */}
      <div className="relative rounded-3xl overflow-hidden border border-card-border bg-cyber-dark/60 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.15)] group transition-premium hover:border-card-border-hover">
        {/* Neon accent frame border */}
        <div className="absolute inset-0 border border-cyber-orange/10 rounded-3xl pointer-events-none group-hover:border-cyber-orange/20 transition-premium" />
        
        {/* Technical crosshair marks in corners */}
        <div className="absolute top-4 left-4 w-3.5 h-3.5 border-t border-l border-card-border pointer-events-none" />
        <div className="absolute top-4 right-4 w-3.5 h-3.5 border-t border-r border-card-border pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-3.5 h-3.5 border-b border-l border-card-border pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-3.5 h-3.5 border-b border-r border-card-border pointer-events-none" />

        {/* Artwork Image */}
        <div className="aspect-square relative w-full overflow-hidden bg-black/5">
          <Image
            src={imageUrl}
            alt={prompt}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover transition-transform duration-[1.5s] ease-out scale-100 group-hover:scale-[1.015]"
            priority
          />
        </div>

        {/* Console details display */}
        <div className="border-t border-card-border p-6 space-y-3 bg-cyber-dark/95">
          <div className="flex items-center justify-between">
            <span className="font-space text-[9px] text-cyber-orange font-bold tracking-widest uppercase">
              GENERATED METADATA
            </span>
            <span className="font-mono text-[8px] text-text-dim uppercase">
              1024x1024 PX · PNG
            </span>
          </div>

          <p className="text-text-primary text-sm font-medium leading-relaxed font-sans">
            "{prompt}"
          </p>

          <div className="flex items-center gap-2 pt-1.5 text-[10px] text-text-muted">
            <span className="bg-card-bg px-2.5 py-1 rounded font-semibold border border-card-border">
              Style: {selectedStyle.label}
            </span>
          </div>
        </div>
      </div>

      {/* Explorer Verification Link */}
      {txHash && !isSimulated && (
        <a
          href={`https://celoscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 text-xs text-emerald-500 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-2xl px-5 py-3.5 hover:bg-emerald-500/[0.06] hover:border-emerald-500/25 transition-premium font-semibold shadow-[0_4px_20px_rgba(16,185,129,0.02)]"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          VERIFIED ON CELOSCAN EXPLORER ↗
        </a>
      )}

      {/* Control Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onSave}
          className="flex-1 bg-card-bg hover:bg-card-bg-hover border border-card-border hover:border-card-border-hover text-text-primary font-bold py-4 rounded-2xl text-center text-xs uppercase tracking-wider transition-premium active:scale-95 cursor-pointer shadow-md"
        >
          ⬇ DOWNLOAD ARTWORK
        </button>
        
        <button
          onClick={onReset}
          className="flex-1 bg-cyber-orange hover:bg-cyber-orange/90 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-premium active:scale-95 cursor-pointer shadow-[0_4px_20px_rgba(255,94,0,0.15)]"
        >
          ✨ GENERATE NEW
        </button>
      </div>
    </div>
  );
}
