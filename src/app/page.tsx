'use client';

import { useState } from 'react';
import Image from 'next/image';

const STYLES = [
  { id: 'photorealistic', label: '📸 Photorealistic', suffix: 'photorealistic, 8k, ultra detailed' },
  { id: 'anime', label: '🎌 Anime', suffix: 'anime style, vibrant, studio ghibli inspired' },
  { id: 'oil-painting', label: '🖼️ Oil Painting', suffix: 'oil painting, classical art, museum quality' },
  { id: 'logo', label: '✏️ Logo / Flat', suffix: 'flat design, logo style, vector art, clean' },
  { id: 'cinematic', label: '🎬 Cinematic', suffix: 'cinematic, dramatic lighting, movie still' },
  { id: 'afrofuturism', label: '🌍 Afrofuturism', suffix: 'afrofuturism, vibrant african patterns, futuristic, bold colors' },
];

const PRICE_PER_IMAGE = 0.05; // cUSD

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paid, setPaid] = useState(false);
  const [step, setStep] = useState<'input' | 'pay' | 'result'>('input');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setStep('pay');
  };

  const handlePayAndGenerate = async () => {
    setLoading(true);
    setError(null);
    setPaid(true);

    try {
      const fullPrompt = `${prompt}, ${selectedStyle.suffix}`;
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Generation failed');

      setImageUrl(data.imageUrl);
      setStep('result');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep('input');
      setPaid(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPrompt('');
    setImageUrl(null);
    setError(null);
    setPaid(false);
    setStep('input');
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white font-space overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#ff6b2b] opacity-[0.07] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#7c3aed] opacity-[0.08] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:py-12">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3.5 py-1.5 text-[11px] sm:text-xs text-white/50 mb-5 sm:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b2b] animate-pulse inline-block" />
            Powered by Celo · Pay {PRICE_PER_IMAGE} cUSD per image
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
            Flash<span className="text-[#ff6b2b]">Art</span>
          </h1>
          <p className="text-white/40 text-sm sm:text-base">
            AI image generation. No subscription. Just pay per image.
          </p>
        </div>

        {/* Step: Input */}
        {step === 'input' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Prompt input */}
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">
                Describe your image
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A Lagos market at sunset with vibrant colors and people selling goods..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/20 text-sm resize-none focus:outline-none focus:border-[#ff6b2b]/50 transition-colors"
              />
            </div>

            {/* Style selector */}
            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-3">
                Choose style
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className={`px-3 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition-all text-left ${selectedStyle.id === style.id
                        ? 'bg-[#ff6b2b]/20 border-[#ff6b2b] text-white'
                        : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30'
                      }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              onClick={handleGenerate}
              disabled={!prompt.trim()}
              className="w-full bg-[#ff6b2b] hover:bg-[#ff8c50] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-3.5 sm:py-4 rounded-xl sm:rounded-2xl transition-all text-sm sm:text-base tracking-wide"
            >
              Generate Image →
            </button>
          </div>
        )}

        {/* Step: Payment confirmation */}
        {step === 'pay' && (
          <div className="animate-in fade-in duration-300">
            <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center space-y-6">
              <div className="text-4xl sm:text-5xl">⚡</div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Confirm Payment</h2>
                <p className="text-white/40 text-xs sm:text-sm">One-time charge to generate your image</p>
              </div>

              <div className="bg-black/30 rounded-xl sm:rounded-2xl p-4 text-left space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-1 sm:gap-4">
                  <span className="text-white/40 shrink-0">Prompt</span>
                  <span className="text-white/80 text-left sm:text-right break-words line-clamp-3 sm:line-clamp-2 max-w-full sm:max-w-[70%]">{prompt}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Style</span>
                  <span className="text-white/80">{selectedStyle.label}</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-[#ff6b2b]">{PRICE_PER_IMAGE} cUSD</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePayAndGenerate}
                  disabled={loading}
                  className="w-full bg-[#ff6b2b] hover:bg-[#ff8c50] disabled:opacity-50 text-white font-bold py-3.5 sm:py-4 rounded-xl sm:rounded-2xl transition-all text-sm sm:text-base"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                      Generating...
                    </span>
                  ) : (
                    `Pay ${PRICE_PER_IMAGE} cUSD & Generate`
                  )}
                </button>
                <button
                  onClick={() => setStep('input')}
                  className="w-full text-white/30 hover:text-white/60 text-xs sm:text-sm py-2 transition-colors"
                >
                  ← Go back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Result */}
        {step === 'result' && imageUrl && (
          <div className="animate-in fade-in duration-500 space-y-6">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10">
              <Image
                src={imageUrl}
                alt={prompt}
                width={1024}
                height={1024}
                className="w-full h-auto"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white/60 text-xs truncate">{prompt}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={imageUrl}
                download="flashart.png"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl sm:rounded-2xl text-center transition-all text-sm flex items-center justify-center min-h-[46px]"
              >
                ⬇ Download
              </a>
              <button
                onClick={handleReset}
                className="flex-1 bg-[#ff6b2b] hover:bg-[#ff8c50] text-white font-semibold py-3 rounded-xl sm:rounded-2xl transition-all text-sm min-h-[46px]"
              >
                ✨ Generate Another
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-white/20 text-xs mt-12">
          FlashArt · Built on Celo · Proof of Ship 2025
        </p>
      </div>
    </main>
  );
}