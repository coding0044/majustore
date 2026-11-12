/**
 * MAJU STORE® First Loading Experience
 * - Cinematic monochrome studio preloader
 * - Minimalist luxury typography with Instrument Serif and Inter Tight
 * - High-speed asset pre-caching for instant 3D lookbook rendering
 * - Fluid progress counter (00% -> 100%) with dashed hairline indicators
 * - Elegant curtain/fade release animation
 */

import React, { useEffect, useState } from 'react';
import { LOOKS, px } from '../data/fashionData';

interface FirstLoaderProps {
  onComplete: () => void;
}

export const FirstLoader: React.FC<FirstLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(0);

  useEffect(() => {
    // Preload key model cut-out images into browser cache
    const preloadUrls = LOOKS.slice(0, 5).map(l => px(l.modelFile, 914));
    let loadedCount = 0;

    preloadUrls.forEach(url => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
        setAssetsLoaded(loadedCount);
      };
      img.onerror = () => {
        loadedCount++;
        setAssetsLoaded(loadedCount);
      };
    });

    // Smooth luxury progress simulation
    const startTime = performance.now();
    const duration = 1800; // 1.8s luxury timing

    const updateTimer = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(pct);

      if (pct < 100) {
        requestAnimationFrame(updateTimer);
      } else {
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            onComplete();
          }, 650);
        }, 200);
      }
    };

    const animFrame = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(animFrame);
  }, [onComplete]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div
      role="status"
      aria-label="Loading MAJU STORE experience"
      className={`fixed inset-0 z-100 flex flex-col justify-between p-6 sm:p-12 bg-[#ececec] select-none transition-all duration-700 ${
        isExiting ? 'opacity-0 -translate-y-4 pointer-events-none scale-102' : 'opacity-100'
      }`}
    >
      {/* Top Header metadata */}
      <div className="flex items-center justify-between text-xs font-mono tracking-widest text-[#6f6f6f] uppercase">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-black animate-ping opacity-60"></span>
          <span>INITIALIZING MONOCHROME STUDIO</span>
        </div>

        <button
          onClick={handleSkip}
          className="text-[10px] text-black hover:underline uppercase tracking-wider cursor-pointer"
        >
          Skip Intro →
        </button>
      </div>

      {/* Center Brand Reveal */}
      <div className="text-center max-w-xl mx-auto space-y-4 my-auto">
        <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#6f6f6f]">
          VOL. 01 ARCHIVE · 2026
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold uppercase tracking-tight text-black font-sans-tight">
          MAJU STORE<span className="text-2xl sm:text-3xl align-top ml-1">®</span>
        </h1>

        <p className="text-2xl sm:text-4xl font-serif-instrument italic text-neutral-800 tracking-normal">
          Stay out of the loop.
        </p>

        <p className="text-xs uppercase font-mono tracking-[0.25em] text-[#6f6f6f] pt-2">
          Nine looks for going quiet
        </p>
      </div>

      {/* Bottom Counter & Minimal Dashed Progress */}
      <div className="w-full max-w-xl mx-auto space-y-4">
        {/* Progress Counter & Percentage */}
        <div className="flex items-baseline justify-between font-mono text-xs text-[#6f6f6f]">
          <span className="uppercase text-[10px] tracking-wider">
            Loading Vol. 01 Assets
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-black">
            {String(progress).padStart(2, '0')}%
          </span>
        </div>

        {/* Minimal Progress Line with Hairline Dash */}
        <div className="relative w-full h-[3px] bg-black/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-black rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-[#6f6f6f] pt-1">
          <span>COLOR: STUDIO #ECECEC</span>
          <span>PARALLAX 3D ENGINE READY</span>
        </div>
      </div>
    </div>
  );
};
