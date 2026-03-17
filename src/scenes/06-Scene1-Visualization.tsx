import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../constants/colors";
import { TransitionPage } from "../components/TransitionPage";
import { VideoSection } from "../components/VideoSection";
import { SCENE_VIDEO_OFFSET } from "../constants/timing";

// ── Right-side illustration: desktop + mobile screenshots ───────────────────

const Scene1Illustration: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const desktopSpring = spring({ frame: frame - 10, fps, config: { damping: 180 }, durationInFrames: 30 });
  const mobileSpring  = spring({ frame: frame - 24, fps, config: { damping: 160 }, durationInFrames: 28 });

  const desktopOpacity = interpolate(desktopSpring, [0, 1], [0, 1]);
  const desktopScale   = interpolate(desktopSpring, [0, 1], [0.92, 1]);
  const desktopY       = interpolate(desktopSpring, [0, 1], [24, 0]);

  const mobileOpacity = interpolate(mobileSpring, [0, 1], [0, 1]);
  const mobileScale   = interpolate(mobileSpring, [0, 1], [0.88, 1]);
  const mobileY       = interpolate(mobileSpring, [0, 1], [32, 0]);

  // Floating
  const t = frame / fps;
  const desktopFloat = Math.sin(t * Math.PI * 0.5) * 7;
  const mobileFloat  = Math.sin(t * Math.PI * 0.5 + Math.PI) * 10;

  // Glow pulse
  const glowA = interpolate(Math.sin(t * Math.PI * 0.7), [-1, 1], [0.12, 0.28]);

  // Chrome bar height is fixed; screenshot fills the rest
  const CHROME_H = 38;
  const CARD_H = 460;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        padding: "0 8px",
      }}
    >
      {/* ── Desktop screenshot ── */}
      <div
        style={{
          height: CARD_H,
          display: "flex",
          flexDirection: "column",
          opacity: desktopOpacity,
          transform: `translateY(${desktopY + desktopFloat}px) scale(${desktopScale})`,
        }}
      >
        {/* Browser chrome */}
        <div
          style={{
            flexShrink: 0,
            height: CHROME_H,
            background: "#1A1D2E",
            borderRadius: "10px 10px 0 0",
            border: `1.5px solid ${COLORS.border}`,
            borderBottom: "none",
            padding: "0 14px",
            display: "flex",
            alignItems: "center",
            gap: 7,
          }}
        >
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
          <div
            style={{
              flex: 1,
              marginLeft: 10,
              background: "#0D0F1A",
              borderRadius: 5,
              padding: "4px 12px",
              fontSize: 11,
              color: `${COLORS.textSecondary}88`,
              fontFamily: '"Inter", monospace',
            }}
          >
            设备监控大屏
          </div>
        </div>
        {/* Screenshot fills remaining height */}
        <div
          style={{
            flex: 1,
            border: `1.5px solid ${COLORS.border}`,
            borderTop: "none",
            borderRadius: "0 0 8px 8px",
            overflow: "hidden",
            boxShadow: `0 20px 48px rgba(0,0,0,0.55), 0 0 0 1px ${COLORS.brandBlue}22`,
          }}
        >
          <Img
            src={staticFile("screenshots/device-monitor-app.png")}
            style={{ width: "auto", height: "100%", display: "block", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* ── Mobile screenshot ── */}
      <div
        style={{
          height: CARD_H,
          opacity: mobileOpacity,
          transform: `translateY(${mobileY + mobileFloat}px) scale(${mobileScale})`,
        }}
      >
        {/* Phone shell sized to match CARD_H */}
        <div
          style={{
            position: "relative",
            height: "100%",
            // width derived from content
            padding: "12px 8px",
            background: "linear-gradient(160deg, #1E2235 0%, #13151F 100%)",
            borderRadius: 28,
            border: `1.5px solid ${COLORS.border}`,
            boxShadow: `0 24px 64px rgba(0,0,0,0.65), 0 0 0 1px ${COLORS.cyan}22, inset 0 1px 0 rgba(255,255,255,0.05)`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Notch */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              width: 56,
              height: 16,
              background: "#0D0F1A",
              borderRadius: "0 0 10px 10px",
              zIndex: 2,
            }}
          />
          <div style={{ height: 10, flexShrink: 0 }} />
          {/* Screenshot fills shell */}
          <div style={{ flex: 1, borderRadius: 16, overflow: "hidden" }}>
            <Img
              src={staticFile("screenshots/device-monitor-mobile.png")}
              style={{ width: "auto", height: "100%", display: "block" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 8, flexShrink: 0 }}>
            <div style={{ width: 44, height: 3, borderRadius: 2, background: `${COLORS.textSecondary}44` }} />
          </div>
          {/* Pulsing cyan ring */}
          <div
            style={{
              position: "absolute",
              inset: -1,
              borderRadius: 29,
              border: `1.5px solid ${COLORS.cyan}${Math.round(glowA * 2.2 * 255).toString(16).padStart(2, "0")}`,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ── Scene ───────────────────────────────────────────────────────────────────

// Scene 06: 场景一 — 设备状态管理应用生成 — 1140 frames

export const Scene1Visualization: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const videoDuration = durationInFrames - SCENE_VIDEO_OFFSET;

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={SCENE_VIDEO_OFFSET} premountFor={fps}>
        <TransitionPage
          tag="场景一"
          tagEn="Scene 1"
          title="设备状态管理应用生成"
          bullets={[
            { label: "实时状态查看", text: "随时掌握车床运行状态、加工数量及当前程序，生产进度一目了然。" },
            { label: "打破空间限制", text: "无论在公司内或外出办公，均可跨地域掌握生产实况，管理得心应手。" },
            { label: "数据实时同步", text: "移动端与电脑端秒级同步，告别繁琐的现场巡检，提升决策效率。" },
          ]}
          tagline="移动端随时查看，无需再到车床现场"
          illustrationNode={<Scene1Illustration />}
        />
      </Sequence>
      <Sequence from={SCENE_VIDEO_OFFSET} durationInFrames={videoDuration} premountFor={fps}>
        <VideoSection
          src={undefined}
          label="设备状态大屏 + 手机端演示"
          labelEn="Remote visualization — video pending"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
