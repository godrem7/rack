/**
 * Interaction timing, easing, and spatial choreography constants
 * calibrated to the 30fps reference sequence.
 */

/** Snappy exponential ease-out curve (frames f34–f40 & open-focus f10–f20) */
export const RACK_EASE = [0.22, 1, 0.36, 1] as const;

/** Quick linear-out fade for secondary chrome */
export const CHROME_EASE = [0.2, 0.8, 0.2, 1] as const;

export const RACK_TIMING = {
  /** Garment turns open from 3/4 side profile to front view on hover/focus (~280ms) */
  hoverExpand: 0.28,
  /** Neighboring garments spread apart and swing on hangers (~300ms) */
  neighborSpread: 0.3,
  /** Clicked garment translates to center stage and scales up (~380ms) */
  focusEnter: 0.38,
  /** Focused garment returns smoothly back to its rack slot (~360ms) */
  focusExit: 0.36,
  /** Directional crossfade when cycling Prev / Next in Focus mode (~220ms) */
  focusNavSwap: 0.22,
  /** Header, footer bar, and rail ghosting fade duration (~180ms) */
  chromeFade: 0.18,
  /** Focus detail caption & arrow controls fade-in duration & stagger */
  captionEnter: 0.24,
  captionDelay: 0.09,
  hoverCaptionDelay: 0.04,
} as const;

export const RACK_GEOMETRY = {
  /** Ghosted opacity of the rail and non-active garments during Focus state */
  ghostRackOpacity: 0.2,
  /** Depth-of-field blur (px) applied to the ghosted rack behind Focus stage */
  ghostRackBlurPx: 7,
  /** Scale multiplier of the active garment in Focus state */
  focusScale: 1.28,
  /** Vertical lift (px) of the active garment in Focus state */
  focusLiftY: -14,
  /** Horizontal push (px) applied to garments flanking the hovered piece */
  neighborSpreadPx: 96,
  /** Expressive pendulum swing angle (deg) on immediate adjacent hangers */
  adjacentTiltDeg: 9.2,
  /** Secondary pendulum angle (deg) two slots away */
  secondaryTiltDeg: 2.8,
  /** 3D turn angle (deg) during side <-> front garment unfold */
  turnAngleDeg: 32,
  /** Subtle directional horizontal offset (px) during Prev/Next swap */
  navSwapOffsetPx: 20,
} as const;
