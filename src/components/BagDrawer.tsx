/**
 * NOWHERE® Shopping Bag Drawer
 * - Itemised list with thumbnail crop, name, size, quantity controls
 * - Automated 10% whole-fit discount breakdown
 * - Subtotal, discount deduction, final total
 * - Clear empty state & direct route to checkout
 */

import React, { useEffect } from 'react';
import { formatDiscount, formatMoney, getProductImageStyle } from '../data/fashionData';
import { useCart } from '../context/CartContext';

interface BagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const BagDrawer: React.FC<BagDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const {
    items,
    removeFromBag,
    updateQuantity,
    subtotal,
    discounts,
    totalDiscount,
    finalTotal,
    totalItemCount,
  } = useCart();

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
    <div className="fixed inset-0 z-80 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Bag Slide-Over Panel */}
      <div className="relative w-full max-w-[420px] sm:w-[420px] h-full bg-white border-l border-black/20 shadow-2xl flex flex-col z-10 animate-slide-right text-black select-none">
        {/* Header */}
        <div className="p-6 border-b border-black flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#6f6f6f]">
              MAJU STORE® / ORDER BAG
            </div>
            <h2 className="text-xl font-bold tracking-tight uppercase font-sans-tight">
              SHOPPING BAG ({totalItemCount})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-dashed border-black/40 flex items-center justify-center text-sm hover:bg-black hover:text-white transition-colors"
            aria-label="Close Bag"
          >
            ✕
          </button>
        </div>

        {/* Items List or Empty State */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="w-16 h-16 rounded-full border border-dashed border-black/30 flex items-center justify-center text-2xl font-serif-instrument mb-4">
                0
              </div>
              <h3 className="text-lg font-bold tracking-tight uppercase">
                YOUR BAG IS EMPTY
              </h3>
              <p className="text-xs text-[#6f6f6f] mt-1 max-w-[220px]">
                Explore Vol. 01 looks and select pieces to add them to your order.
              </p>
              <button
                onClick={onClose}
                className="mt-6 btn-secondary !py-2.5 !px-6"
              >
                RETURN TO COLLECTION
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartItemId}
                className="p-3.5 rounded-xl border border-dashed border-black/20 flex gap-3 items-center group"
              >
                {/* Product Thumbnail */}
                <div
                  style={getProductImageStyle(item.product.lookNumber, item.product.itemNumber)}
                  className="w-16 h-16 rounded-lg bg-neutral-100 border border-black/10 shrink-0"
                />

                {/* Info & Quantity */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-semibold text-black truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-xs font-mono font-semibold tabular-nums">
                      {formatMoney(item.product.price * item.quantity)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-[#6f6f6f] mt-0.5">
                    <span className="uppercase">Look {item.product.lookNumber}</span>
                    <span>·</span>
                    <span className="font-medium text-black">Size: {item.size}</span>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-dashed border-black/10">
                    <div className="flex items-center border border-black/20 rounded-full overflow-hidden text-xs">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-6 h-5 flex items-center justify-center hover:bg-neutral-100 font-mono"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-mono font-semibold text-[11px]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-6 h-5 flex items-center justify-center hover:bg-neutral-100 font-mono"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromBag(item.cartItemId)}
                      className="text-[10px] text-[#6f6f6f] hover:text-red-600 transition-colors uppercase tracking-wider"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Calculations and Checkout CTA */}
        {items.length > 0 && (
          <div className="p-6 bg-neutral-50 border-t border-black">
            {/* Discount notice if any whole fits qualify */}
            {discounts.length > 0 && (
              <div className="mb-3 p-2.5 bg-black text-white rounded-lg text-xs space-y-1">
                <div className="font-semibold text-[11px] uppercase tracking-wider text-neutral-300">
                  ★ WHOLE-FIT DISCOUNT APPLIED:
                </div>
                {discounts.map((d) => (
                  <div key={d.lookNumber} className="flex justify-between text-[11px]">
                    <span>Look {d.lookNumber} ({d.lookName}){d.count > 1 ? ` x${d.count}` : ''}</span>
                    <span className="font-mono tabular-nums">{formatDiscount(d.discountAmount)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 text-xs pb-3 border-b border-black/20">
              <div className="flex justify-between text-[#6f6f6f]">
                <span>Bag Subtotal</span>
                <span className="font-mono tabular-nums">{formatMoney(subtotal)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-black font-medium">
                  <span>Look Discount (−10%)</span>
                  <span className="font-mono tabular-nums">{formatDiscount(totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-black pt-1">
                <span>TOTAL</span>
                <span className="font-mono tabular-nums">{formatMoney(finalTotal)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full btn-primary !py-3 flex items-center justify-center gap-2 group text-xs tracking-wider"
              >
                <span>PROCEED TO CHECKOUT</span>
                <span className="font-mono tabular-nums opacity-80">
                  ({formatMoney(finalTotal)})
                </span>
              </button>

              <button
                onClick={onClose}
                className="w-full btn-secondary !py-2.5 text-[11px]"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
