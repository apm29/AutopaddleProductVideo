import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { COLORS } from "../constants/colors";
import { SCENE_DURATIONS, SCENE_STARTS } from "../constants/timing";
import { Cover } from "../scenes/01-Cover";
import { QuickInstall } from "../scenes/02-QuickInstall";
import { QuickCollect } from "../scenes/03-QuickCollect";
import { QuickUse } from "../scenes/04-QuickUse";
import { CaseIntro } from "../scenes/05-CaseIntro";
import { Scene1Visualization } from "../scenes/06-Scene1-Visualization";
import { Scene2Alert } from "../scenes/07-Scene2-Alert";
import { Scene3Efficiency } from "../scenes/08-Scene3-Efficiency";
import { BrandOutro } from "../scenes/10-BrandOutro";

// Main composition

export const QingTingVideo: React.FC = () => {
  const { fps } = useVideoConfig();
  const premount = fps; // 1s premount

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgPrimary }}>
      <Sequence
        from={SCENE_STARTS.COVER}
        durationInFrames={SCENE_DURATIONS.COVER}
        premountFor={premount}
        name="01 · 封面"
      >
        <Cover />
      </Sequence>

      <Sequence
        from={SCENE_STARTS.QUICK_INSTALL}
        durationInFrames={SCENE_DURATIONS.QUICK_INSTALL}
        premountFor={premount}
        name="02 · 快装"
      >
        <QuickInstall />
      </Sequence>

      <Sequence
        from={SCENE_STARTS.QUICK_COLLECT}
        durationInFrames={SCENE_DURATIONS.QUICK_COLLECT}
        premountFor={premount}
        name="03 · 快采"
      >
        <QuickCollect />
      </Sequence>

      <Sequence
        from={SCENE_STARTS.QUICK_USE}
        durationInFrames={SCENE_DURATIONS.QUICK_USE}
        premountFor={premount}
        name="04 · 快用"
      >
        <QuickUse />
      </Sequence>

      <Sequence
        from={SCENE_STARTS.CASE_INTRO}
        durationInFrames={SCENE_DURATIONS.CASE_INTRO}
        premountFor={premount}
        name="05 · 案例介绍"
      >
        <CaseIntro />
      </Sequence>

      <Sequence
        from={SCENE_STARTS.SCENE1}
        durationInFrames={SCENE_DURATIONS.SCENE1}
        premountFor={premount}
        name="06 · 场景一：设备状态管理"
      >
        <Scene1Visualization />
      </Sequence>

      <Sequence
        from={SCENE_STARTS.SCENE2}
        durationInFrames={SCENE_DURATIONS.SCENE2}
        premountFor={premount}
        name="07 · 场景二：生产数据报表"
      >
        <Scene2Alert />
      </Sequence>

      <Sequence
        from={SCENE_STARTS.SCENE3}
        durationInFrames={SCENE_DURATIONS.SCENE3}
        premountFor={premount}
        name="08 · 场景三：设备能力深度对接"
      >
        <Scene3Efficiency />
      </Sequence>

      <Sequence
        from={SCENE_STARTS.BRAND_OUTRO}
        durationInFrames={SCENE_DURATIONS.BRAND_OUTRO}
        premountFor={premount}
        name="10 · 品牌收尾"
      >
        <BrandOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
