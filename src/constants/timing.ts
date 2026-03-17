// All durations in frames at 30fps

export const FPS = 30;
const TRANSITION_FRAMES = 240; // 8s — text intro page

// Per-scene video segment durations
const VIDEO_QUICK_INSTALL = 300;  // 10s — actual video
const VIDEO_QUICK_COLLECT = 900;  // 30s placeholder
const VIDEO_QUICK_USE     = 1350; // 45s placeholder
const VIDEO_SCENE         = 900;  // 30s placeholder (scenes 1-4)

export const SCENE_DURATIONS = {
  COVER:         180,
  QUICK_INSTALL: TRANSITION_FRAMES + VIDEO_QUICK_INSTALL,   // 540f  18s
  QUICK_COLLECT: TRANSITION_FRAMES + VIDEO_QUICK_COLLECT,   // 1140f 38s
  QUICK_USE:     TRANSITION_FRAMES + VIDEO_QUICK_USE,       // 1590f 53s
  CASE_INTRO:    180,
  SCENE1:        TRANSITION_FRAMES + VIDEO_SCENE,           // 1140f 38s
  SCENE2:        TRANSITION_FRAMES + VIDEO_SCENE,
  SCENE3:        TRANSITION_FRAMES + VIDEO_SCENE,
  SCENE4:        TRANSITION_FRAMES + VIDEO_SCENE,
  BRAND_OUTRO:   300,
} as const;

// Absolute start frames (computed sequentially)
export const SCENE_STARTS = {
  COVER:         0,
  QUICK_INSTALL: 180,
  QUICK_COLLECT: 180  + 540,                // 720
  QUICK_USE:     720  + 1140,               // 1860
  CASE_INTRO:    1860 + 1590,               // 3450
  SCENE1:        3450 + 180,               // 3630
  SCENE2:        3630 + 1140,              // 4770
  SCENE3:        4770 + 1140,              // 5910
  SCENE4:        5910 + 1140,              // 7050
  BRAND_OUTRO:   7050 + 1140,              // 8190
} as const;

// Total: 8190 + 300 = 8490f = 283s ≈ 4min 43s
export const TOTAL_FRAMES = 8490;

// Within-scene frame offset where video section starts
export const SCENE_VIDEO_OFFSET = TRANSITION_FRAMES; // 240f

export const ANIM = {
  FADE_IN:      18,
  FADE_OUT:     12,
  SLIDE_IN:     20,
  TITLE_REVEAL: 24,
  STAGGER:      10,
} as const;
