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
import { TypewriterText } from "../components/TypewriterText";
import { FadeInOut } from "../components/FadeInOut";

// Scene duration: 1200 frames (40s)
// 0-8s   (0-240f):   Title card
// 8-22s  (240-660f): Typewriter input → AI generates plan
// 22-35s (660-1050f): Dashboard/report UI screenshots
// 35-40s (1050-1200f): Multi-device emphasis

const AI_INPUT = "按机床统计今日稼动率，异常时自动发送报警通知";
const AI_THINKING_START = 400; // frame when "AI analyzing" starts
const AI_PLAN_START = 460; // frame when plan cards appear

interface AIPlanCardProps {
  title: string;
  desc: string;
  delay: number;
  color?: string;
}

const AIPlanCard: React.FC<AIPlanCardProps> = ({ title, desc, delay, color = COLORS.brandBlue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 20 });

  return (
    <div
      style={{
        opacity: interpolate(s, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(s, [0, 1], [20, 0])}px)`,
        background: COLORS.bgSecondary,
        border: `1px solid ${color}44`,
        borderRadius: 10,
        padding: "18px 24px",
        borderLeft: `3px solid ${color}`,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 700,
          color: COLORS.textPrimary,
          fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
        }}
      >
        {title}
      </p>
      <p
        style={{
          margin: "6px 0 0",
          fontSize: 18,
          color: COLORS.textSecondary,
          fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
          lineHeight: 1.5,
        }}
      >
        {desc}
      </p>
    </div>
  );
};

interface DeviceCardProps {
  label: string;
  labelEn: string;
  icon: React.ReactNode;
  delay: number;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ label, labelEn, icon, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 22 });

  return (
    <div
      style={{
        opacity: interpolate(s, [0, 1], [0, 1]),
        transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`,
        background: COLORS.bgSecondary,
        border: `1.5px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: "32px 40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        flex: 1,
      }}
    >
      {icon}
      <p
        style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 600,
          color: COLORS.textPrimary,
          fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
        }}
      >
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 18, color: COLORS.textSecondary, fontFamily: '"Inter", sans-serif' }}>
        {labelEn}
      </p>
    </div>
  );
};

// Simple SVG icons
const PCIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="3" width="20" height="14" rx="2" stroke={COLORS.brandBlue} strokeWidth="1.5" />
    <path d="M8 21h8M12 17v4" stroke={COLORS.brandBlue} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 8h12M6 11h8" stroke={COLORS.cyan} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const MobileIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="2" width="14" height="20" rx="3" stroke={COLORS.brandBlue} strokeWidth="1.5" />
    <circle cx="12" cy="18" r="1" fill={COLORS.brandBlue} />
    <path d="M8 7h8M8 10h6" stroke={COLORS.cyan} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SUBTITLES = [
  { zh: "一句话描述需求，AI 自动生成并部署应用", en: "Describe what you need. AI builds and deploys it.", start: 0, end: 240 },
  { zh: "输入需求，AI 自动规划方案，用户审核后一键部署", en: "AI designs the solution. You review. One click to deploy.", start: 240, end: 660 },
  { zh: "看板、报表、预警——数据从采到直接变成用到", en: "Dashboards, reports, alerts — data becomes value instantly.", start: 660, end: 1050 },
  { zh: "PC 端、移动端同步查看，随时随地掌握生产状态", en: "Access on PC and mobile — anytime, anywhere.", start: 1050, end: 1200 },
];

export const QuickUse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const activeSubtitle = SUBTITLES.findLast((s: { zh: string; en: string; start: number; end: number }) => frame >= s.start) ?? SUBTITLES[0];

  // AI thinking spinner rotation
  const spinnerRotation = frame * 8; // 8 degrees/frame

  // AI thinking pulse opacity
  const thinkingOpacity = interpolate(
    frame % 20,
    [0, 10, 20],
    [0.5, 1, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const inputBoxSpring = spring({ frame: frame - 240, fps, config: { damping: 200 }, durationInFrames: 22 });

  return (
    <FadeInOut>
      <AbsoluteFill style={{ backgroundColor: COLORS.bgPrimary }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 50% 80%, ${COLORS.accent}06 0%, transparent 50%)`,
          }}
        />

        {/* Phase 1: Title (0-240f) */}
        {frame < 250 && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center" }}>
            <TitleCard
              tag="快用"
              tagEn="Quick Use"
              title="一句话，生成 AI 应用"
              subtitle="数据从「采到」直接变成「用到」"
              accentWord="一句话"
            />
          </div>
        )}

        {/* Phase 2: Input → AI plan (240-660f) */}
        {frame >= 240 && frame < 670 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              padding: "80px 120px",
              gap: 80,
              alignItems: "flex-start",
            }}
          >
            {/* Left: input + plan */}
            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: "0 0 24px",
                  fontSize: 36,
                  fontWeight: 700,
                  color: COLORS.textPrimary,
                  fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                  opacity: interpolate(frame, [240, 265], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }}
              >
                描述你的需求
              </p>

              {/* Input box */}
              <div
                style={{
                  opacity: interpolate(inputBoxSpring, [0, 1], [0, 1]),
                  background: COLORS.bgSecondary,
                  border: `1.5px solid ${COLORS.brandBlue}66`,
                  borderRadius: 12,
                  padding: "20px 24px",
                  marginBottom: 32,
                  minHeight: 80,
                }}
              >
                <TypewriterText
                  text={AI_INPUT}
                  startFrame={260}
                  charsPerFrame={0.6}
                  fontSize={26}
                  color={COLORS.textPrimary}
                />
              </div>

              {/* AI thinking indicator */}
              {frame >= AI_THINKING_START && frame < AI_PLAN_START && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    opacity: thinkingOpacity,
                    marginBottom: 24,
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    style={{ transform: `rotate(${spinnerRotation}deg)` }}
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke={COLORS.brandBlue}
                      strokeWidth="2"
                      strokeDasharray="20 40"
                      fill="none"
                    />
                  </svg>
                  <span
                    style={{
                      fontSize: 22,
                      color: COLORS.brandBlue,
                      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                    }}
                  >
                    AI 正在规划方案…
                  </span>
                </div>
              )}

              {/* AI plan cards */}
              {frame >= AI_PLAN_START && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <p
                    style={{
                      margin: "0 0 8px",
                      fontSize: 22,
                      color: COLORS.textSecondary,
                      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                      opacity: interpolate(frame, [AI_PLAN_START, AI_PLAN_START + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                    }}
                  >
                    AI 生成方案：
                  </p>
                  <AIPlanCard
                    title="机床稼动率看板"
                    desc="按班组、机台实时展示稼动率与状态"
                    delay={AI_PLAN_START}
                    color={COLORS.brandBlue}
                  />
                  <AIPlanCard
                    title="异常报警规则"
                    desc="稼动率低于阈值自动推送钉钉/微信通知"
                    delay={AI_PLAN_START + 15}
                    color={COLORS.accent}
                  />
                  <AIPlanCard
                    title="日报自动生成"
                    desc="每日收班自动汇总，发送至指定人员"
                    delay={AI_PLAN_START + 30}
                    color={COLORS.cyan}
                  />
                </div>
              )}
            </div>

            {/* Right: screenshot */}
            <div style={{ flex: 1 }}>
              <UIScreenshot
                label="AI 生成方案界面"
                delay={380}
                height={600}
              />
            </div>
          </div>
        )}

        {/* Phase 3: Dashboard screenshots (660-1050f) */}
        {frame >= 660 && frame < 1060 && (
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
                opacity: interpolate(frame, [660, 690], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}
            >
              自动生成并部署应用
            </h3>
            <div style={{ display: "flex", gap: 40, flex: 1 }}>
              <UIScreenshot label="稼动率看板" delay={680} borderRadius={8} />
              <UIScreenshot label="异常报警界面" delay={760} borderRadius={8} />
              <UIScreenshot label="日报自动生成" delay={840} borderRadius={8} />
            </div>
          </div>
        )}

        {/* Phase 4: Multi-device (1050-1200f) */}
        {frame >= 1050 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 48,
              padding: "80px 120px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 48,
                fontWeight: 700,
                color: COLORS.textPrimary,
                fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                textAlign: "center",
                opacity: interpolate(frame, [1050, 1080], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}
            >
              PC / 移动端，随时随地查看
            </p>
            <div style={{ display: "flex", gap: 60 }}>
              <DeviceCard label="PC 端" labelEn="Desktop" icon={<PCIcon />} delay={1080} />
              <DeviceCard label="移动端" labelEn="Mobile" icon={<MobileIcon />} delay={1120} />
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
