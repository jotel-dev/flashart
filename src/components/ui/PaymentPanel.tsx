import React from 'react';
import { StyleType } from './StyleSelector';

interface PaymentPanelProps {
  prompt: string;
  selectedStyle: StyleType;
  walletAddress: string | null;
  priceCelo: string;
  loading: boolean;
  onPay: () => void;
  onCancel: () => void;
}

export default function PaymentPanel({
  prompt,
  selectedStyle,
  walletAddress,
  priceCelo,
  loading,
  onPay,
  onCancel,
}: PaymentPanelProps) {
  return (
    <div className="w-full max-w-md mx-auto relative overflow-hidden rounded-3xl border border-card-border bg-cyber-dark/60 backdrop-blur-md p-6 md:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-premium">
      {/* Visual top accent indicator */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-cyber-orange to-cyber-purple" />

      {/* Charging Icon */}
      <div className="w-12 h-12 rounded-2xl bg-cyber-orange/10 border border-cyber-orange/20 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,94,0,0.1)] animate-pulse">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5 text-cyber-orange"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
          />
        </svg>
      </div>

      <div className="text-center space-y-1">
        <h2 className="font-space text-base font-bold tracking-wider uppercase text-text-primary">
          Authorize Payload
        </h2>
        <p className="text-[9px] text-text-dim tracking-wider font-bold">
          {walletAddress ? 'SECURE TRANSACTION VIA CELO BLOCKCHAIN' : 'DEMO NODE — CONNECT WALLET FOR ON-CHAIN TRANSACTION'}
        </p>
      </div>

      {/* Details Table */}
      <div className="bg-card-bg rounded-2xl border border-card-border p-5 space-y-4 text-xs">
        <div className="flex justify-between items-start gap-4">
          <span className="text-text-muted font-medium">Prompt Payload</span>
          <span className="text-text-primary text-right truncate max-w-[65%] font-semibold font-mono text-[11px]">
            {prompt}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-muted font-medium">Style Configuration</span>
          <span className="text-text-primary font-semibold">{selectedStyle.label}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-text-muted font-medium">Network Node</span>
          <span className="text-text-primary font-semibold font-mono text-[10px]">
            {walletAddress ? 'CELO-MAINNET' : 'SIMULATOR-NODE'}
          </span>
        </div>
        
        <div className="h-px bg-card-border" />

        <div className="flex justify-between items-baseline pt-1">
          <span className="text-text-muted font-bold uppercase tracking-wider text-[9px]">
            Generation Fee
          </span>
          <span className="text-xl font-black text-cyber-orange font-mono">
            {priceCelo} <span className="text-xs text-text-secondary font-bold font-sans">CELO</span>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={onPay}
          disabled={loading}
          className="relative w-full py-4 rounded-2xl bg-cyber-orange hover:bg-cyber-orange/90 text-white font-bold text-xs uppercase tracking-widest overflow-hidden transition-premium hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(255,94,0,0.15)] hover:shadow-[0_4px_30px_rgba(255,94,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2.5">
              <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Broadcasting TX...
            </span>
          ) : (
            `PAY ${priceCelo} CELO & GENERATE`
          )}
        </button>

        <button
          onClick={onCancel}
          disabled={loading}
          className="w-full text-center text-text-muted hover:text-text-primary text-[10px] py-1.5 transition-colors font-bold uppercase tracking-widest cursor-pointer disabled:opacity-40"
        >
          ← CANCEL PAYLOAD
        </button>
      </div>
    </div>
  );
}
