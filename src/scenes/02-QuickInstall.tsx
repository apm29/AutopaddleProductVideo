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

// Scene 02: 快装 — 540 frames (18s)
// 0–240f:   TransitionPage
// 240–540f: Framed video with dynamic effects (10s / 300f)

// Step checklist — timed to video content
const STEPS = [
  { label: "选择安装位置",   labelEn: "Choose install path",   startFrame: 0 },
  { label: "安装程序文件",   labelEn: "Installing files",      startFrame: 80 },
  { label: "启动并完成登录", labelEn: "Launch & sign in",      startFrame: 200 },
];

// Monitor + tower SVG illustration with CRT power-on animation
const LaptopIllustration: React.FC = () => {
  const frame = useCurrentFrame();

  // Screen rect constants (in monitor's local coord space, before translate)
  const SX = 42, SY = 32, SW = 436, SH = 266;
  const centerY = SY + SH / 2; // 165

  // CRT horizontal-line → full-screen expansion (frames 16–54)
  const crtExpand = interpolate(frame, [16, 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const expandedH = crtExpand * SH;
  const clipY = centerY - expandedH / 2;

  // Bright white CRT line opacity
  const lineOpacity = interpolate(frame, [14, 17, 32, 54], [0, 1, 0.6, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Phosphor bloom flash right after power-on
  const phosphorOpacity = interpolate(frame, [16, 21, 38], [0, 0.4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Content fades in after CRT expansion
  const contentOpacity = interpolate(frame, [50, 74], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Scanline overlay fades out after reveal
  const scanOpacity = interpolate(frame, [50, 62, 82], [0.5, 0.25, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      width="640"
      height="380"
      viewBox="0 0 640 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ══ Monitor (shifted -20 so tower fits) ══ */}
      <g transform="translate(-20, 0)">
        {/* Outer chassis — blue-tinted for contrast */}
        <rect x="30" y="20" width="460" height="290" rx="12" fill="#1C1F3A" stroke="#2E3A6E" strokeWidth="2" />
        {/* Inner bezel */}
        <rect x={SX} y={SY} width={SW} height={SH} rx="7" fill="#07070F" />

        {/* ── Screen content (clipped by CRT reveal) ── */}
        <g clipPath="url(#crtClip)" opacity={contentOpacity}>
          {/* Chrome bar */}
          <rect x="42" y="32" width="436" height="24" rx="7" fill="#13131F" />
          <rect x="42" y="44" width="436" height="12" fill="#13131F" />
          <circle cx="60" cy="44" r="5" fill="#FF5F57" />
          <circle cx="76" cy="44" r="5" fill="#FFBD2E" />
          <circle cx="92" cy="44" r="5" fill="#28C940" />
          <rect x="196" y="39" width="128" height="10" rx="5" fill="#1E2235" />

          {/* Sidebar */}
          <rect x="42" y="56" width="120" height="242" fill="#0D0D14" />
          <rect x="58" y="70" width="26" height="26" rx="7" fill="#1A6EFF" opacity="0.9" />
          <rect x="64" y="77" width="14" height="3" rx="1.5" fill="#fff" opacity="0.9" />
          <rect x="64" y="83" width="10" height="3" rx="1.5" fill="#fff" opacity="0.7" />
          <rect x="64" y="89" width="12" height="3" rx="1.5" fill="#fff" opacity="0.5" />
          <rect x="90" y="74" width="58" height="8" rx="3" fill="#1E2235" />
          <rect x="90" y="86" width="44" height="6" rx="3" fill="#1E2235" opacity="0.5" />

          {/* Step 1 done */}
          <circle cx="66" cy="130" r="9" fill="#1A6EFF" />
          <path d="M62 130l3.5 3.5L74 124" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="82" y="125" width="66" height="8" rx="3" fill="#E8EDF5" opacity="0.75" />
          <line x1="66" y1="139" x2="66" y2="153" stroke="#1A6EFF" strokeWidth="1.5" strokeDasharray="2 2" />
          {/* Step 2 active */}
          <circle cx="66" cy="162" r="9" fill="#1A6EFF" />
          <text x="62" y="167" fontSize="10" fill="#fff" fontWeight="bold" fontFamily="monospace">2</text>
          <rect x="82" y="157" width="74" height="8" rx="3" fill="#E8EDF5" opacity="0.9" />
          <rect x="82" y="169" width="54" height="6" rx="3" fill="#1A6EFF" opacity="0.4" />
          <line x1="66" y1="171" x2="66" y2="185" stroke="#1A6EFF" strokeWidth="1.5" />
          {/* Step 3 pending */}
          <circle cx="66" cy="194" r="9" fill="none" stroke="#1E2235" strokeWidth="1.5" />
          <text x="62" y="199" fontSize="10" fill="#7A8599" fontFamily="monospace">3</text>
          <rect x="82" y="189" width="60" height="8" rx="3" fill="#1E2235" />
          <line x1="66" y1="203" x2="66" y2="217" stroke="#1E2235" strokeWidth="1.5" strokeDasharray="2 2" />
          {/* Step 4 pending */}
          <circle cx="66" cy="226" r="9" fill="none" stroke="#1E2235" strokeWidth="1.5" />
          <text x="62" y="231" fontSize="10" fill="#7A8599" fontFamily="monospace">4</text>
          <rect x="82" y="221" width="68" height="8" rx="3" fill="#1E2235" />

          {/* Sidebar divider */}
          <line x1="162" y1="56" x2="162" y2="298" stroke="#1E2235" strokeWidth="1" />

          {/* Main panel */}
          <rect x="162" y="56" width="316" height="242" fill="#0F0F1A" />
          <rect x="182" y="74" width="150" height="13" rx="4" fill="#E8EDF5" opacity="0.85" />
          <rect x="182" y="92" width="240" height="8" rx="3" fill="#7A8599" opacity="0.55" />
          {/* Path field */}
          <rect x="182" y="114" width="70" height="7" rx="3" fill="#7A8599" opacity="0.5" />
          <rect x="182" y="126" width="236" height="24" rx="6" fill="#13131F" stroke="#1E2235" strokeWidth="1" />
          <rect x="190" y="133" width="148" height="8" rx="3" fill="#1E2235" />
          <rect x="400" y="128" width="40" height="20" rx="5" fill="#1A6EFF" opacity="0.8" />
          <rect x="406" y="133" width="28" height="8" rx="3" fill="#fff" opacity="0.45" />
          {/* Disk info */}
          <rect x="182" y="158" width="80" height="6" rx="3" fill="#7A8599" opacity="0.45" />
          <rect x="270" y="158" width="50" height="6" rx="3" fill="#00C4FF" opacity="0.6" />
          {/* Progress */}
          <rect x="182" y="176" width="70" height="7" rx="3" fill="#7A8599" opacity="0.5" />
          <rect x="182" y="188" width="256" height="12" rx="6" fill="#1E2235" />
          <rect x="182" y="188" width="158" height="12" rx="6" fill="url(#monitorProgress)" />
          <rect x="348" y="188" width="44" height="12" rx="5" fill="#1E2235" />
          <rect x="352" y="192" width="28" height="5" rx="2.5" fill="#1A6EFF" opacity="0.55" />
          {/* Log box */}
          <rect x="182" y="210" width="256" height="68" rx="6" fill="#0D0D14" stroke="#1E2235" strokeWidth="1" />
          <rect x="192" y="220" width="160" height="6" rx="3" fill="#1E2235" />
          <rect x="192" y="231" width="190" height="6" rx="3" fill="#1E2235" />
          <rect x="192" y="242" width="140" height="6" rx="3" fill="#1E2235" />
          <rect x="192" y="253" width="210" height="6" rx="3" fill="#1A6EFF" opacity="0.5" />
          <rect x="192" y="264" width="120" height="6" rx="3" fill="#1A6EFF" opacity="0.3" />
          {/* Action bar */}
          <rect x="162" y="278" width="316" height="20" fill="#13131F" />
          <rect x="368" y="281" width="68" height="14" rx="5" fill="#1A6EFF" />
          <rect x="377" y="285" width="50" height="6" rx="3" fill="#fff" opacity="0.6" />
          <rect x="292" y="281" width="68" height="14" rx="5" fill="#1E2235" />
          <rect x="301" y="285" width="50" height="6" rx="3" fill="#7A8599" opacity="0.5" />
        </g>

        {/* Scanline overlay (fades out after reveal) */}
        <rect x={SX} y={SY} width={SW} height={SH}
          fill="url(#scanlines)" opacity={scanOpacity}
          clipPath="url(#crtClip)" />

        {/* Phosphor bloom flash */}
        <rect x={SX} y={SY} width={SW} height={SH} rx="7"
          fill="#99BBFF" opacity={phosphorOpacity} />

        {/* CRT expanding bright line */}
        <rect
          x={SX} y={centerY - 3} width={SW} height={6}
          fill="white" opacity={lineOpacity}
          filter="url(#crtGlow)"
        />

        {/* Screen border glow */}
        <rect x={SX} y={SY} width={SW} height={SH} rx="7"
          fill="none" stroke="#1A6EFF" strokeWidth="1.5"
          opacity={0.1 + contentOpacity * 0.25} />

        {/* Stand neck */}
        <rect x="238" y="310" width="44" height="36" rx="4" fill="#1C1F3A" stroke="#2E3A6E" strokeWidth="1.5" />
        <rect x="246" y="314" width="28" height="28" rx="3" fill="#0A0B18" />
        {/* Stand base */}
        <rect x="170" y="344" width="180" height="16" rx="8" fill="#1C1F3A" stroke="#2E3A6E" strokeWidth="1.5" />
        {/* Power LED */}
        <circle cx="260" cy="304" r="3.5" fill="#1A6EFF"
          opacity={0.2 + contentOpacity * 0.8} />
      </g>

      {/* ══ Tower case (机箱) — larger ══ */}
      {/* Body */}
      <rect x="496" y="58" width="132" height="240" rx="9" fill="#1C1F3A" stroke="#2E3A6E" strokeWidth="1.5" />
      {/* Side panel with mesh */}
      <rect x="504" y="66" width="78" height="224" rx="5" fill="#111428" stroke="#252A4E" strokeWidth="1" />
      {[0,1,2,3,4,5,6,7,8].map((i) => (
        <line key={i} x1="508" y1={78 + i * 17} x2="578" y2={78 + i * 17}
          stroke="#1E2245" strokeWidth="1" opacity="0.9" />
      ))}
      {/* Right button strip */}
      <rect x="586" y="66" width="34" height="224" rx="0" fill="#131628" />
      <rect x="586" y="66" width="34" height="224" rx="0" fill="none" stroke="#252A4E" strokeWidth="0.5" />

      {/* 5.25" drive bay top */}
      <rect x="498" y="62" width="128" height="30" rx="0" fill="#111428" stroke="#252A4E" strokeWidth="0.5" />
      <rect x="506" y="66" width="112" height="20" rx="4" fill="#161830" stroke="#252A4E" strokeWidth="0.5" />

      {/* Power button */}
      <circle cx="609" cy="118" r="11" fill="#161830" stroke="#2E3A6E" strokeWidth="1.5" />
      <circle cx="609" cy="118" r="7" fill="#1A6EFF"
        opacity={0.25 + contentOpacity * 0.75} />

      {/* Reset button */}
      <circle cx="609" cy="142" r="5.5" fill="#131628" stroke="#252A4E" strokeWidth="1" />
      <circle cx="609" cy="142" r="3" fill="#7A8599" opacity="0.4" />

      {/* Power LED */}
      <rect x="600" y="157" width="18" height="6" rx="3"
        fill="#1A6EFF" opacity={contentOpacity * 0.85} />

      {/* HDD LED */}
      <rect x="600" y="168" width="18" height="6" rx="3"
        fill="#FF6B1A" opacity={contentOpacity * 0.6} />

      {/* USB ports */}
      <rect x="592" y="184" width="26" height="12" rx="2.5" fill="#0A0A16" stroke="#252A4E" strokeWidth="0.8" />
      <rect x="592" y="200" width="26" height="12" rx="2.5" fill="#0A0A16" stroke="#252A4E" strokeWidth="0.8" />
      {/* Audio jacks */}
      <rect x="592" y="216" width="11" height="11" rx="2" fill="#0A0A16" stroke="#252A4E" strokeWidth="0.8" />
      <rect x="607" y="216" width="11" height="11" rx="2" fill="#0A0A16" stroke="#252A4E" strokeWidth="0.8" />

      {/* Front vent grills */}
      {[0,1,2,3,4,5].map((i) => (
        <rect key={i} x="506" y={256 + i * 10} width="70" height="6" rx="3"
          fill="#1E2245" opacity="0.8" />
      ))}

      {/* Tower base foot */}
      <rect x="500" y="294" width="124" height="8" rx="4" fill="#111428" stroke="#252A4E" strokeWidth="1" />

      {/* Shadows */}
      <ellipse cx="562" cy="368" rx="72" ry="7" fill="#000" opacity="0.3" />
      <ellipse cx="220" cy="368" rx="158" ry="7" fill="#000" opacity="0.3" />

      <defs>
        {/* CRT reveal clip */}
        <clipPath id="crtClip">
          <rect x={SX} y={clipY} width={SW} height={expandedH} />
        </clipPath>
        {/* Progress bar gradient */}
        <linearGradient id="monitorProgress" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1A6EFF" />
          <stop offset="100%" stopColor="#00C4FF" />
        </linearGradient>
        {/* CRT line glow */}
        <filter id="crtGlow" x="-10%" y="-400%" width="120%" height="900%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Scanlines pattern */}
        <pattern id="scanlines" x={SX} y={SY} width="1" height="4" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="1" height="2" fill="#000" opacity="0.55" />
        </pattern>
      </defs>
    </svg>
  );
};

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
      {/* Step circle */}
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
          // Checkmark
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

      {/* Text */}
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

const InstallVideoSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const VIDEO_DURATION = 300; // 10s
  const EXIT_START = 255;     // flip begins at ~8.5s, lasts 45f (1.5s)

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
        padding: "60px 80px",
        gap: 80,
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
          Install Steps
        </p>
        {STEPS.map((step, i) => (
          <StepItem key={i} index={i} {...step} />
        ))}
      </div>

      {/* ── Right: framed video (smaller, with flip exit) ── */}
      <div
        style={{
          flex: "0 0 580px",
          opacity: combinedOpacity,
          transform: videoTransform,
          transformOrigin: "center center",
          zIndex: 1,
          position: "relative",
        }}
      >
        {/* Glow halo — bigger spread + stronger pulse */}
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
              蜻蜓工业助手 安装向导
            </span>
          </div>

          {/* Video */}
          <OffthreadVideo
            src={staticFile("videos/setup.mp4")}
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

export const QuickInstall: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={SCENE_VIDEO_OFFSET} premountFor={fps}>
        <TransitionPage
          title="快装"
          body="办公电脑即可安装部署，无需专用硬件与复杂环境。数据留存企业内网，权限与访问由你掌控，安全合规、可控可管。"
          illustrationNode={<LaptopIllustration />}
        />
      </Sequence>
      <Sequence from={SCENE_VIDEO_OFFSET} durationInFrames={300} premountFor={fps}>
        <InstallVideoSection />
      </Sequence>
    </AbsoluteFill>
  );
};
