import type { ChallengeQuestionConfig } from "../engine/types";

/**
 * Mock question bank (20). Engine randomly loads 6 per session.
 * Expand this config — do not hardcode questions in UI components.
 */
export const QUESTION_BANK: ChallengeQuestionConfig[] = [
  {
    id: "q-ex-01",
    type: "multiple_choice",
    category: "employee_experience",
    prompt:
      "A new hire’s first week feels fragmented across tools and teams. What do you prioritise first?",
    insight:
      "Interesting choice. Employee experience is often shaped by small decisions in the first mile.",
    options: [
      {
        id: "q-ex-01-a",
        label: "A single guided journey with clear ownership",
        impacts: { empathy: 3, execution: 2, culture: 1 },
      },
      {
        id: "q-ex-01-b",
        label: "More tools so every team can customise locally",
        impacts: { innovation: 2, execution: 1 },
      },
      {
        id: "q-ex-01-c",
        label: "A welcome event and leave the rest to managers",
        impacts: { culture: 2, recognition: 1 },
      },
      {
        id: "q-ex-01-d",
        label: "Wait for feedback before changing anything",
        impacts: { culture: 1, empathy: 1 },
      },
    ],
  },
  {
    id: "q-rec-01",
    type: "multiple_choice",
    category: "recognition",
    prompt:
      "Recognition feels uneven across departments. Where do you invest first?",
    insight:
      "Many growing organisations prioritise consistency over novelty in recognition.",
    options: [
      {
        id: "q-rec-01-a",
        label: "A shared recognition rhythm leaders can actually keep",
        impacts: { recognition: 3, culture: 2, execution: 1 },
      },
      {
        id: "q-rec-01-b",
        label: "A high-visibility awards gala",
        impacts: { recognition: 2, culture: 1 },
      },
      {
        id: "q-rec-01-c",
        label: "Peer points with optional redemption",
        impacts: { recognition: 2, innovation: 2 },
      },
      {
        id: "q-rec-01-d",
        label: "Leave recognition entirely to managers",
        impacts: { execution: 1 },
      },
    ],
  },
  {
    id: "q-gift-01",
    type: "multiple_choice",
    category: "corporate_gifting",
    prompt:
      "Festival gifting is approaching. Your teams want speed and personality. What wins?",
    insight:
      "Corporate gifting works best when it feels personal without creating operational chaos.",
    options: [
      {
        id: "q-gift-01-a",
        label: "Curated choices with clear budgets and timelines",
        impacts: { recognition: 2, execution: 3, empathy: 1 },
      },
      {
        id: "q-gift-01-b",
        label: "One identical premium gift for everyone",
        impacts: { execution: 2, culture: 1 },
      },
      {
        id: "q-gift-01-c",
        label: "Let every team invent their own approach",
        impacts: { innovation: 2, culture: 1 },
      },
      {
        id: "q-gift-01-d",
        label: "Skip physical gifts and send a message",
        impacts: { sustainability: 2, empathy: 1 },
      },
    ],
  },
  {
    id: "q-sus-01",
    type: "true_false",
    category: "sustainability",
    prompt:
      "Sustainable employee programmes only matter if they reduce immediate cost.",
    insight:
      "Sustainability in HR is often a trust signal as much as a cost lever.",
    options: [
      {
        id: "q-sus-01-a",
        label: "True",
        impacts: { execution: 2 },
      },
      {
        id: "q-sus-01-b",
        label: "False",
        impacts: { sustainability: 3, culture: 2, empathy: 1 },
      },
    ],
  },
  {
    id: "q-vendor-01",
    type: "multiple_choice",
    category: "vendor_management",
    prompt:
      "Three vendors can deliver your rewards programme. What decides the partner?",
    insight:
      "Vendor strength shows up in the moments employees actually feel—not the slide deck.",
    options: [
      {
        id: "q-vendor-01-a",
        label: "Reliability, clarity, and employee-facing quality",
        impacts: { execution: 3, empathy: 2, recognition: 1 },
      },
      {
        id: "q-vendor-01-b",
        label: "The lowest bid",
        impacts: { execution: 1 },
      },
      {
        id: "q-vendor-01-c",
        label: "The boldest marketing story",
        impacts: { innovation: 2, culture: 1 },
      },
      {
        id: "q-vendor-01-d",
        label: "Whoever leadership already knows",
        impacts: { culture: 1 },
      },
    ],
  },
  {
    id: "q-future-01",
    type: "opinion_scale",
    category: "future_of_hr",
    prompt:
      "How ready is your organisation to treat employee experience as a product?",
    insight:
      "The future of HR favours leaders who design systems, not just policy.",
    options: [
      { id: "q-future-01-1", label: "1 · Not ready", impacts: { culture: 1 } },
      {
        id: "q-future-01-2",
        label: "2 · Exploring",
        impacts: { innovation: 1, culture: 1 },
      },
      {
        id: "q-future-01-3",
        label: "3 · Building",
        impacts: { innovation: 2, execution: 1 },
      },
      {
        id: "q-future-01-4",
        label: "4 · Embedding",
        impacts: { innovation: 2, execution: 2, culture: 1 },
      },
      {
        id: "q-future-01-5",
        label: "5 · Leading",
        impacts: { innovation: 3, execution: 2, culture: 2 },
      },
    ],
  },
  {
    id: "q-ex-02",
    type: "true_false",
    category: "employee_experience",
    prompt:
      "A seamless experience matters more on day 30 than on day 1.",
    insight:
      "Both moments matter—but day 1 sets the emotional baseline employees remember.",
    options: [
      {
        id: "q-ex-02-a",
        label: "True",
        impacts: { execution: 2, culture: 1 },
      },
      {
        id: "q-ex-02-b",
        label: "False",
        impacts: { empathy: 3, culture: 2 },
      },
    ],
  },
  {
    id: "q-rec-02",
    type: "opinion_scale",
    category: "recognition",
    prompt: "Meaningful recognition should feel frequent enough to stay visible.",
    insight:
      "Recognition loses power when it becomes rare, delayed, or generic.",
    options: [
      { id: "q-rec-02-1", label: "1 · Strongly disagree", impacts: { culture: 1 } },
      { id: "q-rec-02-2", label: "2 · Disagree", impacts: { recognition: 1 } },
      {
        id: "q-rec-02-3",
        label: "3 · Neutral",
        impacts: { recognition: 1, culture: 1 },
      },
      {
        id: "q-rec-02-4",
        label: "4 · Agree",
        impacts: { recognition: 2, culture: 2 },
      },
      {
        id: "q-rec-02-5",
        label: "5 · Strongly agree",
        impacts: { recognition: 3, culture: 2, empathy: 1 },
      },
    ],
  },
  {
    id: "q-gift-02",
    type: "image_choice",
    category: "corporate_gifting",
    prompt: "Which gifting direction feels most on-brand for a modern enterprise?",
    insight:
      "Image and intent must match—employees sense when gifting is performative.",
    options: [
      {
        id: "q-gift-02-a",
        label: "Thoughtful utility with quiet premium detail",
        imageSrc: "/images/placeholders/gift-utility.svg",
        impacts: { recognition: 2, empathy: 2, execution: 1 },
      },
      {
        id: "q-gift-02-b",
        label: "Loud status symbol with heavy branding",
        imageSrc: "/images/placeholders/gift-status.svg",
        impacts: { culture: 1, recognition: 1 },
      },
      {
        id: "q-gift-02-c",
        label: "Experiential note with a simple keepsake",
        imageSrc: "/images/placeholders/gift-experience.svg",
        impacts: { innovation: 2, empathy: 2, recognition: 1 },
      },
      {
        id: "q-gift-02-d",
        label: "Digital-only voucher blast",
        imageSrc: "/images/placeholders/gift-digital.svg",
        impacts: { execution: 2, sustainability: 1 },
      },
    ],
  },
  {
    id: "q-rank-01",
    type: "priority_ranking",
    category: "employee_experience",
    prompt:
      "Rank what you would protect first when employee experience budgets tighten.",
    insight:
      "Ranking reveals your operating philosophy when trade-offs become real.",
    options: [
      {
        id: "q-rank-01-a",
        label: "Onboarding clarity",
        impacts: { empathy: 1, execution: 1 },
      },
      {
        id: "q-rank-01-b",
        label: "Recognition moments",
        impacts: { recognition: 1, culture: 1 },
      },
      {
        id: "q-rank-01-c",
        label: "Manager enablement",
        impacts: { culture: 1, execution: 1 },
      },
      {
        id: "q-rank-01-d",
        label: "Wellbeing support",
        impacts: { empathy: 1, sustainability: 1 },
      },
    ],
  },
  {
    id: "q-sus-02",
    type: "multiple_choice",
    category: "sustainability",
    prompt:
      "You’re redesigning celebration kits. What sustainability move is most credible?",
    insight:
      "Credibility comes from material choices employees can see and believe.",
    options: [
      {
        id: "q-sus-02-a",
        label: "Fewer, better items with responsible sourcing",
        impacts: { sustainability: 3, recognition: 2, empathy: 1 },
      },
      {
        id: "q-sus-02-b",
        label: "More items to make the box feel full",
        impacts: { recognition: 1 },
      },
      {
        id: "q-sus-02-c",
        label: "Plastic packaging with a green slogan",
        impacts: { culture: 1 },
      },
      {
        id: "q-sus-02-d",
        label: "Remove gifts entirely",
        impacts: { sustainability: 2, execution: 1 },
      },
    ],
  },
  {
    id: "q-vendor-02",
    type: "true_false",
    category: "vendor_management",
    prompt:
      "A vendor relationship should be judged primarily by SLA metrics on a dashboard.",
    insight:
      "Dashboards help—but employee sentiment is the ultimate service score.",
    options: [
      {
        id: "q-vendor-02-a",
        label: "True",
        impacts: { execution: 2 },
      },
      {
        id: "q-vendor-02-b",
        label: "False",
        impacts: { empathy: 2, recognition: 2, culture: 1 },
      },
    ],
  },
  {
    id: "q-future-02",
    type: "multiple_choice",
    category: "future_of_hr",
    prompt:
      "AI can draft policies overnight. What should HR protect as uniquely human?",
    insight:
      "Technology scales tasks; leaders still set meaning, fairness, and trust.",
    options: [
      {
        id: "q-future-02-a",
        label: "Judgement, care, and contextual decisions",
        impacts: { empathy: 3, culture: 2, innovation: 1 },
      },
      {
        id: "q-future-02-b",
        label: "Faster document production only",
        impacts: { execution: 2, innovation: 1 },
      },
      {
        id: "q-future-02-c",
        label: "Replacing managers wherever possible",
        impacts: { innovation: 2 },
      },
      {
        id: "q-future-02-d",
        label: "Nothing—automate everything",
        impacts: { innovation: 1 },
      },
    ],
  },
  {
    id: "q-rec-03",
    type: "multiple_choice",
    category: "recognition",
    prompt:
      "A high performer feels invisible after a major launch. Your first move?",
    insight:
      "Timely specificity beats delayed ceremony when someone has stretched.",
    options: [
      {
        id: "q-rec-03-a",
        label: "Personal, timely acknowledgement from leadership",
        impacts: { recognition: 3, empathy: 2, culture: 1 },
      },
      {
        id: "q-rec-03-b",
        label: "Add them to next quarter’s award shortlist",
        impacts: { recognition: 1, execution: 1 },
      },
      {
        id: "q-rec-03-c",
        label: "Assume the bonus covers it",
        impacts: { execution: 1 },
      },
      {
        id: "q-rec-03-d",
        label: "Post a generic shout-out in chat",
        impacts: { recognition: 1, culture: 1 },
      },
    ],
  },
  {
    id: "q-ex-03",
    type: "opinion_scale",
    category: "employee_experience",
    prompt:
      "Leaders should experience the same journeys they ask employees to take.",
    insight:
      "When leaders feel the friction, experience design stops being theoretical.",
    options: [
      { id: "q-ex-03-1", label: "1 · Strongly disagree", impacts: { culture: 1 } },
      { id: "q-ex-03-2", label: "2 · Disagree", impacts: { culture: 1 } },
      {
        id: "q-ex-03-3",
        label: "3 · Neutral",
        impacts: { empathy: 1, culture: 1 },
      },
      {
        id: "q-ex-03-4",
        label: "4 · Agree",
        impacts: { empathy: 2, culture: 2 },
      },
      {
        id: "q-ex-03-5",
        label: "5 · Strongly agree",
        impacts: { empathy: 3, culture: 2, execution: 1 },
      },
    ],
  },
  {
    id: "q-gift-03",
    type: "true_false",
    category: "corporate_gifting",
    prompt:
      "A gift’s meaning is decided more by timing and message than by price.",
    insight:
      "Price gets attention; timing and intent create memory.",
    options: [
      {
        id: "q-gift-03-a",
        label: "True",
        impacts: { recognition: 3, empathy: 2 },
      },
      {
        id: "q-gift-03-b",
        label: "False",
        impacts: { execution: 1, recognition: 1 },
      },
    ],
  },
  {
    id: "q-rank-02",
    type: "priority_ranking",
    category: "vendor_management",
    prompt: "Rank what you evaluate first when selecting an EX partner.",
    insight:
      "Your ranking is a blueprint for how partnerships will feel in delivery.",
    options: [
      {
        id: "q-rank-02-a",
        label: "Employee delight quality",
        impacts: { empathy: 1, recognition: 1 },
      },
      {
        id: "q-rank-02-b",
        label: "Operational reliability",
        impacts: { execution: 1 },
      },
      {
        id: "q-rank-02-c",
        label: "Sustainability practices",
        impacts: { sustainability: 1 },
      },
      {
        id: "q-rank-02-d",
        label: "Innovation roadmap",
        impacts: { innovation: 1 },
      },
    ],
  },
  {
    id: "q-future-03",
    type: "image_choice",
    category: "future_of_hr",
    prompt: "Which future workplace posture feels most Magnus?",
    insight:
      "The most future-ready organisations design for dignity, clarity, and momentum.",
    options: [
      {
        id: "q-future-03-a",
        label: "Human-centred systems with quiet technology",
        imageSrc: "/images/placeholders/future-human.svg",
        impacts: { empathy: 3, innovation: 2, culture: 2 },
      },
      {
        id: "q-future-03-b",
        label: "Fully automated with minimal human touch",
        imageSrc: "/images/placeholders/future-auto.svg",
        impacts: { innovation: 2, execution: 1 },
      },
      {
        id: "q-future-03-c",
        label: "Process-heavy control with dense policy",
        imageSrc: "/images/placeholders/future-policy.svg",
        impacts: { execution: 2 },
      },
      {
        id: "q-future-03-d",
        label: "Trend-chasing pilots every quarter",
        imageSrc: "/images/placeholders/future-trend.svg",
        impacts: { innovation: 2, culture: 1 },
      },
    ],
  },
  {
    id: "q-sus-03",
    type: "opinion_scale",
    category: "sustainability",
    prompt:
      "Sustainability should be designed into celebrations, not added as a footnote.",
    insight:
      "When sustainability is intrinsic, employees trust the story you’re telling.",
    options: [
      { id: "q-sus-03-1", label: "1 · Strongly disagree", impacts: { culture: 1 } },
      { id: "q-sus-03-2", label: "2 · Disagree", impacts: { culture: 1 } },
      {
        id: "q-sus-03-3",
        label: "3 · Neutral",
        impacts: { sustainability: 1 },
      },
      {
        id: "q-sus-03-4",
        label: "4 · Agree",
        impacts: { sustainability: 2, culture: 1 },
      },
      {
        id: "q-sus-03-5",
        label: "5 · Strongly agree",
        impacts: { sustainability: 3, culture: 2, recognition: 1 },
      },
    ],
  },
  {
    id: "q-vendor-03",
    type: "multiple_choice",
    category: "vendor_management",
    prompt:
      "A delivery miss happens before a celebration day. What matters most next?",
    insight:
      "Recovery quality often defines the partnership more than the miss itself.",
    options: [
      {
        id: "q-vendor-03-a",
        label: "Transparent recovery with employee-first fixes",
        impacts: { execution: 3, empathy: 2, culture: 1 },
      },
      {
        id: "q-vendor-03-b",
        label: "Blame the courier quietly",
        impacts: { execution: 1 },
      },
      {
        id: "q-vendor-03-c",
        label: "Discount next year’s contract",
        impacts: { execution: 2 },
      },
      {
        id: "q-vendor-03-d",
        label: "Ignore it if most orders arrived",
        impacts: { culture: 1 },
      },
    ],
  },
];
