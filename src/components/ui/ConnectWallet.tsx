import React from 'react';

interface ConnectWalletProps {
  walletAddress: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

export default function ConnectWallet({
  walletAddress,
  connectWallet,
  disconnectWallet,
}: ConnectWalletProps) {
  return (
    <div className="relative z-20 flex items-center gap-2 sm:gap-3">
      {walletAddress ? (
        <div className="flex items-center gap-2 sm:gap-4 bg-cyber-dark/80 border border-white/5 rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 text-sm backdrop-blur-md transition-premium hover:border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.3)]">
          {/* Status Indicator */}
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="font-space text-[8px] sm:text-[10px] font-bold tracking-wider text-emerald-400/90 uppercase">
              CONNECTED
            </span>
          </div>
          
          <div className="h-4 w-px bg-white/10" />

          {/* Address Display */}
          <span className="font-mono text-[10px] sm:text-xs text-text-secondary font-semibold">
            {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
          </span>

          <div className="h-4 w-px bg-white/10" />

          <button
            onClick={disconnectWallet}
            className="text-[9px] sm:text-[10px] text-text-muted hover:text-rose-500 font-bold tracking-wider uppercase transition-colors duration-200 cursor-pointer"
          >
            OUT
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="relative inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 rounded-2xl text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white overflow-hidden transition-premium hover:scale-[1.02] active:scale-[0.98] cursor-pointer group bg-gradient-to-r from-cyber-orange to-cyber-purple border border-white/10 shadow-[0_0_20px_rgba(255,94,0,0.15)] hover:shadow-[0_0_30px_rgba(255,94,0,0.3)]"
        >
          {/* Glow Overlay */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/90 group-hover:rotate-6 transition-transform duration-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6"
            />
          </svg>
          CONNECT
        </button>
      )}
    </div>
  );
}
