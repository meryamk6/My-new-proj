import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Cairo";

const { fontFamily } = loadFont("normal", { weights: ["900"], subsets: ["arabic"] });

const FPS = 30;
// The CellCog draft's own closing shot crops both faces, so we cut at 12.1s
// and close on the corrected two-shot still instead.
export const CUT = Math.round(12.1 * FPS);
export const ENDING = Math.round(5 * FPS);
export const LWERT_REAL_FRAMES = CUT + ENDING;

const Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const zoom = interpolate(frame, [0, ENDING], [1.0, 1.1]);
  const a = spring({ frame: frame - 15, fps, config: { damping: 14 } });
  const b = spring({ frame: frame - 35, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ opacity: fadeIn, background: "black" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 40%" }}>
        <Img src={staticFile("lwert-real/two_shot.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 80%)" }} />
      <AbsoluteFill
        dir="rtl"
        style={{
          // Reels safe zone (ffmpeg-skill _platforms.py): top 8%, bottom 20%, right 12%, left 5%.
          top: 250,
          bottom: 420,
          height: "auto",
          justifyContent: "flex-end",
          alignItems: "center",
          textAlign: "center",
          padding: "0 150px 0 70px",
          fontFamily,
          fontWeight: 900,
          color: "white",
          textShadow: "0 6px 24px rgba(0,0,0,0.85)",
        }}
      >
        <div style={{ fontSize: 80, lineHeight: 1.45, opacity: a, transform: `translateY(${(1 - a) * 40}px)` }}>
          الورث الحقيقي<br />ماشي الدار…
        </div>
        <div style={{ fontSize: 84, lineHeight: 1.45, color: "#f2c46b", opacity: b, transform: `translateY(${(1 - b) * 40}px)` }}>
          هو الرحمة اللي كتخلي<br />في قلب ولادك
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const LwertReal: React.FC = () => (
  <AbsoluteFill style={{ background: "black" }}>
    <Sequence durationInFrames={CUT}>
      <OffthreadVideo src={staticFile("lwert-real/scene_hd.mp4")} style={{ width: "100%", height: "100%" }} />
    </Sequence>
    <Sequence from={CUT} durationInFrames={ENDING}>
      <Ending />
    </Sequence>
  </AbsoluteFill>
);
