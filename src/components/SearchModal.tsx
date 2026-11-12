/**
 * NOWHERE® Search Modal
 * - Real-time lookup by Name, Category, or Look name
 * - Displays matched products with contact-sheet thumbnails & prices
 * - Clean empty state and keyboard navigation (Esc to close)
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ALL_PRODUCTS, formatMoney, getProductImageStyle, ProductItem } from '../data/fashionData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: ProductItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) return ALL_PRODUCTS.slice(0, 8); // show initial recommendations
    const q = query.toLowerCase();
    return ALL_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.lookName.toLowerCase().includes(q) ||
      `look ${p.lookNumber}`.includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-90 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-black shadow-2xl overflow-hidden animate-fadeIn select-none">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-black flex items-center gap-3">
          <span className="text-sm font-mono text-[#6f6f6f]">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product name, category, or look (e.g. 'Jacket', 'Analog', 'Shoes')..."
            className="w-full text-sm sm:text-base bg-transparent focus:outline-none placeholder-[#6f6f6f] font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#6f6f6f] hover:text-black font-mono px-2"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-dashed border-black/40 flex items-center justify-center text-xs hover:bg-black hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#6f6f6f] mb-3">
            {query.trim() ? `Search Results (${results.length})` : 'Curated Vol. 01 Highlights'}
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#6f6f6f]">
              No pieces matched your search query "{query}".
              <div className="mt-2 text-[11px] font-mono">
                Try searching for "Top", "Bottom", "Outerwear", "Sneaker", or Look names like "Somewhere Else".
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map(product => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="p-3 rounded-xl border border-dashed border-black/20 hover:border-black hover:bg-neutral-50 transition-all flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    style={getProductImageStyle(product.lookNumber, product.itemNumber)}
                    className="w-12 h-12 rounded-lg bg-neutral-200 border border-black/10 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[9px] font-mono text-[#6f6f6f] uppercase">
                      Look {String(product.lookNumber).padStart(2, '0')} · {product.category}
                    </div>
                    <div className="text-xs font-semibold text-black truncate group-hover:underline">
                      {product.name}
                    </div>
                    <div className="text-xs font-mono font-medium tabular-nums">
                      {formatMoney(product.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
