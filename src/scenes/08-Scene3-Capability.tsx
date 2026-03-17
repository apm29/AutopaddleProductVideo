import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { TransitionPage } from "../components/TransitionPage";
import { VideoSection } from "../components/VideoSection";
import { SCENE_VIDEO_OFFSET } from "../constants/timing";

// Scene 08: 场景三 — 设备能力深度对接应用生成 — 1140 frames

export const Scene3Capability: React.FC = () => {
  const { durationInFrames, fps } = useVideoConfig();
  const videoDuration = durationInFrames - SCENE_VIDEO_OFFSET;

  return (
    <AbsoluteFill>
      <Sequence durationInFrames={SCENE_VIDEO_OFFSET} premountFor={fps}>
        <TransitionPage
          tag="场景三"
          tagEn="Scene 3"
          title="设备能力深度对接应用生成"
          body="自动对接机床生产进度与工艺文件接口，AI 分析优化任务排程，工艺文件统一下发管理，替代 U 盘逐台导入，变更可查询回溯。"
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
