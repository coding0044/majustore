/**
 * MAJU STORE® Responsive Header & Luxury Side Navigation Drawer
 * - Universal luxury header with live clock, signal, logo, nav links, search, battery, and bag tally
 * - Ultra-premium Left Side Navigation Drawer with smooth slide-in, backdrop blur, editorial typography,
 *   full directory, category shortcuts, lookbook trigger, search, bag status, founders credit, and PKR currency.
 */

import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatMoney } from '../data/fashionData';

interface HeaderNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSearch: () => void;
  onOpenLooksDrawer?: () => void;
}

export const StatusBar: React.FC<HeaderNavProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  onOpenLooksDrawer,
}) => {
  const { totalItemCount, finalTotal, setIsBagOpen } = useCart();
  const [clockText, setClockText] = useState('06:00');
  const [countAnimated, setCountAnimated] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  // Time handling: Start with 06:00, then switch to live local time and tick on minute boundaries
  useEffect(() => {
    const updateTimeToLive = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setClockText(`${hours}:${minutes}`);
    };

    const initialTimer = setTimeout(() => {
      updateTimeToLive();
      const now = new Date();
      const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

      const minuteTimer = setTimeout(() => {
        updateTimeToLive();
        const interval = setInterval(updateTimeToLive, 60000);
        return () => clearInterval(interval);
      }, Math.max(100, msUntilNextMinute));

      return () => clearTimeout(minuteTimer);
    }, 1200);

    return () => clearTimeout(initialTimer);
  }, []);

  // Trigger bounce animation when bag count changes
  useEffect(() => {
    if (totalItemCount > 0) {
      setCountAnimated(true);
      const timer = setTimeout(() => setCountAnimated(false), 350);
      return () => clearTimeout(timer);
    }
  }, [totalItemCount]);

  // Lock body scroll when side drawer is open
  useEffect(() => {
    if (isSideMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSideMenuOpen]);

  // Close side menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSideMenuOpen) {
        setIsSideMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSideMenuOpen]);

  const handleLinkClick = (view: string) => {
    onNavigate(view);
    setIsSideMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', view: 'home', code: '01' },
    { label: 'Shop All', view: 'shop', code: '02' },
    { label: 'Collections', view: 'collections', code: '03' },
    { label: 'About Us', view: 'about', code: '04' },
  ];

  return (
    <>
      {/* Universal Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[54px] md:h-[50px] px-3.5 sm:px-6 md:px-8 flex items-center justify-between bg-[#ececec]/90 backdrop-blur-md border-b border-black/10 select-none transition-all">
        {/* Left Section: Menu Toggle (Mobile & Desktop) + Clock & Desktop Nav */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Side Drawer Toggle Button */}
          <button
            onClick={() => setIsSideMenuOpen(true)}
            className="group flex items-center gap-2 px-2.5 py-1.5 rounded-full hover:bg-black/5 active:scale-95 transition-all text-black cursor-pointer border border-dashed border-black/20 hover:border-black"
            aria-label="Open Side Navigation Menu"
            aria-expanded={isSideMenuOpen}
          >
            <div className="flex flex-col justify-center gap-[4px] w-4 h-3">
              <span className="w-4 h-[1.5px] bg-black block transition-all group-hover:w-3" />
              <span className="w-2.5 h-[1.5px] bg-black block transition-all group-hover:w-4" />
              <span className="w-3.5 h-[1.5px] bg-black block transition-all" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest font-semibold hidden xs:inline">
              Menu
            </span>
          </button>

          {/* Desktop Live Clock & Low Signal */}
          <div className="hidden lg:flex items-center gap-2 text-xs border-l border-black/15 pl-4">
            <span className="font-mono tabular-nums text-black font-medium">{clockText}</span>

            {/* 4 Signal Bars */}
            <div className="flex items-end gap-[2px] h-[12px] opacity-25" title="Studio Signal">
              <span className="w-[2.5px] h-[4px] bg-black rounded-xs"></span>
              <span className="w-[2.5px] h-[6px] bg-black rounded-xs"></span>
              <span className="w-[2.5px] h-[9px] bg-black rounded-xs"></span>
              <span className="w-[2.5px] h-[12px] bg-black rounded-xs"></span>
            </div>

            <span className="text-[10px] text-[#6f6f6f] uppercase font-mono tracking-widest ml-1">
              Live
            </span>
          </div>

          {/* Desktop Direct Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 ml-1 lg:ml-2 pl-3 lg:pl-4 border-l border-black/15 text-[11px] uppercase tracking-wider font-normal">
            {navLinks.map((link) => {
              const isActive = currentView === link.view;
              return (
                <button
                  key={link.view}
                  onClick={() => onNavigate(link.view)}
                  className={`relative py-1 transition-colors hover:text-black cursor-pointer ${
                    isActive ? 'text-black font-semibold' : 'text-[#6f6f6f]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Center Section: MAJU STORE® Wordmark */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <button
            onClick={() => onNavigate('home')}
            className="text-base sm:text-lg md:text-xl font-black tracking-tight text-black hover:opacity-75 transition-opacity uppercase font-sans-tight flex items-center cursor-pointer"
            aria-label="MAJU STORE Home"
          >
            MAJU STORE<span className="text-[10px] align-top ml-[2px]">®</span>
          </button>
        </div>

        {/* Right Section: Search, Battery & Bag */}
        <div className="flex items-center gap-2 sm:gap-3.5 text-xs">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="text-[11px] uppercase text-[#6f6f6f] hover:text-black tracking-wider transition-colors px-1.5 py-1 rounded-md hover:bg-black/5 flex items-center gap-1.5 cursor-pointer"
            aria-label="Search Collection"
          >
            <span className="text-xs">🔍</span>
            <span className="hidden sm:inline font-mono">Search</span>
          </button>

          {/* Desktop Battery indicator: 12% */}
          <div className="hidden xl:flex items-center gap-1.5 opacity-60 text-[11px] font-mono tabular-nums">
            <span className="text-[#6f6f6f]">12%</span>
            <div className="w-[16px] h-[9px] border border-black/80 rounded-[2px] p-[1px] flex items-center relative">
              <div className="h-full w-[20%] bg-black rounded-[1px]"></div>
              <div className="w-[1.5px] h-[4px] bg-black/80 absolute -right-[2.5px] rounded-r-[1px]"></div>
            </div>
          </div>

          {/* Bag button with animated count tally */}
          <button
            onClick={() => setIsBagOpen(true)}
            className="pill-button !min-h-[32px] !py-1 !px-3 sm:!px-4 !text-[10px] sm:!text-[11px] group cursor-pointer active:scale-95 transition-transform"
            aria-label={`Shopping Bag containing ${totalItemCount} items`}
          >
            <span className="mr-1">Bag</span>
            <span
              className={`inline-block font-mono tabular-nums transition-transform duration-200 ${
                countAnimated ? '-translate-y-1 scale-125 font-bold' : ''
              }`}
            >
              ({totalItemCount})
            </span>
          </button>
        </div>
      </header>

      {/* Luxury Left Side Navigation Drawer */}
      {isSideMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="MAJU STORE Side Navigation Drawer"
          className="fixed inset-0 z-90 flex select-none"
        >
          {/* Dimmed Glassmorphism Backdrop */}
          <div
            onClick={() => setIsSideMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
            aria-hidden="true"
          />

          {/* Side Drawer Content Panel */}
          <div className="relative w-[88vw] sm:w-[380px] max-w-[420px] h-full bg-white border-r border-black/20 shadow-2xl flex flex-col justify-between z-10 animate-slide-left text-black overflow-y-auto">
            {/* 1. Drawer Header */}
            <div className="p-5 sm:p-6 border-b border-black flex items-start justify-between bg-neutral-50/70">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#6f6f6f]">
                    VOL. 01 ARCHIVE · 2026
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight font-sans-tight mt-1">
                  MAJU STORE<span className="text-xs align-top ml-1">®</span>
                </h2>
                <p className="text-xs italic font-serif-instrument text-neutral-700 mt-0.5">
                  Stay out of the loop.
                </p>
              </div>

              <button
                onClick={() => setIsSideMenuOpen(false)}
                className="w-8 h-8 rounded-full border border-dashed border-black/40 flex items-center justify-center text-xs hover:bg-black hover:text-white transition-colors cursor-pointer"
                aria-label="Close Side Navigation"
              >
                ✕
              </button>
            </div>

            {/* 2. Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Primary Navigation Links */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#6f6f6f] mb-3">
                  01 / PRIMARY DESTINATIONS
                </div>

                <nav className="space-y-1.5 font-sans-tight font-bold uppercase tracking-tight text-lg sm:text-xl">
                  {navLinks.map((link) => {
                    const isActive = currentView === link.view;
                    return (
                      <button
                        key={link.view}
                        onClick={() => handleLinkClick(link.view)}
                        className={`w-full text-left flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-black text-white border-black shadow-sm'
                            : 'bg-white hover:bg-neutral-50 border-transparent hover:border-black/15 text-black'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className={`text-xs font-mono ${isActive ? 'text-neutral-400' : 'text-[#6f6f6f]'}`}>
                            {link.code}
                          </span>
                          <span>{link.label}</span>
                        </span>
                        {isActive && (
                          <span className="text-[9px] font-mono uppercase bg-neutral-800 text-neutral-200 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}

                  {/* Looks Directory Trigger */}
                  {onOpenLooksDrawer && (
                    <button
                      onClick={() => {
                        setIsSideMenuOpen(false);
                        onOpenLooksDrawer();
                      }}
                      className="w-full text-left flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-neutral-50 border border-dashed border-black/20 hover:border-black transition-all cursor-pointer text-black"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[#6f6f6f]">05</span>
                        <span>Looks Directory</span>
                      </span>
                      <span className="text-[9px] font-mono uppercase bg-neutral-100 text-black px-2 py-0.5 rounded-full border border-black/15">
                        09 Fits
                      </span>
                    </button>
                  )}
                </nav>
              </div>

              {/* Taxonomy / Categories Quick Filter */}
              <div className="pt-2 border-t border-dashed border-black/15">
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#6f6f6f] mb-3">
                  02 / CURATED CATEGORIES
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono uppercase">
                  {[
                    { label: 'Tops & Knitwear', count: '9 pcs' },
                    { label: 'Outerwear', count: '4 pcs' },
                    { label: 'Bottoms', count: '8 pcs' },
                    { label: 'Footwear & Acc', count: '6 pcs' },
                  ].map((cat) => (
                    <button
                      key={cat.label}
                      onClick={() => handleLinkClick('shop')}
                      className="p-2.5 rounded-lg bg-neutral-50 hover:bg-black hover:text-white border border-black/10 transition-all text-left flex flex-col justify-between cursor-pointer group"
                    >
                      <span className="font-semibold text-[11px] truncate">{cat.label}</span>
                      <span className="text-[9px] text-[#6f6f6f] group-hover:text-neutral-300 mt-1">
                        {cat.count} →
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions (Search & Bag) */}
              <div className="pt-2 border-t border-dashed border-black/15 space-y-2">
                <button
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    onOpenSearch();
                  }}
                  className="w-full pill-button !py-2.5 !text-xs justify-center cursor-pointer"
                >
                  🔍 Search Catalog (27 Pieces)
                </button>

                <button
                  onClick={() => {
                    setIsSideMenuOpen(false);
                    setIsBagOpen(true);
                  }}
                  className="w-full btn-primary !py-2.5 !text-xs justify-center flex items-center gap-2 cursor-pointer"
                >
                  <span>View Shopping Bag</span>
                  <span className="font-mono tabular-nums opacity-80">
                    ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} · {formatMoney(finalTotal)})
                  </span>
                </button>
              </div>
            </div>

            {/* 3. Drawer Footer: Founders & Studio Info */}
            <div className="p-5 border-t border-black bg-neutral-50/80 space-y-2 text-[10px] font-mono text-[#6f6f6f]">
              <div className="flex items-center justify-between text-black font-semibold uppercase">
                <span>MAJU STORE®</span>
                <span>CURRENCY: PKR (₨)</span>
              </div>
              <div className="text-neutral-700">
                Founders: <span className="font-medium text-black">Faraz Ahmed & Kashan Ahmed</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-black/10">
                <span>STUDIO: #ECECEC GREY</span>
                <span>TOKYO · BERLIN · NY</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

