import React from "react";
import { Composition } from "remotion";
import { MarhbaBikom } from "./videos/marhba-bikom/MarhbaBikom";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="marhba-bikom"
        component={MarhbaBikom}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
