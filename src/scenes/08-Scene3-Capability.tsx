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

// ── Program distribute animation (120f / 4s) ──────────────────────────────
const ProgramDistributeTransition: React.FC<{ startFrame: number }> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  const serverS = spring({ frame: f, fps, config: { damping: 180 }, durationInFrames: 18 });
  const serverOpacity = interpolate(serverS, [0, 1], [0, 1]);
  const serverScale   = interpolate(serverS, [0, 1], [0.8, 1]);

  const packetX = (offset: number) =>
    interpolate(f - offset, [0, 22], [-5, 105], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const deviceLit = (i: number) => f >= 18 + i * 5;
  const deviceS   = (i: number) =>
    spring({ frame: f - (18 + i * 5), fps, config: { damping: 200 }, durationInFrames: 14 });

  const textOpacity = interpolate(f, [24, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const DEVICES = 6;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgPrimary, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 45%, ${COLORS.brandBlue}10 0%, transparent 60%)` }} />

      <div style={{ width: "80%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Server block */}
        <div style={{ opacity: serverOpacity, transform: `scale(${serverScale})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <svg width="96" height="108" viewBox="0 0 96 108" fill="none">
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
          {[24, 54, 84].map((y) => (
            <div key={y} style={{ position: "absolute", top: y - 1, left: 0, right: 0, height: 2, background: `repeating-linear-gradient(90deg, ${COLORS.brandBlue}55 0px, ${COLORS.brandBlue}55 8px, transparent 8px, transparent 16px)` }} />
          ))}
          {[0, 4, 8].map((offset, li) => {
            const px = packetX(10 + offset);
            const inRange = px > -5 && px < 105;
            return inRange ? (
              <div key={li} style={{ position: "absolute", top: [17, 47, 77][li], left: `${px}%`, width: 18, height: 10, background: COLORS.brandBlue, borderRadius: 3, boxShadow: `0 0 8px ${COLORS.brandBlue}`, transform: "translateX(-50%)" }} />
            ) : null;
          })}
          <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M12 5l6 5-6 5" stroke={COLORS.brandBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* CNC machine nodes grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, opacity: serverOpacity }}>
          {Array.from({ length: DEVICES }, (_, i) => {
            const lit = deviceLit(i);
            const s   = lit ? deviceS(i) : 0;
            const nodeColor = lit ? COLORS.brandBlue : "#253060";
            const scl = lit ? interpolate(s, [0, 1], [0.7, 1]) : 1;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, transform: `scale(${scl})` }}>
                <div style={{ width: 52, height: 52, borderRadius: 10, background: lit ? `${COLORS.brandBlue}18` : "#13162A", border: `1.5px solid ${nodeColor}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: lit ? `0 0 12px ${COLORS.brandBlue}44` : "none" }}>
                  {lit ? (
                    // Checkmark when received
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <path d="M5 11l4 4 8-8" stroke={COLORS.brandBlue} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    // CNC machine outline
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                      <rect x="3" y="9" width="16" height="10" rx="2" stroke="#253060" strokeWidth="1.5" />
                      <rect x="7" y="5" width="4" height="5" rx="1" stroke="#253060" strokeWidth="1.5" />
                      <line x1="11" y1="5" x2="11" y2="9" stroke="#253060" strokeWidth="1.5" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 11, color: lit ? COLORS.brandBlue : "#3A4870", fontFamily: '"Inter",sans-serif' }}>
                  CNC-{String(i + 1).padStart(2, "0")}
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
          工艺程序已同步至全部机床
        </span>
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
      <Sequence from={1230} durationInFrames={120} premountFor={fps}>
        <ProgramDistributeTransition startFrame={0} />
      </Sequence>
    </AbsoluteFill>
  );
};
