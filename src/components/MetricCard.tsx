import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../constants/colors";
import { CountUp } from "./CountUp";

interface MetricCardProps {
  value: string; // display value e.g. "90%" or "2小时/天" — for non-numeric use static
  countTo?: number; // if set, animate from 0 to this number
  countSuffix?: string;
  countPrefix?: string;
  label: string; // Chinese label
  labelEn: string; // English label
  delay?: number; // stagger delay in frames
}

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  countTo,
  countSuffix = "",
  countPrefix = "",
  label,
  labelEn,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 25,
  });

  const opacity = interpolate(cardSpring, [0, 1], [0, 1]);
  const translateY = interpolate(cardSpring, [0, 1], [40, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        background: COLORS.bgSecondary,
        border: `1.5px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: "40px 48px",
        textAlign: "center",
        minWidth: 320,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${COLORS.brandBlue}, ${COLORS.accent})`,
        }}
      />

      {/* Value */}
      <div style={{ marginBottom: 16 }}>
        {countTo !== undefined ? (
          <CountUp
            to={countTo}
            suffix={countSuffix}
            prefix={countPrefix}
            delay={delay}
            durationInFrames={40}
          />
        ) : (
          <span
            style={{
              fontSize: 96,
              fontWeight: 800,
              color: COLORS.accent,
              fontFamily: '"Inter", "Helvetica Neue", monospace',
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {value}
          </span>
        )}
      </div>

      {/* Chinese label */}
      <p
        style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 500,
          color: COLORS.textPrimary,
          fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
          lineHeight: 1.5,
        }}
      >
        {label}
      </p>

      {/* English label */}
      <p
        style={{
          margin: "8px 0 0",
          fontSize: 18,
          fontWeight: 400,
          color: COLORS.textSecondary,
          fontFamily: '"Inter", sans-serif',
          lineHeight: 1.4,
        }}
      >
        {labelEn}
      </p>
    </div>
  );
};
