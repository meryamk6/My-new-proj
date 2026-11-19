export type CharId = "father" | "youssef" | "samira" | "amina";
export type Bg = "salon" | "kitchen" | "night" | "dark";

export const CHARS: Record<
  CharId,
  { name: string; role: string; color: string; female: boolean }
> = {
  father: { name: "الحاج العربي", role: "الأب", color: "#f2b441", female: false },
  youssef: { name: "يوسف", role: "الولد الكبير", color: "#ef5b4c", female: false },
  samira: { name: "سميرة", role: "البنت", color: "#4fd1a1", female: true },
  amina: { name: "أمينة", role: "مرات يوسف", color: "#b794f6", female: true },
};

export type Shot =
  | { kind: "title"; sec: number; bg: Bg }
  | { kind: "cast"; sec: number; bg: Bg }
  | { kind: "chapter"; sec: number; bg: Bg; num: string; title: string; place?: string }
  | { kind: "line"; sec: number; bg: Bg; who: CharId; text: string }
  | { kind: "action"; sec: number; bg: Bg; text: string; who?: CharId }
  | { kind: "envelope"; sec: number; bg: Bg }
  | { kind: "closeup"; sec: number; bg: Bg }
  | { kind: "moral"; sec: number; bg: Bg };

export const SHOTS: Shot[] = [
  { kind: "title", sec: 3.5, bg: "salon" },
  { kind: "cast", sec: 4, bg: "salon" },

  { kind: "chapter", sec: 2, bg: "dark", num: "المشهد 1", title: "المواجهة", place: "فالصالون" },
  { kind: "line", sec: 3.5, bg: "salon", who: "youssef", text: "بابا، واش غادي تبقى شاد الدار حتى تموت؟" },
  { kind: "line", sec: 3, bg: "salon", who: "youssef", text: "حنا حتى حنا عندنا الحق فالورث!" },
  { kind: "line", sec: 4, bg: "salon", who: "father", text: "واش وليت كتسنى موت باك باش تعرف حقك؟" },

  { kind: "chapter", sec: 2, bg: "dark", num: "المشهد 2", title: "الخيانة", place: "فالمطبخ" },
  { kind: "line", sec: 4, bg: "kitchen", who: "amina", text: "إلا ما قسمش ليكم الورث دابا، غادي تبقاو حتى يفوت الفوت" },
  { kind: "line", sec: 3.5, bg: "kitchen", who: "youssef", text: "ما تخافيش، غادي نخليه يوقع على الأوراق اليوم" },
  { kind: "action", sec: 2.5, bg: "kitchen", who: "samira", text: "سميرة سمعات كلشي… ودخلات" },
  { kind: "line", sec: 3.5, bg: "kitchen", who: "samira", text: "عيب عليكم! هاد الراجل هو اللي رباكم،" },
  { kind: "line", sec: 3, bg: "kitchen", who: "samira", text: "ودابا كتسناو غير يموت؟" },

  { kind: "chapter", sec: 2, bg: "dark", num: "المشهد 3", title: "الصدمة", place: "الأب جمع ولادو" },
  { kind: "line", sec: 4, bg: "night", who: "father", text: "اليوم غادي نقول ليكم شكون يستاهل هاد الدار" },
  { kind: "action", sec: 2.5, bg: "night", who: "youssef", text: "يوسف جالس فرحان… معتقد الدار ديالو" },
  { kind: "envelope", sec: 3.5, bg: "night" },
  { kind: "line", sec: 3.5, bg: "night", who: "youssef", text: "علاش هي؟ واش حنا ماشي ولادك؟" },
  { kind: "line", sec: 4, bg: "night", who: "father", text: "ملي كنت مريض وما قادرش نوقف على رجليا،" },
  { kind: "line", sec: 3, bg: "night", who: "father", text: "كنتو كاملين كتقلبو على الورث…" },
  { kind: "line", sec: 4, bg: "night", who: "father", text: "وهي الوحيدة اللي كانت كتقلب على دوايا" },

  { kind: "chapter", sec: 2, bg: "dark", num: "المشهد 4", title: "النهاية" },
  { kind: "action", sec: 2.5, bg: "night", who: "youssef", text: "يوسف كيبكي… وكيطلب السماح" },
  { kind: "line", sec: 4, bg: "night", who: "father", text: "أنا ما كنتش كنقلب على ولد يرث الدار…" },
  { kind: "line", sec: 4, bg: "night", who: "father", text: "كنت كنقلب على ولد يخاف عليا قبل ما نموت" },
  { kind: "closeup", sec: 3.5, bg: "night" },
  { kind: "moral", sec: 4, bg: "dark" },
];

export const FPS = 30;
export const shotFrames = (s: Shot) => Math.round(s.sec * FPS);
export const TOTAL_FRAMES = SHOTS.reduce((a, s) => a + shotFrames(s), 0);
