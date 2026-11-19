import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Cairo";
import { Background, Envelope, Silhouette } from "./Art";
import { Bg, CharId, CHARS, Shot, SHOTS, shotFrames } from "./shots";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["arabic"],
});

// Set to true once public/logo.png exists (shown in the last scene).
const SHOW_LOGO = false;

const GOLD = "#f2c46b";
const shadow = "0 6px 24px rgba(0,0,0,0.7)";

const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 14, mass: 0.8 } });
};

const useShotFade = (frames: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, 5, frames - 5, frames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

// Everything text-related stays inside y=250..1670 (app UI safe zone).
const Safe: React.FC<{ children: React.ReactNode; justify?: React.CSSProperties["justifyContent"] }> = ({ children, justify = "center" }) => (
  <AbsoluteFill
    dir="rtl"
    style={{
      top: 250,
      bottom: 250,
      height: "auto",
      paddingLeft: 70,
      paddingRight: 70,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: justify,
      textAlign: "center",
      fontFamily,
      color: "white",
    }}
  >
    {children}
  </AbsoluteFill>
);

const TitleShot: React.FC = () => {
  const a = useEnter(0);
  const b = useEnter(18);
  return (
    <Safe>
      <div style={{ fontSize: 46, color: GOLD, fontWeight: 700, opacity: b, letterSpacing: 2 }}>فيلم مغربي قصير</div>
      <div
        style={{
          fontSize: 150,
          fontWeight: 900,
          lineHeight: 1.25,
          marginTop: 20,
          textShadow: shadow,
          opacity: a,
          transform: `scale(${0.75 + 0.25 * a})`,
        }}
      >
        الورث
        <br />
        <span style={{ fontSize: 108, color: GOLD }}>اللي فرّق العائلة</span>
      </div>
    </Safe>
  );
};

const CastShot: React.FC = () => {
  const ids: CharId[] = ["father", "youssef", "samira", "amina"];
  return (
    <Safe>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 40, rowGap: 70 }}>
        {ids.map((id, i) => (
          <CastCard key={id} id={id} delay={i * 6} />
        ))}
      </div>
    </Safe>
  );
};

const CastCard: React.FC<{ id: CharId; delay: number }> = ({ id, delay }) => {
  const e = useEnter(delay);
  const c = CHARS[id];
  return (
    <div style={{ width: 420, display: "flex", flexDirection: "column", alignItems: "center", opacity: e, transform: `translateY(${(1 - e) * 60}px)` }}>
      <Silhouette who={id} size={250} />
      <div style={{ fontSize: 80, fontWeight: 900, color: c.color, lineHeight: 1.3, textShadow: shadow }}>{c.name}</div>
      <div style={{ fontSize: 46, fontWeight: 700, opacity: 0.85 }}>{c.role}</div>
    </div>
  );
};

const ChapterShot: React.FC<{ num: string; title: string; place?: string }> = ({ num, title, place }) => {
  const a = useEnter(0);
  const b = useEnter(8);
  return (
    <Safe>
      <div style={{ fontSize: 56, color: GOLD, fontWeight: 700, opacity: a }}>{num}</div>
      <div style={{ width: 300 * a, height: 4, background: GOLD, margin: "24px 0" }} />
      <div style={{ fontSize: 160, fontWeight: 900, lineHeight: 1.3, textShadow: shadow, opacity: b, transform: `scale(${0.85 + 0.15 * b})` }}>{title}</div>
      {place && <div style={{ fontSize: 56, fontWeight: 700, opacity: 0.8 * b, marginTop: 10 }}>{place}</div>}
    </Safe>
  );
};

