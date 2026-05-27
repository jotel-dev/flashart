import React from 'react';
import Image from 'next/image';

export default function PreviewDeck() {
  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center py-6">
      {/* Background neon light flare */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,94,0,0.015)_0%,transparent_70%)] pointer-events-none" />

      {/* Floating Cards Deck */}
      <div className="relative w-full max-w-lg grid grid-cols-3 gap-4 items-center px-2">
        {/* Card 1: Photorealistic */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 opacity-50 hover:opacity-100 hover:scale-[1.03] hover:rotate-[-2deg] transition-all duration-500 shadow-2xl hover:shadow-[#06b6d4]/10 cursor-pointer group">
          <Image
            src="/preview-photo.png"
            alt="Photorealistic preview"
            fill
            sizes="(max-width: 768px) 33vw, 20vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303]/90 via-transparent to-transparent flex items-end p-4">
            <span className="font-space text-[8px] text-white/40 font-bold uppercase tracking-widest">
              Photo
            </span>
          </div>
        </div>

        {/* Card 2: Stylized Anime (Center Featured) */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-cyber-orange/30 shadow-[0_0_40px_rgba(255,94,0,0.12)] scale-[1.06] hover:scale-[1.1] hover:rotate-[1deg] transition-all duration-500 z-10 cursor-pointer group">
          <Image
            src="/hero-anime.png"
            alt="Anime Hero character"
            fill
            sizes="(max-width: 768px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303]/95 via-transparent to-transparent flex flex-col justify-end p-4">
            <span className="text-[8px] bg-cyber-orange/15 text-cyber-orange border border-cyber-orange/20 px-2 py-0.5 rounded self-start mb-2 font-mono font-bold uppercase tracking-wider">
              FEATURED ART
            </span>
            <span className="font-space text-xs text-white font-extrabold tracking-wider uppercase">
              Anime Style
            </span>
          </div>
        </div>

        {/* Card 3: Afrofuturism */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/5 opacity-50 hover:opacity-100 hover:scale-[1.03] hover:rotate-[2deg] transition-all duration-500 shadow-2xl hover:shadow-[#8b5cf6]/10 cursor-pointer group">
          <Image
            src="/preview-afro.png"
            alt="Afrofuturism preview"
            fill
            sizes="(max-width: 768px) 33vw, 20vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303]/90 via-transparent to-transparent flex items-end p-4">
            <span className="font-space text-[8px] text-white/40 font-bold uppercase tracking-widest">
              Futurism
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
