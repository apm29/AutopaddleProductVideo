// All durations in frames at 30fps

export const FPS = 30;
const TRANSITION_FRAMES = 240; // 8s — text intro page

// Per-scene video segment durations
const VIDEO_QUICK_INSTALL   = 300;  // 10s — actual video (setup.mp4)
const VIDEO_QUICK_COLLECT   = 510;  // 17s — actual video (config.mp4)
const VIDEO_QUICK_USE       = 1500; // 50s — actual video (product-analyze-app-gen.mp4)
const VIDEO_DEVICE_MONITOR  = 1470; // 49s — actual video (device-monitor-app-gen.mp4, Scene 1)
const VIDEO_SCENE2          = 1470; // 49s — actual video (product-analyze-app-gen.mp4)
const VIDEO_SCENE           = 900;  // 30s placeholder (scene 3)

// Scene 1 alert showcase: desktop 16s + T1 2s + image 4s + T2 2s + mobile 12s = 36s
const ALERT_SHOWCASE = 1080;

export const SCENE_DURATIONS = {
  COVER:         180,
  QUICK_INSTALL: TRANSITION_FRAMES + VIDEO_QUICK_INSTALL,                          // 540f  18s
  QUICK_COLLECT: TRANSITION_FRAMES + VIDEO_QUICK_COLLECT,                          // 750f  25s
  QUICK_USE:     TRANSITION_FRAMES + VIDEO_QUICK_USE,                              // 1740f 58s
  CASE_INTRO:    180,
  SCENE1:        TRANSITION_FRAMES + VIDEO_DEVICE_MONITOR + ALERT_SHOWCASE,        // 2790f 93s
  SCENE2:        TRANSITION_FRAMES + VIDEO_SCENE2,                                 // 1710f 57s
  SCENE3:        TRANSITION_FRAMES + VIDEO_SCENE,                                  // 1140f 38s
  BRAND_OUTRO:   300,
} as const;

// Absolute start frames (computed sequentially)
export const SCENE_STARTS = {
  COVER:         0,
  QUICK_INSTALL: 180,
  QUICK_COLLECT: 180  + 540,                // 720
  QUICK_USE:     720  + 750,                // 1470
  CASE_INTRO:    1470 + 1740,               // 3210
  SCENE1:        3210 + 180,                // 3390
  SCENE2:        3390 + 2790,               // 6180
  SCENE3:        6180 + 1710,               // 7890
  BRAND_OUTRO:   7890 + 1140,               // 9030
} as const;

// Total: 9030 + 300 = 9330f = 311s ≈ 5min11s
export const TOTAL_FRAMES = 9330;

// Within-scene frame offset where video section starts
export const SCENE_VIDEO_OFFSET = TRANSITION_FRAMES; // 240f

export const ANIM = {
  FADE_IN:      18,
  FADE_OUT:     12,
  SLIDE_IN:     20,
  TITLE_REVEAL: 24,
  STAGGER:      10,
} as const;
