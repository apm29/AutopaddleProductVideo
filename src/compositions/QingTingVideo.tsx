import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { COLORS } from "../constants/colors";
import { SCENE_DURATIONS, SCENE_STARTS } from "../constants/timing";
import { OpeningHook } from "../scenes/01-OpeningHook";
import { BrandIntro } from "../scenes/02-BrandIntro";
import { QuickInstall } from "../scenes/03-QuickInstall";
import { QuickCollect } from "../scenes/04-QuickCollect";
import { QuickUse } from "../scenes/05-QuickUse";
import { MetricsHighlight } from "../scenes/06-MetricsHighlight";
import { BrandOutro } from "../scenes/07-BrandOutro";

// Main composition: 5400 frames = 180s @ 30fps, 1920×1080

export const QingTingVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const premount = fps; // 1 second premount for all scenes

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgPrimary }}>
      <Sequence
        from={SCENE_STARTS.OPENING_HOOK}
        durationInFrames={SCENE_DURATIONS.OPENING_HOOK}
        premountFor={premount}
        name="01 · 开场钩子"
      >
        <OpeningHook />
      </Sequence>

      <Sequence
        from={SCENE_STARTS.BRAND_INTRO}
        durationInFrames={SCENE_DURATIONS.BRAND_INTRO}
        premountFor={premount}
        name="02 · 品牌出场"
      >
        <BrandIntro />
      </Sequence>

      <Sequence
        from={SCENE_STARTS.QUICK_INSTALL}
        durationInFrames={SCENE_DURATIONS.QUICK_INSTALL}
        premountFor={premount}
        name="03 · 快装"
      >
        <QuickInstall />
      </Sequence>

      <Sequence
        from={SCENE_STARTS.QUICK_COLLECT}
        durationInFrames={SCENE_DURATIONS.QUICK_COLLECT}
        premountFor={premount}
        name="04 · 快采"
      >
        <QuickCollect />
      </Sequence>

      <Sequence
        from={SCENE_STARTS.QUICK_USE}
        durationInFrames={SCENE_DURATIONS.QUICK_USE}
        premountFor={premount}
        name="05 · 快用"
      >
        <QuickUse />
      </Sequence>

      <Sequence
        from={SCENE_STARTS.METRICS}
        durationInFrames={SCENE_DURATIONS.METRICS}
        premountFor={premount}
        name="06 · 数字收割"
      >
        <MetricsHighlight />
      </Sequence>

      <Sequence
        from={SCENE_STARTS.BRAND_OUTRO}
        durationInFrames={SCENE_DURATIONS.BRAND_OUTRO}
        premountFor={premount}
        name="07 · 品牌收尾"
      >
        <BrandOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
