import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'FlashArt – AI Image Generation on Celo',
  description: 'Generate stunning AI images. Pay per image with cUSD on Celo. No subscription needed.',
  other: {
    'talentapp:project_verification': 'ae98585517750241b1d6b6fc8d54e68a077c99125fa953ddcb087a9eb3863ca93b7613b63e100000c0bb29b49fdb4a2873b835ef6475d4bd73c3b64dcdcb4853',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>{children}</body>
    </html>
  );
}