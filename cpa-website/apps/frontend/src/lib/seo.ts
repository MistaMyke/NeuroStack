export type PageMeta = {
  title: string;
  description: string;
};

export const meta: Record<string, PageMeta> = {
  home: {
    title: 'Tax & Bookkeeping in Lockport, NY | VH Tax + Accounting',
    description:
      'Friendly, budget-conscious tax preparation and bookkeeping in Lockport, NY. Call (716) 417-6395 for year-round support from VH Tax + Accounting.',
  },
  services: {
    title: 'Tax & Bookkeeping Services | VH Tax + Accounting',
    description:
      'Explore tax preparation, bookkeeping, sales tax, and IRS representation services tailored for individuals and small businesses in Lockport.',
  },
  about: {
    title: 'About VH Tax + Accounting | Lockport, NY',
    description:
      'Learn how VH Tax + Accounting has supported Western New York since 2015 with approachable tax and bookkeeping guidance.',
  },
  faq: {
    title: 'Tax & Bookkeeping FAQs | VH Tax + Accounting',
    description:
      'Get answers to common questions about scheduling, documents, and working with VH Tax + Accounting in Lockport, NY.',
  },
  resources: {
    title: 'Client Resources & Checklists | VH Tax + Accounting',
    description:
      'Download helpful tax and bookkeeping checklists to stay organized before your appointment with VH Tax + Accounting.',
  },
  contact: {
    title: 'Contact VH Tax + Accounting | Lockport, NY',
    description:
      'Call (716) 417-6395 or send a message to schedule an appointment with VH Tax + Accounting in Lockport, New York.',
  },
  portal: {
    title: 'Client Portal | VH Tax + Accounting',
    description:
      'Access the secure VH Tax + Accounting client portal to upload documents, review returns, and chat with the team.',
  },
  privacy: {
    title: 'Privacy Policy | VH Tax + Accounting',
    description:
      'Read the privacy policy for VH Tax + Accounting covering client data, portal usage, and communications.',
  },
  terms: {
    title: 'Terms of Service | VH Tax + Accounting',
    description:
      "Review the terms for using VH Tax + Accounting's website, resources, and client portal.",
  },
  notFound: {
    title: 'Page Not Found | VH Tax + Accounting',
    description: 'Sorry, we could not find the page you were looking for. Return home or contact our team for assistance.',
  },
};

export const getServiceMeta = (serviceName: string): PageMeta => ({
  title: `${serviceName} | VH Tax + Accounting`,
  description: `${serviceName} support for individuals and small businesses in Lockport, NY. Call (716) 417-6395 to schedule an appointment.`,
});
