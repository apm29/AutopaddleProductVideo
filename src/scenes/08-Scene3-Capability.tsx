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

// ── Scene 3 animation cards (120f / 4s) ───────────────────────────────────
// 3-column layout: progress monitoring | AI optimize | file distribution

const Scene3AnimationSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Staggered card entrance springs
  const cardS = [0, 15, 30].map((delay) =>
    spring({ frame: frame - delay, fps, config: { damping: 170 }, durationInFrames: 24 })
  );

  const titleOpacity = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

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

  // ── Card 2: AI optimization suggestions ──
  const suggestions = [
    { text: "主轴利用率 +12%",    sub: "较上周提升",     delay: 18 },
    { text: "建议调整排程优先级", sub: "CNC-02 优先上机", delay: 34 },
    { text: "预计提前完工 1.5h",  sub: "本班次任务",      delay: 50 },
  ];
  const badgeOpacity = interpolate(frame, [80, 92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const badgeScale   = interpolate(frame, [80, 92], [0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── Card 3: File distribution ──
  const distMachines = [52, 138, 224, 310]; // x positions for 4 CNC columns (in SVG coords, origin = left)
  const litFrames    = [28, 40, 52, 64];
  const finalBadge   = interpolate(frame, [78, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // packet travel: y from 52 (server bottom) to 168 (machine top), frame range [22, 44]
  const packetY = (col: number) =>
    interpolate(frame - col * 4, [22, 50], [52, 162], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const packetVisible = (col: number) => {
    const f = frame - col * 4;
    return f >= 22 && f < 50;
  };

  const CARD_STYLE: React.CSSProperties = {
    flex: 1,
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

      {/* Section label */}
      <p
        style={{
          opacity: titleOpacity,
          margin: 0,
          fontSize: 27,
          fontWeight: 500,
          color: COLORS.textSecondary,
          fontFamily: '"Inter", sans-serif',
          letterSpacing: "0.10em",
          textTransform: "uppercase",
        }}
      >
        Deep Integration Capabilities
      </p>

      {/* ── 3 cards ── */}
      <div style={{ display: "flex", gap: 24, width: "100%", flex: 1, minHeight: 0 }}>

        {/* ── Card 1: 生产进度接口 ── */}
        <div
          style={{
            ...CARD_STYLE,
            opacity: interpolate(cardS[0], [0, 1], [0, 1]),
            transform: `translateY(${interpolate(cardS[0], [0, 1], [32, 0])}px)`,
            borderColor: `${COLORS.brandBlue}55`,
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
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.brandBlue, boxShadow: `0 0 8px ${COLORS.brandBlue}` }} />
            <span style={{ fontSize: 24, fontWeight: 600, color: COLORS.textPrimary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>
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
          <div style={{ padding: "14px", display: "flex", flexWrap: "wrap", gap: 12, flex: 1, alignContent: "center" }}>
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
                    width: "calc(50% - 6px)",
                    borderRadius: 12,
                    border: `1px solid ${sc}33`,
                    background: isRunning ? `${COLORS.brandBlue}09` : "#0D0D1A",
                    padding: "14px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 9,
                    boxShadow: isRunning ? `0 0 12px ${COLORS.brandBlue}18` : "none",
                  }}
                >
                  {/* Name + status */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 22, fontWeight: 700, color: COLORS.textPrimary, fontFamily: '"Inter",monospace' }}>
                      {m.name}
                    </span>
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: sc,
                        background: `${sc}18`,
                        border: `1px solid ${sc}44`,
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif',
                      }}
                    >
                      {m.status}
                    </span>
                  </div>

                  {/* Program */}
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontSize: 18, color: COLORS.textSecondary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>程序</span>
                    <span style={{ fontSize: 20, fontWeight: 600, color: isRunning ? COLORS.brandBlue : COLORS.textSecondary, fontFamily: '"Inter",monospace', opacity: isRunning ? 1 : 0.45 }}>
                      {m.program}
                    </span>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, background: COLORS.border, opacity: 0.6 }} />

                  {/* Counts */}
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      <span style={{ fontSize: 18, color: COLORS.textSecondary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>当前完成</span>
                      <span style={{ fontSize: 30, fontWeight: 700, color: isRunning ? COLORS.textPrimary : COLORS.textSecondary, fontFamily: '"Inter","JetBrains Mono",monospace', lineHeight: 1 }}>
                        {curDisplay}<span style={{ fontSize: 18, fontWeight: 400, marginLeft: 2 }}>件</span>
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-end" }}>
                      <span style={{ fontSize: 18, color: COLORS.textSecondary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>累计完成</span>
                      <span style={{ fontSize: 30, fontWeight: 700, color: COLORS.textSecondary, fontFamily: '"Inter","JetBrains Mono",monospace', lineHeight: 1, opacity: 0.7 }}>
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
            opacity: interpolate(cardS[1], [0, 1], [0, 1]),
            transform: `translateY(${interpolate(cardS[1], [0, 1], [32, 0])}px)`,
            borderColor: `${COLORS.accent}55`,
          }}
        >
          {/* Card header */}
          <div
            style={{
              padding: "16px 22px 14px",
              borderBottom: `1px solid ${COLORS.border}`,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.accent, boxShadow: `0 0 8px ${COLORS.accent}` }} />
            <span style={{ fontSize: 24, fontWeight: 600, color: COLORS.textPrimary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>
              AI 分析优化
            </span>
            <span style={{ marginLeft: "auto", fontSize: 20, color: COLORS.accent, fontFamily: '"Inter",sans-serif', opacity: 0.8 }}>
              智能建议
            </span>
          </div>

          {/* Suggestions */}
          <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 18, flex: 1, justifyContent: "center" }}>
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
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 18px",
                    borderRadius: 12,
                    background: `${COLORS.accent}0A`,
                    border: `1px solid ${COLORS.accent}28`,
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: `${COLORS.accent}22`,
                      border: `1.5px solid ${COLORS.accent}66`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 27, color: COLORS.accent }}>
                      {["↑", "→", "✓"][i]}
                    </span>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 27, fontWeight: 600, color: COLORS.textPrimary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif', lineHeight: 1.3 }}>
                      {sg.text}
                    </p>
                    <p style={{ margin: "4px 0 0", fontSize: 20, color: COLORS.textSecondary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif', opacity: 0.75 }}>
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
                marginTop: 4,
                padding: "10px 16px",
                borderRadius: 10,
                background: `${COLORS.accent}15`,
                border: `1px solid ${COLORS.accent}55`,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.accent, boxShadow: `0 0 6px ${COLORS.accent}` }} />
              <span style={{ fontSize: 22, fontWeight: 600, color: COLORS.accent, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>
                建议已生成，可一键应用
              </span>
            </div>
          </div>
        </div>

        {/* ── Card 3: 工艺文件接口 ── */}
        <div
          style={{
            ...CARD_STYLE,
            opacity: interpolate(cardS[2], [0, 1], [0, 1]),
            transform: `translateY(${interpolate(cardS[2], [0, 1], [32, 0])}px)`,
            borderColor: `${COLORS.cyan}55`,
          }}
        >
          {/* Card header */}
          <div
            style={{
              padding: "16px 22px 14px",
              borderBottom: `1px solid ${COLORS.border}`,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.cyan, boxShadow: `0 0 8px ${COLORS.cyan}` }} />
            <span style={{ fontSize: 24, fontWeight: 600, color: COLORS.textPrimary, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>
              工艺文件下发
            </span>
            <span style={{ marginLeft: "auto", fontSize: 20, color: COLORS.cyan, fontFamily: '"Inter",sans-serif', opacity: 0.8 }}>
              统一管理
            </span>
          </div>

          {/* Distribution SVG */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px 22px 18px", gap: 16 }}>
            <svg width="362" height="220" viewBox="0 0 362 200" fill="none" style={{ width: "100%", maxHeight: 220 }}>
              {/* Cloud/server node at top center */}
              <rect x="131" y="8" width="100" height="44" rx="10" fill="#13162A" stroke={COLORS.cyan} strokeWidth="1.5" />
              <rect x="143" y="18" width="52" height="7" rx="3" fill="#253060" />
              <rect x="143" y="30" width="38" height="5" rx="2.5" fill="#253060" opacity="0.6" />
              <circle cx="218" cy="22" r="4" fill={COLORS.cyan} opacity="0.9" />
              <circle cx="207" cy="22" r="3" fill="#28C840" opacity="0.7" />
              <text x="181" y="64" textAnchor="middle" fontSize="18" fill={COLORS.textSecondary} fontFamily='"Inter",sans-serif'>蜻蜓平台</text>

              {/* Vertical dashed lines to each machine */}
              {distMachines.map((x, i) => {
                const lit = frame >= litFrames[i];
                const lineColor = lit ? COLORS.cyan : "#253060";
                return (
                  <line
                    key={i}
                    x1={x} y1="72"
                    x2={x} y2="152"
                    stroke={lineColor}
                    strokeWidth="1.5"
                    strokeDasharray="5 4"
                    opacity={lit ? 1 : 0.4}
                  />
                );
              })}

              {/* Connecting horizontal line from server */}
              <line x1="181" y1="52" x2="181" y2="72" stroke={COLORS.cyan} strokeWidth="1.5" opacity="0.6" />
              <line x1="52" y1="72" x2="310" y2="72" stroke={COLORS.cyan} strokeWidth="1.5" strokeDasharray="5 4" opacity="0.5" />

              {/* Animated packets */}
              {distMachines.map((x, i) => {
                if (!packetVisible(i)) return null;
                const py = packetY(i);
                return (
                  <rect
                    key={i}
                    x={x - 9}
                    y={py - 5}
                    width={18}
                    height={10}
                    rx="3"
                    fill={COLORS.cyan}
                    opacity="0.9"
                    style={{ filter: `drop-shadow(0 0 4px ${COLORS.cyan})` }}
                  />
                );
              })}

              {/* CNC machine nodes */}
              {distMachines.map((x, i) => {
                const lit = frame >= litFrames[i];
                const s = lit ? spring({ frame: frame - litFrames[i], fps, config: { damping: 200 }, durationInFrames: 14 }) : 0;
                const scl = lit ? interpolate(s, [0, 1], [0.6, 1]) : 1;
                const nodeColor = lit ? COLORS.cyan : "#253060";
                const nodeOpacity = lit ? 1 : 0.45;
                return (
                  <g key={i} transform={`translate(${x}, 178) scale(${scl})`} style={{ transformOrigin: `${x}px 178px` }}>
                    <rect x="-22" y="-22" width="44" height="44" rx="8"
                      fill={lit ? `${COLORS.cyan}18` : "#13162A"}
                      stroke={nodeColor}
                      strokeWidth="1.5"
                      opacity={nodeOpacity}
                      style={{ filter: lit ? `drop-shadow(0 0 8px ${COLORS.cyan}66)` : "none" }}
                    />
                    {lit ? (
                      <path d="-7 0l4.5 4.5 9-9" transform="translate(-7,0)" stroke={COLORS.cyan} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    ) : (
                      <>
                        <rect x="-9" y="-1" width="18" height="10" rx="2" stroke="#253060" strokeWidth="1.5" />
                        <rect x="-5" y="-7" width="4" height="7" rx="1" stroke="#253060" strokeWidth="1.5" />
                      </>
                    )}
                    <text y="30" textAnchor="middle" fontSize="16" fill={lit ? COLORS.cyan : "#3A4870"} fontFamily='"Inter",sans-serif'>
                      CNC-{String(i + 1).padStart(2, "0")}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* 告别U盘 badge */}
            <div
              style={{
                opacity: finalBadge,
                transform: `scale(${interpolate(finalBadge, [0, 1], [0.8, 1])})`,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 22px",
                borderRadius: 22,
                background: `${COLORS.cyan}14`,
                border: `1px solid ${COLORS.cyan}55`,
              }}
            >
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.cyan, boxShadow: `0 0 6px ${COLORS.cyan}` }} />
              <span style={{ fontSize: 24, fontWeight: 600, color: COLORS.cyan, fontFamily: '"PingFang SC","Microsoft YaHei",sans-serif' }}>
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
      <Sequence from={SCENE_VIDEO_OFFSET + 990} durationInFrames={180} premountFor={fps}>
        <Scene3AnimationSection />
      </Sequence>
    </AbsoluteFill>
  );
};
