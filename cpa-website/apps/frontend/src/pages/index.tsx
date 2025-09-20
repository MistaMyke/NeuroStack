import Head from 'next/head';
import Link from 'next/link';
import Script from 'next/script';

import { PageLayout } from '../components/PageLayout';
import { meta } from '../lib/seo';
import { services } from '../lib/services';
import { firmInfo } from '../lib/siteConfig';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AccountingService',
  name: firmInfo.name,
  address: {
    '@type': 'PostalAddress',
    streetAddress: firmInfo.address,
    addressLocality: 'Lockport',
    addressRegion: 'NY',
    postalCode: '14094',
    addressCountry: 'US',
  },
  telephone: firmInfo.phone,
  email: firmInfo.email,
  url: 'https://www.vhtaxaccounting.com',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      description: firmInfo.hoursNote,
    },
  ],
  areaServed: [
    { '@type': 'City', name: 'Lockport' },
    { '@type': 'AdministrativeArea', name: 'Niagara County' },
    { '@type': 'AdministrativeArea', name: 'Western New York' },
  ],
};

const differentiators = [
  'Friendly, no-jargon explanations that keep you confident.',
  'Budget-conscious options sized for individuals and small businesses.',
  'Local expertise for New York State and Niagara County requirements.',
];

const HomePage = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>{meta.home.title}</title>
        <meta name="description" content={meta.home.description} />
      </Head>
      <Script id="schema-local-business" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
      <PageLayout>
        <section className="bg-white bg-brand-hero">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-14 lg:py-20">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full bg-white/70 px-4 py-1 text-sm font-medium text-brand-accent">
                Serving Lockport and Niagara County since 2015
              </span>
              <h1 className="mt-6 text-4xl font-heading font-bold tracking-tight text-brand-slate sm:text-5xl">
                Clear, reliable tax help for Lockport and beyond.
              </h1>
              <p className="mt-4 text-lg text-brand-slate/80">
                Year-round guidance, straightforward pricing, and responsive support for individuals, sole proprietors, and growing companies.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={firmInfo.phoneHref}
                  className="rounded-full bg-gradient-to-r from-brand-primary to-brand-accent px-6 py-3 text-base font-semibold text-white shadow-brand transition hover:from-brand-accent hover:to-brand-primary focus:outline-none focus-visible:ring focus-visible:ring-brand-accent/40"
                >
                  Call {firmInfo.phone}
                </a>
                <Link
                  href="/services"
                  className="rounded-full border border-brand-primary px-6 py-3 text-base font-semibold text-brand-primary transition hover:bg-brand-primary/10 focus:outline-none focus-visible:ring focus-visible:ring-brand-primary/40"
                >
                  View services
                </Link>
                <Link
                  href="/portal"
                  className="rounded-full border border-brand-accent/40 px-6 py-3 text-base font-semibold text-brand-slate transition hover:bg-brand-accent/10 focus:outline-none focus-visible:ring focus-visible:ring-brand-accent/40"
                >
                  Client portal
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-brand-accent/30 bg-white/80 p-6 text-sm text-brand-slate shadow-brand">
              <p className="font-semibold">Why clients partner with VH Tax + Accounting</p>
              <ul className="space-y-3">
                {differentiators.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span aria-hidden className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-brand-slate/80">
                Appointment-based availability means you always have focused time and quick callbacks.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-brand-light">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-heading font-semibold text-brand-slate">Services built for your needs</h2>
                <p className="mt-2 max-w-xl text-base text-brand-slate/80">
                  Whether you are filing as an individual or managing a company, we keep taxes and books simple and predictable.
                </p>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full border border-brand-primary px-4 py-2 text-sm font-semibold text-brand-primary transition hover:bg-brand-primary/10 focus:outline-none focus-visible:ring focus-visible:ring-brand-primary/40"
              >
                View all services
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Link
                  key={service.key}
                  href={`/services/${service.slug}`}
                  className="flex h-full flex-col rounded-xl border border-brand-primary/10 bg-white p-6 shadow-sm transition hover:border-brand-primary/40 hover:shadow-brand focus:outline-none focus-visible:ring focus-visible:ring-brand-primary/30"
                >
                  <h3 className="text-lg font-heading font-semibold text-brand-slate">{service.name}</h3>
                  <p className="mt-3 text-sm text-brand-slate/75">{service.shortDescription}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary">
                    Learn more
                    <span aria-hidden>→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="text-2xl font-heading font-semibold text-brand-slate">Friendly help that fits your budget</h2>
                <p className="mt-4 text-base text-brand-slate/80">
                  VH Tax + Accounting blends approachable conversations with the expertise you need to stay compliant. We explain next steps without jargon so you never feel stuck.
                </p>
              </div>
              <div className="rounded-2xl border border-brand-accent/30 bg-brand-accent/10 p-6 text-sm text-brand-slate shadow-brand">
                <p className="font-heading text-base font-semibold text-brand-accent">Serving Lockport and neighboring communities</p>
                <p className="mt-3 text-brand-slate/80">
                  We regularly support clients across Lockport, Niagara Falls, North Tonawanda, and the wider Western New York region.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-brand-primary to-brand-accent">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-12 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-2xl font-semibold">Call to book your appointment</h2>
              <p className="mt-2 text-sm text-white/80">
                Appointments are tailored to your schedule with responsive follow-ups year-round.
              </p>
            </div>
            <a
              href={firmInfo.phoneHref}
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-brand-primary transition hover:bg-brand-light focus:outline-none focus-visible:ring focus-visible:ring-white"
            >
              Call {firmInfo.phone}
            </a>
          </div>
        </section>
      </PageLayout>
    </>
  );
};

export default HomePage;
