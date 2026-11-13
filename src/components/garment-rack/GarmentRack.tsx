import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GarmentPiece } from '@/src/data/garments';
import { CHROME_EASE, RACK_EASE, RACK_GEOMETRY, RACK_TIMING } from './motion';

export interface GarmentRackProps {
  items: GarmentPiece[];
  /** Controlled hovered / previewed piece ID */
  hoveredId?: string | null;
  onHoveredIdChange?: (id: string | null) => void;
  /** Controlled focused / expanded piece ID */
  focusedId?: string | null;
  onFocusedIdChange?: (id: string | null) => void;
  /** Callback when user clicks the piece action button inside Focus mode */
  onInspectPiece?: (piece: GarmentPiece) => void;
  /** Optional callback for the centered rack action button below the rail */
  onOpenCatalog?: () => void;
  catalogButtonLabel?: string;
  /** Optional label shown in Focus mode action button */
  inspectButtonLabel?: string;
  className?: string;
}

export const GarmentRack: React.FC<GarmentRackProps> = ({
  items,
  hoveredId: controlledHoveredId,
  onHoveredIdChange,
  focusedId: controlledFocusedId,
  onFocusedIdChange,
  onInspectPiece,
  onOpenCatalog,
  catalogButtonLabel = 'See Availability',
  inspectButtonLabel = 'See Availability',
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();

  const [internalHoveredId, setInternalHoveredId] = useState<string | null>(null);
  const [internalFocusedId, setInternalFocusedId] = useState<string | null>(null);

  const hoveredId = controlledHoveredId !== undefined ? controlledHoveredId : internalHoveredId;
  const focusedId = controlledFocusedId !== undefined ? controlledFocusedId : internalFocusedId;

  const setHoveredId = useCallback(
    (id: string | null) => {
      if (controlledHoveredId === undefined) setInternalHoveredId(id);
      onHoveredIdChange?.(id);
    },
    [controlledHoveredId, onHoveredIdChange]
  );

  const setFocusedId = useCallback(
    (id: string | null) => {
      if (controlledFocusedId === undefined) setInternalFocusedId(id);
      onFocusedIdChange?.(id);
    },
    [controlledFocusedId, onFocusedIdChange]
  );

  const [focusTransitionMode, setFocusTransitionMode] = useState<'rack' | 'nav'>('rack');
  const [navDirection, setNavDirection] = useState<1 | -1>(1);
  const [entryDelta, setEntryDelta] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const stageRef = useRef<HTMLDivElement>(null);
  const focusFrameRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const itemButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [stageWidth, setStageWidth] = useState<number>(1120);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const updateWidth = () => {
      setStageWidth(el.clientWidth || 1120);
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const hoveredIndex = useMemo(
    () => (hoveredId ? items.findIndex((item) => item.id === hoveredId) : -1),
    [items, hoveredId]
  );

  const focusedIndex = useMemo(
    () => (focusedId ? items.findIndex((item) => item.id === focusedId) : -1),
    [items, focusedId]
  );

  const focusedPiece = focusedIndex >= 0 ? items[focusedIndex] : null;
  const isFocusOpen = focusedPiece !== null;

  // Responsive spatial geometry (works cleanly from 360px up to 1440px+)
  const isCompact = stageWidth < 640;
  const garmentHeight = useMemo(() => {
    if (isCompact) return Math.round(Math.min(248, Math.max(198, stageWidth * 0.58)));
    return Math.round(Math.min(390, Math.max(275, stageWidth * 0.35)));
  }, [isCompact, stageWidth]);

  const garmentWidth = Math.round(garmentHeight * (560 / 750));

  // Tight boutique cluster spacing so garments sit naturally together along a wider chrome rail
  const slotSpacing = useMemo(() => {
    if (items.length <= 1) return 0;
    const horizontalMargin = isCompact ? 66 : 260;
    const maxSpan = Math.max(180, stageWidth - horizontalMargin);
    return Math.min(90, maxSpan / (items.length - 1));
  }, [isCompact, items.length, stageWidth]);

  const spreadAmount = useMemo(() => {
    if (isCompact) return Math.min(26, slotSpacing * 0.52);
    return Math.min(RACK_GEOMETRY.neighborSpreadPx, slotSpacing * 1.05);
  }, [isCompact, slotSpacing]);

  const getSlotOffsetX = useCallback(
    (index: number) => {
      const centerIndex = (items.length - 1) / 2;
      return (index - centerIndex) * slotSpacing;
    },
    [items.length, slotSpacing]
  );

  const railWidth = useMemo(() => {
    if (items.length === 0) return stageWidth * 0.8;
    const baseSpan = (items.length - 1) * slotSpacing;
    const padding = isCompact ? 64 : 260;
    return Math.min(stageWidth - (isCompact ? 16 : 48), baseSpan + padding);
  }, [isCompact, items.length, slotSpacing, stageWidth]);

  const measureSlotDeltaToCenter = useCallback((pieceId: string, fallbackX: number) => {
    const slotEl = slotRefs.current[pieceId];
    if (!slotEl || typeof window === 'undefined') {
      return { x: fallbackX, y: 0 };
    }
    const rect = slotEl.getBoundingClientRect();
    const slotCenterX = rect.left + rect.width / 2;
    const slotCenterY = rect.top + rect.height / 2;
    const viewportCenterX = window.innerWidth / 2;
    // Focus garment container sits slightly above viewport center because of caption block below it
    const targetCenterY = window.innerHeight / 2 - 54;
    return {
      x: Math.round(slotCenterX - viewportCenterX),
      y: Math.round(slotCenterY - targetCenterY),
    };
  }, []);

  const openFocusForIndex = useCallback(
    (index: number) => {
      const piece = items[index];
      if (!piece) return;
      setFocusTransitionMode('rack');
      setEntryDelta(measureSlotDeltaToCenter(piece.id, getSlotOffsetX(index)));
      setHoveredId(null);
      setFocusedId(piece.id);
    },
    [getSlotOffsetX, items, measureSlotDeltaToCenter, setFocusedId, setHoveredId]
  );

  const closeFocus = useCallback(() => {
    const returnId = focusedId;
    if (returnId) {
      const idx = items.findIndex((i) => i.id === returnId);
      setEntryDelta(measureSlotDeltaToCenter(returnId, idx >= 0 ? getSlotOffsetX(idx) : 0));
    }
    setFocusTransitionMode('rack');
    setFocusedId(null);
    setHoveredId(null);
    if (returnId) {
      requestAnimationFrame(() => {
        itemButtonRefs.current[returnId]?.focus();
      });
    }
  }, [focusedId, getSlotOffsetX, items, measureSlotDeltaToCenter, setFocusedId, setHoveredId]);

  const stepFocus = useCallback(
    (direction: 1 | -1) => {
      if (items.length === 0) return;
      const baseIndex = focusedIndex >= 0 ? focusedIndex : 0;
      const nextIndex = (baseIndex + direction + items.length) % items.length;
      setFocusTransitionMode('nav');
      setNavDirection(direction);
      setFocusedId(items[nextIndex].id);
    },
    [focusedIndex, items, setFocusedId]
  );

  useEffect(() => {
    if (focusedId) {
      const timer = window.setTimeout(() => {
        closeButtonRef.current?.focus({ preventScroll: true });
      }, 60);

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeFocus();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          stepFocus(1);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          stepFocus(-1);
        }
      };

      window.addEventListener('keydown', onKeyDown);
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener('keydown', onKeyDown);
      };
    }
  }, [focusedId, closeFocus, stepFocus]);

  const handleItemKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (isFocusOpen) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = items[(index + 1) % items.length];
      if (next) {
        setHoveredId(next.id);
        itemButtonRefs.current[next.id]?.focus();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = items[(index - 1 + items.length) % items.length];
      if (prev) {
        setHoveredId(prev.id);
        itemButtonRefs.current[prev.id]?.focus();
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      const first = items[0];
      if (first) {
        setHoveredId(first.id);
        itemButtonRefs.current[first.id]?.focus();
      }
    } else if (e.key === 'End') {
      e.preventDefault();
      const last = items[items.length - 1];
      if (last) {
        setHoveredId(last.id);
        itemButtonRefs.current[last.id]?.focus();
      }
    }
  };

  // Normalized hook throat sits at ~6.8% inside the 560x750 garment frame
  const railTopOffset = Math.round(garmentHeight * 0.068);
  const interactiveHitWidth = Math.max(44, Math.round(slotSpacing * 0.92));

  return (
    <section
      ref={stageRef}
      aria-label="Hanging garment portfolio rack"
      className={`relative w-full select-none ${className}`}
    >
      {/* Main Interactive Rack Stage */}
      <div
        className="relative mx-auto flex flex-col items-center justify-center"
        style={{ height: garmentHeight + (isCompact ? 112 : 124) }}
        onMouseLeave={() => {
          if (!isFocusOpen) setHoveredId(null);
        }}
      >
        {/* Rack + Rail Layer (ghosted and depth-of-field blurred in Focus mode) */}
        <motion.div
          className="relative w-full"
          style={{ height: garmentHeight + 48 }}
          animate={{
            opacity: isFocusOpen ? RACK_GEOMETRY.ghostRackOpacity : 1,
            filter: isFocusOpen
              ? prefersReducedMotion
                ? 'none'
                : `blur(${RACK_GEOMETRY.ghostRackBlurPx}px)`
              : 'blur(0px)',
            scale: isFocusOpen && !prefersReducedMotion ? 0.985 : 1,
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : RACK_TIMING.chromeFade * 1.4,
            ease: CHROME_EASE,
          }}
        >
          {/* Brushed-Chrome Horizontal Garment Rail */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 z-[2] -translate-x-1/2"
            style={{
              top: railTopOffset,
              width: railWidth,
            }}
          >
            {/* Wall cast shadow below rail */}
            <div
              className="absolute inset-x-3 top-2.5 h-3 rounded-full blur-[5px]"
              style={{ background: 'var(--rack-shadow)' }}
            />

            {/* Metallic bar */}
            <div
              className="relative h-[9px] w-full rounded-full"
              style={{
                background:
                  'linear-gradient(180deg, var(--rack-metal-mid) 0%, var(--rack-metal-highlight) 32%, var(--rack-metal-light) 56%, var(--rack-metal-dark) 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65), 0 1px 2px rgba(24,24,22,0.18)',
              }}
            />

            {/* Left wall mounting bracket */}
            <div
              className="absolute -left-2 -top-[5px] flex h-[19px] w-[14px] items-center justify-center rounded-sm border border-black/15"
              style={{
                background:
                  'linear-gradient(135deg, var(--rack-metal-highlight) 0%, var(--rack-metal-mid) 65%, var(--rack-metal-dark) 100%)',
                boxShadow: '0 2px 5px rgba(24,24,22,0.2)',
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-black/25" />
            </div>

            {/* Right wall mounting bracket */}
            <div
              className="absolute -right-2 -top-[5px] flex h-[19px] w-[14px] items-center justify-center rounded-sm border border-black/15"
              style={{
                background:
                  'linear-gradient(135deg, var(--rack-metal-highlight) 0%, var(--rack-metal-mid) 65%, var(--rack-metal-dark) 100%)',
                boxShadow: '0 2px 5px rgba(24,24,22,0.2)',
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-black/25" />
            </div>
          </div>

          {/* Hanging Garment Slots */}
          <div role="list" aria-label="Studio garment editions" className="relative z-10 h-full w-full">
            {items.map((piece, index) => {
              const baseOffsetX = getSlotOffsetX(index);
              const isHovered = !isFocusOpen && hoveredIndex === index;
              const isFocusedItem = focusedId === piece.id;

              let neighborOffsetX = 0;
              let pendulumDeg = 0;

              if (!isFocusOpen && hoveredIndex !== -1 && index !== hoveredIndex) {
                const delta = index - hoveredIndex;
                const sign = delta > 0 ? 1 : -1;
                const distance = Math.abs(delta);
                const falloff = distance === 1 ? 1 : Math.max(0.46, 1 - (distance - 1) * 0.14);
                neighborOffsetX = sign * spreadAmount * falloff;

                if (!prefersReducedMotion) {
                  if (distance === 1) {
                    pendulumDeg = -sign * RACK_GEOMETRY.adjacentTiltDeg;
                  } else if (distance === 2) {
                    pendulumDeg = -sign * RACK_GEOMETRY.secondaryTiltDeg;
                  }
                }
              }

              return (
                <motion.div
                  ref={(el) => {
                    slotRefs.current[piece.id] = el;
                  }}
                  key={piece.id}
                  role="listitem"
                  className="pointer-events-none absolute top-0 left-1/2"
                  style={{
                    width: garmentWidth,
                    height: garmentHeight,
                    marginLeft: -garmentWidth / 2,
                    transformOrigin: '50% 6.8%',
                    zIndex: isHovered ? 30 : 10 + index,
                  }}
                  initial={false}
                  animate={{
                    x: baseOffsetX + neighborOffsetX,
                    rotate: pendulumDeg,
                    opacity: isFocusOpen && isFocusedItem ? 0 : 1,
                    scale: isHovered && !prefersReducedMotion ? 1.03 : 1,
                  }}
                  transition={{
                    x: {
                      duration: prefersReducedMotion ? 0 : RACK_TIMING.neighborSpread,
                      ease: RACK_EASE,
                    },
                    rotate: {
                      duration: prefersReducedMotion ? 0 : RACK_TIMING.neighborSpread,
                      ease: RACK_EASE,
                    },
                    scale: {
                      duration: prefersReducedMotion ? 0 : RACK_TIMING.hoverExpand,
                      ease: RACK_EASE,
                    },
                    opacity: {
                      duration: prefersReducedMotion ? 0 : RACK_TIMING.chromeFade,
                      ease: CHROME_EASE,
                    },
                  }}
                >
                  {/* Steady hit target prevents opened sleeves from blocking adjacent garments */}
                  <button
                    ref={(el) => {
                      itemButtonRefs.current[piece.id] = el;
                    }}
                    type="button"
                    aria-label={`${piece.indexLabel} — ${piece.title}, ${piece.colorway}. Activate to inspect piece.`}
                    aria-expanded={isFocusedItem}
                    onPointerEnter={(e) => {
                      if (e.pointerType !== 'touch' && !isFocusOpen) {
                        setHoveredId(piece.id);
                      }
                    }}
                    onFocus={() => {
                      if (!isFocusOpen) setHoveredId(piece.id);
                    }}
                    onBlur={(e) => {
                      if (!isFocusOpen && e.currentTarget !== document.activeElement) {
                        setHoveredId(null);
                      }
                    }}
                    onKeyDown={(e) => handleItemKeyDown(e, index)}
                    onClick={() => openFocusForIndex(index)}
                    className="no-js-rack-item group relative mx-auto block h-full cursor-pointer rounded-md bg-transparent focus-visible:outline-2 focus-visible:outline-offset-4"
                    style={{
                      width: interactiveHitWidth,
                      minWidth: 44,
                      minHeight: 44,
                      pointerEvents: isFocusOpen ? 'none' : 'auto',
                      perspective: 1000,
                    }}
                  >
                    {/* 3/4 Side-profile hanging silhouette (Idle state) */}
                    <motion.img
                      src={piece.sideImage}
                      alt={piece.altSide}
                      draggable={false}
                      className="rack-side-layer pointer-events-none absolute top-0 left-1/2 h-full max-w-none -translate-x-1/2 object-contain"
                      style={{
                        width: garmentWidth,
                        filter: 'drop-shadow(0 12px 14px rgba(24, 24, 22, 0.12))',
                      }}
                      initial={false}
                      animate={{
                        opacity: isHovered ? 0 : 1,
                        rotateY: isHovered && !prefersReducedMotion ? RACK_GEOMETRY.turnAngleDeg : 0,
                        scaleX: isHovered && !prefersReducedMotion ? 0.78 : 1,
                      }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : RACK_TIMING.hoverExpand * 0.75,
                        ease: RACK_EASE,
                      }}
                    />

                    {/* Front-facing garment view (Hover / Active preview state) */}
                    <motion.img
                      src={piece.frontImage}
                      alt={piece.altFront}
                      draggable={false}
                      className="rack-front-layer pointer-events-none absolute top-0 left-1/2 h-full max-w-none -translate-x-1/2 object-contain"
                      style={{
                        width: garmentWidth,
                        filter: 'drop-shadow(0 18px 24px rgba(24, 24, 22, 0.16))',
                      }}
                      initial={false}
                      animate={{
                        opacity: isHovered ? 1 : 0,
                        rotateY: isHovered ? 0 : prefersReducedMotion ? 0 : -RACK_GEOMETRY.turnAngleDeg,
                        scaleX: isHovered ? 1 : prefersReducedMotion ? 1 : 0.44,
                      }}
                      transition={{
                        opacity: {
                          duration: prefersReducedMotion ? 0 : RACK_TIMING.hoverExpand * 0.8,
                          ease: RACK_EASE,
                        },
                        rotateY: {
                          duration: prefersReducedMotion ? 0 : RACK_TIMING.hoverExpand,
                          ease: RACK_EASE,
                        },
                        scaleX: {
                          duration: prefersReducedMotion ? 0 : RACK_TIMING.hoverExpand,
                          ease: RACK_EASE,
                        },
                      }}
                    />
                  </button>

                  {/* Hover Caption Tracked Directly Beneath This Garment */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 2 }}
                        transition={{
                          duration: prefersReducedMotion ? 0 : RACK_TIMING.chromeFade,
                          delay: prefersReducedMotion ? 0 : RACK_TIMING.hoverCaptionDelay,
                          ease: RACK_EASE,
                        }}
                        className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center"
                        style={{ top: garmentHeight + 4 }}
                      >
                        <p className="text-[11px] font-medium tracking-wide text-[var(--color-ink-muted)]">
                          {piece.title}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom Rack CTA (See Availability) */}
        <motion.div
          className="absolute bottom-0 left-1/2 flex w-full max-w-md -translate-x-1/2 flex-col items-center gap-2 px-4 text-center"
          animate={{
            opacity: isFocusOpen ? 0 : 1,
            pointerEvents: isFocusOpen ? 'none' : 'auto',
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : RACK_TIMING.chromeFade,
            ease: CHROME_EASE,
          }}
        >
          {onOpenCatalog && (
            <button
              type="button"
              onClick={onOpenCatalog}
              className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-surface)]/85 px-6 py-2 text-[11px] font-medium tracking-[0.1em] uppercase text-[var(--color-ink)] transition-colors duration-150 hover:border-[var(--color-ink)] hover:bg-[var(--color-surface)] whitespace-nowrap shrink-0 cursor-pointer"
            >
              {catalogButtonLabel}
            </button>
          )}
        </motion.div>
      </div>

      {/* Focused / Expanded Center-Stage Inspection Overlay */}
      <AnimatePresence>
        {isFocusOpen && focusedPiece && (
          <motion.div
            key="focus-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={`Inspecting ${focusedPiece.title}`}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 py-6"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : RACK_TIMING.focusExit,
            }}
          >
            {/* Transparent clickable backdrop so blurred ghost rack remains visible behind */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 bg-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : RACK_TIMING.chromeFade }}
              onClick={closeFocus}
            />

            {/* Top-Right Close Action */}
            <motion.button
              ref={closeButtonRef}
              type="button"
              onClick={closeFocus}
              aria-label="Close garment inspection"
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : RACK_TIMING.chromeFade,
                delay: prefersReducedMotion ? 0 : 0.06,
                ease: RACK_EASE,
              }}
              className="absolute top-5 right-5 z-20 inline-flex min-h-[44px] min-w-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--color-ink)] transition-colors duration-150 hover:bg-black/5 cursor-pointer"
            >
              <span>Close</span>
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </motion.button>

            {/* Center Inspection Carousel */}
            <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
              <div className="relative flex w-full items-center justify-center gap-4 sm:gap-16">
                {/* Previous Garment Button */}
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    stepFocus(-1);
                  }}
                  aria-label="Previous garment"
                  initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.92 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : RACK_TIMING.chromeFade,
                    delay: prefersReducedMotion ? 0 : 0.06,
                    ease: RACK_EASE,
                  }}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-hairline-strong)] bg-transparent text-[var(--color-ink)] transition-colors duration-150 hover:border-[var(--color-ink)] hover:bg-[var(--color-surface)]/75 cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </motion.button>

                {/* Active Garment Stage (glides cleanly from/to exact rack slot) */}
                <motion.div
                  ref={focusFrameRef}
                  className="relative flex items-center justify-center"
                  style={{
                    width: Math.min(370, Math.round(garmentWidth * RACK_GEOMETRY.focusScale)),
                    height: Math.min(495, Math.round(garmentHeight * RACK_GEOMETRY.focusScale)),
                  }}
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : {
                          x: entryDelta.x,
                          y: entryDelta.y,
                          scale: 1 / RACK_GEOMETRY.focusScale,
                          opacity: 0.95,
                        }
                  }
                  animate={{
                    x: 0,
                    y: prefersReducedMotion ? 0 : RACK_GEOMETRY.focusLiftY,
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : {
                          x: entryDelta.x,
                          y: entryDelta.y,
                          scale: 1 / RACK_GEOMETRY.focusScale,
                          opacity: 0,
                        }
                  }
                  transition={{
                    duration: prefersReducedMotion ? 0 : RACK_TIMING.focusEnter,
                    ease: RACK_EASE,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <AnimatePresence mode="wait" custom={navDirection}>
                    <motion.div
                      key={focusedPiece.id}
                      custom={navDirection}
                      className="flex h-full w-full items-center justify-center"
                      initial={
                        focusTransitionMode === 'nav' && !prefersReducedMotion
                          ? {
                              x: navDirection * RACK_GEOMETRY.navSwapOffsetPx,
                              scale: 0.97,
                              opacity: 0,
                            }
                          : false
                      }
                      animate={{
                        x: 0,
                        scale: 1,
                        opacity: 1,
                      }}
                      exit={
                        focusTransitionMode === 'nav' && !prefersReducedMotion
                          ? {
                              x: -navDirection * RACK_GEOMETRY.navSwapOffsetPx,
                              scale: 0.97,
                              opacity: 0,
                            }
                          : { opacity: 0 }
                      }
                      transition={{
                        duration: prefersReducedMotion ? 0 : RACK_TIMING.focusNavSwap,
                        ease: RACK_EASE,
                      }}
                    >
                      <img
                        src={focusedPiece.frontImage}
                        alt={focusedPiece.altFront}
                        draggable={false}
                        className="h-full w-full object-contain"
                        style={{
                          filter: 'drop-shadow(0 28px 38px rgba(24, 24, 22, 0.18))',
                        }}
                      />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* Next Garment Button */}
                <motion.button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    stepFocus(1);
                  }}
                  aria-label="Next garment"
                  initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.92 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : RACK_TIMING.chromeFade,
                    delay: prefersReducedMotion ? 0 : 0.06,
                    ease: RACK_EASE,
                  }}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-hairline-strong)] bg-transparent text-[var(--color-ink)] transition-colors duration-150 hover:border-[var(--color-ink)] hover:bg-[var(--color-surface)]/75 cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </motion.button>
              </div>

              {/* Editorial Caption, Availability Trigger & Position Indicator */}
              <motion.div
                className="mt-1 flex flex-col items-center text-center"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 4 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : RACK_TIMING.chromeFade,
                  delay: prefersReducedMotion ? 0 : 0.06,
                  ease: RACK_EASE,
                }}
              >
                <p className="font-mono text-[11px] tracking-wider text-[var(--color-ink-muted)] tabular-nums">
                  {focusedPiece.indexLabel} / {String(items.length).padStart(2, '0')}
                </p>

                <h2
                  className="mt-1 text-xl font-normal italic tracking-tight text-[var(--color-ink)] sm:text-2xl"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {focusedPiece.title}
                </h2>

                <div className="mt-3.5 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onInspectPiece?.(focusedPiece)}
                    className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[var(--color-hairline-strong)] bg-[var(--color-surface)]/80 px-6 py-1.5 text-[11px] font-medium tracking-[0.1em] uppercase text-[var(--color-ink)] transition-colors duration-150 hover:border-[var(--color-ink)] hover:bg-[var(--color-surface)] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {inspectButtonLabel}
                  </button>
                </div>

                {/* Subtle Carousel Progress Bar Indicator */}
                <div aria-hidden="true" className="mt-3 flex items-center gap-1">
                  {items.map((item, idx) => {
                    const isCurrent = idx === focusedIndex;
                    return (
                      <span
                        key={item.id}
                        className={`h-[3px] rounded-full transition-all duration-200 ${
                          isCurrent
                            ? 'w-5 bg-[var(--color-ink)]/70'
                            : 'w-1.5 bg-[var(--color-ink)]/20'
                        }`}
                      />
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
