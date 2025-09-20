import Head from 'next/head';
import Link from 'next/link';

import { PageLayout } from '../../components/PageLayout';
import { meta } from '../../lib/seo';
import { services } from '../../lib/services';
import { firmInfo } from '../../lib/siteConfig';

const ServicesPage = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>{meta.services.title}</title>
        <meta name="description" content={meta.services.description} />
      </Head>
      <PageLayout>
        <section className="bg-white bg-brand-hero">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-heading font-bold tracking-tight text-brand-slate sm:text-5xl">Services</h1>
              <p className="mt-4 text-lg text-brand-slate/80">
                Whether you are filing as an individual or running a small business, we keep taxes and books simple and predictable. Explore the services below and call us to tailor the right plan.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {services.map((service) => (
                <article key={service.key} className="flex h-full flex-col rounded-2xl border border-brand-primary/15 bg-white/90 p-6 shadow-brand">
                  <h2 className="text-xl font-heading font-semibold text-brand-slate">{service.name}</h2>
                  <p className="mt-3 text-sm text-brand-slate/75">{service.shortDescription}</p>
                  <div className="mt-auto pt-6">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center text-sm font-semibold text-brand-primary transition hover:text-brand-accent"
                    >
                      View details
                      <span aria-hidden className="ml-2">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-gradient-to-r from-brand-primary to-brand-accent">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-12 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-2xl font-semibold">Ready to get started?</h2>
              <p className="mt-2 text-sm text-white/80">Call to walk through your goals and receive a personalized quote.</p>
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

export default ServicesPage;
