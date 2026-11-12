/**
 * NOWHERE® Signature 3D Lookbook Experience
 * - Circular 3D ring with 9 transparent PNG model cut-outs
 * - Exact trigonometric positioning: STEP = 2*PI / 9
 * - Continuous spring physics with inertia, mouse drag, touch drag, and arrow keys
 * - Depth-based scaling, blur, opacity, dynamic z-index
 * - Ring / Grid editorial morphing
 * - Left Looks drawer toggle, Right Ring/Grid toggle, Bottom dock with 3-item previews & Shop This Fit
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { directCdn, formatMoney, getProductImageStyle, LOOKS, LookData, ProductItem, px } from '../data/fashionData';

interface Lookbook3DProps {
  onOpenFocus: (look: LookData, itemIndex?: number | null) => void;
  onOpenLooksDrawer: () => void;
  onOpenProductDetail: (product: ProductItem) => void;
}

const STEP = (2 * Math.PI) / 9;

export const Lookbook3D: React.FC<Lookbook3DProps> = ({
  onOpenFocus,
  onOpenLooksDrawer,
  onOpenProductDetail,
}) => {
  const [viewMode, setViewMode] = useState<'ring' | 'grid'>('ring');
  const [activeLookIndex, setActiveLookIndex] = useState(0); // 0 to 8
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Animation and physics refs
  const currentAngleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const velocityRef = useRef(0);
  const lastMouseXRef = useRef(0);
  const mouseTiltRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const modelsContainerRef = useRef<HTMLDivElement>(null);

  // Determine active look based on current spring angle
  const updateActiveLook = useCallback((angle: number) => {
    // Normalise angle to positive modulo 2*PI
    let normalized = (-angle % (2 * Math.PI));
    if (normalized < 0) normalized += 2 * Math.PI;

    // Active look is the one closest to bottom front (angle = 0 in our coordinate map)
    const index = Math.round(normalized / STEP) % 9;
    setActiveLookIndex(index);
  }, []);

  // Main physics loop running on requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Autoplay progression
      if (isAutoplay && !isDragging && viewMode === 'ring') {
        targetAngleRef.current -= 0.25 * dt;
      }

      // Spring physics (critically damped towards targetAngle)
      if (viewMode === 'ring') {
        const diff = targetAngleRef.current - currentAngleRef.current;
        // Spring tension & damping
        const springForce = diff * 12.0;
        velocityRef.current += springForce * dt;
        velocityRef.current *= Math.pow(0.85, dt * 60); // friction damping
        currentAngleRef.current += velocityRef.current * dt;

        updateActiveLook(currentAngleRef.current);

        // Direct DOM transform updates for peak 60fps performance
        if (modelsContainerRef.current) {
          const modelEls = modelsContainerRef.current.children;
          const containerRect = containerRef.current?.getBoundingClientRect();
          const width = containerRect ? containerRect.width : 1000;
          const height = containerRect ? containerRect.height : 680;

          // Responsive ellipse radii for mobile vs desktop:
          const isMobile = width < 640;
          const isTablet = width >= 640 && width < 1024;
          const rx = isMobile ? Math.min(width * 0.33, 160) : isTablet ? Math.min(width * 0.36, 360) : Math.min(width * 0.38, 520);
          const ry = isMobile ? Math.min(height * 0.16, 100) : isTablet ? Math.min(height * 0.19, 130) : Math.min(height * 0.22, 160);

          for (let i = 0; i < 9; i++) {
            const el = modelEls[i] as HTMLElement;
            if (!el) continue;

            const look = LOOKS[i];
            const theta = currentAngleRef.current + i * STEP;

            // Coordinates on ellipse
            const x = Math.sin(theta) * rx;
            const y = Math.cos(theta) * ry;

            // Depth calculation: cos(theta) = 1 is front, -1 is back
            // Map [-1, 1] -> [0, 1]
            const zNorm = (Math.cos(theta) + 1) / 2;

            const baseScale = isMobile ? 0.68 : 0.62;
            const scaleRange = isMobile ? 0.45 : 0.58;
            const scale = baseScale + scaleRange * zNorm;
            const opacity = 0.40 + 0.60 * zNorm;
            const blur = (1 - zNorm) * 2.8;
            const zIndex = Math.round(zNorm * 100);

            // Foot offset applied to Y
            const footOffsetY = look.footOffset * (isMobile ? 120 : 180);

            // Parallax offset
            const pxOffset = mouseTiltRef.current.x * (zNorm * (isMobile ? 8 : 18));
            const pyOffset = mouseTiltRef.current.y * (zNorm * (isMobile ? 6 : 12));

            el.style.transform = `translate3d(${x + pxOffset}px, ${y + footOffsetY + pyOffset}px, 0px) scale(${scale})`;
            el.style.opacity = `${opacity}`;
            el.style.filter = `blur(${blur}px)`;
            el.style.zIndex = `${zIndex}`;
          }
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAutoplay, isDragging, viewMode, updateActiveLook]);

  // Pointer/Drag Handlers for smooth mouse and touch
  const handlePointerDown = (e: React.PointerEvent) => {
    if (viewMode !== 'ring') return;
    setIsDragging(true);
    lastMouseXRef.current = e.clientX;
    velocityRef.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // Parallax update
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseTiltRef.current = { x: nx, y: ny };
    }

    if (!isDragging || viewMode !== 'ring') return;
    const deltaX = e.clientX - lastMouseXRef.current;
    lastMouseXRef.current = e.clientX;

    const sensitivity = 0.0055;
    targetAngleRef.current += deltaX * sensitivity;
    currentAngleRef.current += deltaX * sensitivity;
    velocityRef.current = deltaX * sensitivity * 40;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    // Snap to nearest look step
    const nearestStep = Math.round(targetAngleRef.current / STEP) * STEP;
    targetAngleRef.current = nearestStep;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        targetAngleRef.current += STEP;
      } else if (e.key === 'ArrowRight') {
        targetAngleRef.current -= STEP;
      } else if (e.key === 'Enter') {
        const active = LOOKS[activeLookIndex];
        if (active) onOpenFocus(active);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLookIndex, onOpenFocus]);

  // Rotate to specific look index
  const rotateToLook = (index: number) => {
    if (viewMode === 'grid') {
      const selected = LOOKS[index];
      if (selected) onOpenFocus(selected);
      return;
    }
    // Calculate shortest angular path to bring look to front (theta = 0)
    const targetAngle = -index * STEP;
    targetAngleRef.current = targetAngle;
  };

  const activeLook = LOOKS[activeLookIndex] || LOOKS[0];

  return (
    <section
      ref={containerRef}
      role="region"
      aria-roledescription={viewMode === 'ring' ? 'carousel' : 'grid of looks'}
      aria-label="MAJU STORE Vol. 01 Fashion Lookbook"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-[90vh] min-h-[640px] max-h-[960px] flex items-center justify-center overflow-hidden select-none bg-[#ececec] cursor-grab active:cursor-grabbing"
    >
      {/* Soft Ambient Lighting Overlay */}
      <div className="absolute inset-0 bg-radial from-white/70 via-transparent to-black/5 pointer-events-none" />

      {/* Center Typography & Dashed Ellipse in Ring Mode */}
      {viewMode === 'ring' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Subtle dashed ring with glint */}
          <div className="absolute w-[82vw] max-w-[940px] h-[340px] rounded-[100%] border border-dashed border-black/20 pointer-events-none glint-effect" />
          <div className="absolute w-[68vw] max-w-[760px] h-[260px] rounded-[100%] border border-dashed border-black/10 pointer-events-none" />

          {/* Centred Title & Subtitle */}
          <div className="text-center z-10 px-4 max-w-xl">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal font-serif-instrument text-black tracking-tight leading-none">
              Stay out of the loop
            </h1>
            <p className="mt-3 text-[10px] md:text-xs uppercase tracking-[0.25em] text-[#6f6f6f] font-mono">
              VOL. 01 — NINE LOOKS FOR GOING QUIET.
            </p>
          </div>
        </div>
      )}

      {/* 3D Ring View Container */}
      <div
        ref={modelsContainerRef}
        className={`absolute inset-0 flex items-center justify-center preserve-3d transition-opacity duration-500 ${
          viewMode === 'ring' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {LOOKS.map((look, i) => {
          const isActive = i === activeLookIndex;
          return (
            <div
              key={look.number}
              onClick={(e) => {
                e.stopPropagation();
                if (isActive) {
                  onOpenFocus(look);
                } else {
                  rotateToLook(i);
                }
              }}
              className="absolute w-[180px] sm:w-[240px] md:w-[320px] h-[380px] sm:h-[480px] md:h-[620px] flex items-end justify-center cursor-pointer transition-filter duration-200 group"
              style={{
                willChange: 'transform, opacity, filter',
              }}
            >
              {/* Subtle foot grounding shadow */}
              <div className="absolute bottom-2 w-28 sm:w-32 h-5 sm:h-6 bg-black/15 rounded-[100%] blur-md pointer-events-none" />

              {/* Model Cut-Out */}
              <img
                src={px(look.modelFile, 914)}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = directCdn(look.modelFile);
                }}
                alt={`Look ${look.numberStr} ${look.name}`}
                className="w-full h-full object-contain object-bottom pointer-events-none drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />

              {/* Quick Tag on Front Active Model */}
              {isActive && (
                <div className="absolute -bottom-4 bg-white/95 backdrop-blur-xs px-2.5 sm:px-3 py-1 rounded-full border border-black/20 text-[9px] sm:text-[10px] uppercase font-mono tracking-wider shadow-sm group-hover:bg-black group-hover:text-white transition-colors">
                  Look {look.numberStr} · Click to Inspect
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Grid Mode View (Morph 3x3 editorial grid) */}
      {viewMode === 'grid' && (
        <div className="relative z-20 w-full max-w-6xl px-4 sm:px-8 py-12 max-h-[80vh] overflow-y-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif-instrument">
              Editorial Index — Vol. 01
            </h2>
            <p className="text-xs font-mono uppercase tracking-widest text-[#6f6f6f] mt-1">
              Select any look to open interactive focus and shopping slip
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {LOOKS.map((look) => (
              <div
                key={look.number}
                onClick={() => onOpenFocus(look)}
                className="group p-4 bg-white/60 hover:bg-white rounded-xl border border-dashed border-black/20 hover:border-black transition-all cursor-pointer shadow-xs hover:shadow-lg"
              >
                <div className="relative aspect-[3/4] w-full flex items-end justify-center overflow-hidden rounded-lg bg-neutral-100/50">
                  <img
                    src={px(look.modelFile, 571)}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = directCdn(look.modelFile);
                    }}
                    alt={`Look ${look.numberStr}`}
                    className="w-full h-full object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 bg-black text-white text-[10px] font-mono px-2 py-0.5 rounded-full">
                    {look.numberStr}
                  </div>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <h3 className="text-sm font-semibold tracking-tight uppercase">
                    {look.name}
                  </h3>
                  <span className="text-xs font-mono tabular-nums text-[#6f6f6f]">
                    {formatMoney(look.total)}
                  </span>
                </div>

                <div className="text-[11px] text-[#6f6f6f] mt-1 truncate">
                  {look.products.map(p => p.name).join(' · ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Left Control: Vertical "LOOKS" pill */}
      <div className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={onOpenLooksDrawer}
          className="pill-button !min-h-[74px] sm:!min-h-[90px] !w-[30px] sm:!w-[36px] !px-0 flex-col gap-1.5 sm:gap-2 group tracking-widest hover:border-black"
          aria-label="Open All Looks Drawer"
        >
          <span className="[writing-mode:vertical-rl] rotate-180 text-[9px] sm:text-[10px] font-bold">
            LOOKS
          </span>
          <span className="text-[8px] sm:text-[9px] font-mono opacity-60">09</span>
        </button>
      </div>

      {/* Right Control: Vertical Ring / Grid Toggle */}
      <div className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={() => setViewMode(prev => (prev === 'ring' ? 'grid' : 'ring'))}
          className="pill-button !min-h-[74px] sm:!min-h-[90px] !w-[30px] sm:!w-[36px] !px-0 flex-col gap-1.5 sm:gap-2 tracking-widest hover:border-black"
          aria-label={`Switch to ${viewMode === 'ring' ? 'Grid' : 'Ring'} view`}
        >
          <span className="[writing-mode:vertical-rl] rotate-180 text-[9px] sm:text-[10px] font-bold">
            {viewMode === 'ring' ? 'GRID' : 'RING'}
          </span>
          <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-black"></span>
        </button>
      </div>

      {/* Bottom Dock Controls */}
      <div className="absolute bottom-3 sm:bottom-4 left-2 right-2 sm:left-8 sm:right-8 z-40 flex items-center justify-between gap-2 pointer-events-none">
        {/* Left: Active Look Counter & Autoplay toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Active look counter "01 / 09" */}
          <div className="pill-button !min-h-[34px] sm:!min-h-[36px] !py-1 !px-2.5 sm:!px-4 font-mono font-bold tracking-widest text-[10px] sm:text-[11px]">
            {activeLook.numberStr} <span className="text-[#6f6f6f] font-normal mx-0.5 sm:mx-1">/</span> 09
          </div>

          {/* Autoplay button */}
          <button
            onClick={() => setIsAutoplay(prev => !prev)}
            className={`pill-button !min-h-[34px] sm:!min-h-[36px] !py-1 !px-2.5 sm:!px-3.5 text-[10px] sm:text-[11px] transition-colors ${
              isAutoplay ? '!bg-black !text-white !border-solid' : ''
            }`}
            aria-label="Toggle Lookbook Rotation Autoplay"
          >
            {isAutoplay ? '⏸' : '▶'} <span className="hidden xs:inline ml-0.5">{isAutoplay ? 'Pause' : 'Auto'}</span>
          </button>

          {/* Current look name */}
          <div className="hidden lg:block pill-button !min-h-[36px] !py-1 !px-4 font-medium">
            <span className="uppercase text-[10px] tracking-wider text-[#6f6f6f] mr-2">LOOK:</span>
            <span className="font-serif-instrument italic text-sm">{activeLook.name}</span>
          </div>
        </div>

        {/* Center: 3 Product Preview Pills */}
        <div className="hidden xl:flex items-center gap-2 pointer-events-auto">
          {activeLook.products.map((prod, idx) => (
            <button
              key={prod.id}
              onClick={() => onOpenFocus(activeLook, idx)}
              className="pill-button !min-h-[36px] !py-1 !px-2.5 flex items-center gap-2 group hover:scale-102"
              title={`View ${prod.name}`}
            >
              <div
                style={getProductImageStyle(activeLook.number, idx)}
                className="w-5 h-5 rounded-full bg-neutral-300 border border-black/20 shrink-0"
              />
              <span className="truncate max-w-[120px] text-[10px] font-normal">
                {prod.name}
              </span>
              <span className="text-[10px] font-mono tabular-nums text-[#6f6f6f] group-hover:text-neutral-200">
                {formatMoney(prod.price)}
              </span>
            </button>
          ))}
        </div>

        {/* Right: "SHOP THIS FIT" Button */}
        <div className="pointer-events-auto">
          <button
            onClick={() => onOpenFocus(activeLook)}
            className="btn-primary !min-h-[34px] sm:!min-h-[38px] !px-3.5 sm:!px-6 flex items-center gap-1.5 sm:gap-2 shadow-md hover:shadow-xl active:scale-95 text-[10px] sm:text-[11px]"
          >
            <span>SHOP THIS FIT</span>
            <span className="font-mono tabular-nums opacity-80 text-[9px] sm:text-[10px]">
              ({formatMoney(activeLook.total)})
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
