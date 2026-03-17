import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { TransitionPage } from "../components/TransitionPage";
import { VideoSection } from "../components/VideoSection";
import { SCENE_VIDEO_OFFSET } from "../constants/timing";

// Scene 07: 场景二 — 生产数据报表应用生成 — 1140 frames

export const Scene2Alert: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const videoDuration = durationInFrames - SCENE_VIDEO_OFFSET;

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={SCENE_VIDEO_OFFSET} premountFor={fps}>
        <TransitionPage
          tag="场景二"
          tagEn="Scene 2"
          title="生产数据报表应用生成"
          body="AI 自动生成生产数据报表应用，按机床、班组统计加工指标，支持数据筛选与时间轴分析，个性化日报、周报一键生成。"
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
