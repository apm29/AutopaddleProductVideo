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
import { FadeInOut } from "./FadeInOut";

interface TransitionPageProps {
  title: string;
  body: string;
  tag?: string;         // e.g. "场景一"
  tagEn?: string;       // e.g. "Scene 1"
  imageSrc?: string;    // filename in public/images/, e.g. "2.png"
  imageAlt?: string;
  illustrationNode?: React.ReactNode; // inline SVG/JSX illustration (used when no imageSrc)
  layout?: "text-only" | "text-image"; // text-only centers text, text-image splits 50/50
}

export const TransitionPage: React.FC<TransitionPageProps> = ({
  title,
  body,
  tag,
  tagEn,
  imageSrc,
  imageAlt = "图示",
  illustrationNode,
  layout,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Auto-detect layout
  const effectiveLayout = layout ?? (imageSrc || illustrationNode ? "text-image" : "text-only");

  const tagSpring = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });
  const titleSpring = spring({ frame: frame - 8, fps, config: { damping: 200 }, durationInFrames: 22 });
  const bodySpring = spring({ frame: frame - 18, fps, config: { damping: 200 }, durationInFrames: 24 });
  const imageSpring = spring({ frame: frame - 12, fps, config: { damping: 200 }, durationInFrames: 28 });

  const tagY = interpolate(tagSpring, [0, 1], [24, 0]);
  const titleY = interpolate(titleSpring, [0, 1], [30, 0]);
  const bodyY = interpolate(bodySpring, [0, 1], [20, 0]);
  const imageScale = interpolate(imageSpring, [0, 1], [0.96, 1]);
  const imageX = interpolate(imageSpring, [0, 1], [40, 0]);

  const textBlock = (
    <div
      style={{
        flex: effectiveLayout === "text-image" ? "0 0 50%" : undefined,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: effectiveLayout === "text-only" ? "0 200px" : "0 80px 0 120px",
      }}
    >
      {/* Tag */}
      {tag && (
        <div
          style={{
            opacity: tagSpring,
            transform: `translateY(${tagY}px)`,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: `${COLORS.brandBlue}22`,
              border: `1.5px solid ${COLORS.brandBlue}55`,
              borderRadius: 8,
              padding: "8px 20px",
            }}
          >
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: COLORS.brandBlue,
                fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
              }}
            >
              {tag}
            </span>
            {tagEn && (
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: COLORS.textSecondary,
                  fontFamily: '"Inter", sans-serif',
                  letterSpacing: "0.05em",
                }}
              >
                {tagEn}
              </span>
            )}
          </div>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: COLORS.accent,
            }}
          />
        </div>
      )}

      {/* Title */}
      <h2
        style={{
          margin: "0 0 32px",
          opacity: titleSpring,
          transform: `translateY(${titleY}px)`,
          fontSize: effectiveLayout === "text-only" ? 80 : 64,
          fontWeight: 700,
          color: COLORS.textPrimary,
          fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>

      {/* Body */}
      <p
        style={{
          margin: 0,
          opacity: bodySpring,
          transform: `translateY(${bodyY}px)`,
          fontSize: effectiveLayout === "text-only" ? 34 : 28,
          fontWeight: 400,
          color: COLORS.textSecondary,
          fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
          lineHeight: 1.9,
          maxWidth: effectiveLayout === "text-only" ? 1100 : undefined,
        }}
      >
        {body}
      </p>
    </div>
  );

  const imageBlock = imageSrc ? (
    <div
      style={{
        flex: "0 0 50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 80px 40px 40px",
        opacity: imageSpring,
        transform: `translateX(${imageX}px) scale(${imageScale})`,
      }}
    >
      <div
        style={{
          borderRadius: 16,
          overflow: "hidden",
          border: `1.5px solid ${COLORS.border}`,
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          width: "100%",
        }}
      >
        <Img
          src={staticFile(`images/${imageSrc}`)}
          style={{ width: "100%", display: "block" }}
          alt={imageAlt}
        />
      </div>
    </div>
  ) : illustrationNode ? (
    <div
      style={{
        flex: "0 0 50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 80px 40px 40px",
        opacity: imageSpring,
        transform: `translateX(${imageX}px) scale(${imageScale})`,
      }}
    >
      {illustrationNode}
    </div>
  ) : null;

  return (
    <FadeInOut>
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.bgPrimary,
          flexDirection: effectiveLayout === "text-image" ? "row" : "column",
          alignItems: "center",
          justifyContent: effectiveLayout === "text-only" ? "center" : "flex-start",
        }}
      >
        {/* Subtle background gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              effectiveLayout === "text-image"
                ? `radial-gradient(ellipse at 20% 50%, ${COLORS.brandBlue}09 0%, transparent 55%)`
                : `radial-gradient(ellipse at 50% 40%, ${COLORS.brandBlue}09 0%, transparent 60%)`,
          }}
        />
        {textBlock}
        {effectiveLayout === "text-image" && imageBlock}
      </AbsoluteFill>
    </FadeInOut>
  );
};
