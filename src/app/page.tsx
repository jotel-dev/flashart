 'use client';

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
import ThemeToggle from '../components/ui/ThemeToggle';

const STYLES: StyleType[] = [
  { id: 'photorealistic', label: '📸 Photorealistic', suffix: 'photorealistic, 8k, ultra detailed' },
  { id: 'anime', label: '🎌 Anime', suffix: 'anime style, vibrant, studio ghibli inspired' },
  { id: 'oil-painting', label: '🖼️ Oil Painting', suffix: 'oil painting, classical art, museum quality' },
  { id: 'logo', label: '🎨 Illustration', suffix: 'digital illustration, vibrant colors, detailed artwork, professional design, sharp edges, concept art' },
  { id: 'cinematic', label: '🎬 Cinematic', suffix: 'cinematic, dramatic lighting, movie still' },
  { id: 'afrofuturism', label: '🌍 Afrofuturism', suffix: 'afrofuturism art, rich african culture, futuristic technology, vibrant colors, cosmic background, powerful black figures, detailed illustration' },
];

const PRICE_CELO = '0.01';
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
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Theme setup
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.className = initialTheme;

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

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.className = newTheme;
  };

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
    <main className="min-h-screen text-text-primary relative flex flex-col justify-between p-4 sm:p-6 md:p-8 overflow-hidden bg-background transition-colors duration-500">
      {/* Premium ambient glows */}
      <NeonGlow />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-between gap-8 md:gap-10">
        {/* Navigation Bar */}
        <header className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 sm:gap-3 select-none">
            <div className="w-8 h-8 rounded-lg bg-card-bg border border-card-border flex items-center justify-center shadow-[0_0_15px_rgba(255,94,0,0.15)] relative overflow-hidden transition-premium hover:border-cyber-orange/40 hover:scale-105">
              <svg className="w-4 h-4 text-text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.5 11.5c-2.5-3.5-1.5-7.5.5-10-1 4.5 1 7.5 3.5 9-2.5-1-4 1-4 1z" />
                <path d="M12.5 18c-3 0-5-2-4.5-4 .5-1.5 2-2.5 3.5-2 1.5.5 2 2 1.5 3.5-.5 1-1 1.5-1.5 2.5.5-1 1.5-1.5 2.5-1 1 .5 1.5 2 .5 3-.5 1-2.5 1-4.5 1z" opacity="0.85" />
                <circle cx="10" cy="15" r="0.6" fill="#ff5e00" />
                <path d="M11 15.5l5.5-8.5.5-.8.5.8-5.5 8.5h-1z" fill="#ff5e00" />
                <path d="M12.5 16l5.5-8.5.5-.8.5.8-5.5 8.5h-1z" fill="#ff5e00" />
                <path d="M14 16.5l4.5-6.5.6-1 .4.2-.2 1.2-4.5 6.5h-.8z" fill="#ff5e00" />
              </svg>
            </div>
            <span className="font-space text-base sm:text-lg font-bold tracking-tight text-text-primary">
              FLASH<span className="text-cyber-orange">ART</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <ConnectWallet
              walletAddress={walletAddress}
              connectWallet={connectWallet}
              disconnectWallet={disconnectWallet}
            />
          </div>
        </header>

        {/* Hero Headline Section */}
        <section className="max-w-2xl mt-2 sm:mt-4 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2.5 bg-card-bg border border-card-border rounded-full px-4 py-1.5 text-[9px] text-text-muted font-bold uppercase tracking-wider shadow-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-orange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyber-orange"></span>
            </span>
            {isMiniPay ? '🟢 MiniPay Connected' : 'Celo Network Integration'}
          </div>
          <h1 className="font-space text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] text-text-primary">
            Generate <span className="text-gradient-orange">Stunning AI Art</span> <br />
            from Pure Text
          </h1>
          <p className="text-text-muted text-xs sm:text-sm leading-relaxed max-w-lg font-medium">
            Transform your concepts into digital outputs. Secured and paid instantly using CELO on the Celo network. No recurring monthly subscriptions. Pay only for what you build.
          </p>
        </section>

        {/* Bento Grid Application Workspace */}
        <section className="w-full flex-1 flex items-center justify-center">
          <BentoGrid className="items-stretch">
            {/* Dynamic Console Card */}
            <BentoCard
              glow={step === 'pay' ? 'orange' : step === 'result' ? 'cyan' : 'none'}
              title={step === 'input' ? 'Design Console' : step === 'pay' ? 'Billing Hub' : 'Artwork View'}
              subtitle={step === 'input' ? 'WORKSPACE V1.0' : step === 'pay' ? 'ON-CHAIN AUTH' : 'SCAN COMPLETED'}
              colSpan="md:col-span-8"
              headerRight={
                <span className="text-[9px] bg-card-bg text-text-muted border border-card-border px-2 py-0.5 rounded font-mono font-bold">
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
              <div className="py-6 space-y-4 text-center md:text-left">
                <div className="space-y-1">
                  <div className="font-mono text-4xl font-black text-cyber-orange tracking-tight">
                    {PRICE_CELO} <span className="text-sm text-text-secondary font-sans font-bold">CELO</span>
                  </div>
                  <div className="text-[10px] text-text-dim tracking-wide font-semibold">
                    ≈ $0.001 USD PER CALL (NO GAS MARKUP)
                  </div>
                </div>

                <div className="h-px bg-card-border w-full" />

                <ul className="text-left space-y-2.5 text-xs text-text-muted font-semibold max-w-[220px] mx-auto md:mx-0">
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
                  <div className="text-[10px] font-bold text-text-muted uppercase tracking-wide">
                    Ledger Address
                  </div>
                  <div className="font-mono text-xs text-text-secondary font-bold select-all bg-card-bg border border-card-border rounded-xl p-3 flex items-center justify-between">
                    <span className="truncate max-w-[85%]">{FLASHART_CONTRACT}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-text-dim hover:text-text-primary transition-colors cursor-pointer">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-3a1.125 1.125 0 0 0-1.125 1.125v1.25m9 0.664a2.25 2.25 0 0 1-2.25 2.25h-1.5m2.25-2.25V6.75A2.25 2.25 0 0 1 18 9v.75m-6.75-6h2.25m-9 13.5h.008v.008H3.75v-.008Zm0-3h.008v.008H3.75v-.008Zm0-3h.008v.008H3.75v-.008Z" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-text-muted uppercase tracking-wide">
                    Smart Contract Interface
                  </div>
                  <div className="font-mono text-xs text-text-secondary font-bold bg-card-bg border border-card-border rounded-xl p-3 flex items-center justify-between">
                    <span>payForImage(string prompt)</span>
                    <span className="text-[9px] bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                      payable
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-card-border my-2 w-full" />

              <div className="flex flex-wrap gap-x-6 gap-y-2 items-center opacity-35 select-none text-[9px] font-bold tracking-[0.2em] uppercase text-text-secondary">
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
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-card-border pt-6 text-[10px] text-text-muted font-bold tracking-wider uppercase">
          <div>
            Built on Celo Network · Proof of Ship 2025
          </div>
          <div>
            FlashArt © 2026
          </div>
        </footer>
      </div>
    </main>
  );
}