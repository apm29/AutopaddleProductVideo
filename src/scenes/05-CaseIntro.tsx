import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../constants/colors";
import { FadeInOut } from "../components/FadeInOut";

// Scene 05: 案例介绍 — 180 frames (6s)

// ── Factory SVG illustration ─────────────────────────────────────────────────

const FactoryIllustration: React.FC<{ opacity: number; scale: number }> = ({ opacity, scale }) => {
  // Window grid helper: returns an array of window rect props
  const windows = (
    startX: number,
    startY: number,
    cols: number,
    rows: number,
    ww: number,
    wh: number,
    gx: number,
    gy: number,
    lit: number[], // indices of lit (bright) windows
  ) =>
    Array.from({ length: cols * rows }, (_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      return (
        <rect
          key={i}
          x={startX + col * (ww + gx)}
          y={startY + row * (wh + gy)}
          width={ww}
          height={wh}
          rx={2}
          fill={lit.includes(i) ? "#4FC3F7" : "#1A2040"}
          opacity={lit.includes(i) ? 0.9 : 0.5}
        />
      );
    });

  return (
    <div style={{ width: "100%", height: "100%", opacity, transform: `scale(${scale})` }}>
      <svg viewBox="0 0 1100 480" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Ground gradient */}
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A2040" />
            <stop offset="100%" stopColor="#0D0F1A" />
          </linearGradient>
          {/* Sky glow */}
          <radialGradient id="skyGlow" cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor={COLORS.brandBlue} stopOpacity="0.12" />
            <stop offset="100%" stopColor={COLORS.brandBlue} stopOpacity="0" />
          </radialGradient>
          {/* Chimney smoke */}
          <radialGradient id="smoke1" cx="50%" cy="80%" r="50%">
            <stop offset="0%" stopColor="#8899BB" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#8899BB" stopOpacity="0" />
          </radialGradient>
          {/* Window glow filter */}
          <filter id="winGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Building shadow */}
          <filter id="bldShadow" x="-5%" y="-5%" width="115%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Sky background glow */}
        <rect width="1100" height="480" fill="url(#skyGlow)" />

        {/* ── Ground plane ── */}
        <rect x="0" y="390" width="1100" height="90" fill="url(#ground)" rx="0" />
        {/* Ground grid lines */}
        {[100, 220, 340, 460, 580, 700, 820, 940, 1060].map((x) => (
          <line key={x} x1={x} y1="390" x2={x} y2="480" stroke="#2A3360" strokeWidth="1" opacity="0.4" />
        ))}
        <line x1="0" y1="420" x2="1100" y2="420" stroke="#2A3360" strokeWidth="1" opacity="0.3" />
        <line x1="0" y1="455" x2="1100" y2="455" stroke="#2A3360" strokeWidth="1" opacity="0.2" />

        {/* ── Left warehouse (low, wide) ── */}
        <rect x="30" y="270" width="280" height="122" fill="#141828" stroke="#1E2A4A" strokeWidth="1.5" filter="url(#bldShadow)" />
        {/* Roof ridge */}
        <polygon points="30,270 170,230 310,270" fill="#1C2238" stroke="#1E2A4A" strokeWidth="1" />
        {/* Roof highlight */}
        <line x1="30" y1="270" x2="170" y2="230" stroke="#2E3A6E" strokeWidth="1.5" />
        <line x1="310" y1="270" x2="170" y2="230" stroke="#2E3A6E" strokeWidth="1.5" />
        {/* Windows row */}
        {windows(50, 300, 5, 2, 36, 22, 10, 10, [0, 2, 5, 7, 9])}
        {/* Door */}
        <rect x="148" y="340" width="44" height="52" rx="3" fill="#0D1020" stroke="#1E2A4A" strokeWidth="1" />
        <rect x="155" y="345" width="12" height="20" rx="1" fill="#1A2A50" opacity="0.6" />
        <rect x="173" y="345" width="12" height="20" rx="1" fill="#1A2A50" opacity="0.6" />

        {/* ── Main factory building (center, tall) ── */}
        <rect x="340" y="180" width="420" height="212" fill="#16192E" stroke="#1E2A4A" strokeWidth="2" filter="url(#bldShadow)" />
        {/* Parapet top */}
        <rect x="335" y="172" width="430" height="14" rx="2" fill="#1C2040" stroke="#253060" strokeWidth="1" />
        {/* Rooftop equipment box */}
        <rect x="420" y="148" width="80" height="28" rx="4" fill="#1A1E35" stroke="#253060" strokeWidth="1" />
        <rect x="590" y="154" width="50" height="22" rx="3" fill="#1A1E35" stroke="#253060" strokeWidth="1" />
        {/* Antenna */}
        <line x1="455" y1="148" x2="455" y2="118" stroke="#2A3360" strokeWidth="2" />
        <circle cx="455" cy="115" r="4" fill={COLORS.accent} opacity="0.8" />
        {/* Windows 3 rows × 7 cols */}
        {windows(360, 205, 7, 3, 44, 28, 10, 12, [0, 2, 3, 5, 8, 10, 11, 13, 15, 17, 20])}
        {/* Company sign strip */}
        <rect x="380" y="310" width="340" height="36" rx="4" fill={`${COLORS.brandBlue}22`} stroke={`${COLORS.brandBlue}55`} strokeWidth="1.5" />
        <text x="550" y="333" textAnchor="middle" fontSize="16" fill={COLORS.brandBlue} fontFamily="'Inter', sans-serif" letterSpacing="2">
          QINGTING · 蜻蜓工业助手
        </text>
        {/* Ground-floor shutter doors */}
        {[360, 460, 560, 660].map((x) => (
          <g key={x}>
            <rect x={x} y="348" width="70" height="42" rx="2" fill="#0E1120" stroke="#1E2A4A" strokeWidth="1" />
            {[354, 362, 370, 378].map((y) => (
              <line key={y} x1={x + 4} y1={y} x2={x + 66} y2={y} stroke="#1E2A4A" strokeWidth="0.8" />
            ))}
          </g>
        ))}

        {/* ── Right annex building ── */}
        <rect x="790" y="240" width="200" height="152" fill="#141828" stroke="#1E2A4A" strokeWidth="1.5" filter="url(#bldShadow)" />
        {/* Flat roof trim */}
        <rect x="785" y="233" width="210" height="12" rx="2" fill="#1C2040" stroke="#253060" strokeWidth="1" />
        {/* Windows */}
        {windows(808, 262, 4, 3, 34, 24, 8, 10, [1, 3, 4, 6, 9, 11])}
        {/* Side door */}
        <rect x="860" y="346" width="50" height="44" rx="2" fill="#0D1020" stroke="#1E2A4A" strokeWidth="1" />

        {/* ── Far-right small shed ── */}
        <rect x="1010" y="320" width="80" height="72" fill="#12152A" stroke="#1E2A4A" strokeWidth="1" />
        <polygon points="1010,320 1050,296 1090,320" fill="#191D32" stroke="#1E2A4A" strokeWidth="1" />

        {/* ── Chimneys ── */}
        {/* Left chimney */}
        <rect x="105" y="150" width="22" height="84" rx="3" fill="#1C2038" stroke="#253060" strokeWidth="1.5" />
        <rect x="100" y="146" width="32" height="10" rx="2" fill="#253060" />
        {/* Center-left chimney */}
        <rect x="395" y="110" width="26" height="70" rx="3" fill="#1C2038" stroke="#253060" strokeWidth="1.5" />
        <rect x="389" y="106" width="38" height="10" rx="2" fill="#253060" />
        {/* Center-right chimney */}
        <rect x="670" y="120" width="22" height="60" rx="3" fill="#1C2038" stroke="#253060" strokeWidth="1.5" />
        <rect x="665" y="116" width="32" height="10" rx="2" fill="#253060" />

        {/* ── Smoke puffs (static, layered ellipses) ── */}
        <ellipse cx="116" cy="135" rx="18" ry="12" fill="url(#smoke1)" />
        <ellipse cx="128" cy="118" rx="14" ry="9" fill="url(#smoke1)" opacity="0.6" />
        <ellipse cx="138" cy="104" rx="10" ry="7" fill="url(#smoke1)" opacity="0.35" />

        <ellipse cx="408" cy="96" rx="20" ry="13" fill="url(#smoke1)" />
        <ellipse cx="422" cy="78" rx="15" ry="9" fill="url(#smoke1)" opacity="0.5" />

        <ellipse cx="681" cy="106" rx="16" ry="10" fill="url(#smoke1)" />
        <ellipse cx="692" cy="90" rx="12" ry="8" fill="url(#smoke1)" opacity="0.45" />

        {/* ── Lit windows glow overlay ── */}
        <g filter="url(#winGlow)" opacity="0.5">
          <rect x="52" y="302" width="36" height="22" rx="2" fill="#4FC3F7" />
          <rect x="72" y="322" width="36" height="22" rx="2" fill="#4FC3F7" />
          <rect x="590" y="217" width="44" height="28" rx="2" fill="#4FC3F7" />
          <rect x="810" y="274" width="34" height="24" rx="2" fill="#4FC3F7" />
        </g>

        {/* ── Foreground fence ── */}
        {/* Base rail */}
        <rect x="0" y="388" width="1100" height="4" rx="2" fill="#253060" />
        {/* Posts */}
        {Array.from({ length: 23 }, (_, i) => (
          <rect key={i} x={i * 50} y="370" width="6" height="22" rx="1" fill="#253060" />
        ))}
        {/* Top rail */}
        <rect x="0" y="368" width="1100" height="4" rx="2" fill="#253060" />

        {/* ── Road / forecourt ── */}
        <rect x="480" y="388" width="140" height="4" fill={`${COLORS.brandBlue}44`} />

        {/* ── Blue accent line at base ── */}
        <line x1="0" y1="390" x2="1100" y2="390" stroke={COLORS.brandBlue} strokeWidth="1.5" opacity="0.4" />
      </svg>
    </div>
  );
};

// ── Scene ────────────────────────────────────────────────────────────────────

export const CaseIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const companySpring = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 22 });
  const imageSpring   = spring({ frame: frame - 12, fps, config: { damping: 200 }, durationInFrames: 26 });

  const companyY   = interpolate(companySpring, [0, 1], [24, 0]);
  const imageScale = interpolate(imageSpring, [0, 1], [0.96, 1]);

  return (
    <FadeInOut>
      <AbsoluteFill
        style={{
          backgroundColor: COLORS.bgPrimary,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          padding: "48px 120px",
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
            浙江绍兴某汽车零部件离散生产型企业
          </p>
        </div>

        {/* Factory illustration */}
        <div
          style={{
            zIndex: 1,
            width: "100%",
            maxWidth: 1100,
          }}
        >
          <FactoryIllustration opacity={imageSpring} scale={imageScale} />
        </div>
      </AbsoluteFill>
    </FadeInOut>
  );
};
