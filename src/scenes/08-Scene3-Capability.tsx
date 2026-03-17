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

// Scene 08: 场景三 — 设备能力深度对接应用生成
// 0–240f:    TransitionPage
// 240–1230f: Scene3VideoSection (33s / 990f, program-distribute.mp4)
// 1230–1350f: ProgramDistributeTransition (4s / 120f)

// ── Transition page illustration ──────────────────────────────────────────
const Scene3Illustration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardEnter = interpolate(frame, [0, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t * (2 - t),
  });
  const cardY = interpolate(frame, [0, 28], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const numScale = interpolate(frame, [4, 22], [0.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  const pulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 2.5),
    [-1, 1],
    [0.4, 1],
  );

  const machines = [
    { name: "CNC-01", file: "O0001.nc", status: "已同步", done: true },
    { name: "CNC-02", file: "O0002.nc", status: "已同步", done: true },
    { name: "CNC-03", file: "O0001.nc", status: "同步中", done: false },
    { name: "CNC-04", file: "O0003.nc", status: "已同步", done: true },
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
      {/* Metric card */}
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
        <div
          style={{
            transform: `scale(${numScale})`,
            transformOrigin: "left center",
            lineHeight: 1,
          }}
        >
          <span
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: COLORS.brandBlue,
              fontFamily: '"Inter", "JetBrains Mono", monospace',
              letterSpacing: "-1px",
            }}
          >
            一键
          </span>
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: COLORS.brandBlue,
              fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
              marginLeft: 6,
            }}
          >
            下发
          </span>
        </div>
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
            工艺文件
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
            统一管理
          </p>
        </div>
      </div>

      {/* Machine file table */}
      <div
        style={{
          background: COLORS.bgSecondary,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "80px 1fr 72px",
            padding: "10px 16px",
            borderBottom: `1px solid ${COLORS.border}`,
            background: "#0D0D14",
          }}
        >
          {["设备", "工艺文件", "状态"].map((h) => (
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
        {machines.map((m, i) => {
          const rowOpacity = interpolate(frame, [24 + i * 12, 44 + i * 12], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const rowX = interpolate(frame, [24 + i * 12, 44 + i * 12], [-12, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const statusColor = m.done ? "#28C940" : COLORS.accent;
          const dotOpacity = m.done ? 1 : pulse;
          const checkScale = spring({
            frame: frame - (30 + i * 12),
            fps,
            config: { damping: 180 },
            durationInFrames: 16,
          });

          return (
            <div
              key={i}
              style={{
                opacity: rowOpacity,
                transform: `translateX(${rowX}px)`,
                display: "grid",
                gridTemplateColumns: "80px 1fr 72px",
                padding: "9px 16px",
                borderBottom: i < machines.length - 1 ? `1px solid ${COLORS.border}` : "none",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 13, color: COLORS.textPrimary, fontFamily: '"Inter", monospace', fontWeight: 600 }}>
                {m.name}
              </span>
              <span style={{ fontSize: 12, color: COLORS.brandBlue, fontFamily: '"Inter", monospace', opacity: 0.85 }}>
                {m.file}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: statusColor,
                    opacity: dotOpacity,
                    transform: m.done ? `scale(${checkScale})` : "scale(1)",
                  }}
                />
                <span style={{ fontSize: 12, color: statusColor, fontFamily: '"PingFang SC", sans-serif' }}>
                  {m.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Step checklist ────────────────────────────────────────────────────────
const STEPS = [
  { label: "读取程序列表", labelEn: "Read program list",    startFrame: 0 },
  { label: "读取程序内容", labelEn: "Read program content", startFrame: 400 },
  { label: "一键下发程序", labelEn: "One-click distribute", startFrame: 750 },
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

  const s = spring({ frame: frame - startFrame, fps, config: { damping: 200 }, durationInFrames: 20 });
  const opacity = interpolate(s, [0, 1], [0, 1]);
  const x = interpolate(s, [0, 1], [-24, 0]);
  const isDone = frame >= startFrame + 30;

  return (
    <div style={{ opacity, transform: `translateX(${x}px)`, display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 28 }}>
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
            <path d="M3 8l3.5 3.5L13 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.brandBlue, fontFamily: '"Inter", monospace' }}>
            {index + 1}
          </span>
        )}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 26, fontWeight: 600, color: isDone ? COLORS.textPrimary : COLORS.textSecondary, fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif', lineHeight: 1.4 }}>
          {label}
        </p>
        <p style={{ margin: "3px 0 0", fontSize: 17, color: COLORS.textSecondary, fontFamily: '"Inter", sans-serif', opacity: 0.7 }}>
          {labelEn}
        </p>
      </div>
    </div>
  );
};

// ── Video section ─────────────────────────────────────────────────────────
const Scene3VideoSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const VIDEO_DURATION = 990; // 33s
  const EXIT_START = 940;

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

  const glowPulse = interpolate(Math.sin((frame / fps) * Math.PI * 0.8), [-1, 1], [0.35, 0.70]);
  const progress  = interpolate(frame, [0, VIDEO_DURATION], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const dots = [
    { cx: "8%",  cy: "20%", delay: 0,  size: 5 },
    { cx: "6%",  cy: "60%", delay: 15, size: 4 },
    { cx: "92%", cy: "30%", delay: 8,  size: 5 },
    { cx: "94%", cy: "70%", delay: 22, size: 4 },
    { cx: "50%", cy: "92%", delay: 30, size: 4 },
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
          backgroundImage: `linear-gradient(${COLORS.border} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.15,
        }}
      />

      {/* Floating dots */}
      {dots.map((d, i) => {
        const dotOpacity = interpolate(Math.sin(((frame + d.delay * 8) / fps) * Math.PI * 0.6), [-1, 1], [0.15, 0.45]);
        return (
          <div key={i} style={{ position: "absolute", left: d.cx, top: d.cy, width: d.size, height: d.size, borderRadius: "50%", background: COLORS.brandBlue, opacity: dotOpacity }} />
        );
      })}

      {/* Left: step checklist */}
      <div style={{ opacity: interpolate(panelSpring, [0, 1], [0, 1]), transform: `translateX(${panelX}px)`, flex: "0 0 320px", zIndex: 1 }}>
        <p style={{ margin: "0 0 36px", fontSize: 22, fontWeight: 500, color: COLORS.textSecondary, fontFamily: '"Inter", sans-serif', letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Distribute Steps
        </p>
        {STEPS.map((step, i) => (
          <StepItem key={i} index={i} {...step} />
        ))}
      </div>

      {/* Right: framed video */}
      <div style={{ flex: "0 0 980px", opacity: combinedOpacity, transform: videoTransform, transformOrigin: "center center", zIndex: 1, position: "relative" }}>
        {/* Glow halo */}
        <div style={{ position: "absolute", inset: -60, borderRadius: 32, background: `${COLORS.brandBlue}${Math.round(glowPulse * 255).toString(16).padStart(2, "0")}`, filter: "blur(72px)" }} />
        <div style={{ position: "absolute", inset: -90, borderRadius: 40, background: `${COLORS.accent}${Math.round(glowPulse * 0.35 * 255).toString(16).padStart(2, "0")}`, filter: "blur(90px)" }} />

        {/* Window frame */}
        <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", border: `1.5px solid ${COLORS.brandBlue}55`, boxShadow: `0 0 0 1px ${COLORS.border}, 0 32px 64px rgba(0,0,0,0.6)` }}>
          {/* Chrome bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "#0A0A12", borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F57" }} />
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFBD2E" }} />
            <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C940" }} />
            <span style={{ marginLeft: 12, fontSize: 13, color: COLORS.textSecondary, fontFamily: '"Inter", sans-serif', opacity: 0.6 }}>
              蜻蜓工业助手 · 程序下发管理
            </span>
          </div>

          <OffthreadVideo src={staticFile("videos/program-distribute.mp4")} style={{ width: "100%", display: "block" }} />

          {/* Progress bar */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: COLORS.border }}>
            <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${COLORS.brandBlue}, ${COLORS.accent})` }} />
          </div>
        </div>

        {/* Version badge */}
        <div style={{ position: "absolute", bottom: 20, right: 16, background: `${COLORS.bgPrimary}CC`, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "4px 12px" }}>
          <span style={{ fontSize: 14, color: COLORS.textSecondary, fontFamily: '"Inter", monospace' }}>v1.5.3</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3 animation cards (270f / 9s) ───────────────────────────────────
// Full-screen carousel: Card1 (0-100f) → Card2 (80-180f) → Card3 (160-270f)
// Each card enters/exits over 20f; solo for 60f (2s)

const Scene3AnimationSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Carousel translateX (%) for each card ──
  const easeOut = Easing.out(Easing.cubic);
  const easeIn  = Easing.in(Easing.cubic);

  // Card 1: enters from left at 0f, exits left at 80f
  const c1x = frame < 50
    ? interpolate(frame, [0, 20], [-100, 0],  { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut })
    : interpolate(frame, [80, 100], [0, -100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIn  });

  // Card 2: enters from right at 80f, exits left at 160f
  const c2x = frame < 130
    ? interpolate(frame, [80, 100],  [100, 0],  { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut })
    : interpolate(frame, [160, 180], [0, -100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeIn  });

  // Card 3: enters from right at 160f, stays
  const c3x = interpolate(frame, [160, 180], [100, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut });

  const titleSpring = spring({ frame, fps, config: { damping: 150 }, durationInFrames: 22 });
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const titleY       = interpolate(titleSpring, [0, 1], [-16, 0]);

  // ── Card 1: Device monitoring cards ──
  const deviceCards = [
    { name: "CNC-01", status: "运行中", program: "O0015.nc", cur: 12,  total: 1284, startF: 8  },
    { name: "CNC-02", status: "运行中", program: "O0008.nc", cur: 7,   total: 956,  startF: 14 },
    { name: "CNC-03", status: "空闲",   program: "--",        cur: 0,   total: 2103, startF: 20 },
    { name: "CNC-04", status: "运行中", program: "O0021.nc", cur: 19,  total: 743,  startF: 26 },
    { name: "CNC-05", status: "离线",   program: "--",        cur: 0,   total: 612,  startF: 32 },
  ];
  const statusColor = (s: string) =>
    s === "运行中" ? COLORS.brandBlue : s === "空闲" ? COLORS.textSecondary : "#FF5F57";

  // ── Card 2: AI optimization suggestions — visible from frame 80 ──
  const suggestions = [
    { text: "主轴利用率 +12%",    sub: "较上周提升",     delay: 98  },
    { text: "建议调整排程优先级", sub: "CNC-02 优先上机", delay: 114 },
    { text: "预计提前完工 1.5h",  sub: "本班次任务",      delay: 130 },
  ];
  const badgeOpacity = interpolate(frame, [160, 172], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const badgeScale   = interpolate(frame, [160, 172], [0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Card 3: File distribution — visible from frame 160 ──
  const litFrames  = [188, 200, 212, 224];
  const finalBadge = interpolate(frame, [238, 250], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const CARD_STYLE: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: 16,
    border: `1px solid ${COLORS.border}`,
    background: COLORS.bgSecondary,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgPrimary,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 72px 40px",
        gap: 18,
      }}
    >
      {/* Ambient glow */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 50%, ${COLORS.brandBlue}09 0%, transparent 65%)` }} />

      {/* Section label — bilingual */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          zIndex: 1,
        }}
      >
        <p style={{ margin: 0, fontSize: 34, fontWeight: 700, color: COLORS.textPrimary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif', letterSpacing: "0.06em" }}>
          设备能力深度对接
        </p>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 500, color: COLORS.textSecondary, fontFamily: '"Inter",sans-serif', letterSpacing: "0.10em", textTransform: "uppercase" }}>
          Deep Integration Capabilities
        </p>
      </div>

      {/* ── Carousel container ── */}
      <div style={{ position: "relative", overflow: "hidden", width: "100%", flex: 1, minHeight: 0, borderRadius: 16 }}>

        {/* ── Card 1: 生产进度接口 ── */}
        <div
          style={{
            ...CARD_STYLE,
            transform: `translateX(${c1x}%)`,
            borderTop: `3px solid ${COLORS.brandBlue}`,
            background: `linear-gradient(180deg, ${COLORS.brandBlue}16 0%, ${COLORS.bgSecondary} 55%)`,
          }}
        >
          {/* Card header */}
          <div
            style={{
              padding: "16px 20px 14px",
              borderBottom: `1px solid ${COLORS.border}`,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 28, fontWeight: 600, color: COLORS.textPrimary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>
              生产进度监控
            </span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
              {[
                { label: "运行中", count: 3, color: COLORS.brandBlue },
                { label: "空闲",   count: 1, color: COLORS.textSecondary },
                { label: "离线",   count: 1, color: "#FF5F57" },
              ].map((s) => (
                <span key={s.label} style={{ fontSize: 20, color: s.color, fontFamily: '"Inter",sans-serif', opacity: 0.85 }}>
                  <span style={{ fontWeight: 700 }}>{s.count}</span> {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* Device cards grid */}
          <div style={{ padding: "20px 24px", display: "flex", flexWrap: "wrap", gap: 16, flex: 1, alignContent: "center" }}>
            {deviceCards.map((m, i) => {
              const cardSpring = spring({ frame: frame - (m.startF - 4), fps, config: { damping: 200 }, durationInFrames: 20 });
              const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);
              const cardY = interpolate(cardSpring, [0, 1], [14, 0]);
              const curDisplay = Math.round(
                interpolate(frame, [m.startF, m.startF + 45], [0, m.cur], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
              );
              const sc = statusColor(m.status);
              const isRunning = m.status === "运行中";
              return (
                <div
                  key={i}
                  style={{
                    opacity: cardOpacity,
                    transform: `translateY(${cardY}px)`,
                    width: "calc(50% - 8px)",
                    borderRadius: 12,
                    border: `1px solid ${sc}33`,
                    background: isRunning ? `${COLORS.brandBlue}09` : "#0D0D1A",
                    padding: "18px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    boxShadow: isRunning ? `0 0 12px ${COLORS.brandBlue}18` : "none",
                  }}
                >
                  {/* Name + status */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: COLORS.textPrimary, fontFamily: '"Inter",monospace' }}>
                      {m.name}
                    </span>
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: sc,
                        background: `${sc}18`,
                        border: `1px solid ${sc}44`,
                        padding: "2px 10px",
                        borderRadius: 4,
                        fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif',
                      }}
                    >
                      {m.status}
                    </span>
                  </div>

                  {/* Program */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 18, color: COLORS.textSecondary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>程序</span>
                    <span style={{ fontSize: 20, fontWeight: 600, color: isRunning ? COLORS.brandBlue : COLORS.textSecondary, fontFamily: '"Inter",monospace', opacity: isRunning ? 1 : 0.45 }}>
                      {m.program}
                    </span>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: COLORS.border, opacity: 0.6 }} />

                  {/* Counts */}
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontSize: 17, color: COLORS.textSecondary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>当前完成</span>
                      <span style={{ fontSize: 32, fontWeight: 700, color: isRunning ? COLORS.textPrimary : COLORS.textSecondary, fontFamily: '"Inter","JetBrains Mono",monospace', lineHeight: 1 }}>
                        {curDisplay}<span style={{ fontSize: 18, fontWeight: 400, marginLeft: 2 }}>件</span>
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-end" }}>
                      <span style={{ fontSize: 17, color: COLORS.textSecondary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>累计完成</span>
                      <span style={{ fontSize: 32, fontWeight: 700, color: COLORS.textSecondary, fontFamily: '"Inter","JetBrains Mono",monospace', lineHeight: 1, opacity: 0.7 }}>
                        {m.total.toLocaleString()}<span style={{ fontSize: 18, fontWeight: 400, marginLeft: 2 }}>件</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Card 2: AI 分析优化 ── */}
        <div
          style={{
            ...CARD_STYLE,
            transform: `translateX(${c2x}%)`,
            borderTop: `3px solid ${COLORS.accent}`,
            background: `linear-gradient(180deg, ${COLORS.accent}16 0%, ${COLORS.bgSecondary} 55%)`,
          }}
        >
          {/* Card header */}
          <div
            style={{
              padding: "16px 28px 14px",
              borderBottom: `1px solid ${COLORS.border}`,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 28, fontWeight: 600, color: COLORS.textPrimary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>
              AI 分析优化
            </span>
            <span style={{ marginLeft: "auto", fontSize: 20, color: COLORS.accent, fontFamily: '"Inter",sans-serif', opacity: 0.8 }}>
              智能建议
            </span>
          </div>

          {/* Suggestions */}
          <div style={{ padding: "28px 40px", display: "flex", flexDirection: "column", gap: 20, flex: 1, justifyContent: "center" }}>
            {suggestions.map((sg, i) => {
              const sgS = spring({ frame: frame - sg.delay, fps, config: { damping: 180 }, durationInFrames: 20 });
              const sgOpacity = interpolate(sgS, [0, 1], [0, 1]);
              const sgX = interpolate(sgS, [0, 1], [-20, 0]);
              return (
                <div
                  key={i}
                  style={{
                    opacity: sgOpacity,
                    transform: `translateX(${sgX}px)`,
                    display: "flex",
                    alignItems: "stretch",
                    gap: 20,
                    padding: "22px 24px",
                    borderRadius: 14,
                    background: `${COLORS.accent}0C`,
                    border: `1px solid ${COLORS.accent}30`,
                  }}
                >
                  {/* Left accent bar */}
                  <div style={{ flexShrink: 0, width: 4, borderRadius: 2, background: COLORS.accent, opacity: 0.9 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 30, fontWeight: 600, color: COLORS.textPrimary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif', lineHeight: 1.3 }}>
                      {sg.text}
                    </p>
                    <p style={{ margin: "6px 0 0", fontSize: 22, color: COLORS.textSecondary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif', opacity: 0.75 }}>
                      {sg.sub}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Result badge */}
            <div
              style={{
                opacity: badgeOpacity,
                transform: `scale(${badgeScale})`,
                marginTop: 8,
                padding: "14px 20px",
                borderRadius: 12,
                background: `${COLORS.accent}15`,
                border: `1px solid ${COLORS.accent}55`,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.accent, boxShadow: `0 0 6px ${COLORS.accent}` }} />
              <span style={{ fontSize: 24, fontWeight: 600, color: COLORS.accent, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>
                建议已生成，可一键应用
              </span>
            </div>
          </div>
        </div>

        {/* ── Card 3: 工艺文件接口 ── */}
        <div
          style={{
            ...CARD_STYLE,
            transform: `translateX(${c3x}%)`,
            borderTop: `3px solid ${COLORS.cyan}`,
            background: `linear-gradient(180deg, ${COLORS.cyan}16 0%, ${COLORS.bgSecondary} 55%)`,
          }}
        >
          {/* Card header */}
          <div
            style={{
              padding: "16px 28px 14px",
              borderBottom: `1px solid ${COLORS.border}`,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 28, fontWeight: 600, color: COLORS.textPrimary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>
              工艺文件下发
            </span>
            <span style={{ marginLeft: "auto", fontSize: 20, color: COLORS.cyan, fontFamily: '"Inter",sans-serif', opacity: 0.8 }}>
              统一管理
            </span>
          </div>

          {/* Distribution diagram — pure React, no SVG */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 40px 24px", gap: 0 }}>

            {/* Server node */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 32px",
                borderRadius: 16,
                background: "#0D0D1A",
                border: `1.5px solid ${COLORS.cyan}`,
                boxShadow: `0 0 24px ${COLORS.cyan}33`,
              }}
            >
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: COLORS.cyan, opacity: 0.9, boxShadow: `0 0 6px ${COLORS.cyan}` }} />
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#28C840", opacity: 0.7 }} />
              </div>
              <span style={{ fontSize: 26, fontWeight: 600, color: COLORS.textPrimary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>
                蜻蜓平台
              </span>
            </div>

            {/* Vertical drop from server to bus */}
            <div style={{ width: 2, height: 40, background: `repeating-linear-gradient(to bottom, ${COLORS.cyan}88 0px, ${COLORS.cyan}88 6px, transparent 6px, transparent 11px)` }} />

            {/* Horizontal bus line */}
            <div style={{ position: "relative", width: "88%", height: 2, background: `linear-gradient(90deg, transparent 0%, ${COLORS.cyan}99 15%, ${COLORS.cyan}99 85%, transparent 100%)` }}>
              {/* 4 vertical drops from bus */}
              {[0, 1, 2, 3].map((i) => {
                const lit = frame >= litFrames[i];
                const pctVal = interpolate(
                  frame - 160 - i * 4,
                  [22, 50],
                  [0, 100],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                const localF = frame - 160 - i * 4;
                const showPacket = localF >= 22 && localF < 50;
                const leftPct = `${12.5 + i * 25}%`;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: leftPct,
                      top: 0,
                      transform: "translateX(-50%)",
                      width: 2,
                      height: 80,
                      background: `repeating-linear-gradient(to bottom, ${lit ? COLORS.cyan : COLORS.border}99 0px, ${lit ? COLORS.cyan : COLORS.border}99 6px, transparent 6px, transparent 11px)`,
                    }}
                  >
                    {showPacket && (
                      <div
                        style={{
                          position: "absolute",
                          left: -9,
                          top: `${pctVal}%`,
                          width: 20,
                          height: 11,
                          borderRadius: 4,
                          background: COLORS.cyan,
                          boxShadow: `0 0 10px ${COLORS.cyan}, 0 0 20px ${COLORS.cyan}66`,
                          transform: "translateY(-50%)",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* CNC machine cards row */}
            <div style={{ display: "flex", width: "88%", gap: 16, marginTop: 80, flex: 1, alignItems: "flex-start" }}>
              {[0, 1, 2, 3].map((i) => {
                const lit = frame >= litFrames[i];
                const nodeSpring = lit
                  ? spring({ frame: frame - litFrames[i], fps, config: { damping: 180 }, durationInFrames: 16 })
                  : 0;
                const nodeScale = lit ? interpolate(nodeSpring, [0, 1], [0.7, 1]) : 1;
                const nodeOpacity = lit ? 1 : 0.3;
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      opacity: 0.4 + (lit ? nodeOpacity * 0.6 : 0),
                      transform: `scale(${nodeScale})`,
                      transformOrigin: "top center",
                      borderRadius: 16,
                      border: `1.5px solid ${lit ? COLORS.cyan : COLORS.border}`,
                      background: lit ? `${COLORS.cyan}14` : "#0D0D1A",
                      padding: "20px 12px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 12,
                      boxShadow: lit ? `0 0 20px ${COLORS.cyan}44` : "none",
                    }}
                  >
                    {/* Status icon */}
                    <div
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 14,
                        background: lit ? `${COLORS.cyan}22` : "#13162A",
                        border: `1.5px solid ${lit ? COLORS.cyan : COLORS.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 28,
                        color: lit ? COLORS.cyan : COLORS.border,
                      }}
                    >
                      {lit ? "✓" : "⬜"}
                    </div>
                    <span style={{ fontSize: 20, fontWeight: 700, color: lit ? COLORS.cyan : COLORS.textSecondary, fontFamily: '"Inter",monospace' }}>
                      CNC-{String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontSize: 17,
                        color: lit ? COLORS.cyan : "transparent",
                        fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif',
                        opacity: lit ? 0.85 : 0,
                        fontWeight: 500,
                      }}
                    >
                      已同步
                    </span>
                  </div>
                );
              })}
            </div>

            {/* 告别U盘 badge */}
            <div
              style={{
                opacity: finalBadge,
                transform: `scale(${interpolate(finalBadge, [0, 1], [0.8, 1])})`,
                marginTop: 24,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 32px",
                borderRadius: 28,
                background: `${COLORS.cyan}14`,
                border: `1px solid ${COLORS.cyan}55`,
              }}
            >
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: COLORS.cyan, boxShadow: `0 0 8px ${COLORS.cyan}` }} />
              <span style={{ fontSize: 26, fontWeight: 600, color: COLORS.cyan, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>
                告别 U 盘逐台导入
              </span>
            </div>
          </div>
        </div>

      </div>
    </AbsoluteFill>
  );
};

// ── Main export ───────────────────────────────────────────────────────────
export const Scene3Capability: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={SCENE_VIDEO_OFFSET} premountFor={fps}>
        <TransitionPage
          tag="场景三"
          tagEn="Scene 3"
          title="设备能力深度对接应用生成"
          bullets={[
            { label: "自动对接机床生产进度接口", text: "实时掌握每台机床工艺文件执行情况。" },
            { label: "AI 分析优化",             text: "根据任务排程、执行情况，生成优化建议。" },
            { label: "自动对接机床工艺文件接口", text: "由传统联网程序或 U 盘逐台下发，升级为一站式统一工艺文件下发与管理。" },
          ]}
          tagline="告别 U 盘逐台导入，工艺变更随时可查"
          illustrationNode={<Scene3Illustration />}
        />
      </Sequence>
      <Sequence from={SCENE_VIDEO_OFFSET} durationInFrames={990} premountFor={fps}>
        <Scene3VideoSection />
      </Sequence>
      <Sequence from={SCENE_VIDEO_OFFSET + 990} durationInFrames={270} premountFor={fps}>
        <Scene3AnimationSection />
      </Sequence>
    </AbsoluteFill>
  );
};
