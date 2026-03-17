import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../constants/colors";

// Scene 01: Cover — 180 frames (6s)

const KEYWORDS = ["快装", "快采", "快用"];

export const Cover: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const subtitleSpring = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });
  const logoSpring = spring({ frame: frame - 10, fps, config: { damping: 200 }, durationInFrames: 24 });
  const titleSpring = spring({ frame: frame - 20, fps, config: { damping: 200 }, durationInFrames: 22 });
  const keywordSpring = spring({ frame: frame - 35, fps, config: { damping: 200 }, durationInFrames: 22 });

  const logoScale = interpolate(logoSpring, [0, 1], [0.6, 1]);

  // Divider line width
  const dividerW = interpolate(titleSpring, [0, 1], [0, 560]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgPrimary,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${COLORS.brandBlue}16 0%, transparent 60%)`,
        }}
      />
      {/* Outer ring */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          border: `1px solid ${COLORS.brandBlue}18`,
          opacity: logoSpring,
        }}
      />

      {/* Subtitle: 蜻蜓AI数采 */}
      <p
        style={{
          margin: "0 0 36px",
          fontSize: 28,
          fontWeight: 400,
          color: COLORS.textSecondary,
          fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
          letterSpacing: "0.15em",
          opacity: subtitleSpring,
          textTransform: "uppercase",
          zIndex: 1,
        }}
      >
        蜻蜓 AI 数采
      </p>

      {/* Logo */}
      <div
        style={{
          opacity: logoSpring,
          transform: `scale(${logoScale})`,
          marginBottom: 36,
          zIndex: 1,
        }}
      >
        <Img
          src={staticFile("autopaddle.ico")}
          style={{ width: 120, height: 120, objectFit: "contain" }}
        />
      </div>

      {/* Brand name */}
      <p
        style={{
          margin: "0 0 16px",
          fontSize: 64,
          fontWeight: 700,
          color: COLORS.textPrimary,
          fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
          letterSpacing: "0.04em",
          opacity: titleSpring,
          zIndex: 1,
        }}
      >
        蜻蜓工业助手
      </p>

      {/* Divider */}
      <div
        style={{
          width: dividerW,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.border}, transparent)`,
          marginBottom: 36,
          zIndex: 1,
        }}
      />

      {/* Three keywords */}
      <div
        style={{
          display: "flex",
          gap: 24,
          alignItems: "center",
          opacity: keywordSpring,
          transform: `translateY(${interpolate(keywordSpring, [0, 1], [20, 0])}px)`,
          zIndex: 1,
        }}
      >
        {KEYWORDS.map((kw, i) => (
          <div key={kw} style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div
              style={{
                background: `${COLORS.brandBlue}18`,
                border: `1.5px solid ${COLORS.brandBlue}44`,
                borderRadius: 10,
                padding: "12px 28px",
              }}
            >
              <span
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  color: COLORS.textPrimary,
                  fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                }}
              >
                {kw}
              </span>
            </div>
            {i < KEYWORDS.length - 1 && (
              <span style={{ fontSize: 28, color: COLORS.accent, fontWeight: 700 }}>·</span>
            )}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
