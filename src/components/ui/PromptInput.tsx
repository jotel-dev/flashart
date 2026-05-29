import React, { KeyboardEvent } from 'react';

interface PromptInputProps {
  prompt: string;
  setPrompt: (val: string) => void;
  onSubmit: () => void;
  error: string | null;
  walletAddress: string | null;
}

export default function PromptInput({
  prompt,
  setPrompt,
  onSubmit,
  error,
  walletAddress,
}: PromptInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && prompt.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-1">
        <span className="font-space text-[11px] font-semibold tracking-[0.08em] text-cyber-purple uppercase">
          AI Prompt Terminal
        </span>
        <p className="text-xs text-text-muted">
          Describe the subjects, lighting parameters, and atmosphere of your artwork.
        </p>
      </div>

      <div className="relative flex items-center bg-card-bg border border-card-border p-2 pl-4 focus-within:border-cyber-purple transition-premium glow-hover">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="w-5 h-5 text-text-dim"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904 9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.187.904ZM18 7.5l-.375 2.25L15.375 10l2.25.375L18 12.75l.375-2.25L20.625 10l-2.25-.375L18 7.5ZM20.25 3.375l-.188 1.125-1.125.188 1.125.188.188 1.125.188-1.125 1.125-.188-1.125-.188-.188-1.125Z"
          />
        </svg>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="A modern anime studio, cybernetic desk, neon cyan backlighting..."
          className="flex-1 bg-transparent border-none text-text-primary placeholder-text-dim text-[15px] font-medium focus:outline-none px-3 py-2"
        />

        <button
          onClick={onSubmit}
          disabled={!prompt.trim()}
          className="w-10 h-10 bg-cyber-orange border border-cyber-orange disabled:bg-card-bg disabled:text-text-dim disabled:border-card-border disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer transition-premium glow-hover"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4 text-text-primary"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-[#2A151C] border border-[#E24B4A40] py-3 px-4 text-xs text-[#E24B4A]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 text-[#E24B4A] flex-shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <span className="font-semibold leading-normal">{error}</span>
        </div>
      )}

      {!walletAddress && (
        <p className="text-text-muted text-[11px] text-center tracking-wide font-medium">
          On mobile? Load in <a href="https://minipay.opera.com" className="text-cyber-orange hover:text-cyber-purple underline transition-premium">MiniPay</a> for an optimized Web3 experience.
        </p>
      )}
    </div>
  );
}
