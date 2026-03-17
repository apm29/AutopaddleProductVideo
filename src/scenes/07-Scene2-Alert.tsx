import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { TransitionPage } from "../components/TransitionPage";
import { VideoSection } from "../components/VideoSection";
import { SCENE_VIDEO_OFFSET } from "../constants/timing";

// Scene 07: 场景二 — 设备异常实时预警 — 1140 frames

export const Scene2Alert: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const videoDuration = durationInFrames - SCENE_VIDEO_OFFSET;

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={SCENE_VIDEO_OFFSET} premountFor={fps}>
        <TransitionPage
          tag="场景二"
          tagEn="Scene 2"
          title="设备异常实时预警"
          body="设备故障、超限、长时间空闲自动触发报警，辅助快速定位异常，缩短停机时间，降低生产损失。"
          imageSrc="3.png"
        />
      </Sequence>
      <Sequence from={SCENE_VIDEO_OFFSET} durationInFrames={videoDuration} premountFor={fps}>
        <VideoSection
          src={undefined}
          label="报警配置 + 报警处理演示"
          labelEn="Real-time alert demo — video pending"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
