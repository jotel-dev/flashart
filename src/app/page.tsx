'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createWalletClient, custom, parseEther, createPublicClient, http } from 'viem';
import { celo } from 'viem/chains';

import NeonGlow from '../components/ui/NeonGlow';
import { BentoGrid, BentoCard } from '../components/ui/Bento';
import ConnectWallet from '../components/ui/ConnectWallet';
import StyleSelector, { StyleType } from '../components/ui/StyleSelector';
import PromptInput from '../components/ui/PromptInput';
import PreviewDeck from '../components/ui/PreviewDeck';
import PaymentPanel from '../components/ui/PaymentPanel';
import ResultPanel from '../components/ui/ResultPanel';
import { useScrollProgress, useScrollAnimation, useParallax } from '../hooks/useScrollAnimation';

const STYLES: StyleType[] = [
  { id: 'photorealistic', label: '📸 Photorealistic', suffix: 'photorealistic, 8k, ultra detailed' },
  { id: 'anime', label: '🎌 Anime', suffix: 'anime style, vibrant, studio ghibli inspired' },
  { id: 'oil-painting', label: '🖼️ Oil Painting', suffix: 'oil painting, classical art, museum quality' },
  { id: 'logo', label: '🎨 Illustration', suffix: 'digital illustration, vibrant colors, detailed artwork, professional design, sharp edges, concept art' },
  { id: 'cinematic', label: '🎬 Cinematic', suffix: 'cinematic, dramatic lighting, movie still' },
  { id: 'afrofuturism', label: '🌍 Afrofuturism', suffix: 'afrofuturism art, rich african culture, futuristic technology, vibrant colors, cosmic background, powerful black figures, detailed illustration' },
];

const PRICE_CELO = '0.001';
const HERO_IMAGES = [
  { src: '/preview-photo.png', alt: 'Generated landscape artwork preview' },
  { src: '/hero-anime.png', alt: 'Generated character artwork preview' },
  { src: '/preview-afro.png', alt: 'Generated portrait artwork preview' },
];
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
  const [selectedStyle, setSelectedStyle] = useState<StyleType>(STYLES[1]); // Anime default
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'pay' | 'result'>('input');
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isMiniPay, setIsMiniPay] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [agentTxHash, setAgentTxHash] = useState<string | null>(null);

  const scrollProgress = useScrollProgress();
  const [heroRef, heroVisible] = useScrollAnimation();
  const [bentoRef, bentoVisible] = useScrollAnimation();
  const parallaxHero = useParallax(0.15);

