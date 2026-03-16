import { interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../constants/colors";

interface TypewriterTextProps {
  text: string;
  startFrame?: number;
  charsPerFrame?: number; // characters revealed per frame
  showCursor?: boolean;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
}

// Typewriter effect using string slicing (not per-character opacity).
export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame = 0,
  charsPerFrame = 0.5, // 1 char every 2 frames
  showCursor = true,
  fontSize = 36,
  color = COLORS.textPrimary,
  fontFamily = '"PingFang SC", "Microsoft YaHei", sans-serif',
}) => {
  const frame = useCurrentFrame();

  const elapsed = Math.max(0, frame - startFrame);
  const charsVisible = Math.min(text.length, Math.floor(elapsed * charsPerFrame));
  const typedText = text.slice(0, charsVisible);
  const isDone = charsVisible >= text.length;

  // Cursor blink: 0.5s cycle = 15 frames
  const cursorOpacity = isDone
    ? interpolate(frame % 16, [0, 8, 16], [1, 0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <span style={{ fontSize, color, fontFamily, lineHeight: 1.6 }}>
      {typedText}
      {showCursor && (
        <span
          style={{
            opacity: cursorOpacity,
            color: COLORS.brandBlue,
            fontWeight: 300,
            marginLeft: 2,
          }}
        >
          ▋
        </span>
      )}
    </span>
  );
};
