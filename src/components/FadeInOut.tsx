import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ANIM } from "../constants/timing";

interface FadeInOutProps {
  children: React.ReactNode;
  fadeInFrames?: number;
  fadeOutFrames?: number;
}

// Wrapper that fades in at scene start and fades out near scene end.
// Uses local frame from useCurrentFrame() — must be inside a <Sequence>.
export const FadeInOut: React.FC<FadeInOutProps> = ({
  children,
  fadeInFrames = ANIM.FADE_IN,
  fadeOutFrames = ANIM.FADE_OUT,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [
      0,
      fadeInFrames,
      durationInFrames - fadeOutFrames,
      durationInFrames,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return <div style={{ opacity, width: "100%", height: "100%" }}>{children}</div>;
};
