import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { TransitionPage } from "../components/TransitionPage";
import { VideoSection } from "../components/VideoSection";
import { SCENE_VIDEO_OFFSET } from "../constants/timing";

// Scene 09: 场景四 — 程序下发提效降本 — 1140 frames

export const Scene4Program: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const videoDuration = durationInFrames - SCENE_VIDEO_OFFSET;

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={SCENE_VIDEO_OFFSET} premountFor={fps}>
        <TransitionPage
          tag="场景四"
          tagEn="Scene 4"
          title="程序下发提效降本"
          body="云端一键下发加工程序至车床，无需 U 盘逐台导入。历史下发日志自动记录，工艺变更可查询回溯。"
          imageSrc="5.png"
        />
      </Sequence>
      <Sequence from={SCENE_VIDEO_OFFSET} durationInFrames={videoDuration} premountFor={fps}>
        <VideoSection
          src={undefined}
          label="程序读取 + 文件下发演示"
          labelEn="Program distribution demo — video pending"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
