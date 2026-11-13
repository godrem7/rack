import React, { useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { GarmentRack } from '@/src/components/garment-rack/GarmentRack';
import { CHROME_EASE, RACK_TIMING } from '@/src/components/garment-rack/motion';
import { PieceDrawer } from '@/src/components/PieceDrawer';
import { StudioModal } from '@/src/components/StudioModal';
import { STUDIO_GARMENTS, type GarmentPiece } from '@/src/data/garments';

type CategoryFilter = 'all' | 'Short Sleeve' | 'Fleece & Long';

export default function App() {
  const prefersReducedMotion = useReducedMotion();

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPiece, setDrawerPiece] = useState<GarmentPiece | null>(null);
  const [modalMode, setModalMode] = useState<'about' | 'contact' | null>(null);

  const filteredItems = useMemo(() => {
    if (categoryFilter === 'all') return STUDIO_GARMENTS;
    if (categoryFilter === 'Short Sleeve') {
      return STUDIO_GARMENTS.filter((item) => item.category === 'Short Sleeve');
    }
    return STUDIO_GARMENTS.filter(
      (item) => item.category === 'Heavy Fleece' || item.category === 'Long Sleeve'
    );
  }, [categoryFilter]);

  const isFocusOpen = focusedId !== null;

  const handleOpenCatalog = () => {
    setDrawerPiece(null);
    setDrawerOpen(true);
  };

  const handleInspectPiece = (piece: GarmentPiece) => {
    setDrawerPiece(piece);
    setDrawerOpen(true);
  };

  const handleFilterChange = (nextFilter: CategoryFilter) => {
    setHoveredId(null);
    setFocusedId(null);
    setCategoryFilter(nextFilter);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-transparent text-[var(--color-ink)]">
      {/* Locked 100vh Studio Rack Stage (matching reference viewport framing) */}
      <div className="flex min-h-screen flex-col justify-between">
        {/* Studio Top Bar: Left About — Centered Brand Mark — Right Contact */}
        <motion.header
          animate={{
            opacity: isFocusOpen ? 0 : 1,
            pointerEvents: isFocusOpen ? 'none' : 'auto',
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : RACK_TIMING.chromeFade,
            ease: CHROME_EASE,
          }}
          className="mx-auto grid w-full max-w-[1360px] grid-cols-3 items-center gap-4 px-5 py-5 sm:px-10 sm:py-7"
        >
          <div className="flex items-center justify-start">
            <button
              type="button"
              onClick={() => setModalMode('about')}
              className="min-h-[40px] px-1 text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)] whitespace-nowrap shrink-0 cursor-pointer"
            >
              About
            </button>
          </div>

          <div className="flex items-center justify-center">
            <a
              href="#rack-stage"
              className="text-center text-xl font-medium italic tracking-tight text-[var(--color-ink)] whitespace-nowrap shrink-0 sm:text-2xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Atelier Marlow
            </a>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setModalMode('contact')}
              className="min-h-[40px] px-1 text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)] whitespace-nowrap shrink-0 cursor-pointer"
            >
              Contact
            </button>
          </div>
        </motion.header>

        {/* Centerpiece Hanging Rack */}
        <main
          id="rack-stage"
          className="mx-auto flex w-full max-w-[1360px] flex-1 flex-col items-center justify-center px-4 sm:px-8"
        >
          <h1 className="sr-only">Atelier Marlow Garment Archive Rack</h1>

          <GarmentRack
            items={filteredItems}
            hoveredId={hoveredId}
            onHoveredIdChange={setHoveredId}
            focusedId={focusedId}
            onFocusedIdChange={setFocusedId}
            onOpenCatalog={handleOpenCatalog}
            onInspectPiece={handleInspectPiece}
            catalogButtonLabel="See Availability"
            inspectButtonLabel="See Availability"
          />
        </main>

        {/* Bottom Studio Ribbon Bar (fades out cleanly in Focus mode) */}
        <motion.div
          animate={{
            opacity: isFocusOpen ? 0 : 1,
            pointerEvents: isFocusOpen ? 'none' : 'auto',
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : RACK_TIMING.chromeFade,
            ease: CHROME_EASE,
          }}
          className="w-full border-t border-[var(--color-hairline)] bg-[#232630] text-[#EBEAE6]"
        >
          <div className="mx-auto flex w-full max-w-[1360px] items-center justify-between gap-4 px-5 py-2.5 text-[10px] font-medium tracking-[0.16em] uppercase sm:px-10">
            <span className="truncate whitespace-nowrap">
              Atelier Marlow · Small-Batch Textile &amp; Print Archive
            </span>
            <div className="flex items-center gap-5 shrink-0">
              <a
                href="#edition-index"
                className="transition-opacity hover:opacity-75 whitespace-nowrap"
              >
                Edition Index
              </a>
              <button
                type="button"
                onClick={handleOpenCatalog}
                className="transition-opacity hover:opacity-75 whitespace-nowrap cursor-pointer"
              >
                Availability
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Below-the-fold Edition Index & State Playground */}
      <section
        id="edition-index"
        aria-labelledby="edition-index-heading"
        className="mx-auto w-full max-w-[1280px] border-t border-[var(--color-hairline)] px-5 py-12 sm:px-10 sm:py-16"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-medium tracking-[0.08em] uppercase text-[var(--color-ink-muted)]">
              Studio Archive · 2025–2026
            </p>
            <h2
              id="edition-index-heading"
              className="mt-2 text-2xl font-normal tracking-tight text-[var(--color-ink)] sm:text-3xl"
              style={{ fontFamily: 'var(--font-display)', textWrap: 'balance' }}
            >
              Numbered garment editions and textile studies
            </h2>
          </div>

          <div
            role="group"
            aria-label="Filter rack by garment category"
            className="inline-flex flex-wrap items-center gap-1 self-start rounded-xl bg-[var(--color-surface-hover)]/70 p-1"
          >
            {(
              [
                { id: 'all', label: 'All Editions (07)' },
                { id: 'Short Sleeve', label: 'Short Sleeve (05)' },
                { id: 'Fleece & Long', label: 'Fleece & Long (02)' },
              ] as const
            ).map((tab) => {
              const active = categoryFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleFilterChange(tab.id)}
                  className={`min-h-[40px] rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[var(--color-surface)] text-[var(--color-ink)] shadow-xs'
                      : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive State Playground Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-[var(--color-hairline)] py-4">
          <div className="text-xs text-[var(--color-ink-muted)]">
            <span className="font-medium text-[var(--color-ink)]">Rack State Preview</span>
            <span aria-hidden="true" className="mx-2">
              ·
            </span>
            <span>
              Active state:{' '}
              <strong className="font-medium text-[var(--color-ink)]">
                {focusedId ? 'Focused' : hoveredId ? 'Hover / Spread' : 'Idle'}
              </strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setFocusedId(null);
                setHoveredId(null);
              }}
              className="min-h-[40px] rounded-lg border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-hover)] whitespace-nowrap shrink-0 cursor-pointer"
            >
              Reset Idle
            </button>
            <button
              type="button"
              onClick={() => {
                const target = filteredItems[Math.min(2, filteredItems.length - 1)];
                if (target) {
                  setFocusedId(null);
                  setHoveredId(target.id);
                  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
                }
              }}
              className="min-h-[40px] rounded-lg border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-hover)] whitespace-nowrap shrink-0 cursor-pointer"
            >
              Preview Hover Spread
            </button>
            <button
              type="button"
              onClick={() => {
                const target =
                  filteredItems[Math.min(3, filteredItems.length - 1)] ?? filteredItems[0];
                if (target) {
                  setHoveredId(null);
                  setFocusedId(target.id);
                }
              }}
              className="min-h-[40px] rounded-lg bg-[var(--color-ink)] px-3.5 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Open Focus Stage
            </button>
          </div>
        </div>

        <div className="mt-6 divide-y divide-[var(--color-hairline)]">
          {filteredItems.map((piece) => (
            <div
              key={piece.id}
              className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-4">
                <span className="font-mono text-xs text-[var(--color-ink-muted)] tabular-nums shrink-0">
                  {piece.indexLabel}
                </span>
                <span
                  aria-hidden="true"
                  className="h-3.5 w-3.5 rounded-full border border-black/15 shrink-0"
                  style={{ backgroundColor: piece.swatchHex }}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[var(--color-ink)]">
                    {piece.title}
                  </p>
                  <p className="text-xs text-[var(--color-ink-muted)]">
                    {piece.colorway} · {piece.fabricSpec} · {piece.printTechnique}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 shrink-0 sm:justify-end">
                <span className="font-mono text-xs text-[var(--color-ink-muted)] tabular-nums">
                  {piece.remainingUnits}/{piece.editionSize} left · {piece.availability}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setHoveredId(null);
                    setFocusedId(piece.id);
                  }}
                  className="min-h-[40px] rounded-full border border-[var(--color-hairline-strong)] px-4 py-1.5 text-xs font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)] hover:bg-[var(--color-surface)] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Inspect
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Edition Detail / Availability Slide-over */}
      <PieceDrawer
        pieces={STUDIO_GARMENTS}
        selectedPiece={drawerPiece}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSelectPiece={(piece) => setDrawerPiece(piece)}
      />

      {/* About & Contact Modals */}
      <StudioModal mode={modalMode} onClose={() => setModalMode(null)} />
    </div>
  );
}
