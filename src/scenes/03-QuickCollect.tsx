import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { TransitionPage } from "../components/TransitionPage";
import { VideoSection } from "../components/VideoSection";
import { SCENE_VIDEO_OFFSET } from "../constants/timing";

// Scene 03: 快采 — 1140 frames (38s)

export const QuickCollect: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const videoDuration = durationInFrames - SCENE_VIDEO_OFFSET;

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={SCENE_VIDEO_OFFSET} premountFor={fps}>
        <TransitionPage
          title="快采"
          body="预置万种主流设备配置，覆盖常见设备与系统接入场景。全程 AI 引导，跟着做就能对接上线，省去找专家、反复试错的时间。"
          layout="text-only"
        />
      </Sequence>
      <Sequence from={SCENE_VIDEO_OFFSET} durationInFrames={videoDuration} premountFor={fps}>
        <VideoSection
          src={undefined}
          label="快采配置录像"
          labelEn="Device onboarding walkthrough — video pending"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