const LineShot: React.FC<{ who: CharId; text: string }> = ({ who, text }) => {
  const s = useEnter(0);
  const t = useEnter(6);
  const c = CHARS[who];
  return (
    <Safe>
      <div style={{ opacity: s, transform: `translateY(${(1 - s) * -40}px)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Silhouette who={who} size={300} />
        <div style={{ fontSize: 64, fontWeight: 900, color: c.color, marginTop: 6, textShadow: shadow }}>{c.name}</div>
      </div>
      <div
        style={{
          marginTop: 40,
          padding: "36px 46px",
          borderRadius: 36,
          background: "rgba(0,0,0,0.55)",
          borderRight: `10px solid ${c.color}`,
          fontSize: 86,
          fontWeight: 900,
          lineHeight: 1.45,
          opacity: t,
          transform: `scale(${0.9 + 0.1 * t})`,
          textShadow: shadow,
        }}
      >
        «{text}»
      </div>
    </Safe>
  );
};

const ActionShot: React.FC<{ text: string; who?: CharId }> = ({ text, who }) => {
  const a = useEnter(0);
  const b = useEnter(8);
  return (
    <Safe>
      {who && (
        <div style={{ opacity: a, transform: `scale(${0.8 + 0.2 * a})` }}>
          <Silhouette who={who} size={380} />
        </div>
      )}
      <div style={{ marginTop: 40, fontSize: 84, fontWeight: 700, lineHeight: 1.45, color: "#f5ead6", opacity: b, textShadow: shadow }}>{text}</div>
    </Safe>
  );
};

const EnvelopeShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = useEnter(0);
  const move = spring({ frame: frame - 18, fps, config: { damping: 18, mass: 1.2 } });
  // RTL: father on the right, Samira on the left.
  const x = interpolate(move, [0, 1], [200, -200]);
  const y = -Math.sin(move * Math.PI) * 140;
  return (
    <Safe justify="flex-start">
      <div style={{ marginTop: 60, fontSize: 84, fontWeight: 900, lineHeight: 1.4, opacity: a, textShadow: shadow }}>
        الأب كيعطي الظرف…
        <br />
        <span style={{ color: CHARS.samira.color }}>لسميرة</span>
      </div>
      <div style={{ position: "relative", width: "100%", height: 700, marginTop: 60 }}>
        <div style={{ position: "absolute", right: 0, bottom: 0, opacity: a }}>
          <Silhouette who="father" size={360} />
        </div>
        <div style={{ position: "absolute", left: 0, bottom: 0, opacity: a }}>
          <Silhouette who="samira" size={360} />
        </div>
        <div style={{ position: "absolute", left: "50%", top: 470, transform: `translate(calc(-50% + ${x}px), ${y}px) rotate(${-8 + move * 16}deg)`, opacity: a }}>
          <Envelope w={200} />
        </div>
      </div>
    </Safe>
  );
};

const CloseupShot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.25]);
  const sam = spring({ frame: frame - 20, fps, config: { damping: 16 } });
  const txt = useEnter(10);
  return (
    <Safe justify="flex-start">
      <div style={{ marginTop: 40, fontSize: 80, fontWeight: 900, lineHeight: 1.4, opacity: txt, textShadow: shadow }}>
        سميرة كتشد باباها
        <br />
        من يدو
      </div>
      <div style={{ position: "relative", width: "100%", height: 760, marginTop: 40 }}>
        <div style={{ position: "absolute", right: 60, bottom: 0, transform: `scale(${zoom})`, transformOrigin: "bottom center" }}>
          <Silhouette who="father" size={460} />
        </div>
        <div style={{ position: "absolute", left: 40, bottom: 0, opacity: sam, transform: `translateX(${(1 - sam) * -200}px)` }}>
          <Silhouette who="samira" size={360} />
        </div>
      </div>
    </Safe>
  );
};

const MoralShot: React.FC = () => {
  const a = useEnter(0);
  const b = useEnter(22);
  const c = useEnter(55);
  return (
    <Safe>
      <div style={{ fontSize: 90, fontWeight: 900, lineHeight: 1.5, opacity: a, textShadow: shadow }}>
        هوما كانو كيحسبو شحال غادي ياخدو…
      </div>
      <div style={{ fontSize: 100, fontWeight: 900, lineHeight: 1.5, color: GOLD, opacity: b, transform: `scale(${0.85 + 0.15 * b})`, textShadow: shadow }}>
        وهي كانت كتحسب شحال باقي ليها معاه
      </div>
      <div style={{ marginTop: 60, fontSize: 48, fontWeight: 700, opacity: 0.7 * c }}>— النهاية —</div>
      {SHOW_LOGO && <Img src={staticFile("logo.png")} style={{ marginTop: 40, width: 200, opacity: c }} />}
    </Safe>
  );
};

const ShotView: React.FC<{ shot: Shot; frames: number }> = ({ shot, frames }) => {
  const fade = useShotFade(frames);
  let inner: React.ReactNode = null;
  switch (shot.kind) {
    case "title": inner = <TitleShot />; break;
    case "cast": inner = <CastShot />; break;
    case "chapter": inner = <ChapterShot num={shot.num} title={shot.title} place={shot.place} />; break;
    case "line": inner = <LineShot who={shot.who} text={shot.text} />; break;
    case "action": inner = <ActionShot text={shot.text} who={shot.who} />; break;
    case "envelope": inner = <EnvelopeShot />; break;
    case "closeup": inner = <CloseupShot />; break;
    case "moral": inner = <MoralShot />; break;
  }
  return <AbsoluteFill style={{ opacity: fade }}>{inner}</AbsoluteFill>;
};

// Group consecutive shots with the same background so it doesn't flash between shots.
const bgGroups = () => {
  const groups: { bg: Bg; from: number; frames: number }[] = [];
  let t = 0;
  for (const s of SHOTS) {
    const f = shotFrames(s);
    const last = groups[groups.length - 1];
    if (last && last.bg === s.bg) last.frames += f;
    else groups.push({ bg: s.bg, from: t, frames: f });
    t += f;
  }
  return groups;
};

const BgFade: React.FC<{ bg: Bg; frames: number }> = ({ bg, frames }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Background bg={bg} frames={frames} />
    </AbsoluteFill>
  );
};

export const Lwert: React.FC = () => {
  let t = 0;
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {bgGroups().map((g, i) => (
        <Sequence key={`bg${i}`} from={g.from} durationInFrames={g.frames}>
          <BgFade bg={g.bg} frames={g.frames} />
        </Sequence>
      ))}
      {SHOTS.map((s, i) => {
        const f = shotFrames(s);
        const from = t;
        t += f;
        return (
          <Sequence key={i} from={from} durationInFrames={f}>
            <ShotView shot={s} frames={f} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
