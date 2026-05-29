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
        <div className="flex items-center gap-2 sm:gap-4 border px-3 py-1.5 sm:px-4 sm:py-2 text-sm hover:border-cyber-purple bg-[#0F2E1F] text-[#1DB97C] border-[#1DB97C33] transition-premium glow-hover">
          {/* Status Indicator */}
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB97C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1DB97C]"></span>
            </span>
            <span className="font-space text-[9px] sm:text-[11px] font-semibold tracking-[0.08em] uppercase text-[#1DB97C]">
              CONNECTED
            </span>
          </div>

          <div className="h-4 w-px bg-[#1DB97C33]" />

          {/* Address Display */}
          <span className="font-mono text-[10px] sm:text-xs font-semibold text-[#8DE3BD]">
            {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
          </span>

          <div className="h-4 w-px bg-[#1DB97C33]" />

          <button
            onClick={disconnectWallet}
            className="border border-transparent px-1 text-[9px] sm:text-[10px] text-[#8DE3BD] hover:text-[#E24B4A] hover:border-cyber-purple font-semibold tracking-[0.08em] uppercase cursor-pointer transition-premium"
          >
            OUT
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="relative inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.08em] text-text-primary cursor-pointer group bg-cyber-orange border border-cyber-orange hover:border-cyber-purple transition-premium glow-hover"
        >
          {/* Glow Overlay */}
          <span className="absolute inset-0 w-full h-full bg-cyber-purple opacity-0 group-hover:opacity-20" />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-text-primary"
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