useEffect(() => {
     // Wallet setup
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

        // Switch to Celo chain if user is on a different network
        try {
          await walletClient.switchChain({ id: celo.id });
        } catch (switchError: any) {
          if (switchError.code === 4902 || switchError.message?.includes('Unrecognized chain') || switchError.message?.includes('4902')) {
            try {
              await walletClient.addChain({ chain: celo });
            } catch (addError) {
              throw new Error('Failed to add Celo network to wallet.');
            }
          } else {
            throw new Error('Failed to switch network. Please switch to Celo manually in your wallet.');
          }
        }

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
        body: JSON.stringify({ 
          prompt: fullPrompt, 
          txHash: paymentTxHash,
          userAddress: walletAddress
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');

      setImageUrl(data.imageUrl);
      setAgentTxHash(data.agentTxHash);
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
    setAgentTxHash(null);
    setStep('input');
  };

return (
    <main className="min-h-screen text-text-primary relative flex flex-col justify-between overflow-hidden bg-background">
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress / 100})` }} />

      {/* Premium ambient glows */}
      <NeonGlow />

      <div className="relative z-10 w-full flex-1 flex flex-col justify-between gap-8 md:gap-10">
        {/* Navigation Bar */}
        <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between w-full px-3 py-2 sm:px-6 sm:py-3 md:px-8 backdrop-blur-[12px] bg-[rgba(10,10,10,0.85)] border-b border-[#1E1E24] glass-panel">
          <div className="flex items-center gap-2 sm:gap-3 select-none">
            <div
              className="relative h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-text-primary transition-premium hover:scale-[1.02]"
              aria-label="FlashArt logo"
            >
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" className="h-full w-full">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C6AF5" />
                    <stop offset="50%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#F4722B" />
                  </linearGradient>
                  <linearGradient id="flashGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F4722B" />
                    <stop offset="100%" stopColor="#FFCF3D" />
                  </linearGradient>
                </defs>
                <rect x="10" y="10" width="80" height="80" rx="16" stroke="url(#logoGradient)" strokeWidth="2.5" fill="none" />
                <path d="M35 25 L55 25 L45 45 L60 45 L40 75 L45 55 L30 55 Z" stroke="url(#flashGradient)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="70" cy="70" r="8" stroke="url(#logoGradient)" strokeWidth="2" fill="none" />
                <circle cx="70" cy="70" r="3" fill="url(#logoGradient)" />
                <path d="M25 75 L30 70 M25 70 L30 75" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
                <path d="M75 25 L80 20 M75 20 L80 25" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="font-space text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">
              <span className="text-gradient-violet">Flash</span><span className="text-gradient-orange">Art</span>
            </h1>
          </div>

<div className="flex items-center gap-2 sm:gap-3">
              <ConnectWallet
                walletAddress={walletAddress}
                connectWallet={connectWallet}
                disconnectWallet={disconnectWallet}
              />
            </div>
          </header>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex-1 flex flex-col justify-between gap-8 md:gap-10 pt-20">
        {/* Hero Headline Section */}
        <section ref={heroRef} className={`grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px] gap-10 lg:gap-14 items-center pt-20 pb-16 scroll-reveal ${heroVisible ? 'visible' : ''}`}>
          <div className="max-w-2xl space-y-4">
            <div className="relative px-4 py-3 text-xs font-medium tracking-wide text-left bg-card-bg border border-card-border text-text-muted cursor-pointer glow-hover transition-premium">
              <div className="flex items-center justify-between w-full">
                <span className="font-sans font-medium">
                  {isMiniPay ? 'MiniPay Connected' : 'Celo Network Integration'}
                </span>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DB97C] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#1DB97C]"></span>
                </span>
              </div>
            </div>
            <h1 className="font-space text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.15] text-text-primary">
              <span className="text-gradient-violet">Generate</span> <span className="text-gradient-orange">Stunning AI Art</span> <br />
              <span className="text-gradient-violet">from Pure Text</span>
            </h1>
            <p className="text-text-muted text-[15px] leading-[1.7] max-w-lg font-medium">
              Transform your concepts into digital outputs. Secured and paid instantly using CELO on the Celo network. No recurring monthly subscriptions. Pay only for what you build.
            </p>
          </div>

          <div className="relative hidden min-h-[420px] lg:block" style={{ transform: `translateY(${parallaxHero}px)` }}>
            {HERO_IMAGES.map((image, index) => (
              <div
                key={image.src}
                className="hero-art-card absolute rounded-none overflow-hidden transition-premium glow-hover"
                style={{ animationDelay: `${index * 2.2}s` }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="440px"
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Bento Grid Application Workspace */}
        <section ref={bentoRef} className={`w-full flex-1 flex items-center justify-center scroll-reveal ${bentoVisible ? 'visible' : ''}`}>
          <BentoGrid className="items-stretch">
            {/* Dynamic Console Card */}
            <BentoCard
              glow={step === 'pay' ? 'orange' : step === 'result' ? 'cyan' : 'none'}
              title={step === 'input' ? 'Design Console' : step === 'pay' ? 'Billing Hub' : 'Artwork View'}
              subtitle={step === 'input' ? 'WORKSPACE V1.0' : step === 'pay' ? 'ON-CHAIN AUTH' : 'SCAN COMPLETED'}
              colSpan="md:col-span-8"
              headerRight={
                <span className="text-[11px] bg-[#1E1A35] text-cyber-purple border border-[#7C6AF540] px-2 py-0.5 rounded-md font-mono font-semibold">
                  STEP {step === 'input' ? '01' : step === 'pay' ? '02' : '03'} / 03
                </span>
              }
            >
              {step === 'input' && (
                <div className="space-y-6 py-2">
                  <StyleSelector
                    styles={STYLES}
                    selectedStyle={selectedStyle}
                    onStyleChange={setSelectedStyle}
                  />
                  <PromptInput
                    prompt={prompt}
                    setPrompt={setPrompt}
                    onSubmit={handleGenerate}
                    error={error}
                    walletAddress={walletAddress}
                  />
                </div>
              )}

              {step === 'pay' && (
                <PaymentPanel
                  prompt={prompt}
                  selectedStyle={selectedStyle}
                  walletAddress={walletAddress}
                  priceCelo={PRICE_CELO}
                  loading={loading}
                  onPay={handlePayAndGenerate}
                  onCancel={() => setStep('input')}
                />
              )}

              {step === 'result' && imageUrl && (
                <ResultPanel
                  imageUrl={imageUrl}
                  prompt={prompt}
                  selectedStyle={selectedStyle}
                  txHash={txHash}
                  agentTxHash={agentTxHash}
                  onSave={handleSaveImage}
                  onReset={handleReset}
                />
              )}
            </BentoCard>

            {/* Gallery Preview Deck Card */}
            <BentoCard
              title="Reference Gallery"
              subtitle="STABILITY SDXL SAMPLES"
              colSpan="md:col-span-4"
              className="flex flex-col justify-center min-h-[300px] md:min-h-0"
            >
              <PreviewDeck />
            </BentoCard>

            {/* Pricing Specifications Card */}
            <BentoCard
              title="Pricing Specifications"
              subtitle="PAY-PER-GENERATION"
              colSpan="md:col-span-4"
              glow="orange"
            >
          <div className="py-2 space-y-4 text-center md:text-left">
                <div className="space-y-1">
                  <div className="font-mono text-4xl font-semibold text-cyber-orange tracking-tight">
                    {PRICE_CELO} <span className="text-sm text-text-secondary font-sans font-semibold">CELO</span>
                  </div>
                  <div className="text-[11px] text-text-muted tracking-[0.08em] font-medium">
                    ≈ $0.001 USD PER CALL (NO GAS MARKUP)
                  </div>
                </div>

                <div className="h-px bg-card-border w-full" />

                <ul className="text-left space-y-2.5 text-xs text-text-muted font-medium max-w-[220px] mx-auto md:mx-0">
                  <li className="flex items-center gap-2">
                    <span className="text-cyber-orange">✓</span> Parallel GPU generation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyber-orange">✓</span> Full SDXL high-res outputs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyber-orange">✓</span> Direct wallet-to-contract billing
                  </li>
                </ul>
              </div>
            </BentoCard>

            {/* Smart Contract Specs Card */}
            <BentoCard
              title="Node System Ledger"
              subtitle="ON-CHAIN ATTRIBUTES"
              colSpan="md:col-span-8"
              className="flex flex-col justify-between"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-3">
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-cyber-purple uppercase tracking-[0.08em]">
                    Ledger Address
                  </div>
                  <div className="font-mono text-xs text-text-secondary font-semibold select-all bg-card-bg-hover border border-card-border rounded-xl p-3 flex items-center justify-between transition-premium hover:border-cyber-purple">
                    <span className="truncate max-w-[85%]">{FLASHART_CONTRACT}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-text-dim hover:text-text-primary transition-colors cursor-pointer">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-3a1.125 1.125 0 0 0-1.125 1.125v1.25m9 0.664a2.25 2.25 0 0 1-2.25 2.25h-1.5m2.25-2.25V6.75A2.25 2.25 0 0 1 18 9v.75m-6.75-6h2.25m-9 13.5h.008v.008H3.75v-.008Zm0-3h.008v.008H3.75v-.008Zm0-3h.008v.008H3.75v-.008Z" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-cyber-purple uppercase tracking-[0.08em]">
                    Smart Contract Interface
                  </div>
                  <div className="font-mono text-xs text-text-secondary font-semibold bg-card-bg-hover border border-card-border rounded-xl p-3 flex items-center justify-between transition-premium hover:border-cyber-purple">
                    <span>payForImage(string prompt)</span>
                    <span className="text-[10px] bg-[#1E1A35] text-cyber-purple border border-[#7C6AF540] px-1.5 py-0.5 rounded-md font-mono font-semibold uppercase">
                      payable
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-card-border my-2 w-full" />

              <div className="flex flex-wrap gap-x-6 gap-y-2 items-center opacity-70 select-none text-[11px] font-semibold tracking-[0.08em] uppercase text-text-muted">
                <span>Celo Ecosystem</span>
                <span>•</span>
                <span>MiniPay Verified</span>
                <span>•</span>
                <span>Opera Browser Ready</span>
                <span>•</span>
                <span>Valora Compliant</span>
              </div>
            </BentoCard>
          </BentoGrid>
        </section>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-card-border pt-6 pb-8 text-[11px] text-text-muted font-semibold tracking-[0.08em] uppercase animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div>
            Built on Celo Network · Proof of Ship 2025
          </div>
          <div>
            FlashArt © 2026
          </div>
        </footer>
        </div>
      </div>
    </main>
  );
}
