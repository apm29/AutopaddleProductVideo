import "./index.css";
import { Composition } from "remotion";
import { QingTingVideo } from "./compositions/QingTingVideo";
import { TOTAL_FRAMES } from "./constants/timing";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="QingTingVideo"
        component={QingTingVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
