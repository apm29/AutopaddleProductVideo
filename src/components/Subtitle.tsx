import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../constants/colors";

interface SubtitleProps {
  zh: string;
  en: string;
  startFrame?: number;
  endFrame?: number;
}

// Bilingual subtitle bar anchored to bottom of frame.
// startFrame/endFrame are local frame values within the current Sequence.
export const Subtitle: React.FC<SubtitleProps> = ({
  zh,
  en,
  startFrame = 0,
  endFrame,
}) => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [startFrame, startFrame + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut =
    endFrame !== undefined
      ? interpolate(frame, [endFrame - 10, endFrame], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        opacity,
        padding: "18px 80px 32px",
        background:
          "linear-gradient(to top, rgba(13,13,20,0.92) 0%, rgba(13,13,20,0) 100%)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 30,
          fontWeight: 500,
          color: COLORS.textPrimary,
          fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
          lineHeight: 1.5,
          textAlign: "center",
        }}
      >
        {zh}
      </p>
      <p
        style={{
          margin: "6px 0 0",
          fontSize: 22,
          fontWeight: 400,
          color: COLORS.textSecondary,
          fontFamily: '"Inter", "Helvetica Neue", sans-serif',
          lineHeight: 1.4,
          textAlign: "center",
          letterSpacing: "0.01em",
        }}
      >
        {en}
      </p>
    </div>
  );
};
