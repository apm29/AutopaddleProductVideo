// All durations in frames at 30fps

export const FPS = 30;
const TRANSITION_FRAMES = 240; // 8s — text intro page

// Per-scene video segment durations
const VIDEO_QUICK_INSTALL = 300;  // 10s — actual video (setup.mp4)
const VIDEO_QUICK_COLLECT = 510;  // 17s — actual video (config.mp4)
const VIDEO_QUICK_USE     = 1350; // 45s placeholder
const VIDEO_SCENE         = 900;  // 30s placeholder (scenes 1-4)

export const SCENE_DURATIONS = {
  COVER:         180,
  QUICK_INSTALL: TRANSITION_FRAMES + VIDEO_QUICK_INSTALL,   // 540f  18s
  QUICK_COLLECT: TRANSITION_FRAMES + VIDEO_QUICK_COLLECT,   // 750f  25s
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
  QUICK_USE:     720  + 750,                // 1470
  CASE_INTRO:    1470 + 1590,               // 3060
  SCENE1:        3060 + 180,                // 3240
  SCENE2:        3240 + 1140,               // 4380
  SCENE3:        4380 + 1140,               // 5520
  SCENE4:        5520 + 1140,               // 6660
  BRAND_OUTRO:   6660 + 1140,               // 7800
} as const;

// Total: 7800 + 300 = 8100f = 270s = 4min 30s
export const TOTAL_FRAMES = 8100;

// Within-scene frame offset where video section starts
export const SCENE_VIDEO_OFFSET = TRANSITION_FRAMES; // 240f

export const ANIM = {
  FADE_IN:      18,
  FADE_OUT:     12,
  SLIDE_IN:     20,
  TITLE_REVEAL: 24,
  STAGGER:      10,
} as const;
