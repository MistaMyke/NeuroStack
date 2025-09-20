export type ResourceDownload = {
  id: string;
  title: string;
  description: string;
  href: string;
};

export const resourceDownloads: ResourceDownload[] = [
  {
    id: 'individual-checklist',
    title: 'New Client Tax Checklist (Individual)',
    description: 'Stay organized with a one-page list of documents to gather before your appointment.',
    href: '/downloads/new-client-tax-checklist.pdf',
  },
  {
    id: 'year-end-prep',
    title: 'Year-End Books Prep (Small Business)',
    description: 'A simple guide for reconciling accounts and preparing records for tax season.',
    href: '/downloads/year-end-books-prep.pdf',
  },
];
