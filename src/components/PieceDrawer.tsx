import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, X } from 'lucide-react';
import type { GarmentPiece } from '@/src/data/garments';
import { CHROME_EASE, RACK_EASE, RACK_TIMING } from './garment-rack/motion';

interface PieceDrawerProps {
  pieces: GarmentPiece[];
  selectedPiece: GarmentPiece | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectPiece: (piece: GarmentPiece) => void;
}

export const PieceDrawer: React.FC<PieceDrawerProps> = ({
  pieces,
  selectedPiece,
  isOpen,
  onClose,
  onSelectPiece,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [requestedIds, setRequestedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (selectedPiece && selectedPiece.sizes.length > 0) {
      setSelectedSize(selectedPiece.sizes.includes('M') ? 'M' : selectedPiece.sizes[0]);
    }
  }, [selectedPiece]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const handleReserve = (piece: GarmentPiece) => {
    setRequestedIds((prev) => ({ ...prev, [piece.id]: true }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedPiece ? `${selectedPiece.title} availability` : 'Studio edition availability'}
          className="fixed inset-0 z-50 flex justify-end"
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : RACK_TIMING.chromeFade, ease: CHROME_EASE }}
            onClick={onClose}
          />

          <motion.aside
            className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-[var(--color-hairline)] bg-[var(--color-surface)] text-[var(--color-ink)] shadow-[var(--shadow-sheet)]"
            initial={{ x: prefersReducedMotion ? 0 : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: prefersReducedMotion ? 0 : '100%' }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: RACK_EASE }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-hairline)] px-6 py-4">
              <div>
                <p className="font-mono text-xs text-[var(--color-ink-muted)] tabular-nums">
                  {selectedPiece
                    ? `Edition ${selectedPiece.indexLabel} · ${selectedPiece.year}`
                    : `Archive Index · ${pieces.length} Pieces`}
                </p>
                <h2
                  className="text-xl font-normal tracking-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {selectedPiece ? selectedPiece.title : 'Edition Availability'}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close availability drawer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-hairline)] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-hover)] cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {selectedPiece ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-center rounded-xl bg-[var(--color-canvas)] p-6">
                    <img
                      src={selectedPiece.frontImage}
                      alt={selectedPiece.altFront}
                      className="h-64 w-auto object-contain"
                      style={{ filter: 'drop-shadow(0 16px 24px rgba(24,24,22,0.14))' }}
                    />
                  </div>

                  <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
                    {selectedPiece.notes}
                  </p>

                  {/* Specifications */}
                  <dl className="divide-y divide-[var(--color-hairline)] border-y border-[var(--color-hairline)] text-sm">
                    <div className="flex items-center justify-between py-3">
                      <dt className="text-[var(--color-ink-muted)]">Colorway</dt>
                      <dd className="flex items-center gap-2 font-medium">
                        <span
                          aria-hidden="true"
                          className="h-3 w-3 rounded-full border border-black/15"
                          style={{ backgroundColor: selectedPiece.swatchHex }}
                        />
                        {selectedPiece.colorway}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <dt className="text-[var(--color-ink-muted)]">Textile</dt>
                      <dd className="font-medium text-right">{selectedPiece.fabricSpec}</dd>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <dt className="text-[var(--color-ink-muted)]">Print Process</dt>
                      <dd className="font-medium text-right">{selectedPiece.printTechnique}</dd>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <dt className="text-[var(--color-ink-muted)]">Edition Run</dt>
                      <dd className="font-mono text-xs tabular-nums">
                        {selectedPiece.remainingUnits} / {selectedPiece.editionSize} remaining
                      </dd>
                    </div>
                  </dl>

                  {/* Size selector */}
                  <div>
                    <p className="mb-2.5 text-xs font-medium text-[var(--color-ink-muted)]">
                      Select Size
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPiece.sizes.map((size) => {
                        const active = selectedSize === size;
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => setSelectedSize(size)}
                            aria-pressed={active}
                            className={`inline-flex min-h-[44px] min-w-[48px] items-center justify-center rounded-lg border px-3 text-xs font-medium transition-colors cursor-pointer ${
                              active
                                ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white'
                                : 'border-[var(--color-hairline-strong)] bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)]'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Inquiry / Request Hold CTA */}
                  <div className="pt-2">
                    {selectedPiece.availability === 'Archive Only' ? (
                      <div className="rounded-xl border border-[var(--color-hairline)] bg-[var(--color-canvas)] px-4 py-3 text-xs text-[var(--color-ink-muted)]">
                        This edition is closed and preserved in the studio archive.
                      </div>
                    ) : requestedIds[selectedPiece.id] ? (
                      <div className="flex items-center gap-2 rounded-xl border border-[var(--color-status-available)]/25 bg-[var(--color-status-available)]/10 px-4 py-3 text-xs font-medium text-[var(--color-status-available)]">
                        <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>
                          Studio hold noted for Size {selectedSize}. Reference{' '}
                          <span className="font-mono">{selectedPiece.indexLabel}</span> in studio inquiry.
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleReserve(selectedPiece)}
                        className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-xs font-medium tracking-[0.08em] uppercase text-white transition-opacity hover:opacity-90 cursor-pointer"
                      >
                        <span>Request Studio Hold · Size {selectedSize}</span>
                        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <ul className="divide-y divide-[var(--color-hairline)]">
                  {pieces.map((piece) => (
                    <li key={piece.id}>
                      <button
                        type="button"
                        onClick={() => onSelectPiece(piece)}
                        className="flex w-full items-center gap-4 py-4 text-left transition-colors hover:bg-[var(--color-canvas)]/70 px-2 rounded-lg cursor-pointer"
                      >
                        <img
                          src={piece.frontImage}
                          alt={piece.altFront}
                          className="h-20 w-16 shrink-0 object-contain"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-xs text-[var(--color-ink-muted)]">
                            <span className="font-mono tabular-nums">{piece.indexLabel}</span>
                            <span aria-hidden="true">·</span>
                            <span>{piece.category}</span>
                          </div>
                          <p className="mt-0.5 truncate text-sm font-medium text-[var(--color-ink)]">
                            {piece.title}
                          </p>
                          <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">
                            {piece.colorway} · {piece.availability}
                          </p>
                        </div>
                        <span className="font-mono text-xs text-[var(--color-ink-muted)] tabular-nums shrink-0">
                          {piece.remainingUnits}/{piece.editionSize}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
