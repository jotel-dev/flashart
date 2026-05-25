 'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createWalletClient, custom, parseEther, createPublicClient, http } from 'viem';
import { celo } from 'viem/chains';

const STYLES = [
  { id: 'photorealistic', label: '📸 Photorealistic', suffix: 'photorealistic, 8k, ultra detailed' },
  { id: 'anime', label: '🎌 Anime', suffix: 'anime style, vibrant, studio ghibli inspired' },
  { id: 'oil-painting', label: '🖼️ Oil Painting', suffix: 'oil painting, classical art, museum quality' },
  { id: 'logo', label: '🎨 Illustration', suffix: 'digital illustration, vibrant colors, detailed artwork, professional design, sharp edges, concept art' },
  { id: 'cinematic', label: '🎬 Cinematic', suffix: 'cinematic, dramatic lighting, movie still' },
  { id: 'afrofuturism', label: '🌍 Afrofuturism', suffix: 'afrofuturism art, rich african culture, futuristic technology, vibrant colors, cosmic background, powerful black figures, detailed illustration' },
];

const PRICE_CUSD = '0.05';
const TREASURY_ADDRESS = '0xfD40e6D6cd174AeE645D65dfC9F4A3061d2a78a7' as `0x${string}`;
const CUSD_CONTRACT = '0x765DE816845861e75A25fCA122bb6898B8B1282a' as `0x${string}`;

const CUSD_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'pay' | 'result'>('input');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) return;

    if (ethereum.isMiniPay) {
      setIsMiniPay(true);
      connectWallet();
    } else {
      // Auto-connect if already authorized
      ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
        if (accounts?.[0]) setWalletAddress(accounts[0]);
      });

      // Listen for account changes
      ethereum.on('accountsChanged', (accounts: string[]) => {
        setWalletAddress(accounts?.[0] || null);
      });
    }
  }, []);

  const connectWallet = async () => {
    try {
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        setError('No wallet found. Please install MetaMask.');
        return;
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts?.[0]) setWalletAddress(accounts[0]);
    } catch (err: any) {
      if (err?.code === 4001) setError('Connection rejected. Please approve in your wallet.');
      else if (err?.code === -32002) setError('Request pending. Please open your wallet to approve.');
      else setError(err?.message || 'Failed to connect wallet');
    }
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setStep('pay');
  };

  const handlePayAndGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      let paymentTxHash = 'simulated_' + Date.now();

      if (walletAddress && (window as any).ethereum) {
        const walletClient = createWalletClient({
          chain: celo,
          transport: custom((window as any).ethereum),
        });
        const publicClient = createPublicClient({ chain: celo, transport: http() });

        const hash = await walletClient.writeContract({
          address: CUSD_CONTRACT,
          abi: CUSD_ABI,
          functionName: 'transfer',
          args: [TREASURY_ADDRESS, parseEther(PRICE_CUSD)],
          account: walletAddress as `0x${string}`,
        });

        await publicClient.waitForTransactionReceipt({ hash });
        paymentTxHash = hash;
        setTxHash(hash);
      }

      const fullPrompt = `${prompt}, ${selectedStyle.suffix}`;
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt, txHash: paymentTxHash }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      setImageUrl(data.imageUrl);
      setStep('result');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveImage = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'flashart-image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setPrompt('');
    setImageUrl(null);
    setError(null);
    setTxHash(null);
    setStep('input');
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#ff6b2b] opacity-[0.07] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#7c3aed] opacity-[0.08] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/50 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b2b] animate-pulse inline-block" />
            {isMiniPay ? '🟢 MiniPay Connected' : 'Powered by Celo'} · Pay {PRICE_CUSD} cUSD per image
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-3">
            Flash<span className="text-[#ff6b2b]">Art</span>
          </h1>
          <p className="text-white/40 text-base">
            AI image generation. No subscription. Just pay per image.
          </p>

          {walletAddress ? (
            <div className="mt-4 inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-xs text-green-400">
              ✓ {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
          ) : (
            <div className="mt-4 space-y-2">
              <button
                onClick={connectWallet}
                className="inline-flex items-center gap-2 bg-[#ff6b2b] hover:bg-[#ff8c50] text-white font-bold py-2.5 px-6 rounded-xl transition-all text-sm"
              >
                Connect Wallet
              </button>
              {error && (
                <p className="text-red-400/80 text-xs text-center">{error}</p>
              )}
              <p className="text-white/30 text-xs text-center">
                📱 On mobile? Open in <a href="https://minipay.opera.com" className="text-[#ff6b2b]">MiniPay</a> for best experience
              </p>
            </div>
          )}
        </div>

        {step === 'input' && (
          <div className="space-y-6">
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

            <div>
              <label className="block text-xs text-white/40 uppercase tracking-widest mb-3">
                Choose style
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all text-left ${selectedStyle.id === style.id
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
              className="w-full bg-[#ff6b2b] hover:bg-[#ff8c50] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all text-base"
            >
              Generate Image →
            </button>
          </div>
        )}

        {step === 'pay' && (
          <div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center space-y-6">
              <div className="text-5xl">⚡</div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Confirm Payment</h2>
                <p className="text-white/40 text-sm">
                  {walletAddress ? 'Real cUSD payment on Celo' : 'Demo mode — connect wallet for real payment'}
                </p>
              </div>

              <div className="bg-black/30 rounded-2xl p-4 text-left space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Prompt</span>
                  <span className="text-white/80 text-right max-w-[60%] truncate">{prompt}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Style</span>
                  <span className="text-white/80">{selectedStyle.label}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Payment</span>
                  <span className="text-white/80">{walletAddress ? 'cUSD on Celo' : 'Demo mode'}</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-[#ff6b2b]">{PRICE_CUSD} cUSD</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePayAndGenerate}
                  disabled={loading}
                  className="w-full bg-[#ff6b2b] hover:bg-[#ff8c50] disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                      Processing payment...
                    </span>
                  ) : (
                    `Pay ${PRICE_CUSD} cUSD & Generate`
                  )}
                </button>
                <button
                  onClick={() => setStep('input')}
                  className="w-full text-white/30 hover:text-white/60 text-sm py-2 transition-colors"
                >
                  ← Go back
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'result' && imageUrl && (
          <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden border border-white/10">
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

            {txHash && !txHash.startsWith('simulated') && (
              <a
                href={`https://celoscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-xs text-green-400 bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-2"
              >
                ✓ Payment confirmed onchain · View on Celoscan ↗
              </a>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSaveImage}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-2xl text-center transition-all text-sm"
              >
                ⬇ Save Image
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-[#ff6b2b] hover:bg-[#ff8c50] text-white font-semibold py-3 rounded-2xl transition-all text-sm"
              >
                ✨ Generate Another
              </button>
            </div>
          </div>
        )}

        <p className="text-center text-white/20 text-xs mt-12">
          FlashArt · Built on Celo · Proof of Ship 2025
        </p>
      </div>
    </main>
  );
}