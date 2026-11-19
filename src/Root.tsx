import React from "react";
import { Composition } from "remotion";
import { MarhbaBikom } from "./videos/marhba-bikom/MarhbaBikom";
import { Lwert } from "./videos/lwert/Lwert";
import { TOTAL_FRAMES } from "./videos/lwert/shots";
import { LwertReal, LWERT_REAL_FRAMES } from "./videos/lwert-real/LwertReal";

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
      <Composition
        id="lwert"
        component={Lwert}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="lwert-real"
        component={LwertReal}
        durationInFrames={LWERT_REAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
