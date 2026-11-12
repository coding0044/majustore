/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { StatusBar } from './components/StatusBar';
import { Lookbook3D } from './components/Lookbook3D';
import { FocusViewer } from './components/FocusViewer';
import { LooksDrawer } from './components/LooksDrawer';
import { BagDrawer } from './components/BagDrawer';
import { SearchModal } from './components/SearchModal';
import { ShopAllPage } from './pages/ShopAllPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { FirstLoader } from './components/FirstLoader';
import { formatMoney, getProductImageStyle, LOOKS, LookData, ProductItem, px } from './data/fashionData';

function NowhereStore() {
  const { isBagOpen, setIsBagOpen, toasts, removeToast } = useCart();

  // First luxury loading screen state
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'collections' | 'about' | 'checkout'>('home');
  const [activeFocusLook, setActiveFocusLook] = useState<LookData | null>(null);
  const [focusInitialItemIndex, setFocusInitialItemIndex] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isLooksDrawerOpen, setIsLooksDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync with browser history for genuine SPA Back/Forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.view) {
        setCurrentView(event.state.view);
        setSelectedProduct(null);
        setActiveFocusLook(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view: 'home' | 'shop' | 'collections' | 'about' | 'checkout') => {
    setCurrentView(view);
    setSelectedProduct(null);
    setActiveFocusLook(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      window.history.pushState({ view }, '', `#${view}`);
    } catch (_) {}
  };

  const handleOpenFocus = (look: LookData, itemIndex: number | null = null) => {
    setActiveFocusLook(look);
    setFocusInitialItemIndex(itemIndex);
  };

  const handleOpenProductDetail = (product: ProductItem) => {
    setSelectedProduct(product);
    setActiveFocusLook(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#ececec] text-black font-sans-tight selection:bg-black selection:text-white relative">
      {/* First Loading Screen */}
      {isInitialLoading && (
        <FirstLoader onComplete={() => setIsInitialLoading(false)} />
      )}

      {/* 1. Universal Floating Status Bar & Luxury Side Navigation Drawer */}
      <StatusBar
        currentView={currentView}
        onNavigate={(view) => navigateTo(view as any)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenLooksDrawer={() => setIsLooksDrawerOpen(true)}
      />

      {/* 2. Main Page Render */}
      <main className="w-full">
        {selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        ) : currentView === 'home' ? (
          <div>
            {/* Signature 3D Fashion Lookbook Hero */}
            <div className="pt-12 sm:pt-12">
              <Lookbook3D
                onOpenFocus={handleOpenFocus}
                onOpenLooksDrawer={() => setIsLooksDrawerOpen(true)}
                onOpenProductDetail={handleOpenProductDetail}
              />
            </div>

            {/* Marquee Ticker */}
            <div className="w-full bg-black text-white py-3 overflow-hidden select-none border-y border-black">
              <div className="flex whitespace-nowrap animate-marquee text-[11px] font-mono uppercase tracking-[0.25em]">
                <span className="mx-6">MAJU STORE®</span>
                <span className="mx-6">·</span>
                <span className="mx-6">VOL. 01 ARCHIVE</span>
                <span className="mx-6">·</span>
                <span className="mx-6">NINE COMPLETE SILHOUETTES</span>
                <span className="mx-6">·</span>
                <span className="mx-6">27 FOUNDATIONAL GARMENTS</span>
                <span className="mx-6">·</span>
                <span className="mx-6">STUDIO GREY #ECECEC</span>
                <span className="mx-6">·</span>
                <span className="mx-6">STAY OUT OF THE LOOP</span>
                <span className="mx-6">·</span>
                <span className="mx-6">MAJU STORE®</span>
                <span className="mx-6">·</span>
                <span className="mx-6">VOL. 01 ARCHIVE</span>
                <span className="mx-6">·</span>
                <span className="mx-6">NINE COMPLETE SILHOUETTES</span>
              </div>
            </div>

            {/* Editorial Introduction Section */}
            <section className="px-4 sm:px-8 max-w-6xl mx-auto py-16 sm:py-24">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-5">
                  <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#6f6f6f]">
                    VOL. 01 / EDITORIAL MANIFESTO
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif-instrument mt-3 font-normal leading-tight">
                    Engineered for quiet retreat and intentional proportion.
                  </h2>
                </div>

                <div className="md:col-span-7 space-y-4 text-xs sm:text-sm text-[#6f6f6f] leading-relaxed">
                  <p>
                    MAJU STORE® removes the visual noise of transient micro-trends. Every garment in Vol. 01 has been developed as part of nine complete, self-contained silhouettes where texture, weight, and drape balance without superficial ornament.
                  </p>
                  <p>
                    Cut from heavyweight French terry, double-pleated poplin, extrafine Australian Merino, and oiled Spanish suedes. Designed to exist outside the cycle.
                  </p>
                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => navigateTo('shop')}
                      className="btn-primary !py-3 !px-6 !text-[11px]"
                    >
                      EXPLORE ALL 27 PIECES →
                    </button>
                    <button
                      onClick={() => navigateTo('about')}
                      className="btn-secondary !py-3 !px-5 !text-[11px]"
                    >
                      READ MANIFESTO
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Category Quick Spotlight */}
            <section className="px-4 sm:px-8 max-w-7xl mx-auto py-12 border-t border-dashed border-black/20">
              <div className="flex items-baseline justify-between mb-8">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#6f6f6f]">
                    CURATED TAXONOMY
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
                    EXPLORE BY CATEGORY
                  </h3>
                </div>
                <button
                  onClick={() => navigateTo('shop')}
                  className="text-xs font-mono uppercase text-[#6f6f6f] hover:text-black underline"
                >
                  View Catalogue (27) →
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Tops & Knitwear', tag: 'Top', count: '9 pieces', desc: 'Merino rollnecks, heavy jerseys, flax linen' },
                  { name: 'Outerwear', tag: 'Outerwear', count: '4 pieces', desc: 'Corduroy truckers, anoraks, relaxed blazers' },
                  { name: 'Bottoms', tag: 'Bottom', count: '8 pieces', desc: 'Kuroki denim, poplin shorts, tropical wool' },
                  { name: 'Footwear & Acc', tag: 'Shoes', count: '6 pieces', desc: 'Crepe moccasins, retro sneakers, desert boots' },
                ].map((cat, i) => (
                  <div
                    key={cat.name}
                    onClick={() => navigateTo('shop')}
                    className="p-5 bg-white rounded-xl border border-dashed border-black/20 hover:border-black transition-all cursor-pointer group shadow-xs hover:shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-[#6f6f6f]">
                        <span>0{i + 1}</span>
                        <span>{cat.count}</span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold uppercase mt-2 group-hover:underline">
                        {cat.name}
                      </h4>
                      <p className="text-[11px] text-[#6f6f6f] mt-1 line-clamp-2">
                        {cat.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-dashed border-black/10 flex items-center justify-between text-[10px] font-mono">
                      <span className="uppercase text-black font-medium">Browse Category</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Looks Showcase */}
            <section className="px-4 sm:px-8 max-w-7xl mx-auto py-20 border-t border-black">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-black pb-4 mb-10 gap-3">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#6f6f6f]">
                    CURATED SILHOUETTES
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight">
                    FEATURED LOOKS
                  </h3>
                </div>

                <button
                  onClick={() => navigateTo('collections')}
                  className="text-xs uppercase font-mono text-[#6f6f6f] hover:text-black underline underline-offset-4"
                >
                  View All 9 Looks Directory →
                </button>
              </div>

              {/* 3 Featured Looks Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[LOOKS[0], LOOKS[3], LOOKS[5]].map((look) => (
                  <div
                    key={look.number}
                    className="group bg-white p-5 rounded-2xl border border-dashed border-black/20 hover:border-black transition-all flex flex-col justify-between shadow-xs hover:shadow-xl"
                  >
                    <div
                      onClick={() => handleOpenFocus(look)}
                      className="relative aspect-[3/4] w-full rounded-xl bg-neutral-100 flex items-end justify-center overflow-hidden cursor-pointer"
                    >
                      <img
                        src={px(look.modelFile, 571)}
                        alt={`Look ${look.numberStr}`}
                        className="h-full object-contain object-bottom group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-mono px-2.5 py-0.5 rounded-full">
                        LOOK {look.numberStr}
                      </div>
                      <div className="absolute bottom-3 right-3 pill-button !min-h-[28px] !text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
                        Inspect 3D
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-base font-bold uppercase tracking-tight">
                            {look.name}
                          </h4>
                          <span className="text-xs font-mono font-semibold">
                            {formatMoney(look.total)}
                          </span>
                        </div>

                        {/* 3 Product Badges */}
                        <div className="mt-3 space-y-1.5">
                          {look.products.map((p, pIdx) => (
                            <div
                              key={p.id}
                              onClick={() => handleOpenProductDetail(p)}
                              className="text-[11px] text-[#6f6f6f] hover:text-black flex items-center justify-between cursor-pointer py-0.5"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  style={getProductImageStyle(look.number, pIdx)}
                                  className="w-4 h-4 rounded-sm bg-neutral-200 border border-black/10 shrink-0"
                                />
                                <span className="truncate max-w-[170px]">{p.name}</span>
                              </div>
                              <span className="font-mono tabular-nums">{formatMoney(p.price)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-dashed border-black/15 flex items-center gap-2">
                        <button
                          onClick={() => handleOpenFocus(look)}
                          className="flex-1 btn-primary !py-2.5 !text-[11px] text-center"
                        >
                          SHOP THIS FIT
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Material & Craftsmanship Breakdown */}
            <section className="bg-white border-t border-black py-20 px-4 sm:px-8">
              <div className="max-w-6xl mx-auto">
                <div className="text-center max-w-xl mx-auto mb-12">
                  <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#6f6f6f]">
                    MATERIAL CONSTITUTION
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight font-sans-tight mt-1">
                    CRAFTED FOR DURABILITY & QUIET
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
                  <div className="p-5 rounded-xl border border-dashed border-black/20 space-y-2">
                    <span className="font-mono text-black font-semibold text-[11px] block">
                      01 / DENIM & COTTON
                    </span>
                    <h5 className="font-bold uppercase text-black text-sm">Kuroki Mills Selvedge</h5>
                    <p className="text-[#6f6f6f] leading-relaxed">
                      13.5oz stay-black shuttle-loom denim woven on vintage Toyoda looms with redline selvedge identity.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-dashed border-black/20 space-y-2">
                    <span className="font-mono text-black font-semibold text-[11px] block">
                      02 / KNITWEAR
                    </span>
                    <h5 className="font-bold uppercase text-black text-sm">Extrafine Merino Wool</h5>
                    <p className="text-[#6f6f6f] leading-relaxed">
                      19.5-micron Australian fleece spun for zero itch and thermal breathability in midnight navy rollnecks.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-dashed border-black/20 space-y-2">
                    <span className="font-mono text-black font-semibold text-[11px] block">
                      03 / SHIRTING
                    </span>
                    <h5 className="font-bold uppercase text-black text-sm">Normandy Flax Linen</h5>
                    <p className="text-[#6f6f6f] leading-relaxed">
                      Unbleached European long-staple flax with dry handle drape and mother of pearl button fastening.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl border border-dashed border-black/20 space-y-2">
                    <span className="font-mono text-black font-semibold text-[11px] block">
                      04 / FOOTWEAR
                    </span>
                    <h5 className="font-bold uppercase text-black text-sm">Oiled Spanish Suede</h5>
                    <p className="text-[#6f6f6f] leading-relaxed">
                      Rough-out split cow suede paired with plantation natural crepe outsoles for quiet, cushioned steps.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : currentView === 'shop' ? (
          <ShopAllPage onOpenProductDetail={handleOpenProductDetail} />
        ) : currentView === 'collections' ? (
          <CollectionsPage
            onOpenFocus={handleOpenFocus}
            onOpenProductDetail={handleOpenProductDetail}
          />
        ) : currentView === 'about' ? (
          <AboutPage onExploreShop={() => navigateTo('shop')} />
        ) : currentView === 'checkout' ? (
          <CheckoutPage onReturnToShop={() => navigateTo('shop')} />
        ) : null}
      </main>

      {/* 3. Redesigned Premium Footer */}
      <footer className="bg-[#ececec] border-t-2 border-black py-16 px-4 sm:px-8 text-black select-none">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand Information & Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight uppercase font-sans-tight">
              MAJU STORE<span className="text-sm align-top ml-1">®</span>
            </div>
            <p className="text-xl font-serif-instrument italic text-neutral-800">
              Stay out of the loop.
            </p>
            <p className="text-xs text-[#6f6f6f] leading-relaxed max-w-sm">
              Vol. 01 — An independent fashion label exploring quiet retreat, minimal silhouettes, and tactile natural textiles. All 27 pieces engineered for permanent daily rotation.
            </p>
            <div className="pt-2 text-[10px] font-mono text-[#6f6f6f] space-y-1">
              <div>STUDIO: TOKYO · BERLIN · NEW YORK</div>
              <div>ENVIRONMENT: MONOCHROME STUDIO #ECECEC</div>
            </div>
          </div>

          {/* Col 3: Directory */}
          <div className="space-y-3 text-xs font-mono">
            <div className="text-[10px] uppercase font-bold text-black tracking-widest border-b border-black/20 pb-2">
              CATALOGUE
            </div>
            <ul className="space-y-2 uppercase text-[#6f6f6f]">
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-black hover:underline transition-colors">
                  Home (3D Lookbook)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('shop')} className="hover:text-black hover:underline transition-colors">
                  Shop All (27 Pieces)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('collections')} className="hover:text-black hover:underline transition-colors">
                  Collections (Vol. 01)
                </button>
              </li>
              <li>
                <button onClick={() => setIsLooksDrawerOpen(true)} className="hover:text-black hover:underline transition-colors">
                  Looks Directory
                </button>
              </li>
              <li>
                <button onClick={() => setIsSearchOpen(true)} className="hover:text-black hover:underline transition-colors">
                  Search Catalog
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Services & Policies */}
          <div className="space-y-3 text-xs font-mono">
            <div className="text-[10px] uppercase font-bold text-black tracking-widest border-b border-black/20 pb-2">
              CLIENT SERVICES
            </div>
            <ul className="space-y-2 text-[#6f6f6f]">
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-black hover:underline transition-colors uppercase">
                  Studio Manifesto
                </button>
              </li>
              <li className="uppercase">Complimentary Express</li>
              <li className="uppercase">30-Day Returns</li>
              <li className="uppercase">Care & Laundering</li>
              <li className="uppercase">Whole-Fit Savings (−10%)</li>
            </ul>
          </div>

          {/* Col 5: Interactive Newsletter Signup */}
          <div className="space-y-3">
            <div className="text-[10px] font-mono uppercase font-bold text-black tracking-widest border-b border-black/20 pb-2">
              JOIN THE QUIET LIST
            </div>
            <p className="text-xs text-[#6f6f6f] leading-relaxed">
              Occasional dispatches on new silhouette volumes and private archive releases.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const emailInput = form.elements.namedItem('email') as HTMLInputElement;
                if (emailInput && emailInput.value.includes('@')) {
                  localStorage.setItem('maju_newsletter_subscribed', emailInput.value);
                  form.reset();
                  alert('Thank you for joining the Quiet List. You are now subscribed.');
                }
              }}
              className="mt-3 space-y-2"
            >
              <div className="flex items-center rounded-full border border-black overflow-hidden bg-white p-1">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter email..."
                  className="w-full px-3 py-1 text-xs focus:outline-none font-sans text-black placeholder-[#6f6f6f]"
                />
                <button
                  type="submit"
                  className="btn-primary !py-1.5 !px-3 !text-[10px] shrink-0"
                >
                  Join
                </button>
              </div>
              <span className="text-[9px] font-mono text-[#6f6f6f] block">
                Zero spam. Instant one-click unsubscribe anytime.
              </span>
            </form>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="max-w-7xl mx-auto mt-14 pt-6 border-t border-dashed border-black/30 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#6f6f6f] gap-4">
          <div className="flex items-center gap-4">
            <span>© 2026 MAJU STORE®. All rights reserved.</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Currency: PKR</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Vol. 01 Edition</span>
            <span>·</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-black font-semibold hover:underline"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>

      {/* 4. Interactive 3D Focus Mode Modal with Side Receipt */}
      {activeFocusLook && (
        <FocusViewer
          look={activeFocusLook}
          initialItemIndex={focusInitialItemIndex}
          onClose={() => setActiveFocusLook(null)}
          onOpenProductDetail={handleOpenProductDetail}
        />
      )}

      {/* 5. Complete Looks Directory Drawer (Left side) */}
      <LooksDrawer
        isOpen={isLooksDrawerOpen}
        onClose={() => setIsLooksDrawerOpen(false)}
        onSelectLook={(look) => {
          handleOpenFocus(look);
        }}
      />

      {/* 6. Shopping Bag Slide-Over Drawer (Right side) */}
      <BagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        onProceedToCheckout={() => navigateTo('checkout')}
      />

      {/* 7. Search Overlay Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={handleOpenProductDetail}
      />

      {/* 8. Toast Feedback Alerts */}
      <div className="fixed bottom-6 right-6 z-100 space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-black text-white px-4 py-3 rounded-xl border border-white/20 shadow-2xl flex items-center justify-between gap-4 min-w-[280px] animate-fadeIn"
          >
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-200">
                {toast.title}
              </div>
              <div className="text-xs text-neutral-300 mt-0.5 font-serif-instrument italic">
                {toast.subtitle}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white text-xs font-mono"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <NowhereStore />
    </CartProvider>
  );
}
