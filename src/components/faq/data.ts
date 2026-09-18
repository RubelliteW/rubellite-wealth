export interface FaqEntry {
  question: string;
  answer: string;
}

export interface FaqGroupData {
  label: string;
  items: FaqEntry[];
}

/** Featured verbatim real-estate/debt question (info.md §4) — auto-opens with the "Most Asked" badge */
export const FEATURED_FAQ: FaqEntry = {
  question: 'Do you help with real estate and debt management as part of wealth planning?',
  answer:
    "Yes. Real estate is often a client's largest asset—and liability. With over 11 years of experience and $2B+ in funded real estate capital, we integrate property debt structuring, liquidity management, and corporate real estate financing directly into your overarching wealth and estate plan.",
};

export const FAQ_GROUPS: FaqGroupData[] = [
  {
    label: 'Working With Rubellite',
    items: [
      {
        question: 'Who does Rubellite Wealth work with?',
        answer:
          'Business owners, incorporated professionals, and high-net-worth families who want a coordinated, proactive wealth blueprint rather than disconnected financial products.',
      },
      {
        question: 'What makes Rubellite different from a traditional advisory firm?',
        answer:
          'We plan across four pillars at once — tax, estate, risk, and real estate debt — so every structure works together seamlessly toward your long-term goals.',
      },
      {
        question: 'What does the process look like?',
        answer:
          'We begin with a discovery consultation, map your full balance sheet — assets and liabilities — then architect an integrated blueprint across all four pillars before any product or structure is implemented.',
      },
    ],
  },
  {
    label: 'The Four Pillars',
    items: [
      {
        question: 'Why is debt management part of wealth planning?',
        answer:
          'Your liabilities shape your outcomes. Debt structures determine estate liquidity, how capital gains taxes are covered upon death, and whether assets must be liquidated under pressure — so we design them alongside everything else.',
      },
      {
        question: 'Do you work with real estate held in corporations?',
        answer:
          'Yes. High-net-worth clients and incorporated professionals frequently hold real estate inside corporate entities, and we optimize corporate debt, tax-free equity extraction, and refinancing alongside the broader wealth plan.',
      },
      {
        question: 'Can you help extract equity without triggering tax?',
        answer:
          'That is a core capability. We leverage property assets strategically to release liquidity for new ventures, succession planning, or investment opportunities without triggering unnecessary taxable events.',
      },
    ],
  },
  {
    label: 'Practicalities',
    items: [
      {
        question: 'Where do you operate?',
        answer: 'We serve clients across Canada, with consultations available in person and virtually.',
      },
      {
        question: 'How do we start?',
        answer:
          "Book a consultation. We'll review your current structures, identify inefficiencies across all four pillars, and outline what a complete blueprint would look like for you.",
      },
    ],
  },
];

/** Case-insensitive match across question + answer text */
export function matchesQuery(entry: FaqEntry, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return entry.question.toLowerCase().includes(q) || entry.answer.toLowerCase().includes(q);
}
