import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { TransitionPage } from "../components/TransitionPage";
import { VideoSection } from "../components/VideoSection";
import { SCENE_VIDEO_OFFSET } from "../constants/timing";

// Scene 04: 快用 — 1590 frames (53s)

export const QuickUse: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const videoDuration = durationInFrames - SCENE_VIDEO_OFFSET;

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={SCENE_VIDEO_OFFSET} premountFor={fps}>
        <TransitionPage
          title="快用"
          body={'一句话生成 AI 应用，所想即所得：看板、报表、预警、业务小工具自动生成并部署。数据从「采到」直接变成「用到」。'}
          layout="text-only"
        />
      </Sequence>
      <Sequence from={SCENE_VIDEO_OFFSET} durationInFrames={videoDuration} premountFor={fps}>
        <VideoSection
          src={undefined}
          label="快用演示录像"
          labelEn="AI app generation walkthrough — video pending"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
