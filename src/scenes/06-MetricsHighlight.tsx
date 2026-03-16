import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../constants/colors";
import { MetricCard } from "../components/MetricCard";
import { Subtitle } from "../components/Subtitle";
import { FadeInOut } from "../components/FadeInOut";

// Scene duration: 390 frames (13s)
// Four metric cards appear with stagger, ~3s each

const METRICS = [
  {
    value: "1 周",
    label: "完成基本接入，快速上线",
    labelEn: "Basic onboarding in 1 week",
    delay: 0,
  },
  {
    value: "90%",
    countTo: 90,
    countSuffix: "%",
    label: "数采场景可自助上线，无需专家",
    labelEn: "Of data collection cases are self-service",
    delay: 60,
  },
  {
    value: "60%+",
    label: "故障发现时间缩短",
    labelEn: "Faster fault detection",
    delay: 120,
  },
  {
    value: "2小时",
    label: "每天节省人工统计时间",
    labelEn: "Per day saved on manual reporting",
    delay: 180,
  },
];

export const MetricsHighlight: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title animation
  const titleSpring = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 22 });

  return (
    <FadeInOut>
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.bgPrimary,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 100px 140px",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 50% 50%, ${COLORS.accent}0A 0%, transparent 65%)`,
          }}
        />

        {/* Title */}
        <p
          style={{
            margin: "0 0 60px",
            fontSize: 52,
            fontWeight: 700,
            color: COLORS.textPrimary,
            fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
            opacity: interpolate(titleSpring, [0, 1], [0, 1]),
            textAlign: "center",
            zIndex: 1,
          }}
        >
          可量化的生产价值
        </p>

        {/* Metric cards grid */}
        <div
          style={{
            display: "flex",
            gap: 32,
            zIndex: 1,
            width: "100%",
            justifyContent: "center",
          }}
        >
          {METRICS.map((m, i) => (
            <MetricCard
              key={i}
              value={m.value}
              countTo={m.countTo}
              countSuffix={m.countSuffix}
              label={m.label}
              labelEn={m.labelEn}
              delay={m.delay}
            />
          ))}
        </div>

        <Subtitle
          zh="可量化的生产价值，清晰的投资回报"
          en="Measurable production value — clear ROI for your business"
          startFrame={10}
        />
      </AbsoluteFill>
    </FadeInOut>
  );
};
