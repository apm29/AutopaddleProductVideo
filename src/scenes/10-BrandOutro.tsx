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

// Scene duration: 300 frames (10s)

export const BrandOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo + brand
  const logoSpring = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 25 });
  const nameSpring = spring({ frame: frame - 12, fps, config: { damping: 200 }, durationInFrames: 22 });
  const sloganSpring = spring({ frame: frame - 24, fps, config: { damping: 200 }, durationInFrames: 22 });
  const ctaSpring = spring({ frame: frame - 60, fps, config: { damping: 200 }, durationInFrames: 25 });

  const logoScale = interpolate(logoSpring, [0, 1], [0.7, 1]);
  const ctaY = interpolate(ctaSpring, [0, 1], [20, 0]);

  // Divider line expansion
  const dividerWidth = interpolate(sloganSpring, [0, 1], [0, 600]);

  // Keywords pulse — subtle scale oscillation
  const kwPulse = interpolate(
    Math.sin((frame / 30) * Math.PI),
    [-1, 1],
    [0.98, 1.02],
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgPrimary,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${COLORS.brandBlue}14 0%, transparent 60%)`,
        }}
      />

      {/* Ring decoration */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          border: `1px solid ${COLORS.brandBlue}22`,
          opacity: interpolate(logoSpring, [0, 1], [0, 1]),
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          border: `1px solid ${COLORS.brandBlue}10`,
          opacity: interpolate(logoSpring, [0, 1], [0, 1]),
        }}
      />

      {/* Logo + name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          marginBottom: 36,
          zIndex: 1,
        }}
      >
        <div
          style={{
            opacity: logoSpring,
            transform: `scale(${logoScale})`,
          }}
        >
          <Img
            src={staticFile("autopaddle.ico")}
            style={{ width: 90, height: 90, objectFit: "contain" }}
          />
        </div>
        <div
          style={{
            opacity: interpolate(nameSpring, [0, 1], [0, 1]),
            transform: `translateX(${interpolate(nameSpring, [0, 1], [40, 0])}px)`,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 60,
              fontWeight: 700,
              color: COLORS.textPrimary,
              fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
              letterSpacing: "0.04em",
            }}
          >
            蜻蜓工业助手
          </p>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 22,
              fontWeight: 400,
              color: COLORS.textSecondary,
              fontFamily: '"Inter", sans-serif',
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            QingTing Assistant
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: dividerWidth,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.border}, transparent)`,
          marginBottom: 36,
          zIndex: 1,
        }}
      />

      {/* Slogan */}
      <p
        style={{
          margin: "0 0 40px",
          fontSize: 32,
          fontWeight: 400,
          color: COLORS.textSecondary,
          fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
          opacity: sloganSpring,
          letterSpacing: "0.04em",
          zIndex: 1,
        }}
      >
        工业数据，快装快采快用
      </p>

      {/* Three keywords with subtle pulse */}
      <div
        style={{
          display: "flex",
          gap: 24,
          alignItems: "center",
          transform: `scale(${kwPulse})`,
          marginBottom: 64,
          zIndex: 1,
          opacity: sloganSpring,
        }}
      >
        {["快装", "·", "快采", "·", "快用"].map((kw, i) => (
          <span
            key={i}
            style={{
              fontSize: kw === "·" ? 28 : 36,
              fontWeight: kw === "·" ? 400 : 700,
              color: kw === "·" ? COLORS.accent : COLORS.textPrimary,
              fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
              letterSpacing: "0.04em",
            }}
          >
            {kw}
          </span>
        ))}
      </div>

      {/* CTA — website */}
      <div
        style={{
          opacity: interpolate(ctaSpring, [0, 1], [0, 1]),
          transform: `translateY(${ctaY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          zIndex: 1,
        }}
      >
        <div
          style={{
            background: `${COLORS.brandBlue}22`,
            border: `1.5px solid ${COLORS.brandBlue}55`,
            borderRadius: 10,
            padding: "16px 48px",
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: COLORS.brandBlue,
              fontFamily: '"Inter", sans-serif',
              letterSpacing: "0.02em",
            }}
          >
            autopaddle.com
          </span>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 20,
            color: COLORS.textSecondary,
            fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
          }}
        >
          立即了解更多，开始免费试用
        </p>
      </div>
    </AbsoluteFill>
  );
};
