/**
 * Shopping Bag and Order State Management
 * Persistent cart with whole-fit 10% discount calculations and toast alerts.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ALL_PRODUCTS, formatMoney, LOOKS, ProductItem } from '../data/fashionData';

export interface CartItem {
  cartItemId: string; // Unique combination of productId + size
  product: ProductItem;
  size: string;
  quantity: number;
}

export interface AppliedDiscount {
  lookNumber: number;
  lookName: string;
  count: number;
  discountAmount: number;
}

interface ToastMessage {
  id: string;
  title: string;
  subtitle: string;
}

interface CartContextType {
  items: CartItem[];
  addToBag: (product: ProductItem, size: string, quantity?: number) => void;
  removeFromBag: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  totalItemCount: number;
  subtotal: number;
  discounts: AppliedDiscount[];
  totalDiscount: number;
  finalTotal: number;
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
  isBagOpen: boolean;
  setIsBagOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'nowhere_bag_state_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Re-hydrate with current product references
          return parsed.map((item: any) => {
            const prod = ALL_PRODUCTS.find(p => p.id === item.product?.id) || item.product;
            return {
              ...item,
              product: prod,
            };
          });
        }
      }
    } catch (e) {
      console.warn('Failed to load bag from localStorage', e);
    }
    return [];
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save bag to localStorage', e);
    }
  }, [items]);

  const addToast = (title: string, subtitle: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, title, subtitle }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToBag = (product: ProductItem, size: string, quantity: number = 1) => {
    if (!size || size.trim() === '') {
      return;
    }

    const cartItemId = `${product.id}-${size}`;

    setItems(prev => {
      const existing = prev.find(i => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map(i =>
          i.cartItemId === cartItemId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { cartItemId, product, size, quantity }];
    });

    addToast(`Added to Bag`, `${product.name} — Size ${size} (${quantity > 1 ? `x${quantity}` : formatMoney(product.price)})`);
  };

  const removeFromBag = (cartItemId: string) => {
    setItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromBag(cartItemId);
      return;
    }
    setItems(prev =>
      prev.map(i => (i.cartItemId === cartItemId ? { ...i, quantity: newQty } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Calculate whole-look 10% discount:
  // For each look 1..9, count how many of item 0, item 1, item 2 are in cart
  const discounts: AppliedDiscount[] = [];
  LOOKS.forEach(look => {
    const item0Qty = items
      .filter(i => i.product.lookNumber === look.number && i.product.itemNumber === 0)
      .reduce((s, i) => s + i.quantity, 0);
    const item1Qty = items
      .filter(i => i.product.lookNumber === look.number && i.product.itemNumber === 1)
      .reduce((s, i) => s + i.quantity, 0);
    const item2Qty = items
      .filter(i => i.product.lookNumber === look.number && i.product.itemNumber === 2)
      .reduce((s, i) => s + i.quantity, 0);

    const completeFits = Math.min(item0Qty, item1Qty, item2Qty);
    if (completeFits > 0) {
      const discountAmount = completeFits * look.discount;
      discounts.push({
        lookNumber: look.number,
        lookName: look.name,
        count: completeFits,
        discountAmount,
      });
    }
  });

  const totalDiscount = discounts.reduce((sum, d) => sum + d.discountAmount, 0);
  const finalTotal = Math.max(0, subtotal - totalDiscount);

  return (
    <CartContext.Provider
      value={{
        items,
        addToBag,
        removeFromBag,
        updateQuantity,
        clearCart,
        totalItemCount,
        subtotal,
        discounts,
        totalDiscount,
        finalTotal,
        toasts,
        removeToast,
        isBagOpen,
        setIsBagOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
