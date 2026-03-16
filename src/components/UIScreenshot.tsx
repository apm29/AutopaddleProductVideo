import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../constants/colors";

interface UIScreenshotProps {
  src?: string; // filename in public/screenshots/
  label?: string; // placeholder label when no src
  delay?: number;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  caption?: string;
}

// Displays a product UI screenshot with a spring entrance animation.
// When no src is provided, renders a styled placeholder.
export const UIScreenshot: React.FC<UIScreenshotProps> = ({
  src,
  label = "Product Screenshot",
  delay = 0,
  width = "100%",
  height = "auto",
  borderRadius = 12,
  caption,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 30,
  });

  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const scale = interpolate(enterSpring, [0, 1], [0.95, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [30, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        width,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius,
          overflow: "hidden",
          border: `1.5px solid ${COLORS.border}`,
          background: COLORS.bgSecondary,
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Window chrome */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 20px",
            background: "#0A0A12",
            borderBottom: `1px solid ${COLORS.border}`,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E" }} />
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C940" }} />
        </div>

        {/* Content */}
        {src ? (
          <Img
            src={staticFile(`screenshots/${src}`)}
            style={{ width: "100%", display: "block" }}
          />
        ) : (
          <div
            style={{
              height,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 20,
              padding: 60,
              minHeight: 400,
            }}
          >
            {/* Grid pattern background */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `linear-gradient(${COLORS.border} 1px, transparent 1px),
                  linear-gradient(90deg, ${COLORS.border} 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
                opacity: 0.3,
              }}
            />
            {/* Camera icon SVG */}
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <rect
                x="2"
                y="6"
                width="20"
                height="14"
                rx="2"
                stroke={COLORS.brandBlue}
                strokeWidth="1.5"
              />
              <circle cx="12" cy="13" r="3.5" stroke={COLORS.brandBlue} strokeWidth="1.5" />
              <path d="M8 6l1.5-2h5L16 6" stroke={COLORS.brandBlue} strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p
              style={{
                margin: 0,
                fontSize: 24,
                color: COLORS.textSecondary,
                fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                textAlign: "center",
                zIndex: 1,
              }}
            >
              {label}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                color: `${COLORS.textSecondary}88`,
                fontFamily: '"Inter", sans-serif',
                textAlign: "center",
                zIndex: 1,
              }}
            >
              Screenshot pending
            </p>
          </div>
        )}
      </div>

      {caption && (
        <p
          style={{
            margin: 0,
            fontSize: 22,
            color: COLORS.textSecondary,
            fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
            textAlign: "center",
          }}
        >
          {caption}
        </p>
      )}
    </div>
  );
};
