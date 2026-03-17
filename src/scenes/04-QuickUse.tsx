import {
  AbsoluteFill,
  Easing,
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

// Scene 04: 快用 — 1710 frames (57s)
// 0–240f:   TransitionPage
// 240–1710f: UseVideoSection (49s / 1470f)

const STEPS = [
  { label: "描述业务需求",   labelEn: "Describe your need",      startFrame: 0 },
  { label: "AI 生成应用计划", labelEn: "AI drafts app plan",      startFrame: 200 },
  { label: "自动构建并部署", labelEn: "Auto-build & deploy",      startFrame: 900 },
];

interface StepItemProps {
  label: string;
  labelEn: string;
  startFrame: number;
  index: number;
}

const StepItem: React.FC<StepItemProps> = ({ label, labelEn, startFrame, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });

  const opacity = interpolate(s, [0, 1], [0, 1]);
  const x = interpolate(s, [0, 1], [-24, 0]);
  const isDone = frame >= startFrame + 30;

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        marginBottom: 28,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: isDone
            ? `linear-gradient(135deg, ${COLORS.brandBlue}, ${COLORS.accent})`
            : `${COLORS.brandBlue}33`,
          border: isDone ? "none" : `1.5px solid ${COLORS.brandBlue}88`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 2,
        }}
      >
        {isDone ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8l3.5 3.5L13 5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: COLORS.brandBlue,
              fontFamily: '"Inter", monospace',
            }}
          >
            {index + 1}
          </span>
        )}
      </div>
      <div>
        <p
          style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 600,
            color: isDone ? COLORS.textPrimary : COLORS.textSecondary,
            fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
            lineHeight: 1.4,
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: "3px 0 0",
            fontSize: 17,
            color: COLORS.textSecondary,
            fontFamily: '"Inter", sans-serif',
            opacity: 0.7,
          }}
        >
          {labelEn}
        </p>
      </div>
    </div>
  );
};

