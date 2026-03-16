import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../constants/colors";
import { Subtitle } from "../components/Subtitle";

// Scene duration: 360 frames (12s)
// Three pain-point cards appear sequentially, each ~4s

interface PainPoint {
  main: string;
  detail: string;
  highlightWord: string;
}

const PAIN_POINTS: PainPoint[] = [
  {
    main: "人工抄表，每天 2 小时",
    detail: "— 还经常出错",
    highlightWord: "2 小时",
  },
  {
    main: "设备停机，找原因靠经验",
    detail: "— 数据没有留存",
    highlightWord: "靠经验",
  },
  {
    main: "接个设备，要等厂商工程师",
    detail: "— 少则一周，多则一月",
    highlightWord: "等厂商工程师",
  },
];

interface PainCardProps {
  point: PainPoint;
  delay: number;
}

const PainCard: React.FC<PainCardProps> = ({ point, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });

  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [40, 0]);

  // Underline reveal
  const underlineWidth = interpolate(
    frame,
    [delay + 15, delay + 35],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const renderMain = () => {
    if (!point.main.includes(point.highlightWord)) return point.main;
    const parts = point.main.split(point.highlightWord);
    return (
      <>
        {parts[0]}
        <span style={{ color: COLORS.accent }}>{point.highlightWord}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        marginBottom: 48,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 60,
          fontWeight: 700,
          color: COLORS.textPrimary,
          fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
          lineHeight: 1.3,
        }}
      >
        {renderMain()}
      </p>
      <p
        style={{
          margin: "8px 0 0",
          fontSize: 40,
          fontWeight: 400,
          color: COLORS.textSecondary,
          fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
          lineHeight: 1.4,
        }}
      >
        {point.detail}
      </p>
      {/* Underline */}
      <div
        style={{
          marginTop: 16,
          height: 2,
          width: `${underlineWidth}%`,
          background: `linear-gradient(90deg, ${COLORS.brandBlue}, ${COLORS.accent})`,
          borderRadius: 2,
        }}
      />
    </div>
  );
};

export const OpeningHook: React.FC = () => {
  // Each card gets ~4s (120f). Stagger by 100f so they build up and stay visible.
  const CARD_STAGGER = 100;
  const subtitleTexts = [
    { zh: "人工抄表，每天耗时 2 小时，还经常出错", en: "Manual data logging: 2 hours daily, error-prone", start: 0, end: 100 },
    { zh: "设备停机，找原因只能靠经验，数据没有留存", en: "Machine downtime: root cause unknown, no data trail", start: 100, end: 200 },
    { zh: "接入一台设备，少则一周，多则一个月", en: "Device onboarding: weeks of waiting, expert required", start: 200, end: 360 },
  ];

  const frame = useCurrentFrame();

  // Pick active subtitle based on frame
  const activeSubtitle = subtitleTexts.findLast((s: { zh: string; en: string; start: number; end: number }) => frame >= s.start) ?? subtitleTexts[0];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgPrimary,
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0 160px",
      }}
    >
      {/* Background subtle grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 80% 50%, ${COLORS.brandBlue}08 0%, transparent 60%)`,
        }}
      />

      {/* Pain point cards */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {PAIN_POINTS.map((point, i) => (
          <PainCard key={i} point={point} delay={i * CARD_STAGGER} />
        ))}
      </div>

      {/* Subtitle */}
      <Subtitle
        zh={activeSubtitle.zh}
        en={activeSubtitle.en}
        startFrame={activeSubtitle.start}
        endFrame={activeSubtitle.end}
      />
    </AbsoluteFill>
  );
};
