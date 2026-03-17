import { interpolate } from "remotion";
import { COLORS } from "../constants/colors";
import { TypewriterText } from "./TypewriterText";

interface PromptPanelProps {
  prompt: string;
  startFrame?: number;
  charsPerFrame?: number;
  panelOpacity: number;
  panelX: number;
}

export const PromptPanel: React.FC<PromptPanelProps> = ({
  prompt,
  startFrame = 0,
  charsPerFrame = 1.5,
  panelOpacity,
  panelX,
}) => {
  return (
    <div
      style={{
        opacity: interpolate(panelOpacity, [0, 1], [0, 1]),
        transform: `translateX(${panelX}px)`,
        flex: "0 0 240px",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Label row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            color: COLORS.brandBlue,
            fontSize: 14,
            lineHeight: 1,
          }}
        >
          ✦
        </span>
        <span
          style={{
            fontSize: 12,
            color: COLORS.textSecondary,
            fontFamily: '"Inter", sans-serif',
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          用户输入
        </span>
      </div>

      {/* Chat box */}
      <div
        style={{
          flex: 1,
          background: COLORS.bgSecondary,
          border: `1px solid ${COLORS.brandBlue}33`,
          borderRadius: 12,
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        {/* Typewriter text */}
        <div style={{ flex: 1 }}>
          <TypewriterText
            text={prompt}
            startFrame={startFrame}
            charsPerFrame={charsPerFrame}
            showCursor
            fontSize={14}
            color={COLORS.textPrimary}
          />
        </div>

        {/* Decorative send button */}
        <div
          style={{
            marginTop: 16,
            background: `${COLORS.brandBlue}22`,
            border: `1px solid ${COLORS.brandBlue}55`,
            borderRadius: 6,
            padding: "6px 12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: COLORS.brandBlue,
              fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
            }}
          >
            生成应用
          </span>
          <span style={{ fontSize: 12, color: COLORS.brandBlue }}>→</span>
        </div>
      </div>
    </div>
  );
};
