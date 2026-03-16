import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../constants/colors";
import { TitleCard } from "../components/TitleCard";
import { UIScreenshot } from "../components/UIScreenshot";
import { Subtitle } from "../components/Subtitle";
import { FadeInOut } from "../components/FadeInOut";

// Scene duration: 1650 frames (55s)
// 0-10s  (0-300f):    Title card
// 10-25s (300-750f):  AI-guided config demo
// 25-50s (750-1500f): Three collection methods (8s each)
// 50-55s (1500-1650f): Wrap-up

const PROTOCOLS = ["Modbus TCP", "OPC-UA", "MQTT", "EtherNet/IP", "Siemens S7"];

interface ProtocolTagProps {
  label: string;
  delay: number;
}

const ProtocolTag: React.FC<ProtocolTagProps> = ({ label, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 18 });
  return (
    <div
      style={{
        opacity: interpolate(s, [0, 1], [0, 1]),
        transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`,
        background: `${COLORS.cyan}18`,
        border: `1px solid ${COLORS.cyan}44`,
        borderRadius: 6,
        padding: "6px 16px",
        fontSize: 20,
        color: COLORS.cyan,
        fontFamily: '"Inter", monospace',
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};

interface CollectionMethodProps {
  icon: React.ReactNode;
  title: string;
  titleEn: string;
  desc: string;
  screenshotLabel: string;
  delay: number;
}

const CollectionMethod: React.FC<CollectionMethodProps> = ({
  icon,
  title,
  titleEn,
  desc,
  screenshotLabel,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });

  return (
    <div
      style={{
        opacity: interpolate(enterSpring, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(enterSpring, [0, 1], [30, 0])}px)`,
        flex: 1,
        background: COLORS.bgSecondary,
        border: `1.5px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: "36px 40px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Method icon & title */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 12,
            background: `${COLORS.brandBlue}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              color: COLORS.textPrimary,
              fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
            }}
          >
            {title}
          </p>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: 16,
              color: COLORS.textSecondary,
              fontFamily: '"Inter", sans-serif',
              letterSpacing: "0.04em",
            }}
          >
            {titleEn}
          </p>
        </div>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 22,
          color: COLORS.textSecondary,
          fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
          lineHeight: 1.6,
        }}
      >
        {desc}
      </p>

      <UIScreenshot label={screenshotLabel} delay={delay + 15} borderRadius={8} />
    </div>
  );
};

const SUBTITLES = [
  { zh: "预置万种设备配置，AI 引导接入，90% 场景自助上线", en: "AI-guided setup with 10,000+ device templates. 90% self-service.", start: 0, end: 300 },
  { zh: "跟着 AI 一步步配置，无需专家指导，无需反复试错", en: "Step-by-step AI guidance. No expert needed.", start: 300, end: 750 },
  { zh: "三种接入方式，覆盖绝大多数工业现场场景", en: "Three collection methods covering most industrial scenarios.", start: 750, end: 1650 },
];

// SVG Icons
const IconDirectConnect = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="8" width="8" height="8" rx="1.5" stroke={COLORS.brandBlue} strokeWidth="1.5" />
    <rect x="14" y="8" width="8" height="8" rx="1.5" stroke={COLORS.brandBlue} strokeWidth="1.5" />
    <path d="M10 12h4" stroke={COLORS.accent} strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="12" r="1" fill={COLORS.accent} />
  </svg>
);

