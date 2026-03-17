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

interface Bullet {
  label: string;   // colored label e.g. "实时状态查看"
  text: string;    // description
}

interface TransitionPageProps {
  title: string;
  body?: string;
  tag?: string;
  tagEn?: string;
  imageSrc?: string;
  imageAlt?: string;
  illustrationNode?: React.ReactNode;
  layout?: "text-only" | "text-image";
  bullets?: Bullet[];       // animated bullet list, replaces body
  tagline?: string;         // bottom emphasis line shown after bullets
}

// Animated single bullet row
const BulletItem: React.FC<{ bullet: Bullet; index: number; startFrame: number }> = ({
  bullet, startFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame: frame - startFrame, fps, config: { damping: 180 }, durationInFrames: 22 });
  const x = interpolate(s, [0, 1], [-36, 0]);
  const opacity = interpolate(s, [0, 1], [0, 1]);

  // Subtle shimmer scan on label — travels left-to-right once
  const shimmer = interpolate(frame - startFrame, [0, 18], [-100, 110], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${x}px)`,
        display: "flex",
        alignItems: "flex-start",
        gap: 20,
        marginBottom: 32,
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          flexShrink: 0,
          width: 4,
          height: 52,
          borderRadius: 2,
          marginTop: 4,
          background: `linear-gradient(180deg, ${COLORS.brandBlue}, ${COLORS.cyan})`,
          boxShadow: `0 0 10px ${COLORS.brandBlue}88`,
        }}
      />
      <div>
        {/* Label with shimmer */}
        <div style={{ position: "relative", display: "inline-block", overflow: "hidden", borderRadius: 4, marginBottom: 6 }}>
          <span
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: COLORS.cyan,
              fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
              letterSpacing: "0.02em",
              textShadow: `0 0 16px ${COLORS.cyan}66`,
            }}
          >
            {bullet.label}
          </span>
          {/* Shimmer sweep */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: `${shimmer}%`,
              width: "40%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
              pointerEvents: "none",
            }}
          />
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 22,
            color: COLORS.textPrimary,
            fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
            lineHeight: 1.6,
            opacity: 0.85,
          }}
        >
          {bullet.text}
        </p>
      </div>
    </div>
  );
};

export const TransitionPage: React.FC<TransitionPageProps> = ({
  title,
  body,
  tag,
  tagEn,
  imageSrc,
  imageAlt = "图示",
  illustrationNode,
  layout,
  bullets,
  tagline,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const effectiveLayout = layout ?? (imageSrc || illustrationNode ? "text-image" : "text-only");

  const tagSpring   = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 20 });
  const titleSpring = spring({ frame: frame - 8, fps, config: { damping: 200 }, durationInFrames: 22 });
  const bodySpring  = spring({ frame: frame - 18, fps, config: { damping: 200 }, durationInFrames: 24 });
  const imageSpring = spring({ frame: frame - 12, fps, config: { damping: 200 }, durationInFrames: 28 });

  const tagY    = interpolate(tagSpring,   [0, 1], [24, 0]);
  const titleY  = interpolate(titleSpring, [0, 1], [30, 0]);
  const bodyY   = interpolate(bodySpring,  [0, 1], [20, 0]);
  const imageScale = interpolate(imageSpring, [0, 1], [0.96, 1]);
  const imageX     = interpolate(imageSpring, [0, 1], [40, 0]);

  // Tagline pulse glow
  const taglinePulse = interpolate(
    Math.sin((frame / fps) * Math.PI * 1.2),
    [-1, 1],
    [0.4, 0.85],
  );
  // Tagline entrance — after last bullet
  const BULLET_STAGGER = 14;
  const lastBulletStart = bullets ? 18 + (bullets.length - 1) * BULLET_STAGGER : 18;
  const taglineSpring = spring({
    frame: frame - (lastBulletStart + 20),
    fps,
    config: { damping: 180 },
    durationInFrames: 20,
  });
  const taglineY = interpolate(taglineSpring, [0, 1], [16, 0]);

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
            <span style={{ fontSize: 28, fontWeight: 700, color: COLORS.brandBlue, fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif' }}>
              {tag}
            </span>
            {tagEn && (
              <span style={{ fontSize: 16, fontWeight: 400, color: COLORS.textSecondary, fontFamily: '"Inter", sans-serif', letterSpacing: "0.05em" }}>
                {tagEn}
              </span>
            )}
          </div>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.accent }} />
        </div>
      )}

      {/* Title */}
      <h2
        style={{
          margin: "0 0 36px",
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

      {/* Bullets OR plain body */}
      {bullets ? (
        <div>
          {bullets.map((b, i) => (
            <BulletItem
              key={i}
              bullet={b}
              index={i}
              startFrame={18 + i * BULLET_STAGGER}
            />
          ))}
          {/* Tagline */}
          {tagline && (
            <div
              style={{
                marginTop: 8,
                opacity: taglineSpring,
                transform: `translateY(${taglineY}px)`,
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: `${COLORS.accent}14`,
                border: `1.5px solid ${COLORS.accent}${Math.round(taglinePulse * 255).toString(16).padStart(2, "0")}`,
                borderRadius: 10,
                padding: "12px 24px",
                boxShadow: `0 0 18px ${COLORS.accent}${Math.round(taglinePulse * 0.4 * 255).toString(16).padStart(2, "00")}`,
              }}
            >
              {/* Checkbox icon */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="1" y="1" width="16" height="16" rx="4" stroke={COLORS.accent} strokeWidth="1.5" />
                <path d="M4.5 9l3 3 6-6" stroke={COLORS.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: COLORS.accent,
                  fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                  letterSpacing: "0.02em",
                }}
              >
                {tagline}
              </span>
            </div>
          )}
        </div>
      ) : (
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
      )}
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
      <div style={{ borderRadius: 16, overflow: "hidden", border: `1.5px solid ${COLORS.border}`, boxShadow: "0 24px 60px rgba(0,0,0,0.5)", width: "100%" }}>
        <Img src={staticFile(`images/${imageSrc}`)} style={{ width: "100%", display: "block" }} alt={imageAlt} />
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
