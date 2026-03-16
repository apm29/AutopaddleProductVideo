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
import { Subtitle } from "../components/Subtitle";

// Scene duration: 300 frames (10s)

const KEYWORDS = ["快装", "快采", "快用"];

export const BrandIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo scale-in
  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 25,
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.6, 1]);

  // Brand name slides in from right
  const nameSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });
  const nameX = interpolate(nameSpring, [0, 1], [60, 0]);
  const nameOpacity = nameSpring;

  // Slogan fades in
  const sloganSpring = spring({
    frame: frame - 20,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });

  // Keywords stagger in
  const keywordDelays = [50, 65, 80];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgPrimary,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      {/* Radial glow behind logo */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.brandBlue}18 0%, transparent 70%)`,
        }}
      />

      {/* Logo + brand name row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
          marginBottom: 40,
          zIndex: 1,
        }}
      >
        <div style={{ transform: `scale(${logoScale})`, opacity: logoSpring }}>
          <Img
            src={staticFile("autopaddle.ico")}
            style={{ width: 100, height: 100, objectFit: "contain" }}
          />
        </div>
        <div
          style={{
            opacity: nameOpacity,
            transform: `translateX(${nameX}px)`,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 64,
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
              fontSize: 24,
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
          width: interpolate(sloganSpring, [0, 1], [0, 600]),
          height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.border}, transparent)`,
          marginBottom: 40,
          zIndex: 1,
        }}
      />

      {/* Slogan */}
      <p
        style={{
          margin: "0 0 48px",
          fontSize: 36,
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

      {/* Three keywords */}
      <div
        style={{
          display: "flex",
          gap: 32,
          alignItems: "center",
          zIndex: 1,
        }}
      >
        {KEYWORDS.map((kw, i) => {
          const kwSpring = spring({
            frame: frame - keywordDelays[i],
            fps,
            config: { damping: 200 },
            durationInFrames: 20,
          });
          const kwOpacity = interpolate(kwSpring, [0, 1], [0, 1]);
          const kwScale = interpolate(kwSpring, [0, 1], [0.8, 1]);

          return (
            <div
              key={kw}
              style={{
                display: "flex",
                alignItems: "center",
                gap: i < KEYWORDS.length - 1 ? 32 : 0,
              }}
            >
              <div
                style={{
                  opacity: kwOpacity,
                  transform: `scale(${kwScale})`,
                  background: `${COLORS.brandBlue}18`,
                  border: `1.5px solid ${COLORS.brandBlue}44`,
                  borderRadius: 10,
                  padding: "14px 32px",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 40,
                    fontWeight: 700,
                    color: COLORS.textPrimary,
                    fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                  }}
                >
                  {kw}
                </span>
              </div>
              {i < KEYWORDS.length - 1 && (
                <div
                  style={{
                    opacity: kwOpacity,
                    fontSize: 32,
                    color: COLORS.accent,
                    fontWeight: 700,
                  }}
                >
                  ·
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Subtitle
        zh="蜻蜓工业助手——工业数据采集平台"
        en="QingTing Industrial Assistant — Industrial Data Platform"
        startFrame={15}
      />
    </AbsoluteFill>
  );
};