const IconVisual = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="14" rx="2" stroke={COLORS.brandBlue} strokeWidth="1.5" />
    <circle cx="12" cy="11" r="3" stroke={COLORS.cyan} strokeWidth="1.5" />
    <path d="M8 20h8M12 18v2" stroke={COLORS.brandBlue} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconFile = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke={COLORS.brandBlue} strokeWidth="1.5" />
    <path d="M14 2v6h6M9 12h6M9 16h4" stroke={COLORS.cyan} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const QuickCollect: React.FC = () => {
  const frame = useCurrentFrame();
  const activeSubtitle = SUBTITLES.findLast((s: { zh: string; en: string; start: number; end: number }) => frame >= s.start) ?? SUBTITLES[0];

  return (
    <FadeInOut>
      <AbsoluteFill style={{ backgroundColor: COLORS.bgPrimary }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 90% 20%, ${COLORS.accent}06 0%, transparent 50%)`,
          }}
        />

        {/* Phase 1: Title (0-300f) */}
        {frame < 310 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
            <TitleCard
              tag="快采"
              tagEn="Quick Collect"
              title="90% 数采场景，自助上线"
              subtitle="AI 引导式配置，无需专家，无需改造设备"
              accentWord="90%"
            />
          </div>
        )}

        {/* Phase 2: AI-guided demo (300-750f) */}
        {frame >= 300 && frame < 760 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              padding: "80px 120px",
              gap: 80,
            }}
          >
            {/* Left: AI flow */}
            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: "0 0 32px",
                  fontSize: 42,
                  fontWeight: 700,
                  color: COLORS.textPrimary,
                  fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                  opacity: interpolate(frame, [300, 330], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }}
              >
                AI 引导式配置
              </p>

              {/* AI flow steps */}
              {[
                { step: "选择设备类型", icon: "→", delay: 320 },
                { step: "AI 自动推荐配置方案", icon: "→", delay: 380 },
                { step: "一键应用，设备上线", icon: "✓", delay: 440 },
              ].map(({ step, icon, delay }, i) => {
                const s = spring({ frame: frame - delay, fps: 30, config: { damping: 200 }, durationInFrames: 20 });
                return (
                  <div
                    key={i}
                    style={{
                      opacity: interpolate(s, [0, 1], [0, 1]),
                      transform: `translateX(${interpolate(s, [0, 1], [-20, 0])}px)`,
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      marginBottom: 20,
                      padding: "14px 24px",
                      background: COLORS.bgSecondary,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 10,
                    }}
                  >
                    <span style={{ fontSize: 20, color: COLORS.brandBlue }}>{icon}</span>
                    <span
                      style={{
                        fontSize: 26,
                        color: COLORS.textPrimary,
                        fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                      }}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}

              {/* Protocol tags */}
              <div
                style={{
                  marginTop: 32,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  opacity: interpolate(frame, [460, 490], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }}
              >
                {PROTOCOLS.map((p, i) => (
                  <ProtocolTag key={p} label={p} delay={480 + i * 12} />
                ))}
                <div
                  style={{
                    border: `1px dashed ${COLORS.border}`,
                    borderRadius: 6,
                    padding: "6px 16px",
                    fontSize: 20,
                    color: COLORS.textSecondary,
                    fontFamily: '"Inter", monospace',
                  }}
                >
                  + 9,995 more
                </div>
              </div>
            </div>

            {/* Right: screenshot */}
            <div style={{ flex: 1 }}>
              <UIScreenshot
                label="AI 引导配置界面"
                delay={350}
                height={500}
              />
            </div>
          </div>
        )}

        {/* Phase 3: Three collection methods (750-1500f) */}
        {frame >= 750 && frame < 1520 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              padding: "60px 80px 120px",
            }}
          >
            <h3
              style={{
                margin: "0 0 40px",
                fontSize: 42,
                fontWeight: 700,
                color: COLORS.textPrimary,
                fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                opacity: interpolate(frame, [750, 780], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}
            >
              三种采集方式，覆盖主流场景
            </h3>
            <div style={{ display: "flex", gap: 32, flex: 1 }}>
              <CollectionMethod
                icon={<IconDirectConnect />}
                title="设备直连"
                titleEn="Direct Connect"
                desc="局域网内工业设备，内置协议库，无需额外采购，一键接入"
                screenshotLabel="设备直连配置界面"
                delay={770}
              />
              <CollectionMethod
                icon={<IconVisual />}
                title="视觉识别"
                titleEn="Visual Recognition"
                desc="对准设备屏幕，AI 识别数据，无需改造硬件，零侵入接入"
                screenshotLabel="视觉识别配置界面"
                delay={890}
              />
              <CollectionMethod
                icon={<IconFile />}
                title="文件采集"
                titleEn="File Collect"
                desc="系统导出文件或员工上传，保存即自动采集，省去手动粘贴"
                screenshotLabel="文件采集配置界面"
                delay={1010}

              />
            </div>
          </div>
        )}

        <Subtitle
          zh={activeSubtitle.zh}
          en={activeSubtitle.en}
          startFrame={activeSubtitle.start}
          endFrame={activeSubtitle.end}
        />
      </AbsoluteFill>
    </FadeInOut>
  );
};
