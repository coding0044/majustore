/**
 * NOWHERE® Receipt-Style Shopping Slip
 * - Width: 336px (desktop), full/near-full width (mobile)
 * - Rounded left edge: 24px
 * - White paper background, crisp black typography, dashed separators
 * - Prints down from top edge with smooth vertical entrance animation
 * - Calculates subtotal, whole-fit -10% discount, and total
 */

import React, { useState } from 'react';
import { formatDiscount, formatMoney, getProductImageStyle, LookData, ProductItem } from '../data/fashionData';
import { useCart } from '../context/CartContext';

interface ReceiptSlipProps {
  look: LookData;
  activeItemIndex: number | null;
  onSelectItem: (index: number) => void;
  onOpenProductDetail: (product: ProductItem) => void;
  onClose: () => void;
}

export const ReceiptSlip: React.FC<ReceiptSlipProps> = ({
  look,
  activeItemIndex,
  onSelectItem,
  onOpenProductDetail,
  onClose,
}) => {
  const { addToBag } = useCart();
  // Selected sizes for each of the 3 products in the look: index 0, 1, 2
  const [selectedSizes, setSelectedSizes] = useState<{ [key: number]: string }>({
    0: look.products[0].sizes[0] || '',
    1: look.products[1].sizes[0] || '',
    2: look.products[2].sizes[0] || '',
  });

  const [validationErrors, setValidationErrors] = useState<{ [key: number]: boolean }>({});
  const [addedSuccess, setAddedSuccess] = useState<{ [key: number]: boolean }>({});

  const handleSelectSize = (itemIndex: number, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [itemIndex]: size }));
    setValidationErrors(prev => ({ ...prev, [itemIndex]: false }));
  };

  const handleAddSingleItem = (product: ProductItem, itemIndex: number) => {
    const size = selectedSizes[itemIndex];
    if (!size) {
      setValidationErrors(prev => ({ ...prev, [itemIndex]: true }));
      return;
    }

    addToBag(product, size, 1);
    setAddedSuccess(prev => ({ ...prev, [itemIndex]: true }));
    setTimeout(() => {
      setAddedSuccess(prev => ({ ...prev, [itemIndex]: false }));
    }, 1800);
  };

  const handleAddWholeFit = () => {
    let hasError = false;
    const newErrors: { [key: number]: boolean } = {};

    look.products.forEach((prod, idx) => {
      if (!selectedSizes[idx]) {
        newErrors[idx] = true;
        hasError = true;
      }
    });

    if (hasError) {
      setValidationErrors(newErrors);
      return;
    }

    // Add all 3 items to cart to trigger 10% discount!
    look.products.forEach((prod, idx) => {
      addToBag(prod, selectedSizes[idx], 1);
    });

    setAddedSuccess({ 0: true, 1: true, 2: true });
    setTimeout(() => {
      setAddedSuccess({});
    }, 2000);
  };

  return (
    <aside
      className="fixed top-0 right-0 z-70 h-full w-full max-w-[340px] md:w-[336px] bg-[#ffffff] shadow-2xl md:rounded-l-[24px] border-l border-black/15 flex flex-col justify-between overflow-y-auto animate-print-down text-black select-none"
      aria-label="Look Receipt"
    >
      {/* Receipt Top Section */}
      <div className="p-5 md:p-6 pb-2">
        {/* Close Button & Receipt Header */}
        <div className="flex items-start justify-between border-b border-black pb-3 mb-4">
          <div>
            <div className="text-[10px] tracking-widest uppercase font-mono text-[#6f6f6f]">
              MAJU STORE® / RECEIPT
            </div>
            <h2 className="text-xl font-bold tracking-tight uppercase font-sans-tight">
              LOOK {look.numberStr}
            </h2>
            <div className="text-xs italic text-[#6f6f6f] font-serif-instrument">
              "{look.name}"
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-dashed border-black/60 flex items-center justify-center text-xs hover:bg-black hover:text-white transition-colors"
            aria-label="Close Receipt"
          >
            ✕
          </button>
        </div>

        {/* 3 Products in this look */}
        <div className="space-y-4">
          {look.products.map((product, idx) => {
            const isHighlighted = activeItemIndex === idx;
            const hasError = validationErrors[idx];
            const isSuccess = addedSuccess[idx];

            return (
              <div
                key={product.id}
                onClick={() => onSelectItem(idx)}
                className={`p-3 rounded-lg border transition-all ${
                  isHighlighted
                    ? 'border-black bg-neutral-50 shadow-xs'
                    : 'border-dashed border-black/20 hover:border-black/50'
                }`}
              >
                {/* Thumbnail & Product Details Header */}
                <div className="flex gap-3 items-start">
                  {/* Contact Sheet Cropped Thumbnail */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenProductDetail(product);
                    }}
                    style={getProductImageStyle(look.number, idx)}
                    className="w-14 h-14 shrink-0 rounded-md bg-neutral-200 border border-black/10 cursor-pointer hover:scale-105 transition-transform"
                    title={`View ${product.name}`}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#6f6f6f] font-medium">
                        0{idx + 1} · {product.category}
                      </span>
                      <span className="text-xs font-semibold tabular-nums font-mono">
                        {formatMoney(product.price)}
                      </span>
                    </div>

                    <h3
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProductDetail(product);
                      }}
                      className="text-xs font-medium tracking-tight truncate cursor-pointer hover:underline"
                    >
                      {product.name}
                    </h3>

                    <p className="text-[10px] text-[#6f6f6f] line-clamp-1 mt-0.5">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Size Selection Pills */}
                <div className="mt-3 pt-2 border-t border-dashed border-black/15 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-[9px] uppercase tracking-wider text-[#6f6f6f] mr-1">
                      Size:
                    </span>
                    {product.sizes.map(size => {
                      const isSelected = selectedSizes[idx] === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectSize(idx, size);
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-black text-white font-medium shadow-xs'
                              : 'bg-neutral-100 text-black hover:bg-neutral-200'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddSingleItem(product, idx);
                    }}
                    className={`btn-primary !text-[10px] !py-1 !px-3 shrink-0 ${
                      isSuccess ? '!bg-neutral-800' : ''
                    }`}
                  >
                    {isSuccess ? '✓ Added' : 'Add'}
                  </button>
                </div>

                {hasError && (
                  <div className="text-[10px] text-red-600 mt-1 font-medium">
                    Please select a size first
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Receipt Calculations & Whole-Fit Action Footer */}
      <div className="p-5 md:p-6 bg-neutral-50/80 border-t border-dashed border-black/30 mt-auto">
        {/* Receipt Line Items */}
        <div className="space-y-1.5 text-xs pb-3 border-b border-black">
          <div className="flex justify-between text-[#6f6f6f]">
            <span>Subtotal (3 items)</span>
            <span className="tabular-nums font-mono">{formatMoney(look.subtotal)}</span>
          </div>
          <div className="flex justify-between text-black font-medium">
            <span>Whole fit −10%</span>
            <span className="tabular-nums font-mono text-black">{formatDiscount(look.discount)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold pt-1 text-black">
            <span>TOTAL</span>
            <span className="tabular-nums font-mono">{formatMoney(look.total)}</span>
          </div>
        </div>

        {/* Add Entire Fit CTA Button */}
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleAddWholeFit}
            className="w-full btn-primary !py-3 flex items-center justify-center gap-2 group"
          >
            <span>ADD ENTIRE LOOK</span>
            <span className="font-mono tabular-nums text-neutral-300">
              ({formatMoney(look.total)})
            </span>
          </button>

          <p className="text-[10px] text-center text-[#6f6f6f] uppercase tracking-wider">
            10% bundle discount applied automatically at bag
          </p>
        </div>
      </div>
    </aside>
  );
};
