import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../constants/colors";

interface TitleCardProps {
  tag: string; // e.g. "快装"
  tagEn: string; // e.g. "Quick Deploy"
  title: string;
  subtitle?: string;
  accentWord?: string; // word to highlight in title with accent color
  delay?: number; // frames before animation starts
}

export const TitleCard: React.FC<TitleCardProps> = ({
  tag,
  tagEn,
  title,
  subtitle,
  accentWord,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });

  const titleSpring = spring({
    frame: frame - delay - 8,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });

  const subtitleSpring = spring({
    frame: frame - delay - 16,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });

  const tagY = interpolate(tagSpring, [0, 1], [30, 0]);
  const titleY = interpolate(titleSpring, [0, 1], [30, 0]);
  const subtitleY = interpolate(subtitleSpring, [0, 1], [20, 0]);

  const renderTitle = () => {
    if (!accentWord || !title.includes(accentWord)) {
      return title;
    }
    const parts = title.split(accentWord);
    return (
      <>
        {parts[0]}
        <span style={{ color: COLORS.accent }}>{accentWord}</span>
        {parts[1]}
      </>
    );
  };

  return (
    <div style={{ padding: "100px 120px" }}>
      {/* Tag pill */}
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
              fontSize: 32,
              fontWeight: 700,
              color: COLORS.brandBlue,
              fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
            }}
          >
            {tag}
          </span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 400,
              color: COLORS.textSecondary,
              fontFamily: '"Inter", sans-serif',
              letterSpacing: "0.05em",
            }}
          >
            {tagEn}
          </span>
        </div>
        {/* Accent dot */}
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: COLORS.accent,
          }}
        />
      </div>

      {/* Main title */}
      <h2
        style={{
          margin: 0,
          opacity: titleSpring,
          transform: `translateY(${titleY}px)`,
          fontSize: 72,
          fontWeight: 700,
          color: COLORS.textPrimary,
          fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
          lineHeight: 1.2,
          letterSpacing: "-0.01em",
        }}
      >
        {renderTitle()}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p
          style={{
            margin: "20px 0 0",
            opacity: subtitleSpring,
            transform: `translateY(${subtitleY}px)`,
            fontSize: 32,
            fontWeight: 400,
            color: COLORS.textSecondary,
            fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
            lineHeight: 1.6,
            maxWidth: 900,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
