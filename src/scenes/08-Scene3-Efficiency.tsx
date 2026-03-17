import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { TransitionPage } from "../components/TransitionPage";
import { VideoSection } from "../components/VideoSection";
import { SCENE_VIDEO_OFFSET } from "../constants/timing";

// Scene 08: 场景三 — 生产效率数据化分析 — 1140 frames

export const Scene3Efficiency: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const videoDuration = durationInFrames - SCENE_VIDEO_OFFSET;

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={SCENE_VIDEO_OFFSET} premountFor={fps}>
        <TransitionPage
          tag="场景三"
          tagEn="Scene 3"
          title="生产效率数据化分析"
          body="按机床、班组自动生成日报，秒级追溯机器运行状态，零误差自动采集，每天节省约 2 小时人工统计时间。"
          imageSrc="4.png"
        />
      </Sequence>
      <Sequence from={SCENE_VIDEO_OFFSET} durationInFrames={videoDuration} premountFor={fps}>
        <VideoSection
          src={undefined}
          label="日报表 + 时间轴分析演示"
          labelEn="Production efficiency analysis — video pending"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
