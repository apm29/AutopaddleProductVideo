import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../constants/colors";

interface CountUpProps {
  from?: number;
  to: number;
  suffix?: string;
  prefix?: string;
  durationInFrames?: number;
  delay?: number;
  fontSize?: number;
  color?: string;
  decimals?: number;
}

// Animated counter that counts up from `from` to `to` over `durationInFrames`.
// All values are local frames.
export const CountUp: React.FC<CountUpProps> = ({
  from = 0,
  to,
  suffix = "",
  prefix = "",
  durationInFrames = 45,
  delay = 0,
  fontSize = 120,
  color = COLORS.accent,
  decimals = 0,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [delay, delay + durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const value = from + (to - from) * progress;
  const display = decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toString();

  return (
    <span
      style={{
        fontSize,
        fontWeight: 800,
        color,
        fontFamily: '"Inter", "Helvetica Neue", monospace',
        letterSpacing: "-0.02em",
        lineHeight: 1,
      }}
    >
      {prefix}
      {display}
      {suffix}
    </span>
  );
};
