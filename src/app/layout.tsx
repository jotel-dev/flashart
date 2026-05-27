 import type { Metadata } from 'next';
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'FlashArt – AI Image Generation on Celo',
  description: 'Generate stunning AI images. Pay per image with CELO on Celo. No subscription needed.',
  openGraph: {
    title: 'FlashArt – AI Image Generation on Celo',
    description: 'Generate stunning AI images. Pay per image with CELO on Celo. No subscription needed.',
    url: 'https://flashart.vercel.app',
    siteName: 'FlashArt',
    images: [{ url: 'https://flashart.vercel.app/og-image.png', width: 1200, height: 630 }],
  },
  other: {
    'talentapp:project_verification': 'ae98585517750241b1d6b6fc8d54e68a077c99125fa953ddcb087a9eb3863ca93b7613b63e100000c0bb29b49fdb4a2873b835ef6475d4bd73c3b64dcdcb4853',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plusJakartaSans.variable}`}>
      <body className="antialiased font-sans bg-[#030303] text-white selection:bg-[#ff6b2b]/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}