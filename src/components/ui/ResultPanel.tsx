import Image from 'next/image';
import { StyleType } from './StyleSelector';

interface ResultPanelProps {
  imageUrl: string;
  prompt: string;
  selectedStyle: StyleType;
  txHash: string | null;
  agentTxHash: string | null;
  onSave: () => void;
  onReset: () => void;
}

export default function ResultPanel({
  imageUrl,
  prompt,
  selectedStyle,
  txHash,
  agentTxHash,
  onSave,
  onReset,
}: ResultPanelProps) {
  const isSimulated = txHash?.startsWith('simulated') ?? false;

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 relative z-10">
      {/* Sharp rectangular canvas container */}
      <div className="relative overflow-hidden bg-card-bg group transition-premium glow-hover">
        {/* Artwork Image */}
        <div className="aspect-square relative w-full overflow-hidden bg-card-bg-hover">
          <Image
            src={imageUrl}
            alt={prompt}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Console details display */}
        <div className="p-5 space-y-3 bg-card-bg">
          <div className="flex items-center justify-between">
            <span className="font-space text-[11px] text-cyber-purple font-semibold tracking-[0.08em] uppercase">
              GENERATED METADATA
            </span>
            <span className="font-mono text-[10px] text-text-muted uppercase">
              1024x1024 PX · PNG
            </span>
          </div>

          <p className="text-text-primary text-sm font-medium leading-relaxed font-sans">
            "{prompt}"
          </p>

          <div className="flex items-center gap-2 pt-1.5 text-[10px] text-text-muted">
            <span className="bg-card-bg-hover px-2.5 py-1">
              Style: {selectedStyle.label}
            </span>
          </div>
        </div>
      </div>

      {/* Explorer Verification Link (User Payment) */}
      {txHash && !isSimulated && (
        <a
          href={`https://celoscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 text-xs text-[#1DB97C] bg-[#0F2E1F] border border-[#1DB97C33] px-5 py-3.5 font-semibold transition-premium glow-hover"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB97C] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1DB97C]"></span>
          </span>
          VERIFIED USER PAYMENT ON CELOSCAN ↗
        </a>
      )}

      {/* AI Agent on-chain delivery receipt (ERC-8004 Agent Transaction) */}
      {agentTxHash && (
        <div className="bg-card-bg border border-card-border p-5 space-y-3 transition-premium glow-hover">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-orange"></span>
              </span>
              <span className="font-space text-[11px] text-cyber-purple font-semibold tracking-[0.08em] uppercase">
                AGENT DELIVERY LEDGER
              </span>
            </div>
            <span className="text-[10px] bg-[#2A1508] text-cyber-orange border border-[#F4722B40] px-1.5 py-0.5 font-mono font-semibold uppercase">
              ERC-8004
            </span>
          </div>

          <div className="text-[10px] text-text-muted font-semibold leading-normal">
            This asset was autonomously logged and dispatched on-chain by the verified human-backed AI Agent.
          </div>

          <div className="h-px bg-card-border" />

          {agentTxHash.startsWith('simulated') ? (
            <div className="text-[10px] font-mono text-text-dim text-center">
              Simulation Hash: {agentTxHash}
            </div>
          ) : (
            <a
              href={`https://celoscan.io/tx/${agentTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-xs text-cyber-orange hover:text-cyber-purple font-semibold transition-premium"
            >
              Verify Agent Dispatch ↗
            </a>
          )}
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onSave}
          className="flex-1 bg-card-bg border border-card-border text-text-primary font-semibold py-4 text-center text-xs uppercase tracking-[0.08em] cursor-pointer transition-premium glow-hover"
        >
          ⬇ DOWNLOAD ARTWORK
        </button>

        <button
          onClick={onReset}
          className="flex-1 bg-cyber-orange border border-cyber-orange text-text-primary font-semibold py-4 text-xs uppercase tracking-[0.08em] cursor-pointer transition-premium glow-hover"
        >
          ✨ GENERATE NEW
        </button>
      </div>
    </div>
  );
}
