import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { CHROME_EASE, RACK_EASE, RACK_TIMING } from './garment-rack/motion';

interface StudioModalProps {
  mode: 'about' | 'contact' | null;
  onClose: () => void;
}

export const StudioModal: React.FC<StudioModalProps> = ({ mode, onClose }) => {
  const prefersReducedMotion = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setSubmitted(false);
  }, [mode]);

  useEffect(() => {
    if (!mode) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {mode && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={mode === 'about' ? 'About Atelier Marlow' : 'Contact Studio'}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-black/25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : RACK_TIMING.chromeFade, ease: CHROME_EASE }}
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-surface)] p-6 text-[var(--color-ink)] shadow-[var(--shadow-sheet)] sm:p-8"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12, scale: prefersReducedMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : 8, scale: prefersReducedMotion ? 1 : 0.98 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.24, ease: RACK_EASE }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-[var(--color-ink-muted)]">
                  {mode === 'about' ? 'Studio Monograph' : 'Commission & Stockist Inquiry'}
                </p>
                <h2
                  className="mt-1 text-2xl font-normal tracking-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {mode === 'about' ? 'Atelier Marlow' : 'Studio Inquiry'}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-hairline)] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-hover)] cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {mode === 'about' ? (
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                <p>
                  Atelier Marlow is an independent textile and print studio producing small-batch
                  garments in milled 260–420 GSM organic cottons and French terry.
                </p>
                <p>
                  Each edition is numbered, waterbase-screenprinted in house, and archived on our
                  studio rack alongside fabric dye trials and separation studies.
                </p>
                <dl className="grid grid-cols-2 gap-4 border-t border-[var(--color-hairline)] pt-4 text-xs">
                  <div>
                    <dt className="text-[var(--color-ink-muted)]">Studio Location</dt>
                    <dd className="mt-0.5 font-medium text-[var(--color-ink)]">Portland, Oregon</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--color-ink-muted)]">Archive Editions</dt>
                    <dd className="mt-0.5 font-mono font-medium text-[var(--color-ink)] tabular-nums">
                      07 Current Pieces
                    </dd>
                  </div>
                </dl>
              </div>
            ) : submitted ? (
              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3 rounded-xl border border-[var(--color-status-available)]/25 bg-[var(--color-status-available)]/10 p-4 text-sm text-[var(--color-status-available)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <p>
                    Inquiry received for <span className="font-medium">{name}</span>. Our studio team
                    responds to custom batch and archive requests within two business days.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-[var(--color-hairline-strong)] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-ink)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label htmlFor="studio-name" className="block text-xs font-medium text-[var(--color-ink-muted)]">
                    Name
                  </label>
                  <input
                    id="studio-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jordan Vance"
                    className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] px-3.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/60"
                  />
                </div>
                <div>
                  <label htmlFor="studio-email" className="block text-xs font-medium text-[var(--color-ink-muted)]">
                    Email
                  </label>
                  <input
                    id="studio-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jordan@studio.example"
                    className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] px-3.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/60"
                  />
                </div>
                <div>
                  <label htmlFor="studio-notes" className="block text-xs font-medium text-[var(--color-ink-muted)]">
                    Project or Edition Notes
                  </label>
                  <textarea
                    id="studio-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Edition numbers, sizing, or custom screenprint inquiry..."
                    className="mt-1.5 w-full rounded-lg border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] p-3.5 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]/60"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[var(--color-ink)] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.08em] text-white transition-opacity hover:opacity-90 cursor-pointer"
                >
                  Send Studio Inquiry
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
