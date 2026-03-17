import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { TransitionPage } from "../components/TransitionPage";
import { VideoSection } from "../components/VideoSection";
import { SCENE_VIDEO_OFFSET } from "../constants/timing";

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
          imageSrc="2.png"
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
