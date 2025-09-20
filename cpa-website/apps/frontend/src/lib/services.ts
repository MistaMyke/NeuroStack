export type ServiceKey =
  | 'individual-tax-preparation'
  | 'business-tax-preparation'
  | 'bookkeeping'
  | 'sales-and-use-tax'
  | 'irs-representation';

export type Service = {
  key: ServiceKey;
  name: string;
  slug: string;
  shortDescription: string;
  detail: {
    headline: string;
    whoItsFor: string;
    whatsIncluded: string[];
    whatToExpect: string[];
    pricingApproach: string;
    faqs: Array<{ question: string; answer: string }>;
  };
};

const sharedSteps = [
  'Start with a quick intake call so we understand your goals and timing.',
  'Send documents through our secure portal or schedule a drop-off at the office.',
  'We review, prepare, and walk you through key findings before anything is filed.',
  'Finalize, e-file, and outline next steps or reminders so you stay organized.',
];

export const services: Service[] = [
  {
    key: 'individual-tax-preparation',
    name: 'Individual Tax Preparation',
    slug: 'individual-tax-preparation',
    shortDescription:
      'Accurate, on-time filing with clear guidance on deductions and credits for federal and NYS returns.',
    detail: {
      headline: 'Stress-free filing for W-2 earners, retirees, and households with mixed income.',
      whoItsFor:
        'Individuals and families across Lockport and Western New York who want returns handled correctly—with explanations you can understand.',
      whatsIncluded: [
        'Personalized document checklist that keeps everyone on the same page.',
        'Deep review of deductions, credits, and life changes that may impact your return.',
        'Secure e-filing for federal and NYS returns with confirmation on timing.',
        'Guidance for estimated payments or planning for next year so there are no surprises.',
      ],
      whatToExpect: sharedSteps,
      pricingApproach:
        'Budget-conscious pricing with a quote after a short intake call based on complexity and forms needed.',
      faqs: [
        {
          question: 'Can you help if I have multiple W-2s or side income?',
          answer: 'Yes. We routinely handle W-2, 1099, retirement, and investment income and clarify what documents we need in advance.',
        },
        {
          question: 'Do you provide virtual appointments?',
          answer: 'We can meet by phone or video and use the client portal for secure document exchange if you prefer not to visit in person.',
        },
        {
          question: "Will you review last year's return?",
          answer: 'Absolutely. Reviewing prior filings helps us spot carryovers or opportunities you may have missed.',
        },
      ],
    },
  },
  {
    key: 'business-tax-preparation',
    name: 'Business Tax Preparation',
    slug: 'business-tax-preparation',
    shortDescription:
      'Returns for sole proprietors, LLCs, S-Corps, C-Corps, and nonprofits coordinated with your books to minimize surprises.',
    detail: {
      headline: 'Reliable year-end filings that align with your books and cash flow.',
      whoItsFor:
        'Owners of sole proprietorships, partnerships, corporations, and nonprofits who want proactive guidance and fewer tax season surprises.',
      whatsIncluded: [
        'Entity-specific federal and NYS income tax returns with clear deliverables.',
        'Coordination with your bookkeeping to tidy up balances before filing.',
        'Estimated tax planning and reminders so quarterly payments stay on track.',
        'Secure e-filing and copies for your lender or board as needed.',
      ],
      whatToExpect: sharedSteps,
      pricingApproach:
        'Quotes provided after understanding your entity type, bookkeeping status, and filing deadlines.',
      faqs: [
        {
          question: 'Do you work with multi-state filings?',
          answer: 'We handle New York-based businesses and can coordinate additional state filings when activity warrants it.',
        },
        {
          question: 'Can you collaborate with my bookkeeper?',
          answer: 'Yes. We partner with internal teams or outside bookkeepers to ensure the return reflects accurate year-end numbers.',
        },
        {
          question: 'What information will you need from me?',
          answer: 'We provide a tailored checklist, prior-year returns, financial statements, payroll reports, and any major asset purchases or loans.',
        },
      ],
    },
  },
  {
    key: 'bookkeeping',
    name: 'Bookkeeping',
    slug: 'bookkeeping',
    shortDescription:
      'Monthly categorization, reconciliations, and simple reports so you always know where the business stands.',
    detail: {
      headline: 'Stay organized year-round with clean books and timely reports.',
      whoItsFor:
        'Busy owners who would rather focus on clients and operations while staying compliant with taxes and lenders.',
      whatsIncluded: [
        'Monthly categorization of bank and credit card activity in your accounting system.',
        'Bank, credit card, and loan reconciliations with notes on outstanding items.',
        'Straightforward profit & loss and balance sheet reporting delivered on a set schedule.',
        'Quarterly check-ins to flag trends, cash flow needs, or upcoming filings.',
      ],
      whatToExpect: sharedSteps,
      pricingApproach:
        'Flat or tiered monthly pricing after we review volume, software, and any catch-up work needed.',
      faqs: [
        {
          question: 'Which accounting platforms do you support?',
          answer: 'We primarily work in QuickBooks Online but can discuss other systems if you already have one in place.',
        },
        {
          question: 'Can you help me catch up past months?',
          answer: 'Yes. We scope any cleanup or historical work first, then move you into an ongoing monthly rhythm.',
        },
        {
          question: 'Will I still have access to my books?',
          answer: 'Of course. You retain ownership of the accounting file and we document everything so you always know the status.',
        },
      ],
    },
  },
  {
    key: 'sales-and-use-tax',
    name: 'Sales & Use Tax',
    slug: 'sales-and-use-tax',
    shortDescription:
      'Setup and filings for NYS with reminders and support to avoid penalties.',
    detail: {
      headline: 'Stay compliant with New York sales tax without the scramble.',
      whoItsFor:
        'Retailers, service businesses, and contractors that collect or owe sales tax in New York and want dependable filing support.',
      whatsIncluded: [
        'Nexus review to confirm when and where you must collect sales tax.',
        'Registration assistance and portal setup with NYS if you are new to sales tax.',
        'Preparation and filing of quarterly or annual sales tax returns.',
        'Calendar reminders and payment guidance so nothing slips through the cracks.',
      ],
      whatToExpect: sharedSteps,
      pricingApproach:
        'Engagements are scoped by filing frequency and transaction volume after a discovery call.',
      faqs: [
        {
          question: 'Can you help me understand what is taxable?',
          answer: 'Yes. We review your products or services and explain which line items require sales tax and which do not.',
        },
        {
          question: 'Do you file late or amended returns?',
          answer: 'We can assist with catching up missed filings and communicating with NYS to reduce penalties when possible.',
        },
        {
          question: 'Will you remind me about due dates?',
          answer: 'Absolutely. We set shared reminders prior to each filing deadline and confirm submissions once filed.',
        },
      ],
    },
  },
  {
    key: 'irs-representation',
    name: 'IRS Representation',
    slug: 'irs-representation',
    shortDescription:
      'Notices, letters, and audits handled with calm, experienced support so you have an advocate.',
    detail: {
      headline: 'Experienced guidance when tax notices or audits show up.',
      whoItsFor:
        'Individuals and businesses facing IRS or NYS notices, payment plans, or audits who want a responsive representative.',
      whatsIncluded: [
        'Review of notices with a clear action plan and next steps.',
        'Communication with the IRS or NYS on your behalf, including written responses.',
        'Representation during audits or meetings so you have support in the room.',
        'Payment plan guidance and follow-up so agreements stay current.',
      ],
      whatToExpect: sharedSteps,
      pricingApproach:
        'Quoted based on the type of notice or audit and the level of representation required.',
      faqs: [
        {
          question: 'Can you speak to the IRS for me?',
          answer: 'Yes. With an authorization form on file, we communicate directly with the IRS or NYS agents handling your case.',
        },
        {
          question: 'Do you help with payment plans?',
          answer: 'We negotiate installment agreements, offer in compromise options when appropriate, and keep you informed of next steps.',
        },
        {
          question: 'What should I bring to the first meeting?',
          answer: 'Bring any notices, prior correspondence, and recent tax returns so we can evaluate the situation quickly.',
        },
      ],
    },
  },
];

export const servicesBySlug = new Map(services.map((service) => [service.slug, service]));
