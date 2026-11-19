import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Cairo";

const { fontFamily } = loadFont("normal", {
  weights: ["700", "900"],
  subsets: ["arabic"],
});

// Set to true if public/logo.png exists (shown in the last scene).
const SHOW_LOGO = false;

export const MarhbaBikom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: { damping: 12 } });
  const sub = spring({ frame: frame - 75, fps, config: { damping: 14 } });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 10, durationInFrames],
    [1, 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      dir="rtl"
      style={{
        background: "linear-gradient(160deg, #0f766e 0%, #134e4a 55%, #052e2b 100%)",
        fontFamily,
        color: "white",
        // Safe zone: keep text out of top/bottom 250px.
        paddingTop: 250,
        paddingBottom: 250,
        paddingLeft: 80,
        paddingRight: 80,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        opacity: fadeOut,
      }}
    >
      <div
        style={{
          fontSize: 170,
          fontWeight: 900,
          lineHeight: 1.3,
          transform: `scale(${0.6 + 0.4 * titleIn})`,
          opacity: titleIn,
          textShadow: "0 8px 30px rgba(0,0,0,0.35)",
        }}
      >
        مرحبا بيكم
      </div>
      <div
        style={{
          marginTop: 40,
          fontSize: 80,
          fontWeight: 700,
          color: "#fde68a",
          opacity: sub,
          transform: `translateY(${(1 - sub) * 80}px)`,
        }}
      >
        فالستوديو ديالنا
      </div>
      {SHOW_LOGO && (
        <Img
          src={staticFile("logo.png")}
          style={{ marginTop: 60, width: 220, opacity: sub }}
        />
      )}
    </AbsoluteFill>
  );
};
