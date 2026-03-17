import {
  AbsoluteFill,
  Video,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../constants/colors";

interface VideoSectionProps {
  src?: string;         // filename in public/videos/, e.g. "install.mp4"
  label?: string;       // placeholder label
  labelEn?: string;
}

// When src is provided: plays the video full-screen.
// When src is not provided: shows a styled placeholder.
export const VideoSection: React.FC<VideoSectionProps> = ({
  src,
  label = "录像素材",
  labelEn = "Video pending",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);

  if (src) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#000" }}>
        <Video
          src={staticFile(`videos/${src}`)}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgPrimary,
        opacity,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 32,
      }}
    >
      {/* Subtle grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${COLORS.border} 1px, transparent 1px),
            linear-gradient(90deg, ${COLORS.border} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: 0.25,
        }}
      />

      {/* Play button */}
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `${COLORS.brandBlue}22`,
          border: `2px solid ${COLORS.brandBlue}55`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        }}
      >
        {/* Triangle */}
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: "22px solid transparent",
            borderBottom: "22px solid transparent",
            borderLeft: `38px solid ${COLORS.brandBlue}`,
            marginLeft: 8,
          }}
        />
      </div>

      {/* Label */}
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <p
          style={{
            margin: 0,
            fontSize: 36,
            fontWeight: 500,
            color: COLORS.textSecondary,
            fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
          }}
        >
          {label}
        </p>
        <p
          style={{
            margin: "10px 0 0",
            fontSize: 22,
            fontWeight: 400,
            color: `${COLORS.textSecondary}88`,
            fontFamily: '"Inter", sans-serif',
          }}
        >
          {labelEn}
        </p>
      </div>

      {/* Corner label */}
      <div
        style={{
          position: "absolute",
          top: 32,
          right: 40,
          background: `${COLORS.accent}22`,
          border: `1px solid ${COLORS.accent}55`,
          borderRadius: 6,
          padding: "6px 16px",
        }}
      >
        <span
          style={{
            fontSize: 18,
            color: COLORS.accent,
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Placeholder
        </span>
      </div>
    </AbsoluteFill>
  );
};
