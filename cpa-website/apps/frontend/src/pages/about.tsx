import Head from 'next/head';

import { PageLayout } from '../components/PageLayout';
import { meta } from '../lib/seo';
import { firmInfo } from '../lib/siteConfig';

const aboutStory = `VH Tax + Accounting has helped individuals and small businesses in the Lockport area since 2015. We focus on clear, friendly communication and practical solutions that fit your budget. Whether you're filing your first return, cleaning up books, or navigating an IRS notice, you'll get straightforward guidance and steady support. We work by appointment so you get focused time and quick follow-ups. From annual taxes to monthly bookkeeping and sales tax filings, our goal is to keep your finances organized and your stress low—so you can get back to life and work.`;

const AboutPage = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>{meta.about.title}</title>
        <meta name="description" content={meta.about.description} />
      </Head>
      <PageLayout>
        <section className="bg-white bg-brand-hero">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h1 className="text-4xl font-heading font-bold tracking-tight text-brand-slate sm:text-5xl">About us</h1>
                <p className="mt-6 whitespace-pre-line text-lg text-brand-slate/80">{aboutStory}</p>
              </div>
              <aside className="flex flex-col gap-4 rounded-2xl border border-brand-primary/15 bg-white/90 p-6 text-sm text-brand-slate shadow-brand">
                <div>
                  <h2 className="text-base font-heading font-semibold text-brand-slate">Meet the owner</h2>
                  <p className="mt-2 text-sm text-brand-slate/75">
                    Owner Vanetta Hermann leads every engagement with responsive support and practical advice. A local resident, she understands what Lockport businesses and families need from their accountant.
                  </p>
                </div>
                <div className="border-t border-brand-primary/15 pt-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-accent">How we work</h3>
                  <ul className="mt-3 space-y-2 text-brand-slate/80">
                    <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand-primary" aria-hidden />Appointment-based meetings tailored to your calendar.</li>
                    <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand-primary" aria-hidden />Clear next steps after every call or document review.</li>
                    <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brand-primary" aria-hidden />Secure portal for document uploads and updates.</li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>
        <section className="bg-gradient-to-r from-brand-primary to-brand-accent">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-12 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-2xl font-semibold">Let&apos;s plan your next steps</h2>
              <p className="mt-2 text-sm text-white/80">Call to book time with Vanetta and get answers to your questions.</p>
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

export default AboutPage;
