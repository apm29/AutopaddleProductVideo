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

// Scene 03: 快采 — 750 frames (25s)
// 0–240f:   TransitionPage
// 240–750f: CollectVideoSection (17s / 510f)

// Step checklist — timed to video content
const STEPS = [
  { label: "选择设备类型",    labelEn: "Choose device type",     startFrame: 0 },
  { label: "AI 引导配置参数", labelEn: "AI-guided setup",        startFrame: 130 },
  { label: "验证数据采集",    labelEn: "Verify data collection",  startFrame: 340 },
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

// Data collection illustration for TransitionPage
const CollectIllustration: React.FC = () => (
  <svg
    width="480"
    height="340"
    viewBox="0 0 480 340"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* ── Industrial device (left) ── */}
    <rect x="20" y="60" width="130" height="200" rx="10" fill="#1C1F3A" stroke="#2E3A6E" strokeWidth="1.5" />
    {/* Device display panel */}
    <rect x="34" y="76" width="102" height="64" rx="5" fill="#0A0B18" stroke="#252A4E" strokeWidth="1" />
    {/* Display content — waveform lines */}
    <polyline points="38,120 50,108 60,118 72,100 84,112 96,96 108,110 120,104 132,114" stroke="#1A6EFF" strokeWidth="1.5" fill="none" opacity="0.9" />
    <polyline points="38,128 52,124 66,126 80,122 94,125 108,121 122,124 132,122" stroke="#00C4FF" strokeWidth="1" fill="none" opacity="0.6" />
    {/* Device label area */}
    <rect x="34" y="148" width="60" height="7" rx="3" fill="#1E2245" />
    <rect x="34" y="160" width="46" height="6" rx="3" fill="#1E2245" opacity="0.6" />
    {/* Status lights */}
    <circle cx="44" cy="184" r="6" fill="#28C940" opacity="0.9" />
    <circle cx="64" cy="184" r="6" fill="#1A6EFF" opacity="0.8" />
    <circle cx="84" cy="184" r="6" fill="#FF6B1A" opacity="0.5" />
    {/* Port connectors */}
    <rect x="34" y="200" width="38" height="10" rx="3" fill="#0A0B18" stroke="#252A4E" strokeWidth="1" />
    <rect x="34" y="216" width="28" height="8" rx="2" fill="#0A0B18" stroke="#252A4E" strokeWidth="1" />
    {/* Bottom of device */}
    <rect x="24" y="252" width="122" height="8" rx="4" fill="#111428" stroke="#252A4E" strokeWidth="1" />
    {/* Device label */}
    <rect x="34" y="232" width="80" height="6" rx="3" fill="#1A6EFF" opacity="0.3" />

    {/* ── Cable / connection ── */}
    {/* Horizontal wire */}
    <line x1="150" y1="160" x2="230" y2="160" stroke="#2E3A6E" strokeWidth="3" strokeLinecap="round" />
    {/* Data packets flowing */}
    <rect x="160" y="152" width="14" height="16" rx="3" fill="#1A6EFF" opacity="0.9" />
    <rect x="185" y="152" width="14" height="16" rx="3" fill="#00C4FF" opacity="0.7" />
    <rect x="210" y="152" width="14" height="16" rx="3" fill="#1A6EFF" opacity="0.5" />
    {/* Arrow head */}
    <path d="M224 153 L234 160 L224 167" stroke="#1A6EFF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

    {/* ── Software UI panel (right) ── */}
    <rect x="238" y="30" width="222" height="280" rx="10" fill="#13131F" stroke="#2E3A6E" strokeWidth="1.5" />
    {/* Chrome bar */}
    <rect x="238" y="30" width="222" height="24" rx="10" fill="#0D0D14" />
    <rect x="238" y="42" width="222" height="12" fill="#0D0D14" />
    <circle cx="254" cy="42" r="4.5" fill="#FF5F57" />
    <circle cx="268" cy="42" r="4.5" fill="#FFBD2E" />
    <circle cx="282" cy="42" r="4.5" fill="#28C940" />
    <rect x="320" y="37" width="90" height="9" rx="4" fill="#1E2235" />
    {/* Sidebar */}
    <rect x="238" y="54" width="60" height="256" fill="#0A0B18" />
    <rect x="248" y="66" width="40" height="8" rx="3" fill="#1A6EFF" opacity="0.7" />
    <rect x="248" y="82" width="34" height="6" rx="3" fill="#1E2235" />
    <rect x="248" y="94" width="38" height="6" rx="3" fill="#1E2235" />
    <rect x="248" y="106" width="30" height="6" rx="3" fill="#1E2235" />
    <line x1="298" y1="54" x2="298" y2="310" stroke="#1E2235" strokeWidth="1" />
    {/* Main panel */}
    <rect x="298" y="54" width="162" height="256" fill="#0F0F1A" />
    {/* Live data header */}
    <rect x="310" y="66" width="80" height="11" rx="3" fill="#E8EDF5" opacity="0.85" />
    <rect x="396" y="68" width="10" height="8" rx="2" fill="#28C940" opacity="0.8" />
    <rect x="408" y="68" width="40" height="7" rx="3" fill="#28C940" opacity="0.4" />
    {/* Data rows — live stream */}
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <g key={i}>
        <rect x="310" y={88 + i * 26} width="50" height="7" rx="3"
          fill="#1E2235" opacity="0.8" />
        <rect x="368" y={88 + i * 26} width="38" height="7" rx="3"
          fill={i % 3 === 0 ? "#1A6EFF" : i % 3 === 1 ? "#00C4FF" : "#FF6B1A"}
          opacity={0.6 + i * 0.04} />
        <rect x="414" y={88 + i * 26} width="30" height="7" rx="3"
          fill="#1E2235" opacity="0.5" />
      </g>
    ))}
    {/* Active row highlight */}
    <rect x="306" y="244" width="150" height="18" rx="4" fill="#1A6EFF" opacity="0.1" />
    <rect x="310" y="248" width="50" height="7" rx="3" fill="#1E2235" />
    <rect x="368" y="248" width="38" height="7" rx="3" fill="#1A6EFF" opacity="0.9" />
    <rect x="414" y="248" width="30" height="7" rx="3" fill="#1E2235" opacity="0.5" />
    {/* Bottom status bar */}
    <rect x="298" y="286" width="162" height="24" fill="#0D0D14" />
    <rect x="306" y="292" width="12" height="12" rx="6" fill="#28C940" opacity="0.7" />
    <rect x="322" y="295" width="60" height="6" rx="3" fill="#1E2235" />
    <rect x="400" y="295" width="48" height="6" rx="3" fill="#1A6EFF" opacity="0.5" />

    {/* Screen edge glow */}
    <rect x="238" y="30" width="222" height="280" rx="10" fill="none"
      stroke="#1A6EFF" strokeWidth="1" opacity="0.2" />

    {/* Floor shadow */}
    <ellipse cx="85" cy="330" rx="75" ry="6" fill="#000" opacity="0.25" />
    <ellipse cx="349" cy="330" rx="115" ry="6" fill="#000" opacity="0.2" />
  </svg>
);

const CollectVideoSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const VIDEO_DURATION = 510; // 17s
  const EXIT_START = 460;     // flip begins at ~15.3s

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
        padding: "40px 60px",
        gap: 40,
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
          flex: "0 0 240px",
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
          Collect Steps
        </p>
        {STEPS.map((step, i) => (
          <StepItem key={i} index={i} {...step} />
        ))}
      </div>

      {/* ── Right: framed video with flip exit ── */}
      <div
        style={{
          flex: "0 0 1200px",
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
              蜻蜓工业助手 · 设备接入向导
            </span>
          </div>

          {/* Video */}
          <OffthreadVideo
            src={staticFile("videos/config.mp4")}
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

export const QuickCollect: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={SCENE_VIDEO_OFFSET} premountFor={fps}>
        <TransitionPage
          title="快采"
          body="预置万种主流设备配置，覆盖常见设备与系统接入场景。全程 AI 引导，跟着做就能对接上线，省去找专家、反复试错的时间。"
          illustrationNode={<CollectIllustration />}
        />
      </Sequence>
      <Sequence from={SCENE_VIDEO_OFFSET} durationInFrames={510} premountFor={fps}>
        <CollectVideoSection />
      </Sequence>
    </AbsoluteFill>
  );
};
