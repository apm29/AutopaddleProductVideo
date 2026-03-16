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

// Scene duration: 1200 frames (40s)
// 0-8s   (0-240f):   Title card
// 8-30s  (240-900f): 3-step flow + screenshots
// 30-36s (900-1080f): Security emphasis card
// 36-40s (1080-1200f): Transition out

interface StepProps {
  number: number;
  title: string;
  desc: string;
  screenshotSrc?: string;
  screenshotLabel?: string;
  delay: number;
  isLast?: boolean;
}

const Step: React.FC<StepProps> = ({
  number,
  title,
  desc,
  screenshotSrc,
  screenshotLabel,
  delay,
  isLast = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 22,
  });

  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const translateY = interpolate(enterSpring, [0, 1], [30, 0]);

  // Connector line grows after the step appears
  const lineWidth = interpolate(
    frame,
    [delay + 20, delay + 45],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        position: "relative",
      }}
    >
      {/* Step number circle */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${COLORS.brandBlue}, ${COLORS.accent})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          boxShadow: `0 0 30px ${COLORS.brandBlue}44`,
        }}
      >
        <span
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#fff",
            fontFamily: '"Inter", monospace',
          }}
        >
          {number}
        </span>
      </div>

      {/* Connector line to next step */}
      {!isLast && (
        <div
          style={{
            position: "absolute",
            top: 32,
            left: "50%",
            right: "-50%",
            height: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${lineWidth}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${COLORS.brandBlue}, ${COLORS.accent})`,
            }}
          />
        </div>
      )}

      {/* Title */}
      <p
        style={{
          margin: "0 0 8px",
          fontSize: 30,
          fontWeight: 700,
          color: COLORS.textPrimary,
          fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
          textAlign: "center",
        }}
      >
        {title}
      </p>

      {/* Desc */}
      <p
        style={{
          margin: "0 0 24px",
          fontSize: 22,
          fontWeight: 400,
          color: COLORS.textSecondary,
          fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth: 280,
        }}
      >
        {desc}
      </p>

      {/* Screenshot */}
      <UIScreenshot
        src={screenshotSrc}
        label={screenshotLabel}
        delay={delay + 15}
        borderRadius={8}
      />
    </div>
  );
};

const SecurityCard: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterSpring = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: 25,
  });

  const features = [
    { icon: "🔒", text: "数据留存内网，不出企业边界" },
    { icon: "👤", text: "权限访问由企业自主掌控" },
    { icon: "✅", text: "安全合规，可控可管" },
  ];

  return (
    <div
      style={{
        opacity: interpolate(enterSpring, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(enterSpring, [0, 1], [30, 0])}px)`,
        background: `linear-gradient(135deg, ${COLORS.bgSecondary}, ${COLORS.bgPrimary})`,
        border: `1.5px solid ${COLORS.brandBlue}44`,
        borderRadius: 16,
        padding: "40px 60px",
        display: "flex",
        alignItems: "center",
        gap: 80,
        margin: "0 120px",
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: 40,
            fontWeight: 700,
            color: COLORS.textPrimary,
            fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
          }}
        >
          数据安全，企业自控
        </p>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 22,
            color: COLORS.textSecondary,
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Your data stays within your network
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {features.map((f, i) => {
          const itemSpring = spring({
            frame: frame - delay - i * 10,
            fps,
            config: { damping: 200 },
            durationInFrames: 20,
          });
          return (
            <div
              key={i}
              style={{
                opacity: interpolate(itemSpring, [0, 1], [0, 1]),
                transform: `translateX(${interpolate(itemSpring, [0, 1], [20, 0])}px)`,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: COLORS.cyan,
                }}
              />
              <span
                style={{
                  fontSize: 26,
                  color: COLORS.textPrimary,
                  fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                }}
              >
                {f.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SUBTITLES = [
  { zh: "办公电脑安装即用，无需专用服务器", en: "Runs on any office PC. No dedicated hardware.", start: 0, end: 240 },
  { zh: "三步完成部署，AI 引导全程配置", en: "Three steps to deploy. AI guides every step.", start: 240, end: 900 },
  { zh: "数据留存内网，企业自主掌控权限", en: "Data stays in your network. You own the access.", start: 900, end: 1200 },
];

export const QuickInstall: React.FC = () => {
  const frame = useCurrentFrame();
  const activeSubtitle = SUBTITLES.findLast((s: { zh: string; en: string; start: number; end: number }) => frame >= s.start) ?? SUBTITLES[0];

  return (
    <FadeInOut>
      <AbsoluteFill style={{ backgroundColor: COLORS.bgPrimary }}>
        {/* Subtle gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 10% 30%, ${COLORS.brandBlue}08 0%, transparent 50%)`,
          }}
        />

        {/* Phase 1: Title (0-240f) */}
        {frame < 250 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <TitleCard
              tag="快装"
              tagEn="Quick Deploy"
              title="办公电脑即可，3 步完成部署"
              subtitle="无需专用硬件，无需厂商支持，安装即用"
              accentWord="3 步"
            />
          </div>
        )}

        {/* Phase 2: 3-step flow (240-900f) */}
        {frame >= 240 && frame < 920 && (
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
                margin: "0 0 50px",
                fontSize: 42,
                fontWeight: 700,
                color: COLORS.textPrimary,
                fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                opacity: interpolate(frame, [240, 270], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              三步完成接入
            </h3>
            <div style={{ display: "flex", gap: 40, flex: 1 }}>
              <Step
                number={1}
                title="下载并安装"
                desc="一键安装包，双击即可，5 分钟完成"
                screenshotLabel="安装引导界面"
                delay={240}
              />
              <Step
                number={2}
                title="配置内网地址"
                desc="填写企业内网 IP，AI 自动识别设备"
                screenshotSrc={undefined}
                screenshotLabel="安装配置界面"
                delay={360}
              />
              <Step
                number={3}
                title="设备自动发现"
                desc="平台自动扫描并列出可接入设备"
                screenshotSrc={undefined}
                screenshotLabel="设备发现列表"
                delay={480}
                isLast
              />
            </div>
          </div>
        )}

        {/* Phase 3: Security card (900-1200f) */}
        {frame >= 900 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SecurityCard delay={920} />
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
