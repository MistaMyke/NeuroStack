export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const generalFaq: FaqItem[] = [
  {
    id: 'schedule',
    question: 'How do I schedule?',
    answer: 'Call (716) 417-6395 and we will arrange an appointment time that fits your schedule.',
  },
  {
    id: 'walk-ins',
    question: 'Do you accept walk-ins?',
    answer: 'We work by appointment so each client receives dedicated time and timely follow-ups.',
  },
  {
    id: 'what-to-bring',
    question: 'What should I bring to my tax appointment?',
    answer: 'We send a tailored checklist before your meeting. Common items include W-2s, 1099s, prior-year returns, receipts, and identification.',
  },
  {
    id: 'entity-support',
    question: 'Do you work with S-Corps and LLCs?',
    answer: 'Yes. We support LLCs, S-Corps, C-Corps, and nonprofits with setup, filings, and annual returns.',
  },
  {
    id: 'payment-options',
    question: 'Do you offer payment plans?',
    answer: 'We can discuss budget-friendly payment options. Current payment methods include cash, check, Venmo, and Cash App.',
  },
];
