/**
 * NOWHERE® Page 03 — COLLECTIONS
 * Editorial lookbook presentation of "Vol. 01 — Going Quiet"
 * Magazine-style layout featuring full-length model silhouettes and 3-piece breakdowns.
 */

import React from 'react';
import { formatDiscount, formatMoney, getProductImageStyle, LOOKS, LookData, ProductItem, px } from '../data/fashionData';

interface CollectionsPageProps {
  onOpenFocus: (look: LookData, itemIndex?: number | null) => void;
  onOpenProductDetail: (product: ProductItem) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  onOpenFocus,
  onOpenProductDetail,
}) => {
  return (
    <div className="pt-20 md:pt-24 pb-28 px-4 sm:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Editorial Header */}
      <div className="border-b border-black pb-10 sm:pb-12 pt-2 sm:pt-4 text-center max-w-3xl mx-auto">
        <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#6f6f6f]">
          MAJU STORE® / EDITORIAL COLLECTION
        </div>
        <h1 className="text-4xl sm:text-6xl font-normal font-serif-instrument mt-2 tracking-tight">
          Vol. 01 — Going Quiet
        </h1>
        <p className="text-xs sm:text-sm text-[#6f6f6f] mt-4 font-normal leading-relaxed">
          Nine complete silhouettes captured in natural monochromatic balance. An exploration of solitude, non-connectivity, and structured ease.
        </p>
      </div>

      {/* Looks Showcase Grid */}
      <div className="mt-16 space-y-24">
        {LOOKS.map((look, index) => {
          const isEven = index % 2 === 1;
          return (
            <article
              key={look.number}
              className={`flex flex-col ${
                isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'
              } items-center gap-8 lg:gap-16 border-b border-dashed border-black/20 pb-20`}
            >
              {/* Left/Right: Model Portrait */}
              <div
                onClick={() => onOpenFocus(look)}
                className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white rounded-2xl border border-dashed border-black/20 hover:border-black transition-all cursor-pointer group shadow-xs hover:shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-4 left-4 bg-black text-white text-xs font-mono px-3 py-1 rounded-full uppercase tracking-wider">
                  Look {look.numberStr}
                </div>

                <div className="h-[460px] sm:h-[540px] w-auto aspect-[1/2] flex items-end justify-center">
                  <img
                    src={px(look.modelFile, 914)}
                    alt={`Look ${look.numberStr} ${look.name}`}
                    className="h-full object-contain object-bottom group-hover:scale-104 transition-transform duration-500 drop-shadow-md"
                  />
                </div>

                <div className="absolute bottom-4 right-4 pill-button !text-[10px] !min-h-[30px] opacity-0 group-hover:opacity-100 transition-opacity">
                  Inspect in 3D ↗
                </div>
              </div>

              {/* Look Breakdown & Pieces */}
              <div className="w-full lg:w-1/2 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-[#6f6f6f]">
                    SILHOUETTE {look.numberStr} / 09
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight uppercase font-sans-tight mt-1">
                    {look.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 font-mono text-xs">
                    <span className="text-[#6f6f6f]">3-Piece Set Subtotal: {formatMoney(look.subtotal)}</span>
                    <span>·</span>
                    <span className="font-semibold text-black">Complete Fit −10%: {formatMoney(look.total)}</span>
                  </div>

                  <p className="text-xs text-[#6f6f6f] mt-4 leading-relaxed">
                    Designed as a coherent system of drape and proportion. All three pieces complement the tactile tension between soft knitwear, structured bottoms, and technical footwear.
                  </p>
                </div>

                {/* 3 Product Cards */}
                <div className="mt-8 space-y-3">
                  {look.products.map((product, pIdx) => (
                    <div
                      key={product.id}
                      onClick={() => onOpenProductDetail(product)}
                      className="p-3 bg-neutral-50 hover:bg-white rounded-xl border border-dashed border-black/20 hover:border-black transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          style={getProductImageStyle(look.number, pIdx)}
                          className="w-12 h-12 rounded-lg bg-neutral-200 border border-black/10 shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <div className="text-[9px] font-mono uppercase text-[#6f6f6f]">
                            Piece 0{pIdx + 1} · {product.category}
                          </div>
                          <div className="text-xs font-semibold text-black group-hover:underline">
                            {product.name}
                          </div>
                          <div className="text-[10px] text-[#6f6f6f]">
                            Sizes: {product.sizes.join(', ')}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-mono font-semibold tabular-nums">
                          {formatMoney(product.price)}
                        </div>
                        <span className="text-[10px] text-[#6f6f6f] group-hover:text-black">
                          Details →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-8 pt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onOpenFocus(look)}
                    className="btn-primary !py-3 !px-6 text-xs tracking-wider flex-1 text-center"
                  >
                    SHOP COMPLETE LOOK ({formatMoney(look.total)})
                  </button>
                  <button
                    onClick={() => onOpenFocus(look)}
                    className="btn-secondary !py-3 !px-5 text-xs tracking-wider"
                  >
                    OPEN 3D FOCUS
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
