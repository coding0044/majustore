/**
 * NOWHERE® Page 04 — PRODUCT DETAIL VIEW (PDP)
 * - Large contact-sheet crop with zoom/hover
 * - Size selector, quantity selector, and Add to Bag
 * - Accurate materials, shipping & returns specifications
 * - Related products from the same look
 */

import React, { useState } from 'react';
import { formatMoney, getProductImageStyle, LOOKS, ProductItem } from '../data/fashionData';
import { useCart } from '../context/CartContext';

interface ProductDetailPageProps {
  product: ProductItem;
  onBack: () => void;
  onSelectProduct: (product: ProductItem) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack,
  onSelectProduct,
}) => {
  const { addToBag } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [sizeError, setSizeError] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Retrieve the full parent look to display sibling items
  const parentLook = LOOKS.find(l => l.number === product.lookNumber) || LOOKS[0];
  const siblingProducts = parentLook.products.filter(p => p.id !== product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    addToBag(product, selectedSize, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  return (
    <div className="pt-20 md:pt-24 pb-28 px-4 sm:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Back button & Breadcrumb */}
      <div className="py-3 sm:py-4 border-b border-black/10 flex items-center justify-between">
        <button
          onClick={onBack}
          className="pill-button !min-h-[32px] !py-1 !px-4 text-xs font-mono cursor-pointer"
        >
          ← Back to Catalogue
        </button>

        <div className="text-xs font-mono uppercase text-[#6f6f6f] hidden sm:block">
          Look {String(product.lookNumber).padStart(2, '0')} · {parentLook.name}
        </div>
      </div>

      {/* Main PDP Split Container */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        {/* Left: Product Imagery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full rounded-2xl bg-white border border-dashed border-black/20 p-6 sm:p-8 flex items-center justify-center overflow-hidden shadow-sm">
            <div
              style={getProductImageStyle(product.lookNumber, product.itemNumber)}
              className="w-full h-full rounded-xl transition-transform duration-700 hover:scale-110 cursor-zoom-in"
            />
            <div className="absolute top-4 left-4 bg-black text-white text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category}
            </div>
          </div>

          <div className="text-[11px] font-mono text-center text-[#6f6f6f] uppercase tracking-wider">
            Studio Reference: {product.id.toUpperCase().replace('NW-', 'MS-')} · Vol. 01 Archive
          </div>
        </div>

        {/* Right: Product Details & Contiguous Purchase Module */}
        <div className="flex flex-col justify-between space-y-8 bg-white p-6 sm:p-8 rounded-2xl border border-dashed border-black/20 shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#6f6f6f] uppercase tracking-widest">
                LOOK {String(product.lookNumber).padStart(2, '0')} · {product.category.toUpperCase()}
              </span>
              <span className="text-2xl font-bold font-mono tabular-nums">
                {formatMoney(product.price)}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight uppercase font-sans-tight mt-2">
              {product.name}
            </h1>

            <p className="text-sm text-[#6f6f6f] mt-4 leading-relaxed font-normal">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mt-8 pt-6 border-t border-dashed border-black/15">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase font-mono tracking-wider font-semibold">
                  Select Size
                </span>
                <span className="text-[11px] text-[#6f6f6f] font-mono">
                  True to size fit
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError(false);
                      }}
                      className={`min-w-[48px] py-2 px-3 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-black text-white font-medium shadow-sm ring-2 ring-black'
                          : 'bg-neutral-100 text-black hover:bg-neutral-200'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {sizeError && (
                <div className="text-xs text-red-600 mt-2 font-medium">
                  Please select an available size to proceed.
                </div>
              )}
            </div>

            {/* Quantity Selector & Add to Bag */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center justify-between border border-black/30 rounded-full px-3 py-2 w-full sm:w-32 bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-6 h-6 flex items-center justify-center font-mono text-sm hover:opacity-60"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="font-mono text-xs font-bold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-6 h-6 flex items-center justify-center font-mono text-sm hover:opacity-60"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 btn-primary !py-3.5 text-xs font-semibold tracking-wider flex items-center justify-center gap-2 group shadow-sm hover:shadow-lg"
              >
                <span>{addedSuccess ? '✓ ADDED TO BAG' : 'ADD TO BAG'}</span>
                <span className="font-mono tabular-nums opacity-80">
                  ({formatMoney(product.price * quantity)})
                </span>
              </button>
            </div>

            {/* Whole Fit Incentive Banner */}
            <div className="mt-6 p-3.5 bg-neutral-100/70 rounded-xl border border-dashed border-black/20 text-xs flex items-center justify-between">
              <div>
                <span className="font-semibold block uppercase text-[10px] tracking-wider">
                  Complete the fit for −10%
                </span>
                <span className="text-[#6f6f6f] text-[11px]">
                  Add all 3 pieces from Look {parentLook.numberStr} to unlock bundle savings.
                </span>
              </div>
            </div>

            {/* Specifications Accordion / List */}
            <div className="mt-8 pt-6 border-t border-dashed border-black/20 space-y-4 text-xs">
              <div>
                <h4 className="font-bold uppercase tracking-wider text-[11px] font-mono text-black">
                  Product Details & Construction
                </h4>
                <ul className="mt-2 space-y-1 text-[#6f6f6f]">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-black/40"></span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-dashed border-black/10">
                <h4 className="font-bold uppercase tracking-wider text-[11px] font-mono text-black">
                  Complimentary Shipping & Global Returns
                </h4>
                <p className="mt-1 text-[#6f6f6f] leading-relaxed">
                  Complimentary express courier delivery on all orders over PKR 40,000. Returns accepted within 30 days of arrival in unworn original packaging.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sibling Products from Look */}
      {siblingProducts.length > 0 && (
        <div className="mt-20 pt-10 border-t border-black">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <div className="text-[10px] font-mono uppercase text-[#6f6f6f] tracking-widest">
                COMPLETE SILHOUETTE
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">
                Other Pieces from Look {parentLook.numberStr}
              </h3>
            </div>
            <div className="text-xs text-[#6f6f6f] font-mono">
              Combine all 3 for 10% discount
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {siblingProducts.map((sib) => (
              <div
                key={sib.id}
                onClick={() => {
                  onSelectProduct(sib);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 bg-white rounded-xl border border-dashed border-black/20 hover:border-black transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div
                    style={getProductImageStyle(sib.lookNumber, sib.itemNumber)}
                    className="w-16 h-16 rounded-lg bg-neutral-100 border border-black/10 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#6f6f6f]">
                      {sib.category}
                    </span>
                    <h4 className="text-sm font-semibold uppercase group-hover:underline">
                      {sib.name}
                    </h4>
                    <span className="text-xs font-mono font-medium">
                      {formatMoney(sib.price)}
                    </span>
                  </div>
                </div>

                <span className="pill-button !min-h-[28px] !text-[10px]">
                  View Piece →
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
