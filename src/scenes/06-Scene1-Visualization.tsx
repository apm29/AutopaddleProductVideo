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

// Timing for sequential display within ALERT_DISPLAY_FRAMES (1080f)
const SEG1_END = 480; // 0–479   alert-config video (16s)
const T1_END   = 540; // 480–539 config-push transition (2s)
const SEG2_END = 660; // 540–659 alert image (4s)
const T2_END   = 720; // 660–719 wechat notification transition (2s)
// Seg3: T2_END–1079 alert-process video (12s)

// ── T1: 报警配置下发示意 ─────────────────────────────────────────────────────

const ConfigPushTransition: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame; // local frame 0–59

  // Server spring
  const serverS = spring({ frame: f, fps, config: { damping: 180 }, durationInFrames: 18 });
  const serverOpacity = interpolate(serverS, [0, 1], [0, 1]);
  const serverScale   = interpolate(serverS, [0, 1], [0.8, 1]);

  // Data packets travel left→right along each of the 3 lines
  // packet x: -5% → 105%  over f 10–32
  const packetX = (offset: number) =>
    interpolate(f - offset, [0, 22], [-5, 105], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Devices light up with stagger
  const deviceLit = (i: number) => f >= 18 + i * 5;
  const deviceS   = (i: number) =>
    spring({ frame: f - (18 + i * 5), fps, config: { damping: 200 }, durationInFrames: 14 });

  // Bottom text fade
  const textOpacity = interpolate(f, [24, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Fade in/out for the whole component (handled by parent opacity)
  const DEVICES = 6;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgPrimary, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 0 }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 45%, ${COLORS.brandBlue}10 0%, transparent 60%)` }} />

      {/* ── Diagram ── */}
      <div style={{ width: 900, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 0 }}>

        {/* Server block */}
        <div style={{
          opacity: serverOpacity,
          transform: `scale(${serverScale})`,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        }}>
          <svg width="96" height="108" viewBox="0 0 96 108" fill="none">
            {/* Three server slabs */}
            {[0, 36, 72].map((y) => (
              <g key={y}>
                <rect x="4" y={y} width="88" height="28" rx="6" fill="#1A2040" stroke={COLORS.brandBlue} strokeWidth="1.5" />
                <rect x="12" y={y + 8} width="48" height="6" rx="3" fill="#253060" />
                <circle cx="78" cy={y + 11} r="4" fill={COLORS.brandBlue} opacity="0.9" />
                <circle cx="68" cy={y + 11} r="3" fill="#28C840" opacity="0.7" />
              </g>
            ))}
          </svg>
          <span style={{ fontSize: 16, color: COLORS.textSecondary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif', fontWeight: 600 }}>
            蜻蜓平台
          </span>
        </div>

        {/* Arrow + packets channel */}
        <div style={{ flex: 1, position: "relative", height: 108 }}>
          {/* Three horizontal dashed lines */}
          {[24, 54, 84].map((y) => (
            <div key={y} style={{ position: "absolute", top: y - 1, left: 0, right: 0, height: 2, background: `repeating-linear-gradient(90deg, ${COLORS.brandBlue}55 0px, ${COLORS.brandBlue}55 8px, transparent 8px, transparent 16px)` }} />
          ))}
          {/* Animated packets on each line */}
          {[0, 4, 8].map((offset, li) => {
            const px = packetX(10 + offset);
            const inRange = px > -5 && px < 105;
            return inRange ? (
              <div key={li} style={{
                position: "absolute",
                top: [17, 47, 77][li],
                left: `${px}%`,
                width: 18, height: 10,
                background: COLORS.brandBlue,
                borderRadius: 3,
                boxShadow: `0 0 8px ${COLORS.brandBlue}`,
                transform: "translateX(-50%)",
              }} />
            ) : null;
          })}
          {/* Arrow head at right */}
          <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M12 5l6 5-6 5" stroke={COLORS.brandBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Device nodes grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16,
          opacity: serverOpacity,
        }}>
          {Array.from({ length: DEVICES }, (_, i) => {
            const lit = deviceLit(i);
            const s   = lit ? deviceS(i) : 0;
            const nodeColor = lit ? COLORS.cyan : "#253060";
            const scl = lit ? interpolate(s, [0, 1], [0.7, 1]) : 1;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transform: `scale(${scl})` }}>
                <div style={{
                  width: 52, height: 52,
                  borderRadius: 10,
                  background: lit ? `${COLORS.cyan}18` : "#13162A",
                  border: `1.5px solid ${nodeColor}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: lit ? `0 0 12px ${COLORS.cyan}44` : "none",
                }}>
                  {lit ? (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <path d="M5 11l4 4 8-8" stroke={COLORS.cyan} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <rect x="3" y="7" width="16" height="10" rx="3" stroke="#253060" strokeWidth="1.5" />
                      <rect x="7" y="3" width="8" height="5" rx="2" stroke="#253060" strokeWidth="1.5" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 11, color: lit ? COLORS.cyan : "#3A4870", fontFamily: '"Inter",sans-serif' }}>
                  #{String(i + 1).padStart(2, "0")}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom label */}
      <div style={{ marginTop: 48, opacity: textOpacity, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28C840", boxShadow: "0 0 8px #28C840" }} />
        <span style={{ fontSize: 22, fontWeight: 600, color: COLORS.textPrimary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>
          报警规则已同步至全部在线设备
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ── T2: 微信通知弹出 + 点击过渡 ─────────────────────────────────────────────

const WechatNotificationTransition: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame; // local frame 0–59

  // Phone slides in from slight offset
  const phoneS = spring({ frame: f, fps, config: { damping: 180 }, durationInFrames: 20 });
  const phoneY = interpolate(phoneS, [0, 1], [40, 0]);
  const phoneOpacity = interpolate(phoneS, [0, 1], [0, 1]);

  // Notification card slides down from top of phone
  const cardS = spring({ frame: f - 12, fps, config: { damping: 160 }, durationInFrames: 20 });
  const cardY = interpolate(cardS, [0, 1], [-80, 0]);
  const cardOpacity = interpolate(cardS, [0, 1], [0, 1]);

  // Notification text fade in
  const textOpacity = interpolate(f, [22, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Finger appears and clicks
  const fingerS = spring({ frame: f - 38, fps, config: { damping: 200 }, durationInFrames: 14 });
  const fingerX = interpolate(fingerS, [0, 1], [60, 0]);
  const fingerOpacity = interpolate(fingerS, [0, 1], [0, 1]);

  // Click pulse: at f=48, scale bounces
  const clickScale = interpolate(f, [48, 51, 55], [1, 0.82, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rippleScale = interpolate(f, [48, 58], [0.3, 2.2], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rippleOpacity = interpolate(f, [48, 58], [0.6, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgPrimary, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 45%, ${COLORS.cyan}08 0%, transparent 60%)` }} />

      {/* Phone shell */}
      <div style={{
        position: "relative",
        opacity: phoneOpacity,
        transform: `translateY(${phoneY}px)`,
        width: 300,
        height: 560,
        padding: "14px 10px",
        background: "linear-gradient(160deg,#1E2235 0%,#13151F 100%)",
        borderRadius: 36,
        border: `1.5px solid ${COLORS.border}`,
        boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px ${COLORS.cyan}22, inset 0 1px 0 rgba(255,255,255,0.06)`,
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Notch */}
        <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 72, height: 20, background: "#0D0F1A", borderRadius: "0 0 14px 14px", zIndex: 4 }} />

        {/* Status bar */}
        <div style={{ height: 28, flexShrink: 0, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 16px 4px", zIndex: 3 }}>
          <span style={{ fontSize: 11, color: "#8899BB", fontFamily: '"Inter",monospace' }}>9:41</span>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {[3, 5, 7, 9].map((h) => <div key={h} style={{ width: 3, height: h, background: "#8899BB", borderRadius: 1 }} />)}
          </div>
        </div>

        {/* Home screen mock — blurred grid of app icons */}
        <div style={{
          flex: 1, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, padding: "12px 8px",
          alignContent: "start",
        }}>
          {Array.from({ length: 16 }, (_, i) => (
            <div key={i} style={{ width: "100%", aspectRatio: "1", borderRadius: 14, background: ["#1A2A5E","#1C3A2A","#2A1A1A","#1A2A3A"][i % 4], opacity: 0.6 }} />
          ))}
        </div>

        {/* WeChat notification banner — slides in */}
        <div style={{
          position: "absolute",
          top: 52, left: 10, right: 10,
          opacity: cardOpacity,
          transform: `translateY(${cardY}px)`,
          background: "rgba(30,34,56,0.96)",
          backdropFilter: "blur(12px)",
          borderRadius: 14,
          border: `1px solid rgba(255,255,255,0.1)`,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          padding: "12px 14px",
          display: "flex", gap: 12, alignItems: "flex-start",
          zIndex: 5,
        }}>
          {/* WeChat icon */}
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#07C160", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <ellipse cx="8" cy="9" rx="6" ry="5" fill="white" />
              <ellipse cx="15" cy="12" rx="5.5" ry="4.5" fill="white" opacity="0.9" />
              <circle cx="6" cy="9" r="1.4" fill="#07C160" />
              <circle cx="9.5" cy="9" r="1.4" fill="#07C160" />
              <circle cx="13.5" cy="12" r="1.2" fill="#07C160" />
              <circle cx="16.5" cy="12" r="1.2" fill="#07C160" />
            </svg>
          </div>
          <div style={{ flex: 1, opacity: textOpacity }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#E8EDF5", fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>
                蜻蜓工业助手
              </span>
              <span style={{ fontSize: 11, color: "#6A7A9A", fontFamily: '"Inter",sans-serif' }}>
                刚刚
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "#FF6060", fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif', fontWeight: 600 }}>
              ⚠️ 报警触发
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9AAABB", fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>
              #03号 三菱机床：主轴过载，请及时处理
            </p>
          </div>
        </div>

        {/* Home bar */}
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0", flexShrink: 0 }}>
          <div style={{ width: 60, height: 4, borderRadius: 2, background: "#3A4870" }} />
        </div>
      </div>

      {/* Finger cursor */}
      <div style={{
        position: "absolute",
        // Positioned to tap the notification card
        top: "calc(50% - 200px)",
        left: "calc(50% + 60px)",
        opacity: fingerOpacity,
        transform: `translateX(${fingerX}px) scale(${clickScale})`,
        zIndex: 10,
      }}>
        {/* Ripple */}
        {f >= 48 && (
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            width: 40, height: 40,
            marginLeft: -20, marginTop: -20,
            borderRadius: "50%",
            border: `2px solid ${COLORS.cyan}`,
            opacity: rippleOpacity,
            transform: `scale(${rippleScale})`,
          }} />
        )}
        {/* Finger SVG */}
        <svg width="36" height="48" viewBox="0 0 36 48" fill="none">
          <path d="M18 44 C10 44 6 38 6 30 L6 18 C6 15 8 13 11 13 C12 13 13 13.5 14 14.5 L14 8 C14 5.5 16 4 18 4 C20 4 22 5.5 22 8 L22 14.5 C23 13.5 24 13 25 13 C28 13 30 15 30 18 L30 30 C30 38 26 44 18 44Z" fill="white" stroke="#D0D8E8" strokeWidth="1" />
          <circle cx="18" cy="8" r="2" fill="#C0C8D8" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// ── Alert feature page ───────────────────────────────────────────────────────

const AlertFeaturePage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cards always visible, fade in early
  const cardSprings = [0, 10, 20].map((delay) =>
    spring({ frame: frame - delay, fps, config: { damping: 180 }, durationInFrames: 26 })
  );

  // Which segment are we in?
  const inSeg1 = frame < SEG1_END;
  const inT1   = frame >= SEG1_END && frame < T1_END;
  const inSeg2 = frame >= T1_END   && frame < SEG2_END;
  const inT2   = frame >= SEG2_END && frame < T2_END;
  const inSeg3 = frame >= T2_END;

  // Cross-fade helpers: 12-frame fade at boundaries
  const FADE = 12;
  const OVERLAP = 20; // T1 starts appearing this many frames before SEG1_END
  const seg1Opacity = frame < SEG1_END - FADE ? 1 : interpolate(frame, [SEG1_END - FADE, SEG1_END], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t1Opacity   = interpolate(frame, [SEG1_END - OVERLAP, SEG1_END - OVERLAP + FADE, T1_END - FADE, T1_END], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const seg2Opacity = interpolate(frame, [T1_END, T1_END + FADE, SEG2_END - FADE, SEG2_END], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t2Opacity   = interpolate(frame, [SEG2_END, SEG2_END + FADE, T2_END - FADE, T2_END], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const seg3Opacity = frame < T2_END + FADE ? interpolate(frame, [T2_END, T2_END + FADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;

  // Alert image pulse: red border + flash overlay
  const alertPulse = Math.sin(((frame - T1_END) / fps) * Math.PI * 3);
  const alertBorderOpacity = interpolate(alertPulse, [-1, 1], [0.4, 1]);
  const alertFlash = interpolate(alertPulse, [-1, 1], [0, 0.08]);
  const badgeBlink = alertPulse > 0 ? 1 : 0.25;

  // Entry spring for video segments
  const seg1Spring = spring({ frame, fps, config: { damping: 180 }, durationInFrames: 28 });
  const seg2Spring = spring({ frame: frame - T1_END, fps, config: { damping: 180 }, durationInFrames: 28 });
  const seg3Spring = spring({ frame: frame - T2_END, fps, config: { damping: 180 }, durationInFrames: 28 });

  const entryY   = (s: number) => interpolate(s, [0, 1], [28, 0]);
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
            <div style={{ flexShrink: 0, height: 34, background: "#1A1D2E", display: "flex", alignItems: "center", padding: "0 14px", gap: 7, borderBottom: "1px solid #2A3060" }}>
              {["#FF5F57","#FEBC2E","#28C840"].map((c) => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
              ))}
              <div style={{ flex: 1, marginLeft: 10, background: "#0D1020", borderRadius: 5, padding: "3px 12px", fontSize: 12, color: "#5A6A90", fontFamily: '"Inter",monospace' }}>
                报警配置管理
              </div>
            </div>
            <div style={{ flex: 1, overflow: "hidden", background: "#000" }}>
              <Sequence durationInFrames={SEG1_END + FADE}>
                <OffthreadVideo
                  src={staticFile("videos/alert-config.mp4")}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </Sequence>
            </div>
          </div>
        )}

        {/* T1: 配置下发示意 — overlaps with Seg1 by OVERLAP frames */}
        {(inT1 || (frame >= SEG1_END - OVERLAP && frame < T1_END + FADE)) && (
          <div style={{ position: "absolute", inset: 0, opacity: t1Opacity }}>
            <ConfigPushTransition startFrame={SEG1_END - OVERLAP} />
          </div>
        )}

        {/* Segment 2: factory-device-alert.jpg */}
        {(inSeg2 || (frame >= T1_END - FADE && frame < SEG2_END + FADE)) && (
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
            <Img src={staticFile("screenshots/factory-device-alert.jpg")} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: `rgba(255,40,40,${alertFlash})`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)" }} />
            <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(220,30,30,0.9)", borderRadius: 6, padding: "6px 16px", display: "flex", alignItems: "center", gap: 8, opacity: badgeBlink, boxShadow: "0 0 12px rgba(255,50,50,0.6)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />
              <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif', letterSpacing: "0.05em" }}>报警触发中</span>
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 100%)", padding: "24px 28px 20px", display: "flex", alignItems: "flex-end", gap: 14 }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 4L30 28H2L16 4Z" stroke="#FF4444" strokeWidth="2" strokeLinejoin="round" fill="rgba(255,68,68,0.15)" />
                <line x1="16" y1="13" x2="16" y2="21" stroke="#FF4444" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="16" cy="24.5" r="1.4" fill="#FF4444" />
              </svg>
              <div>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#FF6060", fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>设备报警触发</p>
                <p style={{ margin: "4px 0 0", fontSize: 15, color: "rgba(255,255,255,0.7)", fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>系统已自动推送通知至管理人员手机</p>
              </div>
            </div>
          </div>
        )}

        {/* T2: 微信通知过渡 */}
        {(inT2 || (frame >= SEG2_END - FADE && frame < T2_END + FADE)) && (
          <div style={{ position: "absolute", inset: 0, opacity: t2Opacity }}>
            <WechatNotificationTransition startFrame={SEG2_END} />
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
            <div style={{
              position: "relative", height: "100%", aspectRatio: "9/21",
              padding: "12px 8px",
              background: "linear-gradient(160deg,#1E2235 0%,#13151F 100%)",
              borderRadius: 28,
              border: `1.5px solid ${COLORS.cyan}44`,
              boxShadow: `0 24px 64px rgba(0,0,0,0.65), 0 0 0 1px ${COLORS.cyan}22, inset 0 1px 0 rgba(255,255,255,0.05)`,
              display: "flex", flexDirection: "column",
            }}>
              <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", width: 52, height: 16, background: "#0D0F1A", borderRadius: "0 0 10px 10px", zIndex: 2 }} />
              <div style={{ height: 10, flexShrink: 0 }} />
              <div style={{ flex: 1, borderRadius: 16, overflow: "hidden", background: "#000" }}>
                {/* from={T2_END} resets frame so video plays from 0 */}
                <Sequence from={T2_END}>
                  <OffthreadVideo
                    src={staticFile("videos/alert-process.mp4")}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Sequence>
              </div>
              <div style={{ display: "flex", justifyContent: "center", marginTop: 8, flexShrink: 0 }}>
                <div style={{ width: 40, height: 3, borderRadius: 2, background: "#5A6A9044" }} />
              </div>
              <div style={{ position: "absolute", inset: -1, borderRadius: 29, border: `1.5px solid ${COLORS.cyan}55`, pointerEvents: "none" }} />
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom cards — always visible ── */}
      <div style={{ position: "absolute", bottom: 44, left: 100, right: 100, display: "flex", gap: 28 }}>
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
