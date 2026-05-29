import React from 'react';
import Image from 'next/image';

export default function PreviewDeck() {
  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center py-6">
      {/* Sharp Rectangle Cards Deck */}
      <div className="relative w-full max-w-lg grid grid-cols-3 gap-4 items-center px-2">
        {/* Card 1 */}
        <div className="relative aspect-[3/4] overflow-hidden opacity-60 hover:opacity-100 hover:scale-[1.03] transition-premium cursor-pointer group">
          <Image
            src="/preview-photo.png"
            alt="Photorealistic preview"
            fill
            sizes="(max-width: 768px) 33vw, 20vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Card 2 (Center Featured) */}
        <div className="relative aspect-[3/4] overflow-hidden scale-[1.06] hover:scale-[1.1] transition-premium z-10 cursor-pointer group">
          <Image
            src="/hero-anime.png"
            alt="Anime Hero character"
            fill
            sizes="(max-width: 768px) 33vw, 25vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Card 3 */}
        <div className="relative aspect-[3/4] overflow-hidden opacity-60 hover:opacity-100 hover:scale-[1.03] transition-premium cursor-pointer group">
          <Image
            src="/preview-afro.png"
            alt="Afrofuturism preview"
            fill
            sizes="(max-width: 768px) 33vw, 20vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