// AI app generation illustration for TransitionPage
const UseIllustration: React.FC = () => (
  <svg
    width="480"
    height="340"
    viewBox="0 0 480 340"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* ── Chat input box (left) ── */}
    <rect x="10" y="90" width="180" height="170" rx="10" fill="#1C1F3A" stroke="#2E3A6E" strokeWidth="1.5" />
    {/* Chat header */}
    <rect x="10" y="90" width="180" height="28" rx="10" fill="#0D0D14" />
    <rect x="10" y="106" width="180" height="12" fill="#0D0D14" />
    <rect x="24" y="98" width="60" height="8" rx="4" fill="#1E2235" />
    {/* AI badge */}
    <rect x="152" y="96" width="28" height="14" rx="5" fill="#1A6EFF" opacity="0.8" />
    <rect x="156" y="99" width="20" height="7" rx="2.5" fill="#fff" opacity="0.5" />
    {/* User message bubble */}
    <rect x="60" y="128" width="116" height="36" rx="8" fill="#1A6EFF" opacity="0.85" />
    <rect x="68" y="137" width="90" height="6" rx="3" fill="#fff" opacity="0.8" />
    <rect x="68" y="148" width="70" height="6" rx="3" fill="#fff" opacity="0.6" />
    {/* AI thinking bubble */}
    <rect x="18" y="176" width="130" height="50" rx="8" fill="#13131F" stroke="#1E2235" strokeWidth="1" />
    <rect x="26" y="184" width="50" height="7" rx="3" fill="#1A6EFF" opacity="0.6" />
    <rect x="26" y="196" width="110" height="6" rx="3" fill="#1E2235" />
    <rect x="26" y="207" width="90" height="6" rx="3" fill="#1E2235" />
    {/* Typing dots */}
    <circle cx="26" cy="238" r="4" fill="#1A6EFF" opacity="0.9" />
    <circle cx="38" cy="238" r="4" fill="#1A6EFF" opacity="0.6" />
    <circle cx="50" cy="238" r="4" fill="#1A6EFF" opacity="0.3" />
    {/* Input bar */}
    <rect x="18" y="248" width="162" height="22" rx="6" fill="#0D0D14" stroke="#1E2235" strokeWidth="1" />
    <rect x="26" y="255" width="100" height="7" rx="3" fill="#1E2235" />
    <rect x="164" y="250" width="16" height="18" rx="5" fill="#1A6EFF" opacity="0.8" />

    {/* ── Arrow: prompt → plan ── */}
    <path d="M196 175 L230 175" stroke="#2E3A6E" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M224 169 L232 175 L224 181" stroke="#1A6EFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

    {/* ── AI plan card (middle) ── */}
    <rect x="234" y="100" width="108" height="160" rx="9" fill="#13131F" stroke="#2E3A6E" strokeWidth="1.5" />
    {/* Plan header */}
    <rect x="242" y="112" width="68" height="9" rx="3" fill="#E8EDF5" opacity="0.8" />
    <rect x="242" y="126" width="92" height="6" rx="3" fill="#7A8599" opacity="0.5" />
    {/* Plan items */}
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <circle cx="248" cy={148 + i * 22} r="4" fill="#1A6EFF" opacity={0.9 - i * 0.15} />
        <rect x="258" y={144 + i * 22} width={68 - i * 8} height="7" rx="3"
          fill="#1E2235" opacity={0.9 - i * 0.1} />
      </g>
    ))}
    {/* Approve button */}
    <rect x="242" y="234" width="92" height="18" rx="6" fill="#1A6EFF" opacity="0.9" />
    <rect x="262" y="239" width="52" height="8" rx="3" fill="#fff" opacity="0.7" />

    {/* ── Arrow: plan → app ── */}
    <path d="M346 175 L378 175" stroke="#2E3A6E" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M372 169 L380 175 L372 181" stroke="#FF6B1A" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

    {/* ── Generated app preview (right) ── */}
    <rect x="382" y="60" width="88" height="220" rx="16" fill="#1C1F3A" stroke="#2E3A6E" strokeWidth="1.5" />
    {/* Phone notch */}
    <rect x="406" y="68" width="40" height="8" rx="4" fill="#0D0D14" />
    {/* Status bar dots */}
    <circle cx="464" cy="72" r="3" fill="#1A6EFF" opacity="0.7" />
    {/* App header */}
    <rect x="390" y="84" width="72" height="12" rx="4" fill="#0D0D14" />
    <rect x="394" y="88" width="40" height="6" rx="3" fill="#1E2235" />
    {/* Metric cards */}
    <rect x="390" y="104" width="32" height="32" rx="5" fill="#0D0D14" stroke="#1E2235" strokeWidth="1" />
    <rect x="395" y="109" width="20" height="7" rx="2.5" fill="#1A6EFF" opacity="0.9" />
    <rect x="395" y="120" width="16" height="5" rx="2" fill="#1E2235" />
    <rect x="428" y="104" width="32" height="32" rx="5" fill="#0D0D14" stroke="#1E2235" strokeWidth="1" />
    <rect x="433" y="109" width="20" height="7" rx="2.5" fill="#FF6B1A" opacity="0.9" />
    <rect x="433" y="120" width="16" height="5" rx="2" fill="#1E2235" />
    {/* Mini chart */}
    <rect x="390" y="144" width="70" height="50" rx="5" fill="#0D0D14" stroke="#1E2235" strokeWidth="1" />
    <polyline points="396,184 404,172 412,178 420,162 428,168 436,156 444,160 452,154"
      stroke="#1A6EFF" strokeWidth="1.5" fill="none" />
    {/* List rows */}
    <rect x="390" y="202" width="70" height="6" rx="3" fill="#1E2235" />
    <rect x="390" y="213" width="55" height="6" rx="3" fill="#1E2235" opacity="0.7" />
    <rect x="390" y="224" width="62" height="6" rx="3" fill="#1E2235" opacity="0.5" />
    {/* Home bar */}
    <rect x="412" y="268" width="28" height="4" rx="2" fill="#1E2235" />

    {/* Generated badge */}
    <rect x="382" y="286" width="88" height="18" rx="6" fill="#FF6B1A" opacity="0.15"
      stroke="#FF6B1A" strokeWidth="1" />
    <rect x="394" y="291" width="64" height="7" rx="3" fill="#FF6B1A" opacity="0.6" />

    {/* Glow behind app */}
    <ellipse cx="426" cy="170" rx="50" ry="100" fill="#FF6B1A" opacity="0.04" />

    {/* Floor shadows */}
    <ellipse cx="100" cy="330" rx="90" ry="6" fill="#000" opacity="0.22" />
    <ellipse cx="288" cy="330" rx="60" ry="5" fill="#000" opacity="0.18" />
    <ellipse cx="426" cy="330" rx="48" ry="5" fill="#000" opacity="0.18" />
  </svg>
);

const UseVideoSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const VIDEO_DURATION = 1500; // 50s
  const EXIT_START = 1430;     // flip begins at ~47.7s

  // --- Entrance ---
  const enterSpring = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 25 });
  const entranceScale   = interpolate(enterSpring, [0, 1], [0.92, 1]);
  const entranceOpacity = enterSpring;

  // --- Flip exit (rotateY 0 → 90deg) ---
  const flipAngle = interpolate(frame, [EXIT_START, VIDEO_DURATION], [0, 90], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const exitOpacity = interpolate(frame, [EXIT_START + 10, VIDEO_DURATION - 5], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const combinedOpacity = entranceOpacity * exitOpacity;
  const videoTransform  = `perspective(1000px) scale(${entranceScale}) rotateY(${flipAngle}deg)`;

  // --- Glow pulse ---
  const glowPulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 0.8),
    [-1, 1],
    [0.35, 0.70],
  );

  // --- Progress bar ---
  const progress = interpolate(frame, [0, VIDEO_DURATION], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // --- Floating accent dots ---
  const dots = [
    { cx: "8%",  cy: "20%", delay: 0,   size: 5 },
    { cx: "6%",  cy: "60%", delay: 15,  size: 4 },
    { cx: "92%", cy: "30%", delay: 8,   size: 5 },
    { cx: "94%", cy: "70%", delay: 22,  size: 4 },
    { cx: "50%", cy: "92%", delay: 30,  size: 4 },
  ];

  // --- Left panel slide-in ---
  const panelSpring = spring({ frame: frame - 10, fps, config: { damping: 200 }, durationInFrames: 22 });
  const panelX = interpolate(panelSpring, [0, 1], [-40, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgPrimary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 60px",
        gap: 60,
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${COLORS.border} 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.border} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.15,
        }}
      />

      {/* Decorative floating dots */}
      {dots.map((d, i) => {
        const dotOpacity = interpolate(
          Math.sin(((frame + d.delay * 8) / fps) * Math.PI * 0.6),
          [-1, 1],
          [0.15, 0.45],
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: d.cx,
              top: d.cy,
              width: d.size,
              height: d.size,
              borderRadius: "50%",
              background: COLORS.brandBlue,
              opacity: dotOpacity,
            }}
          />
        );
      })}

      {/* ── Left: step checklist ── */}
      <div
        style={{
          opacity: interpolate(panelSpring, [0, 1], [0, 1]),
          transform: `translateX(${panelX}px)`,
          flex: "0 0 320px",
          zIndex: 1,
        }}
      >
        <p
          style={{
            margin: "0 0 36px",
            fontSize: 22,
            fontWeight: 500,
            color: COLORS.textSecondary,
            fontFamily: '"Inter", sans-serif',
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Use Steps
        </p>
        {STEPS.map((step, i) => (
          <StepItem key={i} index={i} {...step} />
        ))}
      </div>

      {/* ── Right: framed video with flip exit ── */}
      <div
        style={{
          flex: "0 0 980px",
          opacity: combinedOpacity,
          transform: videoTransform,
          transformOrigin: "center center",
          zIndex: 1,
          position: "relative",
        }}
      >
        {/* Glow halo */}
        <div
          style={{
            position: "absolute",
            inset: -60,
            borderRadius: 32,
            background: `${COLORS.brandBlue}${Math.round(glowPulse * 255).toString(16).padStart(2, "0")}`,
            filter: "blur(72px)",
          }}
        />
        {/* Secondary outer ring glow */}
        <div
          style={{
            position: "absolute",
            inset: -90,
            borderRadius: 40,
            background: `${COLORS.accent}${Math.round(glowPulse * 0.35 * 255).toString(16).padStart(2, "0")}`,
            filter: "blur(90px)",
          }}
        />

        {/* Window frame */}
        <div
          style={{
            position: "relative",
            borderRadius: 14,
            overflow: "hidden",
            border: `1.5px solid ${COLORS.brandBlue}55`,
            boxShadow: `0 0 0 1px ${COLORS.border}, 0 32px 64px rgba(0,0,0,0.6)`,
          }}
        >
          {/* Chrome bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              background: "#0A0A12",
              borderBottom: `1px solid ${COLORS.border}`,
            }}
          >
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFBD2E" }} />
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C940" }} />
            <span
              style={{
                marginLeft: 12,
                fontSize: 13,
                color: COLORS.textSecondary,
                fontFamily: '"Inter", sans-serif',
                opacity: 0.6,
              }}
            >
              蜻蜓工业助手 · AI 应用生成
            </span>
          </div>

          {/* Video */}
          <OffthreadVideo
            src={staticFile("videos/product-analyze-app-gen.mp4")}
            style={{ width: "100%", display: "block" }}
          />

          {/* Progress bar */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 3,
              background: COLORS.border,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${COLORS.brandBlue}, ${COLORS.accent})`,
              }}
            />
          </div>
        </div>

        {/* Version badge */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            right: 16,
            background: `${COLORS.bgPrimary}CC`,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 6,
            padding: "4px 12px",
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: COLORS.textSecondary,
              fontFamily: '"Inter", monospace',
            }}
          >
            v1.5.3
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const QuickUse: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={SCENE_VIDEO_OFFSET} premountFor={fps}>
        <TransitionPage
          title="快用"
          body="一句话生成 AI 应用，所想即所得：看板、报表、预警、业务小工具自动生成并部署。数据从「采到」直接变成「用到」。"
          illustrationNode={<UseIllustration />}
        />
      </Sequence>
      <Sequence from={SCENE_VIDEO_OFFSET} durationInFrames={1500} premountFor={fps}>
        <UseVideoSection />
      </Sequence>
    </AbsoluteFill>
  );
};
