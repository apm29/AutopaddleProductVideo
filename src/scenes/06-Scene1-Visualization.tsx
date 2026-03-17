import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { TransitionPage } from "../components/TransitionPage";
import { VideoSection } from "../components/VideoSection";
import { SCENE_VIDEO_OFFSET } from "../constants/timing";

// Scene 06: 场景一 — 设备状态远程可视化管理 — 1140 frames

export const Scene1Visualization: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const videoDuration = durationInFrames - SCENE_VIDEO_OFFSET;

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={SCENE_VIDEO_OFFSET} premountFor={fps}>
        <TransitionPage
          tag="场景一"
          tagEn="Scene 1"
          title="设备状态远程可视化管理"
          body="实时掌握所有设备的运行状态，PC 端大屏与手机端同步查看，随时随地了解车间动态。"
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
