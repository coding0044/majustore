/**
 * MAJU STORE® Page 06 — CHECKOUT
 * Complete checkout interface with address form validation, demo payment modes,
 * and high-fidelity order confirmation receipt with real PDF invoice download.
 */

import React, { useState } from 'react';
import { Download, ArrowRight, CheckCircle2, FileText, ShieldCheck, Clock } from 'lucide-react';
import { formatDiscount, formatMoney, getProductImageStyle } from '../data/fashionData';
import { useCart } from '../context/CartContext';
import { downloadOrderReceiptPdf, OrderData } from '../utils/pdfGenerator';

interface CheckoutPageProps {
  onReturnToShop: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onReturnToShop }) => {
  const { items, subtotal, discounts, totalDiscount, finalTotal, clearCart } = useCart();

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card_demo'>('cod');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderData | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Validate form fields
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!address.trim()) newErrors.address = 'Delivery address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!postalCode.trim()) newErrors.postalCode = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Generate clean unique order reference matching MAJU-ORDER-XXXXX format
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const orderRef = `MAJU-ORDER-2026-${randomId}`;
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const isCod = paymentMethod === 'cod';
      const paymentMethodLabel = isCod
        ? 'Cash on Delivery (Standard Courier)'
        : 'Simulated Card Payment (Authorized)';
      const paymentStatus = isCod
        ? 'Pending Verification on Delivery'
        : 'Paid (Authorized Sandbox)';

      const orderData: OrderData = {
        orderRef,
        date: dateStr,
        time: timeStr,
        customer: { fullName, email, phone, address, city, postalCode, country },
        items: items.map((it) => ({
          cartItemId: it.cartItemId,
          product: {
            id: it.product.id,
            name: it.product.name,
            category: it.product.category,
            price: it.product.price,
            lookNumber: it.product.lookNumber,
            itemNumber: it.product.itemNumber,
          },
          size: it.size,
          quantity: it.quantity,
        })),
        subtotal,
        totalDiscount,
        finalTotal,
        paymentMethod: paymentMethodLabel,
        paymentStatus,
      };

      setCompletedOrder(orderData);
      clearCart();
      setIsSubmitting(false);
    }, 750);
  };

  const handleDownloadPdf = () => {
    if (!completedOrder) return;
    setIsPdfGenerating(true);
    try {
      downloadOrderReceiptPdf(completedOrder);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // If order completed, display the confirmed order receipt
  if (completedOrder) {
    return (
      <div className="pt-24 pb-28 px-4 sm:px-8 max-w-3xl mx-auto min-h-screen">
        <div className="bg-white rounded-2xl border border-black shadow-2xl p-6 sm:p-10 text-black animate-print-down">
          {/* Header & Logo */}
          <div className="border-b-2 border-black pb-6 text-center relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[11px] font-mono font-medium mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>DISPATCH RESERVATION CONFIRMED</span>
            </div>

            <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#6f6f6f] block">
              MAJU STORE® OFFICIAL ORDER RECEIPT
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mt-1 font-sans-tight">
              ORDER CONFIRMED
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
              <span className="px-4 py-1.5 rounded-full bg-neutral-100 border border-black font-mono text-xs font-bold text-black tracking-wider">
                ID: {completedOrder.orderRef}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#6f6f6f] font-mono">
                <Clock className="w-3.5 h-3.5 text-black" />
                {completedOrder.date} · {completedOrder.time}
              </span>
            </div>
          </div>

          {/* Demo Notice */}
          <div className="my-6 p-4 rounded-xl bg-neutral-50 border border-dashed border-black/25 text-xs text-[#6f6f6f] leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-black shrink-0 mt-0.5" />
            <div>
              <strong className="text-black font-semibold uppercase block mb-0.5">
                Official Receipt & Verification:
              </strong>
              Thank you for shopping at <span className="text-black font-medium">MAJU STORE®</span>.
              Your order has been recorded under reference{' '}
              <span className="font-mono text-black font-bold">{completedOrder.orderRef}</span>.
              A printable A4 invoice has been prepared for your records.
            </div>
          </div>

          {/* Order Details & Summary */}
          <div className="space-y-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-neutral-50 border border-black/10">
                <span className="font-bold uppercase tracking-wider text-[10px] text-[#6f6f6f] block mb-1">
                  Customer & Delivery Destination
                </span>
                <p className="font-bold text-sm text-black">{completedOrder.customer.fullName}</p>
                <p className="text-[#6f6f6f] mt-1">{completedOrder.customer.address}</p>
                <p className="text-[#6f6f6f]">
                  {completedOrder.customer.city}, {completedOrder.customer.postalCode}
                </p>
                <p className="text-[#6f6f6f]">{completedOrder.customer.country}</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-black/10">
                <span className="font-bold uppercase tracking-wider text-[10px] text-[#6f6f6f] block mb-1">
                  Payment Method & Status
                </span>
                <p className="font-bold text-sm text-black">{completedOrder.paymentMethod}</p>
                <div className="mt-1.5 inline-block px-2.5 py-0.5 rounded-full bg-black text-white text-[10px] font-mono font-medium">
                  {completedOrder.paymentStatus}
                </div>
                <div className="mt-2 text-[#6f6f6f] space-y-0.5">
                  <p>Email: {completedOrder.customer.email}</p>
                  <p>Contact: {completedOrder.customer.phone}</p>
                </div>
              </div>
            </div>

            {/* Line Items with Images */}
            <div className="border-t border-dashed border-black/30 pt-5">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold uppercase tracking-wider text-[11px] text-[#6f6f6f]">
                  Ordered Items ({completedOrder.items.length})
                </span>
                <span className="text-[10px] font-mono text-[#6f6f6f] uppercase">
                  Prices in Pakistani Rupee (PKR)
                </span>
              </div>

              <div className="space-y-3">
                {completedOrder.items.map((it) => (
                  <div
                    key={it.cartItemId}
                    className="flex items-center justify-between gap-4 p-3 rounded-xl border border-neutral-100 hover:border-black/20 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        style={getProductImageStyle(it.product.lookNumber, it.product.itemNumber)}
                        className="w-12 h-12 rounded-lg bg-neutral-200 border border-black/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-black truncate">{it.product.name}</div>
                        <div className="text-[10px] text-[#6f6f6f] mt-0.5">
                          Size: <span className="font-semibold text-black">{it.size}</span> · Look{' '}
                          {String(it.product.lookNumber).padStart(2, '0')} · {it.product.category}
                        </div>
                        <div className="text-[10px] font-mono text-[#6f6f6f] mt-0.5">
                          Unit: {formatMoney(it.product.price)} × {it.quantity}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-xs font-bold text-black tabular-nums">
                        {formatMoney(it.product.price * it.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Totals Breakdown */}
            <div className="border-t-2 border-black pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-[#6f6f6f]">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-black font-medium">
                  {formatMoney(completedOrder.subtotal)}
                </span>
              </div>

              {completedOrder.totalDiscount > 0 && (
                <div className="flex justify-between text-black font-semibold">
                  <span>Whole-Fit Bundle Discount (−10%)</span>
                  <span className="font-mono tabular-nums text-black">
                    {formatDiscount(completedOrder.totalDiscount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-[#6f6f6f]">
                <span>Courier Express Shipping</span>
                <span className="font-mono text-black font-semibold">Complimentary (PKR 0)</span>
              </div>

              <div className="flex justify-between text-base font-bold pt-3 border-t border-dashed border-black/30">
                <span>TOTAL AMOUNT</span>
                <span className="font-mono tabular-nums text-lg text-black font-black">
                  {formatMoney(completedOrder.finalTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Download Notification Toast */}
          {downloadSuccess && (
            <div className="mt-6 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-mono text-center flex items-center justify-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Receipt downloaded successfully ({completedOrder.orderRef}.pdf)</span>
            </div>
          )}

          {/* Action Buttons: Download PDF and Continue Shopping */}
          <div className="mt-8 pt-6 border-t border-black flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={isPdfGenerating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-neutral-800 active:scale-[0.98] transition-all px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isPdfGenerating ? 'GENERATING A4 PDF...' : 'DOWNLOAD PDF'}</span>
            </button>

            <button
              onClick={onReturnToShop}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black border border-black hover:bg-neutral-100 active:scale-[0.98] transition-all px-7 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <span>CONTINUE SHOPPING</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If bag is empty and no completed order, show empty state
  if (items.length === 0) {
    return (
      <div className="pt-28 pb-28 px-4 max-w-xl mx-auto min-h-screen text-center">
        <div className="p-8 bg-white rounded-2xl border border-dashed border-black/30">
          <h2 className="text-2xl font-bold uppercase">NO ITEMS TO CHECK OUT</h2>
          <p className="text-xs text-[#6f6f6f] mt-2">
            Your shopping bag is empty. Explore the Vol. 01 looks to select garments.
          </p>
          <button
            onClick={onReturnToShop}
            className="mt-6 btn-primary !py-3 !px-8 text-xs"
          >
            DISCOVER COLLECTION
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-28 px-4 sm:px-8 max-w-6xl mx-auto min-h-screen">
      {/* Header */}
      <div className="border-b border-black pb-6 pt-4">
        <div className="text-[10px] font-mono uppercase tracking-widest text-[#6f6f6f]">
          MAJU STORE® / ORDER DISPATCH
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight uppercase font-sans-tight mt-1">
          CHECKOUT
        </h1>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Customer Information & Delivery Form */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-8">
          {/* Customer Details */}
          <div className="bg-white p-6 rounded-2xl border border-dashed border-black/20 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-black mb-4">
              01 · Customer Information
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block uppercase text-[10px] font-mono text-[#6f6f6f] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Julian Hayes"
                  className="w-full p-2.5 rounded-lg border border-black/30 focus:outline-none focus:border-black font-sans"
                />
                {errors.fullName && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-[10px] font-mono text-[#6f6f6f] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="julian@example.com"
                    className="w-full p-2.5 rounded-lg border border-black/30 focus:outline-none focus:border-black font-sans"
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block uppercase text-[10px] font-mono text-[#6f6f6f] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full p-2.5 rounded-lg border border-black/30 focus:outline-none focus:border-black font-sans"
                  />
                  {errors.phone && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white p-6 rounded-2xl border border-dashed border-black/20 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-black mb-4">
              02 · Delivery Destination
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block uppercase text-[10px] font-mono text-[#6f6f6f] mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="450 Studio Lane, Apt 3B"
                  className="w-full p-2.5 rounded-lg border border-black/30 focus:outline-none focus:border-black font-sans"
                />
                {errors.address && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block uppercase text-[10px] font-mono text-[#6f6f6f] mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="New York"
                    className="w-full p-2.5 rounded-lg border border-black/30 focus:outline-none focus:border-black font-sans"
                  />
                  {errors.city && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block uppercase text-[10px] font-mono text-[#6f6f6f] mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="10012"
                    className="w-full p-2.5 rounded-lg border border-black/30 focus:outline-none focus:border-black font-sans"
                  />
                  {errors.postalCode && (
                    <p className="text-[11px] text-red-600 mt-1">{errors.postalCode}</p>
                  )}
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block uppercase text-[10px] font-mono text-[#6f6f6f] mb-1">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-black/30 bg-white focus:outline-none focus:border-black font-sans text-xs"
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="Japan">Japan</option>
                    <option value="France">France</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white p-6 rounded-2xl border border-dashed border-black/20 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-black mb-4">
              03 · Payment Method
            </h2>

            <div className="space-y-3">
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-black bg-neutral-50 shadow-xs'
                    : 'border-dashed border-black/20 hover:border-black/50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-0.5 accent-black"
                />
                <div className="text-xs">
                  <div className="font-bold text-black uppercase">
                    Cash on Delivery (COD)
                  </div>
                  <p className="text-[#6f6f6f] mt-0.5">
                    Pay upon receipt of courier parcel. Zero transaction fees. Verified on doorstep.
                  </p>
                </div>
              </label>

              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'card_demo'
                    ? 'border-black bg-neutral-50 shadow-xs'
                    : 'border-dashed border-black/20 hover:border-black/50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card_demo'}
                  onChange={() => setPaymentMethod('card_demo')}
                  className="mt-0.5 accent-black"
                />
                <div className="text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black uppercase">
                      Online Card Payment
                    </span>
                    <span className="text-[9px] font-mono uppercase bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded-full">
                      Demo Mode
                    </span>
                  </div>
                  <p className="text-[#6f6f6f] mt-0.5">
                    Simulated card transaction testing. No external credentials required.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary !py-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-lg"
          >
            {isSubmitting ? (
              <span>PROCESSING RESERVATION...</span>
            ) : (
              <span>CONFIRM ORDER ({formatMoney(finalTotal)})</span>
            )}
          </button>
        </form>

        {/* Right: Order Summary Slip */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-2xl border border-black shadow-lg sticky top-24">
            <div className="border-b border-black pb-3">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#6f6f6f]">
                MAJU STORE® / VOL. 01
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight font-sans-tight">
                ORDER SUMMARY
              </h3>
            </div>

            {/* Items */}
            <div className="max-h-[300px] overflow-y-auto my-4 space-y-3 pr-1">
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex items-center justify-between text-xs gap-3 border-b border-dashed border-black/10 pb-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      style={getProductImageStyle(item.product.lookNumber, item.product.itemNumber)}
                      className="w-10 h-10 rounded-md bg-neutral-200 border border-black/10 shrink-0"
                    />
                    <div className="truncate">
                      <div className="font-semibold text-black truncate">{item.product.name}</div>
                      <div className="text-[10px] text-[#6f6f6f]">
                        Size: {item.size} · Qty: {item.quantity}
                      </div>
                    </div>
                  </div>

                  <span className="font-mono tabular-nums font-semibold shrink-0">
                    {formatMoney(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs border-t border-black pt-4">
              <div className="flex justify-between text-[#6f6f6f]">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">{formatMoney(subtotal)}</span>
              </div>

              {discounts.length > 0 && (
                <div className="flex justify-between text-black font-semibold">
                  <span>Whole-fit Discount (−10%)</span>
                  <span className="font-mono tabular-nums">{formatDiscount(totalDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#6f6f6f]">
                <span>Shipping</span>
                <span className="font-mono uppercase text-black font-semibold">Free Express</span>
              </div>

              <div className="flex justify-between text-base font-bold text-black pt-3 border-t border-dashed border-black/30">
                <span>TOTAL DUE</span>
                <span className="font-mono tabular-nums">{formatMoney(finalTotal)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-black/15 text-[10px] text-[#6f6f6f] uppercase tracking-wider text-center font-mono">
              All deliveries carbon neutralized · 30-day returns
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
