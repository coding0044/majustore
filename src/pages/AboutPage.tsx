/**
 * MAJU STORE® Page 08 — ABOUT MAJU STORE
 * High-Fashion Editorial Brand Story & Studio Manifesto
 * "Stay out of the loop."
 * "Vol. 01. Nine looks for going quiet."
 */

import React from 'react';
import { LOOKS, px } from '../data/fashionData';

export const AboutPage: React.FC<{ onExploreShop: () => void }> = ({ onExploreShop }) => {
  return (
    <div className="pt-20 md:pt-24 pb-28 px-4 sm:px-8 max-w-6xl mx-auto min-h-screen text-black">
      {/* Editorial Header */}
      <div className="border-b border-black pb-10 sm:pb-12 pt-2 sm:pt-4 text-center max-w-3xl mx-auto">
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#6f6f6f] mb-3">
          EDITORIAL ESSAY · MONOCHROME ARCHIVE
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight uppercase font-sans-tight">
          MAJU STORE<span className="text-2xl sm:text-3xl align-top ml-1">®</span>
        </h1>
        <p className="text-2xl sm:text-4xl font-serif-instrument italic mt-3 text-neutral-800">
          Stay out of the loop.
        </p>
        <p className="text-xs font-mono uppercase tracking-widest text-[#6f6f6f] mt-4">
          VOL. 01 — NINE LOOKS FOR GOING QUIET.
        </p>
      </div>

      {/* Editorial Split Hero: Manifesto + Model Cutouts */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left: Manifesto Text */}
        <div className="lg:col-span-7 space-y-6">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#6f6f6f]">
            THE FOUNDING MANIFESTO
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-instrument leading-snug">
            "A deliberate step away from algorithm-driven urgency into physical tactile stillness."
          </h2>
          <p className="text-xs sm:text-sm text-[#6f6f6f] leading-relaxed">
            MAJU STORE® was conceived as an antidote to the ceaseless cadence of contemporary fast fashion. Rather than producing dozens of fragmented drops, Vol. 01 presents nine coherent silhouettes designed to be worn as complete outfits or integrated effortlessly into a permanent wardrobe.
          </p>
          <p className="text-xs sm:text-sm text-[#6f6f6f] leading-relaxed">
            By eliminating seasonal trend chasing, we focus entirely on the relationship between fabric weight, garment drape, and subtle structural precision.
          </p>

          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={onExploreShop}
              className="btn-primary !py-3 !px-6 text-xs tracking-wider"
            >
              EXPLORE THE COLLECTION
            </button>
            <span className="text-[10px] font-mono uppercase text-[#6f6f6f]">
              27 Pieces · 9 Looks
            </span>
          </div>
        </div>

        {/* Right: Studio Imagery Preview */}
        <div className="lg:col-span-5 flex items-center justify-center p-6 bg-white rounded-2xl border border-dashed border-black/20 shadow-sm">
          <div className="h-[360px] sm:h-[420px] w-auto aspect-[1/2] flex items-end justify-center">
            <img
              src={px(LOOKS[0].modelFile, 571)}
              alt="MAJU STORE Look 01 Editorial"
              className="h-full object-contain object-bottom drop-shadow-md"
            />
          </div>
        </div>
      </div>

      {/* 3 Core Design Pillars */}
      <div className="mt-24 pt-16 border-t border-black">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#6f6f6f]">
            DESIGN DISCIPLINE
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight font-sans-tight mt-1">
            THE THREE PILLARS
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl border border-dashed border-black/20 space-y-3">
            <div className="text-xs font-mono text-black font-bold">01 / PROPORTION</div>
            <h4 className="text-base font-bold uppercase">The Whole-Fit Silhouette</h4>
            <p className="text-xs text-[#6f6f6f] leading-relaxed">
              Every look is engineered as a unified visual composition. The tension between wide-leg trousers, structured outerwear, and relaxed knitwear creates an architectural calm that requires no ornament.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-dashed border-black/20 space-y-3">
            <div className="text-xs font-mono text-black font-bold">02 / CANVAS</div>
            <h4 className="text-base font-bold uppercase">#ECECEC Studio Grey</h4>
            <p className="text-xs text-[#6f6f6f] leading-relaxed">
              We reject high-saturation neon and distracting colorways. The signature studio neutral allows unbleached cotton, mineral-washed black, and midnight navy to communicate their natural depth.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-dashed border-black/20 space-y-3">
            <div className="text-xs font-mono text-black font-bold">03 / TACTILITY</div>
            <h4 className="text-base font-bold uppercase">Honest Materiality</h4>
            <p className="text-xs text-[#6f6f6f] leading-relaxed">
              Extrafine Australian Merino wool, Japanese selvedge denim from Kuroki Mills, Normandy flax linen, and natural plantation crepe rubber soles. Garments designed to wear in, not wear out.
            </p>
          </div>
        </div>
      </div>

      {/* Founding Leadership: Faraz Ahmed & Kashan Ahmed */}
      <div className="mt-24 pt-16 border-t border-black">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#6f6f6f]">
            FOUNDING LEADERSHIP
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight font-sans-tight mt-1">
            FARAZ AHMED & KASHAN AHMED
          </h3>
          <p className="text-xs sm:text-sm text-[#6f6f6f] mt-2 font-serif-instrument italic">
            "Directing form, materiality, and the quiet architecture of Vol. 01."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-7 sm:p-8 bg-white rounded-2xl border border-dashed border-black/25 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#6f6f6f]">
                CO-FOUNDER & CREATIVE DIRECTOR
              </div>
              <h4 className="text-xl sm:text-2xl font-bold uppercase tracking-tight mt-1">
                FARAZ AHMED
              </h4>
              <p className="text-xs sm:text-sm text-[#6f6f6f] leading-relaxed mt-3">
                Oversees silhouette proportion, architectural draping, and the visual language of MAJU STORE®. Faraz leads the design of each Vol. 01 silhouette with a focus on restrained structural calm, raw textural tension, and garments engineered to exist outside transient seasonal cycles.
              </p>
            </div>
            <div className="pt-4 border-t border-dashed border-black/15 text-[10px] font-mono text-black font-medium flex items-center justify-between">
              <span>FOCUS: FORM, SILHOUETTE & VISUAL DIRECTION</span>
              <span>EST. 2026</span>
            </div>
          </div>

          <div className="p-7 sm:p-8 bg-white rounded-2xl border border-dashed border-black/25 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#6f6f6f]">
                CO-FOUNDER & MANAGING DIRECTOR
              </div>
              <h4 className="text-xl sm:text-2xl font-bold uppercase tracking-tight mt-1">
                KASHAN AHMED
              </h4>
              <p className="text-xs sm:text-sm text-[#6f6f6f] leading-relaxed mt-3">
                Directs global textile sourcing, mill partnerships, and craftsmanship standards. Kashan curates MAJU STORE®'s physical materials—partnering with historic weavers from Kuroki Mills in Okayama to Normandy flax producers—ensuring honest construction and permanent durability.
              </p>
            </div>
            <div className="pt-4 border-t border-dashed border-black/15 text-[10px] font-mono text-black font-medium flex items-center justify-between">
              <span>FOCUS: TEXTILE SOURCING & ATELIER OPERATIONS</span>
              <span>EST. 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Studio Locations Grid */}
      <div className="mt-24 pt-16 border-t border-dashed border-black/20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#6f6f6f]">
              GLOBAL PHYSICAL HUBS
            </div>
            <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
              STUDIO APPOINTMENTS
            </h3>
          </div>
          <div className="text-xs font-mono text-[#6f6f6f]">
            Private fitting sessions by appointment
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs font-mono">
          <div className="p-5 bg-white rounded-xl border border-black/15 space-y-2">
            <div className="font-bold text-black uppercase">TOKYO STUDIO</div>
            <p className="text-[#6f6f6f]">3-14-8 Minami-Aoyama, Minato-ku</p>
            <p className="text-[#6f6f6f]">Tokyo 107-0062, Japan</p>
            <span className="inline-block text-[10px] text-black font-semibold mt-2 underline">
              Book Appointment ↗
            </span>
          </div>

          <div className="p-5 bg-white rounded-xl border border-black/15 space-y-2">
            <div className="font-bold text-black uppercase">BERLIN ATELIER</div>
            <p className="text-[#6f6f6f]">Torstraße 94, Mitte</p>
            <p className="text-[#6f6f6f]">10119 Berlin, Germany</p>
            <span className="inline-block text-[10px] text-black font-semibold mt-2 underline">
              Book Appointment ↗
            </span>
          </div>

          <div className="p-5 bg-white rounded-xl border border-black/15 space-y-2">
            <div className="font-bold text-black uppercase">NEW YORK ARCHIVE</div>
            <p className="text-[#6f6f6f]">76 Mercer Street, SoHo</p>
            <p className="text-[#6f6f6f]">New York, NY 10012, USA</p>
            <span className="inline-block text-[10px] text-black font-semibold mt-2 underline">
              Book Appointment ↗
            </span>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-20 pt-12 border-t border-black text-center">
        <h3 className="text-2xl font-serif-instrument">
          Discover the complete Vol. 01 Catalogue
        </h3>
        <p className="text-xs text-[#6f6f6f] font-mono mt-1 mb-6 uppercase tracking-wider">
          Complimentary insured worldwide shipping on all qualifying orders
        </p>
        <button
          onClick={onExploreShop}
          className="btn-primary !py-3.5 !px-8 text-xs tracking-wider"
        >
          VIEW ALL 27 GARMENTS
        </button>
      </div>
    </div>
  );
};
