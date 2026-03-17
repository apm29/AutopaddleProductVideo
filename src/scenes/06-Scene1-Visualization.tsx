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
          body="通过 AI 一句话生成设备状态监控应用，实时掌握车间所有设备运行状态，PC 端与手机端同步查看，故障预警自动触发。"
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
