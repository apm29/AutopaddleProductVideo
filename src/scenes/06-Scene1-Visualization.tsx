import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../constants/colors";
import { TransitionPage } from "../components/TransitionPage";

import { SCENE_VIDEO_OFFSET } from "../constants/timing";

// ── Right-side illustration: desktop + mobile screenshots ───────────────────

const Scene1Illustration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const desktopSpring = spring({ frame: frame - 10, fps, config: { damping: 180 }, durationInFrames: 30 });
  const mobileSpring  = spring({ frame: frame - 24, fps, config: { damping: 160 }, durationInFrames: 28 });

  const desktopOpacity = interpolate(desktopSpring, [0, 1], [0, 1]);
  const desktopScale   = interpolate(desktopSpring, [0, 1], [0.92, 1]);
  const desktopY       = interpolate(desktopSpring, [0, 1], [24, 0]);

  const mobileOpacity = interpolate(mobileSpring, [0, 1], [0, 1]);
  const mobileScale   = interpolate(mobileSpring, [0, 1], [0.88, 1]);
  const mobileY       = interpolate(mobileSpring, [0, 1], [32, 0]);

  // Floating
  const t = frame / fps;
  const desktopFloat = Math.sin(t * Math.PI * 0.5) * 7;
  const mobileFloat  = Math.sin(t * Math.PI * 0.5 + Math.PI) * 10;

  // Glow pulse
  const glowA = interpolate(Math.sin(t * Math.PI * 0.7), [-1, 1], [0.12, 0.28]);

  // Chrome bar height is fixed; screenshot fills the rest
  const CHROME_H = 38;
  const CARD_H = 460;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: "0 8px",
      }}
    >
      {/* ── Desktop screenshot ── */}
      <div
        style={{
          height: CARD_H,
          display: "flex",
          flexDirection: "column",
          opacity: desktopOpacity,
          transform: `translateY(${desktopY + desktopFloat}px) scale(${desktopScale})`,
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            flexShrink: 0,
            height: CHROME_H,
            background: "#1A1D2E",
            borderRadius: "10px 10px 0 0",
            border: `1.5px solid ${COLORS.border}`,
            borderBottom: "none",
            padding: "0 14px",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
          <div
            style={{
              flex: 1,
              marginLeft: 10,
              background: "#0D0F1A",
              borderRadius: 5,
              padding: "4px 12px",
              fontSize: 11,
              color: `${COLORS.textSecondary}88`,
              fontFamily: '"Inter", monospace',
            }}
          >
            设备监控大屏
          </div>
        </div>
        {/* Screenshot fills remaining height */}
        <div
          style={{
            flex: 1,
            border: `1.5px solid ${COLORS.border}`,
            borderTop: "none",
            borderRadius: "0 0 8px 8px",
            overflow: "hidden",
            boxShadow: `0 20px 48px rgba(0,0,0,0.55), 0 0 0 1px ${COLORS.brandBlue}22`,
          }}
        >
          <Img
            src={staticFile("screenshots/device-monitor-app.png")}
            style={{ width: "auto", height: "100%", display: "block", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* ── Mobile screenshot ── */}
      <div
        style={{
          height: CARD_H,
          opacity: mobileOpacity,
          transform: `translateY(${mobileY + mobileFloat}px) scale(${mobileScale})`,
        }}
      >
        {/* Phone shell sized to match CARD_H */}
        <div
          style={{
            position: "relative",
            height: "100%",
            // width derived from content
            padding: "12px 8px",
            background: "linear-gradient(160deg, #1E2235 0%, #13151F 100%)",
            borderRadius: 28,
            border: `1.5px solid ${COLORS.border}`,
            boxShadow: `0 24px 64px rgba(0,0,0,0.65), 0 0 0 1px ${COLORS.cyan}22, inset 0 1px 0 rgba(255,255,255,0.05)`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              width: 56,
              height: 16,
              background: "#0D0F1A",
              borderRadius: "0 0 10px 10px",
              zIndex: 2,
            }}
          />
          <div style={{ height: 10, flexShrink: 0 }} />
          {/* Screenshot fills shell */}
          <div style={{ flex: 1, borderRadius: 16, overflow: "hidden" }}>
            <Img
              src={staticFile("screenshots/device-monitor-mobile.png")}
              style={{ width: "auto", height: "100%", display: "block" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 8, flexShrink: 0 }}>
            <div style={{ width: 44, height: 3, borderRadius: 2, background: `${COLORS.textSecondary}44` }} />
          </div>
          {/* Pulsing cyan ring */}
          <div
            style={{
              position: "absolute",
              inset: -1,
              borderRadius: 29,
              border: `1.5px solid ${COLORS.cyan}${Math.round(glowA * 2.2 * 255).toString(16).padStart(2, "0")}`,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ── Alert feature showcase page ─────────────────────────────────────────────

const ALERT_DISPLAY_FRAMES = 960; // 16s + 4s + 12s = 32s

const FEATURE_CARDS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="13" r="8" stroke="#F5A623" strokeWidth="2" />
        <path d="M10 21c1.1.6 2.5 1 4 1s2.9-.4 4-1" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
        <line x1="14" y1="9" x2="14" y2="14" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" />
        <circle cx="14" cy="16.5" r="1.2" fill="#F5A623" />
      </svg>
    ),
    accent: "#F5A623",
    title: "实时推送",
    body: "车床出现故障障碍警时，系统自动推送至管理人员手机，确保故障第一时间获知。",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="9" stroke="#FF5C5C" strokeWidth="2" />
        <line x1="14" y1="9" x2="14" y2="15" stroke="#FF5C5C" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="14" cy="18" r="1.3" fill="#FF5C5C" />
      </svg>
    ),
    accent: "#FF5C5C",
    title: "异常监测",
    body: "自动识别长时间空闲等异常生产状态，提醒管理人员优化资源分配。",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <polygon points="14,4 17,13 24,13 18,18 20,27 14,22 8,27 10,18 4,13 11,13" stroke={COLORS.cyan} strokeWidth="1.8" strokeLinejoin="round" fill="none" />
        <polygon points="14,9 15.8,14.5 20,14.5 16.5,17.2 17.8,22 14,19.5 10.2,22 11.5,17.2 8,14.5 12.2,14.5" fill={COLORS.cyan} opacity="0.25" />
      </svg>
    ),
    accent: COLORS.cyan,
    title: "快速响应",
    body: "辅助管理人员精确定位异常，大幅减少停机时间对生产线的负面影响。",
  },
] as const;

