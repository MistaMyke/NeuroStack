export type KnowledgeItem = {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
};

export const knowledgeBase: KnowledgeItem[] = [
  {
    id: 'schedule',
    question: 'How do I schedule an appointment?',
    answer: 'Call (716) 417-6395 and we will arrange an appointment time that fits your schedule. We work by appointment so each client gets dedicated time.',
    tags: ['appointment', 'schedule', 'call', 'phone'],
  },
  {
    id: 'walk-ins',
    question: 'Do you accept walk-ins?',
    answer: 'We work by appointment so each client receives dedicated time and timely follow-ups. Call to set a time.',
    tags: ['walk-in', 'appointment'],
  },
  {
    id: 'documents',
    question: 'What should I bring to my tax appointment?',
    answer: 'We send a tailored checklist before your meeting. Common items include W-2s, 1099s, prior-year returns, receipts, and identification.',
    tags: ['documents', 'checklist', 'tax', 'W-2', '1099'],
  },
  {
    id: 'entity-support',
    question: 'Do you work with LLCs, S-Corps, or nonprofits?',
    answer: 'Yes. We support LLCs, S-Corps, C-Corps, and nonprofits with setup, filings, and annual returns.',
    tags: ['llc', 's-corp', 'c-corp', 'nonprofit', 'business'],
  },
  {
    id: 'payment-options',
    question: 'What payment options do you accept?',
    answer: 'We can discuss budget-friendly payment options. Current payment methods include cash, check, Venmo, and Cash App. Additional payment links can be provided on request.',
    tags: ['payment', 'venmo', 'cash app', 'check', 'cash'],
  },
  {
    id: 'portal-access',
    question: 'How do I access the client portal?',
    answer: 'Portal access is available for current clients. If you need an invite or forgot your login, call the office and we will help you get access.',
    tags: ['portal', 'login', 'invite'],
  },
  {
    id: 'portal-features',
    question: 'What can I do in the client portal?',
    answer: 'You can upload documents securely, review completed returns, check your engagement status, and send questions to the team.',
    tags: ['portal', 'upload', 'download', 'status'],
  },
  {
    id: 'privacy',
    question: 'How is my information protected?',
    answer: 'Documents are encrypted in transit and at rest, and access is restricted to authorized team members. We follow IRS and FTC safeguards for protecting client data.',
    tags: ['security', 'privacy', 'encryption'],
  },
];
