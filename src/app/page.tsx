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

const PRICE_CELO = '0.001';
const FLASHART_CONTRACT = '0xBa3D984C36c5a34d37897f7d3CD4c6E5BB6CF568' as `0x${string}`;
const FLASHART_ABI = [
  {
    name: 'payForImage',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'prompt', type: 'string' },
    ],
    outputs: [],
  },
] as const;

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[1]); // Anime default
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
      if (accounts?.[0]) {
        setWalletAddress(accounts[0]);
        setError(null);
      }
    } catch (err: any) {
      if (err?.code === 4001) setError('Connection rejected. Please approve in your wallet.');
      else if (err?.code === -32002) setError('Request pending. Please open your wallet to approve.');
      else setError(err?.message || 'Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setError(null);
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
          address: FLASHART_CONTRACT,
          abi: FLASHART_ABI,
          functionName: 'payForImage',
          args: [prompt],
          value: parseEther(PRICE_CELO),
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

  const scrollToSection = (sectionId: string) => {
    if (step !== 'input') {
      setStep('input');
    }
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white relative font-space flex flex-col justify-between">
      {/* Background ambient glows with motion design */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#ff6b2b] opacity-[0.04] blur-[150px] animate-drift-one" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#7c3aed] opacity-[0.05] blur-[150px] animate-drift-two" />
        <div className="absolute top-[40%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[80vw] h-[50vh] rounded-full bg-gradient-to-tr from-[#ff6b2b]/5 to-[#7c3aed]/5 opacity-60 blur-[130px] animate-pulse-slow" />
      </div>

      {/* Header Navigation */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3 select-none">
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_0_15px_rgba(255,107,43,0.15)] relative overflow-hidden group hover:border-[#ff6b2b]/30 transition-all duration-300">
            <svg className="w-5.5 h-5.5 text-white group-hover:text-[#ff6b2b] transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
              {/* Background Swoosh/Wing */}
              <path d="M7.5 11.5c-2.5-3.5-1.5-7.5.5-10-1 4.5 1 7.5 3.5 9-2.5-1-4 1-4 1z" />
              {/* Artist Palette */}
              <path d="M12.5 18c-3 0-5-2-4.5-4 .5-1.5 2-2.5 3.5-2 1.5.5 2 2 1.5 3.5-.5 1-1 1.5-1.5 2.5.5-1 1.5-1.5 2.5-1 1 .5 1.5 2 .5 3-.5 1-2.5 1-4.5 1z" opacity="0.85" />
              {/* Thumb hole */}
              <circle cx="10" cy="15" r="0.6" fill="#ff6b2b" />
              {/* Brush 1 */}
              <path d="M11 15.5l5.5-8.5.5-.8.5.8-5.5 8.5h-1z" fill="#ff6b2b" />
              {/* Brush 2 */}
              <path d="M12.5 16l5.5-8.5.5-.8.5.8-5.5 8.5h-1z" fill="#ff6b2b" />
              {/* Palette Knife */}
              <path d="M14 16.5l4.5-6.5.6-1 .4.2-.2 1.2-4.5 6.5h-.8z" fill="#ff6b2b" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">
            Flash<span className="text-[#ff6b2b]">Art</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-white/50 font-medium">
          <button
            type="button"
            onClick={() => scrollToSection('generator-section')}
            className={`cursor-pointer transition-all pb-1 hover:text-white ${
              step === 'input' ? 'text-white border-b-2 border-[#ff6b2b]' : ''
            }`}
          >
            Generator
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('styles-section')}
            className="hover:text-white transition-colors cursor-pointer pb-1"
          >
            Styles
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('pricing-section')}
            className="hover:text-white transition-colors cursor-pointer pb-1"
          >
            Pricing
          </button>
        </nav>

        <div>
          {walletAddress ? (
            <div className="flex items-center gap-3">
              <button 
                onClick={disconnectWallet}
                className="hidden sm:inline-flex text-xs text-white/40 hover:text-white/80 transition-colors"
              >
                Disconnect
              </button>
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white/90 shadow-[0_0_15px_rgba(255,255,255,0.02)]">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="inline-flex items-center gap-2 bg-[#ff6b2b] hover:bg-[#ff8c50] text-white font-bold py-2 px-5 rounded-xl transition-all duration-300 text-sm shadow-[0_0_20px_rgba(255,107,43,0.2)] hover:shadow-[0_0_25px_rgba(255,107,43,0.35)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6" />
              </svg>
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-6 py-6">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div id="pricing-section" className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/50 mb-6 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b2b] animate-pulse inline-block" />
            {isMiniPay ? '🟢 MiniPay Connected' : 'Celo Network'} · Pay {PRICE_CELO} CELO per image
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] mb-6">
            Create <span className="text-gradient-orange">Stunning Art</span> <br />
            from Text
          </h1>
          <p className="text-white/45 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Turn your ideas into digital artwork. Paid with CELO on Celo. No monthly subscription. Pay only for what you generate.
          </p>
        </div>

        {/* Input Bar */}
        {step === 'input' && (
          <div id="generator-section" className="w-full max-w-2xl mx-auto mb-16">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full p-2 pl-5 focus-within:border-[#ff6b2b]/40 focus-within:shadow-[0_0_30px_rgba(255,107,43,0.12)] transition-all duration-300 backdrop-blur-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-white/30">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.187.904ZM18 7.5l-.375 2.25L15.375 10l2.25.375L18 12.75l.375-2.25L20.625 10l-2.25-.375L18 7.5ZM20.25 3.375l-.188 1.125-1.125.188 1.125.188.188 1.125.188-1.125 1.125-.188-1.125-.188-.188-1.125Z" />
              </svg>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && prompt.trim()) {
                    handleGenerate();
                  }
                }}
                placeholder="A modern anime office workspace, natural light..."
                className="flex-1 bg-transparent border-none text-white placeholder-white/20 text-sm sm:text-base focus:outline-none py-2"
              />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="w-10 h-10 rounded-full bg-[#ff6b2b] hover:bg-[#ff8c50] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 shadow-[0_0_15px_rgba(255,107,43,0.3)] hover:scale-105 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                </svg>
              </button>
            </div>
            {error && (
              <p className="text-red-400/80 text-xs text-center mt-3 bg-red-500/10 border border-red-500/20 rounded-xl py-2 px-4 inline-block mx-auto">{error}</p>
            )}
            {!walletAddress && (
              <p className="text-white/20 text-xs text-center mt-3">
                📱 On mobile? Open in <a href="https://minipay.opera.com" className="text-[#ff6b2b] underline">MiniPay</a> for the best experience
              </p>
            )}
          </div>
        )}

        {/* Styles & Previews Deck */}
        {step === 'input' && (
          <div id="styles-section" className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-4">
            
            {/* Left Overlay style selection */}
            <div className="lg:col-span-4 glass-panel rounded-2xl p-2.5 space-y-1 relative z-10">
              <div className="px-3 py-2 text-[10px] font-bold text-white/30 tracking-widest uppercase mb-1">
                Choose Art Style
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
                {STYLES.map((style) => {
                  const isActive = selectedStyle.id === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => setSelectedStyle(style)}
                      className={`px-4 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all text-left flex items-center justify-between cursor-pointer relative z-20 ${
                        isActive
                          ? 'bg-[#ff6b2b]/10 text-white border border-[#ff6b2b]/30 shadow-[0_0_15px_rgba(255,107,43,0.1)]'
                          : 'text-white/40 border border-transparent hover:text-white/80 hover:bg-white/5'
                      }`}
                    >
                      <span>{style.label}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b2b]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right 3 Preview Cards Deck */}
            <div className="lg:col-span-8 grid grid-cols-3 gap-4 items-center">
              {/* Card 1: Photorealistic */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 opacity-55 hover:opacity-90 hover:scale-[1.02] transition-all duration-500 shadow-xl group">
                <Image
                  src="/preview-photo.png"
                  alt="Photorealistic preview"
                  fill
                  sizes="(max-width: 768px) 33vw, 20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[10px] sm:text-xs text-white/50 font-bold uppercase tracking-wider">Photorealistic</span>
                </div>
              </div>

              {/* Card 2: Anime Hero Image (Featured Center) */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#ff6b2b]/30 shadow-[0_0_35px_rgba(255,107,43,0.18)] scale-[1.06] hover:scale-[1.09] transition-all duration-500 z-10 group">
                <Image
                  src="/hero-anime.png"
                  alt="Anime Hero character"
                  fill
                  sizes="(max-width: 768px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent flex flex-col justify-end p-4">
                  <span className="text-[9px] bg-[#ff6b2b]/20 text-[#ff8c50] border border-[#ff6b2b]/30 px-2 py-0.5 rounded-md self-start mb-1.5 font-bold uppercase tracking-wider">Featured Hero</span>
                  <span className="text-xs sm:text-sm text-white font-black tracking-wide uppercase">Stylized Anime</span>
                </div>
              </div>

              {/* Card 3: Afrofuturism */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 opacity-55 hover:opacity-90 hover:scale-[1.02] transition-all duration-500 shadow-xl group">
                <Image
                  src="/preview-afro.png"
                  alt="Afrofuturism preview"
                  fill
                  sizes="(max-width: 768px) 33vw, 20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[10px] sm:text-xs text-white/50 font-bold uppercase tracking-wider">Afrofuturism</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Step: Confirm Payment */}
        {step === 'pay' && (
          <div className="w-full max-w-md mx-auto my-8 relative z-10">
            <div className="glass-panel rounded-3xl p-8 text-center space-y-6 relative overflow-hidden shadow-[0_0_50px_rgba(255,107,43,0.12)]">
              {/* Orange top accent bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#ff6b2b] to-[#7c3aed]" />

              <div className="w-16 h-16 rounded-full bg-[#ff6b2b]/10 border border-[#ff6b2b]/20 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,107,43,0.15)] animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-[#ff6b2b]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>

              <div>
                <h2 className="text-2xl font-extrabold mb-1">Confirm Payment</h2>
                <p className="text-white/40 text-sm">
                  {walletAddress ? 'Secure transaction on Celo Network' : 'Demo Mode — Connect wallet for real transaction'}
                </p>
              </div>

              <div className="bg-black/35 rounded-2xl p-5 text-left space-y-3.5 border border-white/5 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/45">Prompt</span>
                  <span className="text-white/85 text-right max-w-[60%] truncate font-medium">{prompt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/45">Style Style</span>
                  <span className="text-white/85 font-medium">{selectedStyle.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/45">Network/Payment</span>
                  <span className="text-white/85 font-medium">{walletAddress ? 'CELO on Celo' : 'Simulation Mode'}</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between items-baseline">
                  <span className="text-white/45 font-semibold">Total Price</span>
                  <span className="text-2xl font-black text-[#ff6b2b]">{PRICE_CELO} CELO</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePayAndGenerate}
                  disabled={loading}
                  className="w-full bg-[#ff6b2b] hover:bg-[#ff8c50] disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(255,107,43,0.2)] hover:shadow-[0_0_25px_rgba(255,107,43,0.3)]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                      Paying & Generating...
                    </span>
                  ) : (
                    `Pay ${PRICE_CELO} CELO & Generate`
                  )}
                </button>
                <button
                  onClick={() => setStep('input')}
                  disabled={loading}
                  className="w-full text-white/30 hover:text-white/60 text-xs py-2 transition-colors font-medium uppercase tracking-wider"
                >
                  ← Modify Prompt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Generation Results */}
        {step === 'result' && imageUrl && (
          <div className="w-full max-w-xl mx-auto my-4 relative z-10 space-y-6">
            <div className="relative rounded-3xl overflow-hidden border border-[#ff6b2b]/20 shadow-[0_0_40px_rgba(255,107,43,0.15)] bg-white/5 backdrop-blur-md">
              <div className="aspect-square relative w-full">
                <Image
                  src={imageUrl}
                  alt={prompt}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="bg-black/40 border-t border-white/5 p-5 backdrop-blur-md">
                <div className="text-[10px] font-bold text-[#ff6b2b] tracking-wider uppercase mb-1">Generated Prompt</div>
                <p className="text-white/80 text-sm font-medium">{prompt}</p>
                <div className="text-[10px] text-white/30 mt-1">Style: {selectedStyle.label}</div>
              </div>
            </div>

            {txHash && !txHash.startsWith('simulated') && (
              <a
                href={`https://celoscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-xs text-green-400 bg-green-400/5 border border-green-500/20 rounded-xl px-4 py-3 hover:bg-green-400/10 transition-all duration-300 font-semibold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Payment Confirmed on Celo · View Explorer ↗
              </a>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleSaveImage}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-4 rounded-2xl text-center transition-all duration-300 text-sm active:scale-95"
              >
                ⬇ Save Image
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-[#ff6b2b] hover:bg-[#ff8c50] text-white font-black py-4 rounded-2xl transition-all duration-300 text-sm shadow-[0_0_20px_rgba(255,107,43,0.2)] active:scale-95"
              >
                ✨ Generate Another
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Footer / Partner Logos */}
      <footer className="relative z-20 w-full border-t border-white/5 py-10 mt-16 bg-[#07070a]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between text-center md:text-left">
          
          {/* Partner row (Vibe-style logos) */}
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-12 gap-y-4 opacity-25 select-none">
            <span className="text-xs font-black tracking-[0.2em] uppercase text-white hover:opacity-100 transition-opacity">Celo</span>
            <span className="text-xs font-black tracking-[0.2em] uppercase text-white hover:opacity-100 transition-opacity">MiniPay</span>
            <span className="text-xs font-black tracking-[0.2em] uppercase text-white hover:opacity-100 transition-opacity">Opera</span>
            <span className="text-xs font-black tracking-[0.2em] uppercase text-white hover:opacity-100 transition-opacity">Valora</span>
          </div>

          <p className="text-white/20 text-xs tracking-wider">
            FlashArt · Proof of Ship 2025 · Built on Celo
          </p>
        </div>
      </footer>
    </main>
  );
}