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
import { FadeInOut } from "../components/FadeInOut";

// Scene 05: 案例介绍 — 180 frames (6s)
// Shows the case company name + overview image (public/images/1.png)

export const CaseIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const companySpring = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 22 });
  const imageSpring = spring({ frame: frame - 12, fps, config: { damping: 200 }, durationInFrames: 26 });

  const companyY = interpolate(companySpring, [0, 1], [24, 0]);
  const imageScale = interpolate(imageSpring, [0, 1], [0.96, 1]);

  const IMAGE_SRC = "images/1.png";

  return (
    <FadeInOut>
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.bgPrimary,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
          padding: "60px 120px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 50% 30%, ${COLORS.brandBlue}0A 0%, transparent 55%)`,
          }}
        />

        {/* Company name */}
        <div
          style={{
            opacity: companySpring,
            transform: `translateY(${companyY}px)`,
            zIndex: 1,
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background: `${COLORS.brandBlue}18`,
              border: `1.5px solid ${COLORS.brandBlue}44`,
              borderRadius: 10,
              padding: "12px 32px",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontSize: 22,
                fontWeight: 400,
                color: COLORS.textSecondary,
                fontFamily: '"Inter", sans-serif',
                letterSpacing: "0.06em",
              }}
            >
              CASE STUDY
            </span>
          </div>
          <p
            style={{
              margin: "16px 0 0",
              fontSize: 40,
              fontWeight: 700,
              color: COLORS.textPrimary,
              fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
              lineHeight: 1.4,
            }}
          >
            浙江绍兴某汽车零部件
          </p>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 40,
              fontWeight: 700,
              color: COLORS.textPrimary,
              fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
              lineHeight: 1.4,
            }}
          >
            离散生产型企业
          </p>
        </div>

        {/* Case image */}
        <div
          style={{
            opacity: imageSpring,
            transform: `scale(${imageScale})`,
            zIndex: 1,
            width: "100%",
            maxWidth: 1100,
            borderRadius: 16,
            overflow: "hidden",
            border: `1.5px solid ${COLORS.border}`,
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          }}
        >
          <Img
            src={staticFile(IMAGE_SRC)}
            style={{ width: "100%", display: "block" }}
          />
        </div>
      </AbsoluteFill>
    </FadeInOut>
  );
};
