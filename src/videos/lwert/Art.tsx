import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Bg, CharId, CHARS } from "./shots";

const PALETTES: Record<Bg, { top: string; bottom: string; line: string; glow: string }> = {
  salon: { top: "#5a1e1b", bottom: "#1f0b0a", line: "#d9a441", glow: "rgba(255,190,90,0.35)" },
  kitchen: { top: "#0f4a45", bottom: "#061d1b", line: "#e9d8a6", glow: "rgba(150,240,220,0.25)" },
  night: { top: "#18203d", bottom: "#07091a", line: "#c99a3b", glow: "rgba(255,180,80,0.30)" },
  dark: { top: "#140d0a", bottom: "#000000", line: "#8a6a2f", glow: "rgba(255,180,80,0.18)" },
};

// 8-point star (Moroccan zellige motif)
const Star: React.FC<{ x: number; y: number; r: number; color: string; o?: number }> = ({ x, y, r, color, o = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <rect x={-r} y={-r} width={2 * r} height={2 * r} fill="none" stroke={color} strokeWidth={4} />
    <rect x={-r} y={-r} width={2 * r} height={2 * r} fill="none" stroke={color} strokeWidth={4} transform="rotate(45)" />
  </g>
);

export const Background: React.FC<{ bg: Bg; frames: number }> = ({ bg, frames }) => {
  const frame = useCurrentFrame();
  const p = PALETTES[bg];
  const zoom = interpolate(frame, [0, frames], [1.0, 1.08]);
  const flicker = 0.85 + 0.15 * Math.sin(frame / 7) * Math.sin(frame / 3.3);
  const stars = [] as React.ReactNode[];
  for (let i = 0; i < 7; i++) {
    stars.push(<Star key={`a${i}`} x={i * 180} y={1790} r={52} color={p.line} o={0.35} />);
    stars.push(<Star key={`b${i}`} x={90 + i * 180} y={1880} r={38} color={p.line} o={0.25} />);
  }
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${p.top} 0%, ${p.bottom} 100%)` }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          {bg !== "dark" && (
            <>
              {/* horseshoe arch */}
              <path d="M150,1920 V860 A430,450 0 1,1 930,860 V1920" fill="rgba(0,0,0,0.25)" stroke={p.line} strokeWidth={10} opacity={0.75} />
              <path d="M190,1920 V870 A395,415 0 1,1 890,870 V1920" fill="none" stroke={p.line} strokeWidth={3} opacity={0.45} />
              {stars}
            </>
          )}
          {bg === "kitchen" &&
            [0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i} x={200 + i * 115} y={1560} width={90} height={90} fill="none" stroke={p.line} strokeWidth={3} opacity={0.3} transform={`rotate(45 ${245 + i * 115} 1605)`} />
            ))}
          {(bg === "salon" || bg === "night") && (
            <g transform="translate(540 0)" opacity={0.9}>
              <line x1={0} y1={0} x2={0} y2={50} stroke={p.line} strokeWidth={4} />
              <circle cx={0} cy={125} r={120} fill={p.glow} opacity={flicker} />
              <path d="M-40,50 L40,50 L58,120 L30,180 L-30,180 L-58,120 Z" fill="#2a1a0a" stroke={p.line} strokeWidth={5} />
              <path d="M-26,72 L26,72 L37,120 L19,162 L-19,162 L-37,120 Z" fill="#ffcf7a" opacity={0.75 * flicker} />
              <path d="M-18,180 L18,180 L0,205 Z" fill={p.line} />
            </g>
          )}
        </svg>
      </AbsoluteFill>
      {/* vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)" }} />
    </AbsoluteFill>
  );
};

export const Silhouette: React.FC<{ who: CharId; size?: number; style?: React.CSSProperties }> = ({ who, size = 300, style }) => {
  const c = CHARS[who];
  const skin = "#1a1310";
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 300 360" style={style}>
      <circle cx={150} cy={170} r={150} fill={c.color} opacity={0.12} />
      <path d="M30,360 C30,245 85,215 150,215 C215,215 270,245 270,360 Z" fill={skin} stroke={c.color} strokeWidth={6} />
      {c.female ? (
        <>
          <path d="M62,160 C62,40 238,40 238,160 C238,205 268,232 272,262 L28,262 C32,232 62,205 62,160 Z" fill={c.color} opacity={0.9} />
          <ellipse cx={150} cy={145} rx={56} ry={66} fill={skin} />
        </>
      ) : (
        <>
          <circle cx={150} cy={135} r={72} fill={skin} stroke={c.color} strokeWidth={6} />
          {who === "father" && (
            <>
              <path d="M98,88 L110,30 L190,30 L202,88 Z" fill="#b3261e" stroke={c.color} strokeWidth={4} />
              <path d="M188,32 Q222,50 214,96" stroke="#111" strokeWidth={6} fill="none" />
            </>
          )}
        </>
      )}
    </svg>
  );
};

export const Envelope: React.FC<{ w?: number }> = ({ w = 260 }) => (
  <svg width={w} height={w * 0.66} viewBox="0 0 300 200">
    <rect x={4} y={4} width={292} height={192} rx={10} fill="#f4e6c8" stroke="#a37a2c" strokeWidth={6} />
    <path d="M6,8 L150,115 L294,8" fill="none" stroke="#a37a2c" strokeWidth={6} />
    <circle cx={150} cy={115} r={24} fill="#a3201a" />
  </svg>
);
