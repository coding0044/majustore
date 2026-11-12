/**
 * NOWHERE® Looks Drawer
 * Displays the complete Vol. 01 look directory (01 to 09)
 * Slides in from the left side with paper aesthetic and quick-navigation actions.
 */

import React, { useEffect } from 'react';
import { formatMoney, getProductImageStyle, LOOKS, LookData, px } from '../data/fashionData';

interface LooksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLook: (look: LookData) => void;
}

export const LooksDrawer: React.FC<LooksDrawerProps> = ({ isOpen, onClose, onSelectLook }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-80 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-[380px] sm:w-[380px] h-full bg-white border-r border-black/20 shadow-2xl flex flex-col z-10 animate-slide-left select-none">
        {/* Header */}
        <div className="p-6 border-b border-black flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#6f6f6f]">
              MAJU STORE® / CATALOGUE
            </div>
            <h2 className="text-xl font-bold tracking-tight uppercase font-sans-tight">
              LOOKS DIRECTORY
            </h2>
            <div className="text-xs text-[#6f6f6f] font-mono mt-0.5">
              VOL. 01 — 9 FULL SILHOUETTES
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-dashed border-black/40 flex items-center justify-center text-sm hover:bg-black hover:text-white transition-colors"
            aria-label="Close Drawer"
          >
            ✕
          </button>
        </div>

        {/* Looks List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {LOOKS.map((look) => (
            <div
              key={look.number}
              onClick={() => {
                onSelectLook(look);
                onClose();
              }}
              className="p-3.5 rounded-xl border border-dashed border-black/20 hover:border-black hover:bg-neutral-50 transition-all cursor-pointer flex items-center gap-4 group"
            >
              {/* Model Cut-Out Mini Preview */}
              <div className="w-14 h-20 bg-neutral-100 rounded-lg flex items-end justify-center overflow-hidden shrink-0 border border-black/10">
                <img
                  src={px(look.modelFile, 571)}
                  alt={`Look ${look.numberStr}`}
                  className="h-full object-contain object-bottom group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Look Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#6f6f6f] uppercase">
                    LOOK {look.numberStr}
                  </span>
                  <span className="text-xs font-mono tabular-nums font-semibold">
                    {formatMoney(look.total)}
                  </span>
                </div>

                <h3 className="text-sm font-semibold tracking-tight text-black group-hover:underline truncate mt-0.5">
                  {look.name}
                </h3>

                {/* 3 Micro Product Previews */}
                <div className="flex items-center gap-1.5 mt-2">
                  {look.products.map((prod, pIdx) => (
                    <div
                      key={prod.id}
                      style={getProductImageStyle(look.number, pIdx)}
                      className="w-5 h-5 rounded-sm bg-neutral-200 border border-black/15"
                      title={prod.name}
                    />
                  ))}
                  <span className="text-[10px] text-[#6f6f6f] font-mono ml-1">
                    3 pieces (−10%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-dashed border-black/20 text-center">
          <p className="text-[10px] text-[#6f6f6f] uppercase tracking-wider font-mono">
            Every complete look qualifies for a 10% fit discount
          </p>
        </div>
      </div>
    </div>
  );
};
