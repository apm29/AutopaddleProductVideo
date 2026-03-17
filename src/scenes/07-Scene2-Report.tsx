import {
  AbsoluteFill,
  Easing,
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

// Scene 07: 场景二 — 生产数据报表应用生成 — 1710 frames (57s)
// 0–240f:    TransitionPage
// 240–1710f: ReportVideoSection (49s / 1470f)

// ── Right-side illustration for TransitionPage ──
const Scene2Illustration: React.FC = () => {
  const frame = useCurrentFrame();

  // Overall card entrance
  const cardEnter = interpolate(frame, [0, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * (2 - t),
  });
  const cardY = interpolate(frame, [0, 28], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "2" number pop
  const numScale = interpolate(frame, [4, 22], [0.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  // Table rows stagger (from frame 24)
  const rows = [
    { label: "车床 CNC-01", value: "134 件", rate: "91%", color: COLORS.brandBlue },
    { label: "车床 CNC-02", value: "98 件",  rate: "87%", color: COLORS.accent },
    { label: "班组 A",      value: "232 件", rate: "89%", color: COLORS.brandBlue },
    { label: "班组 B",      value: "176 件", rate: "85%", color: "#00C4FF" },
  ];

  return (
    <div
      style={{
        opacity: cardEnter,
        transform: `translateY(${cardY}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        width: 420,
      }}
    >
      {/* ── Metric card ── */}
      <div
        style={{
          background: COLORS.bgSecondary,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* Number */}
        <div
          style={{
            transform: `scale(${numScale})`,
            transformOrigin: "left center",
            lineHeight: 1,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: COLORS.accent,
              fontFamily: '"Inter", "JetBrains Mono", monospace',
              letterSpacing: "-2px",
            }}
          >
            2
          </span>
          <span
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: COLORS.accent,
              fontFamily: '"Inter", monospace',
              marginLeft: 4,
            }}
          >
            h
          </span>
        </div>
        {/* Label */}
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              color: COLORS.textSecondary,
              fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
              lineHeight: 1.5,
            }}
          >
            每天节省
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              color: COLORS.textPrimary,
              fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
              fontWeight: 600,
              lineHeight: 1.5,
            }}
          >
            人工统计时间
          </p>
        </div>
      </div>

      {/* ── Mini report table ── */}
      <div
        style={{
          background: COLORS.bgSecondary,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 80px 60px",
            padding: "10px 16px",
            borderBottom: `1px solid ${COLORS.border}`,
            background: "#0D0D14",
          }}
        >
          {["设备/班组", "产量", "稼动率"].map((h) => (
            <span
              key={h}
              style={{
                fontSize: 11,
                color: COLORS.textSecondary,
                fontFamily: '"Inter", sans-serif',
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {h}
            </span>
          ))}
        </div>
        {/* Rows */}
        {rows.map((row, i) => {
          const rowOpacity = interpolate(frame, [24 + i * 12, 44 + i * 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const rowX = interpolate(frame, [24 + i * 12, 44 + i * 12], [-12, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                opacity: rowOpacity,
                transform: `translateX(${rowX}px)`,
                display: "grid",
                gridTemplateColumns: "1fr 80px 60px",
                padding: "9px 16px",
                borderBottom: i < rows.length - 1 ? `1px solid ${COLORS.border}` : "none",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  color: COLORS.textPrimary,
                  fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                }}
              >
                {row.label}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: row.color,
                  fontFamily: '"Inter", monospace',
                  fontWeight: 600,
                }}
              >
                {row.value}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: COLORS.textSecondary,
                  fontFamily: '"Inter", monospace',
                }}
              >
                {row.rate}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const STEPS = [
  { label: "描述报表需求",    labelEn: "Describe report needs",   startFrame: 0 },
  { label: "AI 生成报表应用", labelEn: "AI builds report app",    startFrame: 0 },
  { label: "构建部署应用",   labelEn: "Build & deploy app",      startFrame: 1020 },
  { label: "查看数据与分析",  labelEn: "Review data & analysis",  startFrame: 1170 },
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

const ReportVideoSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const VIDEO_DURATION = 1470; // 49s
  const EXIT_START = 1400;

  const enterSpring = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 25 });
  const entranceScale   = interpolate(enterSpring, [0, 1], [0.92, 1]);
  const entranceOpacity = enterSpring;

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

  const glowPulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 0.8),
    [-1, 1],
    [0.35, 0.70],
  );

  const progress = interpolate(frame, [0, VIDEO_DURATION], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dots = [
    { cx: "8%",  cy: "20%", delay: 0,   size: 5 },
    { cx: "6%",  cy: "60%", delay: 15,  size: 4 },
    { cx: "92%", cy: "30%", delay: 8,   size: 5 },
    { cx: "94%", cy: "70%", delay: 22,  size: 4 },
    { cx: "50%", cy: "92%", delay: 30,  size: 4 },
  ];

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

      {/* Left: step checklist */}
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
          Report Steps
        </p>
        {STEPS.map((step, i) => (
          <StepItem key={i} index={i} {...step} />
        ))}
      </div>

      {/* Right: framed video with flip exit */}
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
              蜻蜓工业助手 · 生产数据报表
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

// ── Callout badge for screenshot annotations ──
interface CalloutProps {
  frame: number;
  startFrame: number;
  label: string;
  sub: string;
  color: string;
  side: "left" | "right";
  exitFrame?: number;
}

const Callout: React.FC<CalloutProps> = ({ frame, startFrame, label, sub, color, side, exitFrame }) => {
  const { fps } = useVideoConfig();

  const enterS = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 180 },
    durationInFrames: 22,
  });
  const enterOpacity = interpolate(enterS, [0, 1], [0, 1]);
  const enterX = interpolate(enterS, [0, 1], [side === "right" ? 40 : -40, 0]);
  const enterScale = interpolate(enterS, [0, 1], [0.82, 1]);

  const exitOpacity = exitFrame != null
    ? interpolate(frame, [exitFrame, exitFrame + 20], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;

  return (
    <div
      style={{
        opacity: enterOpacity * exitOpacity,
        transform: `translateX(${enterX}px) scale(${enterScale})`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: `${COLORS.bgSecondary}EE`,
        border: `1px solid ${color}55`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 8,
        padding: "8px 14px",
        backdropFilter: "blur(4px)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          flexShrink: 0,
        }}
      />
      <div>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COLORS.textPrimary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif', lineHeight: 1.3 }}>
          {label}
        </p>
        <p style={{ margin: 0, fontSize: 12, color: COLORS.textSecondary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif', lineHeight: 1.4 }}>
          {sub}
        </p>
      </div>
    </div>
  );
};

// ── Screenshot showcase: stacked side-angle → fly out to normal ──
const ReportScreenshotShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Stack entrance (both cards slide in from right at 35deg) ──
  const stackEnter = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 40 });
  const stackX = interpolate(stackEnter, [0, 1], [320, 0]);
  const stackOpacity = interpolate(stackEnter, [0, 1], [0, 1]);

  // ── List card: fly out (55–90f) ──
  const listFlyS = spring({ frame: frame - 55, fps, config: { damping: 160 }, durationInFrames: 35 });
  const listRotY = interpolate(listFlyS, [0, 1], [35, 0]);
  const listTX = interpolate(listFlyS, [0, 1], [-60, 0]);
  // exit (155–185f)
  const listExitAngle = interpolate(frame, [155, 185], [0, -35], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  const listExitOpacity = interpolate(frame, [155, 183], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const listAngle = frame < 155 ? listRotY : listExitAngle;
  const listOpacity = frame < 155 ? 1 : listExitOpacity;

  // ── Detail card: fly out (180–215f) ──
  const detailFlyS = spring({ frame: frame - 180, fps, config: { damping: 160 }, durationInFrames: 35 });
  const detailRotY = interpolate(detailFlyS, [0, 1], [35, 0]);
  const detailTX = interpolate(detailFlyS, [0, 1], [60, 0]);
  // exit (275–300f)
  const detailExitOpacity = interpolate(frame, [275, 298], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Overall badge header ──
  const headerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── List callout exit (synchronised with list exit) ──
  const calloutListExit = 150;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgPrimary,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 0,
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
          opacity: 0.13,
        }}
      />

      {/* Top label badge */}
      <div
        style={{
          opacity: headerOpacity,
          position: "absolute",
          top: 48,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: `${COLORS.bgSecondary}CC`,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 20,
          padding: "6px 18px",
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28C940" }} />
        <span style={{ fontSize: 16, color: COLORS.textSecondary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>
          某汽车零件制造企业 · 实际应用效果
        </span>
      </div>

      {/* ── Stacked phase (0–55f): both cards visible at 35deg ── */}
      {frame < 155 && (
        <div
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            perspective: "1400px",
            width: "100%",
          }}
        >
          {/* Detail card (behind) — only in stack phase */}
          {frame < 180 && (
            <div
              style={{
                position: "absolute",
                opacity: frame < 55 ? stackOpacity * 0.45 : 0,
                transform: `translateX(calc(${stackX}px + 60px)) rotateY(35deg) scale(0.9)`,
                transformOrigin: "center center",
                maxWidth: 920,
                width: "100%",
                borderRadius: 14,
                overflow: "hidden",
                border: `1px solid ${COLORS.border}`,
                boxShadow: `0 20px 60px rgba(0,0,0,0.5)`,
              }}
            >
              <Img src={staticFile("screenshots/product-daily-report-detail.png")} style={{ width: "100%", display: "block" }} />
            </div>
          )}
        </div>
      )}

      {/* ── List screenshot (main) ── */}
      <div
        style={{
          position: "absolute",
          perspective: "1400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "0 80px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            opacity: frame < 55 ? stackOpacity : listOpacity,
            transform: frame < 55
              ? `translateX(calc(${stackX}px - 60px)) rotateY(35deg)`
              : `translateX(${listTX}px) rotateY(${listAngle}deg)`,
            transformOrigin: "center center",
            maxWidth: 1360,
            width: "100%",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Glow */}
          <div style={{ position: "absolute", inset: -50, borderRadius: 28, background: `${COLORS.brandBlue}28`, filter: "blur(60px)" }} />
          {/* Window frame */}
          <div
            style={{
              position: "relative",
              borderRadius: 14,
              overflow: "hidden",
              border: `1.5px solid ${COLORS.brandBlue}55`,
              boxShadow: `0 0 0 1px ${COLORS.border}, 0 28px 60px rgba(0,0,0,0.55)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", background: "#0A0A12", borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C940" }} />
              <span style={{ marginLeft: 10, fontSize: 12, color: COLORS.textSecondary, fontFamily: '"Inter",sans-serif', opacity: 0.6 }}>
                蜻蜓工业助手 · 设备日报
              </span>
            </div>
            <Img src={staticFile("screenshots/product-daily-report-list.png")} style={{ width: "100%", display: "block" }} />
          </div>

          {/* List callouts (appear after fly-out at f 100, stagger 10f) */}
          <div
            style={{
              position: "absolute",
              right: -220,
              top: "28%",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              width: 210,
            }}
          >
            {[
              { label: "加工时长", sub: "机床实际切削加工累计时长", color: "#28C940", start: 100 },
              { label: "开机时长", sub: "机床通电运行总时长", color: "#FF6B1A", start: 110 },
              { label: "空闲时长", sub: "开机但未切削的等待时间", color: "#7A8599", start: 120 },
              { label: "离线时长", sub: "机床断联或停机时间", color: "#FF4D4D", start: 130 },
            ].map((c, i) => (
              <Callout
                key={i}
                frame={frame}
                startFrame={c.start}
                label={c.label}
                sub={c.sub}
                color={c.color}
                side="right"
                exitFrame={calloutListExit}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Detail screenshot ── */}
      {frame >= 160 && (
        <div
          style={{
            position: "absolute",
            perspective: "1400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "0 120px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              opacity: frame < 180 ? stackOpacity * 0.45 : detailExitOpacity,
              transform: frame < 180
                ? `translateX(calc(${stackX}px + 60px)) rotateY(35deg) scale(0.9)`
                : `translateX(${detailTX}px) rotateY(${detailRotY}deg)`,
              transformOrigin: "center center",
              maxWidth: 980,
              width: "100%",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Glow */}
            <div style={{ position: "absolute", inset: -50, borderRadius: 28, background: `${COLORS.accent}1E`, filter: "blur(60px)" }} />
            {/* Window frame */}
            <div
              style={{
                position: "relative",
                borderRadius: 14,
                overflow: "hidden",
                border: `1.5px solid ${COLORS.brandBlue}55`,
                boxShadow: `0 0 0 1px ${COLORS.border}, 0 28px 60px rgba(0,0,0,0.55)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 16px", background: "#0A0A12", borderBottom: `1px solid ${COLORS.border}` }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C940" }} />
                <span style={{ marginLeft: 10, fontSize: 12, color: COLORS.textSecondary, fontFamily: '"Inter",sans-serif', opacity: 0.6 }}>
                  蜻蜓工业助手 · 日报详情 · #05001-新代
                </span>
              </div>
              <Img src={staticFile("screenshots/product-daily-report-detail.png")} style={{ width: "100%", display: "block" }} />
            </div>

            {/* Detail callouts */}
            <div
              style={{
                position: "absolute",
                right: -220,
                top: "20%",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                width: 210,
              }}
            >
              {[
                { label: "秒级时间轴", sub: "追溯每台机床每一秒运行状态", color: COLORS.brandBlue, start: 225 },
                { label: "运行率 74.8%", sub: "当班加工效率一目了然", color: "#FF6B1A", start: 235 },
                { label: "离线仅 8min", sub: "当班稳定运行，极少中断", color: "#28C940", start: 245 },
              ].map((c, i) => (
                <Callout
                  key={i}
                  frame={frame}
                  startFrame={c.start}
                  label={c.label}
                  sub={c.sub}
                  color={c.color}
                  side="right"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};


export const Scene2Report: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={SCENE_VIDEO_OFFSET} premountFor={fps}>
        <TransitionPage
          tag="场景二"
          tagEn="Scene 2"
          title="生产数据报表应用生成"
          bullets={[
            { label: "日报自动生成", text: "按车床及班组自动统计加工型号、数量及稼动率，报表触手可及。" },
            { label: "全过程可追溯", text: "查看机床每一秒的运行状态，精准掌握零件加工时长与人员效率。" },
            { label: "零误差采集",   text: "系统自动采集数据，彻底消除人工统计的偏差，确保决策依据精准可靠。" },
          ]}
          tagline="提供精确时间节点数据，让管理「有据可依」"
          illustrationNode={<Scene2Illustration />}
        />
      </Sequence>
      <Sequence from={SCENE_VIDEO_OFFSET} durationInFrames={1470} premountFor={fps}>
        <ReportVideoSection />
      </Sequence>
      <Sequence from={1710} durationInFrames={300}>
        <ReportScreenshotShowcase />
      </Sequence>
    </AbsoluteFill>
  );
};
