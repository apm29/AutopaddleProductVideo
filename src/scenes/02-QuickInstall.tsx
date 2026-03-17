import {
  AbsoluteFill,
  Easing,
  Sequence,
  Video,
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
          <Video
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
          layout="text-only"
        />
      </Sequence>
      <Sequence from={SCENE_VIDEO_OFFSET} durationInFrames={300} premountFor={fps}>
        <InstallVideoSection />
      </Sequence>
    </AbsoluteFill>
  );
};
