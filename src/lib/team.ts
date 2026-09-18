export interface TeamStat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface TeamMember {
  id: 'nick' | 'swarn';
  name: string;
  role: string;
  fullRole: string;
  portrait: string;
  cardBio: string;
  fullBio: string[];
  credentials: string[];
  /** Overlay eyebrow, e.g. 'FOUNDER PROFILE' (team page cinematic bio) */
  profileEyebrow: string;
  /** Champagne discipline line under the overlay title */
  discipline: string;
  /** Stat row shown inside the cinematic overlay (counts up on open) */
  stats: TeamStat[];
  /** The other member's id — used for cross-profile FLIP navigation */
  counterpartId: 'nick' | 'swarn';
}

export const TEAM: TeamMember[] = [
  {
    id: 'nick',
    name: 'Nick Sidhu',
    role: 'Founder & Principal Advisor',
    fullRole: 'Founder & Principal Advisor — Corporate Tax & Estate Strategy',
    portrait: '/team-nick.jpg',
    cardBio:
      'Specializes in corporate restructuring and multi-generational wealth planning. Trusted advisor to business owners across Canada for over 10 years, focused on tax efficiency and estate optimization.',
    fullBio: [
      'Specializing in corporate restructuring and multi-generational wealth planning, Nick Sidhu has served as a trusted advisor to business owners, incorporated professionals, and families across Canada for over a decade. Nick founded Rubellite Wealth to provide clients with holistic, proactive financial blueprints—eliminating inefficiencies, minimizing tax erosion, and protecting generational wealth. His strategic approach ensures every corporate structure, estate plan, and risk management tool works together seamlessly to advance long-term goals.',
    ],
    credentials: ['Corporate Tax', 'Estate Strategy'],
    profileEyebrow: 'Founder Profile',
    discipline: 'Corporate Tax & Estate Strategy',
    stats: [
      { value: 10, suffix: '+', label: 'years trusted advisor' },
      { value: 4, label: 'integrated pillars' },
    ],
    counterpartId: 'swarn',
  },
  {
    id: 'swarn',
    name: 'Swarn Sidhu',
    role: 'Principal Mortgage Broker',
    fullRole: 'Founding Partner & Mortgage Broker — Strategic Debt and Investment Coordination',
    portrait: '/team-swarn.jpg',
    cardBio:
      'Specializes in strategic debt and real estate capital optimization. 11+ years of experience with over $2 Billion in funded mortgages, integrating liability management into overall wealth plans.',
    fullBio: [
      'Swarn Sidhu helps establish Rubellite Wealth on a distinct premise: effective financial planning must address both sides of the balance sheet. Bringing over 11 years of specialized mortgage experience and a track record of funding more than $2 Billion in real estate capital, Swarn provides clients with a rare dual perspective in wealth advisory—merging advanced estate and tax planning with high-level leverage and asset optimization.',
      'Swarn works alongside lenders, business owners, and industry professionals, to simplify complex corporate ecosystems. By unifying business structuring, risk management, real estate leverage, and wealth transfer, Swarn helps clients preserve their capital, reduce tax erosion, and build long-term generational security.',
    ],
    credentials: ['Strategic Debt', 'Investment Coordination'],
    profileEyebrow: 'Partner Profile',
    discipline: 'Strategic Debt and Investment Coordination',
    stats: [
      { value: 2, prefix: '$', suffix: 'B+', label: 'funded mortgage capital' },
      { value: 11, suffix: '+', label: 'years specialized experience' },
    ],
    counterpartId: 'nick',
  },
];