// Timing for sequential display within ALERT_DISPLAY_FRAMES (960f)
const SEG1_END = 480; // 0–479   alert-config video (16s)
const SEG2_END = 600; // 480–599 alert image (4s)
// SEG3 runs from SEG2_END to ALERT_DISPLAY_FRAMES (600–959, 12s)

const AlertFeaturePage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cards always visible, fade in early
  const cardSprings = [0, 10, 20].map((delay) =>
    spring({ frame: frame - delay, fps, config: { damping: 180 }, durationInFrames: 26 })
  );

  // Which segment are we in?
  const inSeg1 = frame < SEG1_END;
  const inSeg2 = frame >= SEG1_END && frame < SEG2_END;
  const inSeg3 = frame >= SEG2_END;

  // Cross-fade helpers: 12-frame fade at segment boundaries
  const FADE = 12;
  const seg1Opacity = frame < SEG1_END - FADE ? 1 : interpolate(frame, [SEG1_END - FADE, SEG1_END], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const seg2Opacity = interpolate(frame, [SEG1_END, SEG1_END + FADE, SEG2_END - FADE, SEG2_END], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const seg3Opacity = frame < SEG2_END + FADE ? interpolate(frame, [SEG2_END, SEG2_END + FADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

  // Alert image pulse: red border + flash overlay
  const alertPulse = Math.sin(((frame - SEG1_END) / fps) * Math.PI * 3); // ~1.5 Hz
  const alertBorderOpacity = interpolate(alertPulse, [-1, 1], [0.4, 1]);
  const alertFlash = interpolate(alertPulse, [-1, 1], [0, 0.08]);
  // "报警" badge blink
  const badgeBlink = alertPulse > 0 ? 1 : 0.25;

  // Entry spring for each segment (local to its segment start)
  const seg1Spring = spring({ frame, fps, config: { damping: 180 }, durationInFrames: 28 });
  const seg2Spring = spring({ frame: frame - SEG1_END, fps, config: { damping: 180 }, durationInFrames: 28 });
  const seg3Spring = spring({ frame: frame - SEG2_END, fps, config: { damping: 180 }, durationInFrames: 28 });

  const entryY  = (s: number) => interpolate(s, [0, 1], [28, 0]);
  const entryScl = (s: number) => interpolate(s, [0, 1], [0.95, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgPrimary }}>
      {/* Background glow */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 20%, ${COLORS.brandBlue}08 0%, transparent 60%)`, pointerEvents: "none" }} />

      {/* ── Main content area (above cards) ── */}
      <div style={{ position: "absolute", top: 44, left: 100, right: 100, bottom: 220 }}>

        {/* Segment 1: alert-config.mp4 — desktop browser */}
        {(inSeg1 || frame < SEG1_END + FADE) && (
          <div
            style={{
              position: "absolute", inset: 0,
              opacity: seg1Opacity,
              transform: `translateY(${entryY(seg1Spring)}px) scale(${entryScl(seg1Spring)})`,
              display: "flex", flexDirection: "column",
              borderRadius: 10, overflow: "hidden",
              border: `1.5px solid #F5A62344`,
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            }}
          >
            {/* Chrome bar */}
            <div style={{ flexShrink: 0, height: 34, background: "#1A1D2E", display: "flex", alignItems: "center", padding: "0 14px", gap: 7, borderBottom: "1px solid #2A3060" }}>
              {["#FF5F57","#FEBC2E","#28C840"].map((c) => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
              ))}
              <div style={{ flex: 1, marginLeft: 10, background: "#0D1020", borderRadius: 5, padding: "3px 12px", fontSize: 12, color: "#5A6A90", fontFamily: '"Inter",monospace' }}>
                报警配置管理
              </div>
            </div>
            <div style={{ flex: 1, overflow: "hidden", background: "#000" }}>
              {/* Sequence resets frame to 0 so video plays from beginning */}
              <Sequence durationInFrames={SEG1_END + FADE}>
                <OffthreadVideo
                  src={staticFile("videos/alert-config.mp4")}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </Sequence>
            </div>
          </div>
        )}

        {/* Segment 2: factory-device-alert.jpg with alert effects */}
        {inSeg2 && (
          <div
            style={{
              position: "absolute", inset: 0,
              opacity: seg2Opacity,
              transform: `translateY(${entryY(seg2Spring)}px) scale(${entryScl(seg2Spring)})`,
              borderRadius: 12, overflow: "hidden",
              border: `2px solid rgba(255,60,60,${alertBorderOpacity})`,
              boxShadow: `0 0 32px rgba(255,60,60,${alertBorderOpacity * 0.5}), 0 16px 48px rgba(0,0,0,0.5)`,
            }}
          >
            <Img
              src={staticFile("screenshots/factory-device-alert.jpg")}
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
            {/* Red flash overlay */}
            <div style={{ position: "absolute", inset: 0, background: `rgba(255,40,40,${alertFlash})`, pointerEvents: "none" }} />
            {/* Scanline overlay */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
            }} />
            {/* "报警" blinking badge top-right */}
            <div style={{
              position: "absolute", top: 16, right: 16,
              background: "rgba(220,30,30,0.9)", borderRadius: 6,
              padding: "6px 16px", display: "flex", alignItems: "center", gap: 8,
              opacity: badgeBlink,
              boxShadow: "0 0 12px rgba(255,50,50,0.6)",
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
              <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif', letterSpacing: "0.05em" }}>
                报警触发中
              </span>
            </div>
            {/* Bottom label bar */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 100%)",
              padding: "24px 28px 20px",
              display: "flex", alignItems: "flex-end", gap: 14,
            }}>
              {/* Alert icon */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 4L30 28H2L16 4Z" stroke="#FF4444" strokeWidth="2" strokeLinejoin="round" fill="rgba(255,68,68,0.15)" />
                <line x1="16" y1="13" x2="16" y2="21" stroke="#FF4444" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="16" cy="24.5" r="1.4" fill="#FF4444" />
              </svg>
              <div>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#FF6060", fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif', letterSpacing: "0.02em" }}>
                  设备报警触发
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 15, color: "rgba(255,255,255,0.7)", fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>
                  系统已自动推送通知至管理人员手机
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Segment 3: alert-process.mp4 — phone frame */}
        {inSeg3 && (
          <div
            style={{
              position: "absolute", inset: 0,
              opacity: seg3Opacity,
              transform: `translateY(${entryY(seg3Spring)}px) scale(${entryScl(seg3Spring)})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {/* Phone shell */}
            <div style={{
              position: "relative",
              height: "100%",
              aspectRatio: "9/21",
              padding: "12px 8px",
              background: "linear-gradient(160deg,#1E2235 0%,#13151F 100%)",
              borderRadius: 28,
              border: `1.5px solid ${COLORS.cyan}44`,
              boxShadow: `0 24px 64px rgba(0,0,0,0.65), 0 0 0 1px ${COLORS.cyan}22, inset 0 1px 0 rgba(255,255,255,0.05)`,
              display: "flex", flexDirection: "column",
            }}>
              {/* Notch */}
              <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 52, height: 16, background: "#0D0F1A", borderRadius: "0 0 10px 10px", zIndex: 2 }} />
              <div style={{ height: 10, flexShrink: 0 }} />
              <div style={{ flex: 1, borderRadius: 16, overflow: "hidden", background: "#000" }}>
                {/* Sequence from={SEG2_END} resets frame to 0 when seg3 starts */}
                <Sequence from={SEG2_END}>
                  <OffthreadVideo
                    src={staticFile("videos/alert-process.mp4")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Sequence>
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 8, flexShrink: 0 }}>
                <div style={{ width: 40, height: 3, borderRadius: 2, background: "#5A6A9044" }} />
              </div>
              {/* Cyan ring */}
              <div style={{ position: "absolute", inset: -1, borderRadius: 29, border: `1.5px solid ${COLORS.cyan}55`, pointerEvents: "none" }} />
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom cards — always visible ── */}
      <div style={{
        position: "absolute", bottom: 44, left: 100, right: 100,
        display: "flex", gap: 28,
      }}>
        {FEATURE_CARDS.map((card, i) => (
          <div
            key={card.title}
            style={{
              flex: 1,
              opacity: interpolate(cardSprings[i], [0, 1], [0, 1]),
              transform: `translateY(${interpolate(cardSprings[i], [0, 1], [24, 0])}px)`,
              background: `${card.accent}0E`,
              border: `1.5px solid ${card.accent}33`,
              borderRadius: 16,
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            {/* Icon circle */}
            <div style={{
              flexShrink: 0,
              width: 48, height: 48, borderRadius: "50%",
              background: `${card.accent}18`,
              border: `1.5px solid ${card.accent}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {card.icon}
            </div>
            <div>
              <p style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 700, color: card.accent, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>
                {card.title}
              </p>
              <p style={{ margin: 0, fontSize: 15, color: COLORS.textSecondary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif', lineHeight: 1.6, opacity: 0.85 }}>
                {card.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene ───────────────────────────────────────────────────────────────────

// Scene 06: 场景一 — 设备状态管理应用生成 — 1140 frames

export const Scene1Visualization: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={SCENE_VIDEO_OFFSET} premountFor={fps}>
        <TransitionPage
          tag="场景一"
          tagEn="Scene 1"
          title="设备状态管理应用生成"
          bullets={[
            { label: "实时状态查看", text: "随时掌握车床运行状态、加工数量及当前程序，生产进度一目了然。" },
            { label: "打破空间限制", text: "无论在公司内或外出办公，均可跨地域掌握生产实况，管理得心应手。" },
            { label: "数据实时同步", text: "移动端与电脑端秒级同步，告别繁琐的现场巡检，提升决策效率。" },
          ]}
          tagline="移动端随时查看，无需再到车床现场"
          illustrationNode={<Scene1Illustration />}
        />
      </Sequence>
      <Sequence from={SCENE_VIDEO_OFFSET} durationInFrames={ALERT_DISPLAY_FRAMES} premountFor={fps}>
        <AlertFeaturePage />
      </Sequence>
    </AbsoluteFill>
  );
};
