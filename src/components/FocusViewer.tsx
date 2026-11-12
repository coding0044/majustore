/**
 * NOWHERE® Interactive 3D Focus Mode
 * - FLIP animation into enlarged focus view
 * - Numbered shop dots placed at exact coordinates [left%, top%]
 * - Dashed circular outline, spring scale, italic tooltip with price
 * - Side receipt slip integration
 */

import React, { useEffect, useState } from 'react';
import { directCdn, formatMoney, LookData, ProductItem, px } from '../data/fashionData';
import { ReceiptSlip } from './ReceiptSlip';

interface FocusViewerProps {
  look: LookData;
  initialItemIndex?: number | null;
  onClose: () => void;
  onOpenProductDetail: (product: ProductItem) => void;
}

export const FocusViewer: React.FC<FocusViewerProps> = ({
  look,
  initialItemIndex = null,
  onClose,
  onOpenProductDetail,
}) => {
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(initialItemIndex);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);
  const [showReceiptMobile, setShowReceiptMobile] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Focus view for Look ${look.numberStr} ${look.name}`}
      className="fixed inset-0 z-60 bg-[#ececec]/95 backdrop-blur-xl flex items-center justify-center overflow-hidden animate-fadeIn"
    >
      {/* Top Bar with Look Info & Close button */}
      <div className="absolute top-4 left-4 md:left-8 z-70 flex items-center gap-3">
        <button
          onClick={onClose}
          className="pill-button !min-h-[32px] !py-1 !px-4"
          aria-label="Back to 3D Stage"
        >
          ← Back to Ring
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-wider font-mono">
          <span className="font-bold">LOOK {look.numberStr}</span>
          <span className="text-[#6f6f6f]">/</span>
          <span className="italic font-serif-instrument text-sm lowercase">{look.name}</span>
        </div>
      </div>

      {/* Mobile Receipt Toggle */}
      <div className="md:hidden absolute top-4 right-4 z-70">
        <button
          onClick={() => setShowReceiptMobile(prev => !prev)}
          className="pill-button !min-h-[32px] !py-1 !px-4"
        >
          {showReceiptMobile ? 'View Figure' : 'View Slip'}
        </button>
      </div>

      {/* Center 3D Focus Stage */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:pr-[360px]">
        {/* Subtle ground shadow */}
        <div className="absolute bottom-[8%] w-[280px] md:w-[420px] h-[36px] bg-black/10 rounded-[100%] blur-xl pointer-events-none"></div>

        {/* The Model Figure Container */}
        <div
          className="relative max-h-[82vh] h-[780px] w-auto aspect-[1/2] flex items-end justify-center select-none"
          style={{
            transform: `translateY(${look.footOffset * 100}px)`,
          }}
        >
          <img
            src={px(look.modelFile, 914)}
            onError={(e) => {
              // Direct fallback if proxy is blocked
              (e.currentTarget as HTMLImageElement).src = directCdn(look.modelFile);
            }}
            alt={`Look ${look.numberStr} — ${look.name}`}
            className="w-full h-full object-contain object-bottom pointer-events-none drop-shadow-xl"
            loading="eager"
            decoding="sync"
          />

          {/* 3 Numbered Shop Dots at exact coordinates */}
          {look.dots.map((dot, idx) => {
            const product = look.products[idx];
            const isHovered = hoveredDot === idx;
            const isSelected = activeItemIndex === idx;

            return (
              <div
                key={idx}
                style={{
                  left: `${dot.left}%`,
                  top: `${dot.top}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group"
              >
                {/* Numbered shopping dot button */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveItemIndex(idx);
                    if (window.innerWidth < 768) {
                      setShowReceiptMobile(true);
                    }
                  }}
                  onMouseEnter={() => setHoveredDot(idx)}
                  onMouseLeave={() => setHoveredDot(null)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono font-bold transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-black text-white scale-125 border border-black ring-4 ring-black/20'
                      : isHovered
                      ? 'bg-black text-white scale-120 border border-black shadow-md'
                      : 'bg-white/90 text-black border border-dashed border-black hover:border-solid hover:bg-black hover:text-white backdrop-blur-xs'
                  }`}
                  aria-label={`Product 0${idx + 1}: ${product?.name} (${formatMoney(product?.price)})`}
                >
                  0{idx + 1}
                </button>

                {/* Tooltip on hover or when selected */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 pointer-events-none transition-all duration-200 z-40 whitespace-nowrap ${
                    isHovered || isSelected
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-1 scale-95'
                  }`}
                >
                  <div className="bg-black text-white px-3 py-1.5 rounded-md shadow-xl text-left border border-white/20">
                    <div className="text-[9px] uppercase tracking-wider text-neutral-400">
                      0{idx + 1} · {product?.category}
                    </div>
                    <div className="text-xs italic font-serif-instrument text-neutral-100">
                      {product?.name}
                    </div>
                    <div className="text-[11px] font-mono tabular-nums text-white font-medium mt-0.5">
                      {formatMoney(product?.price)}
                    </div>
                  </div>
                  {/* Tooltip triangle */}
                  <div className="w-2 h-2 bg-black rotate-45 mx-auto -mt-1 border-r border-b border-white/20"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ambient bottom instructions */}
        <div className="absolute bottom-4 left-6 hidden md:block text-[11px] uppercase tracking-wider text-[#6f6f6f] font-mono">
          Click numbered dots to inspect pieces · ESC to exit
        </div>
      </div>

      {/* Desktop Receipt Slip (always rendered) / Mobile (toggleable) */}
      <div className={`${showReceiptMobile ? 'block' : 'hidden md:block'}`}>
        <ReceiptSlip
          look={look}
          activeItemIndex={activeItemIndex}
          onSelectItem={(idx) => setActiveItemIndex(idx)}
          onOpenProductDetail={onOpenProductDetail}
          onClose={() => {
            if (showReceiptMobile && window.innerWidth < 768) {
              setShowReceiptMobile(false);
            } else {
              onClose();
            }
          }}
        />
      </div>
    </div>
  );
};
