// All durations in frames at 30fps
// Total: 5400 frames = 180s = 3 minutes

export const FPS = 30;

export const SCENE_DURATIONS = {
  OPENING_HOOK: 360, // 12s — pain point cards
  BRAND_INTRO: 300, // 10s — logo + slogan
  QUICK_INSTALL: 1200, // 40s — fast deploy
  QUICK_COLLECT: 1650, // 55s — AI-guided data collection
  QUICK_USE: 1200, // 40s — one-sentence app generation
  METRICS: 390, // 13s — 4 key numbers
  BRAND_OUTRO: 300, // 10s — logo + CTA
} as const;

// Absolute start frames for each scene (used in Sequence from=)
export const SCENE_STARTS = {
  OPENING_HOOK: 0,
  BRAND_INTRO: 360,
  QUICK_INSTALL: 660,
  QUICK_COLLECT: 1860,
  QUICK_USE: 3510,
  METRICS: 4710,
  BRAND_OUTRO: 5100,
} as const;

export const TOTAL_FRAMES = 5400;

// Common animation durations (frames)
export const ANIM = {
  FADE_IN: 18, // 0.6s
  FADE_OUT: 12, // 0.4s
  SLIDE_IN: 20, // ~0.67s
  TITLE_REVEAL: 24, // 0.8s
  STAGGER: 10, // gap between staggered items
} as const;
