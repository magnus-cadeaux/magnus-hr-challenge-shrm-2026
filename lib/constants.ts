export const APP_NAME = "Magnus HR Challenge" as const;
export const EVENT_NAME = "SHRM Hyderabad 2026" as const;
export const APP_TAGLINE =
  "A premium exhibition experience for senior HR leaders." as const;

export const ROUTES = {
  home: "/",
  register: "/register",
  arena: "/arena",
  challenge: "/challenge",
  analysis: "/analysis",
  signature: "/signature",
  reward: "/reward",
  leaderboard: "/leaderboard",
  thankYou: "/thank-you",
  sales: "/sales",
  admin: "/admin",
  adminScan: "/admin/scan",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

export const QUERY_KEYS = {
  participant: "participant",
  challenge: "challenge",
  analysis: "analysis",
  leaderboard: "leaderboard",
  session: "session",
} as const;

export const STORAGE_KEYS = {
  participantDraft: "magnus.participant.draft",
  sessionId: "magnus.session.id",
  theme: "magnus.theme",
  challengeSession: "magnus.challenge.session",
  signatureProfile: "magnus.signature.profile",
  leadIntelligence: "magnus.sales.lead-intelligence",
  rewardAssignment: "magnus.reward.assignment",
  salesNotes: "magnus.sales.notes",
  salesConversationComplete: "magnus.sales.conversation-complete",
  questionBank: "magnus.admin.question-bank",
  /** Soft duplicate-play log keyed by event day (phone/email). */
  playLog: "magnus.registration.play-log",
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  ipad: 768,
  lg: 1024,
  ipadPro: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const MOTION = {
  instant: 0.08,
  fast: 0.15,
  base: 0.25,
  slow: 0.45,
  reveal: 0.7,
  dramatic: 1,
} as const;
