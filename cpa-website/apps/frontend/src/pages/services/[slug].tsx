import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { PageLayout } from '../../components/PageLayout';
import { getServiceMeta } from '../../lib/seo';
import { services, servicesBySlug, type Service } from '../../lib/services';
import { firmInfo } from '../../lib/siteConfig';

type ServicePageProps = {
  service: Service;
};

const ServiceDetailPage = ({ service }: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element => {
  const meta = getServiceMeta(service.name);

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
      </Head>
      <PageLayout>
        <section className="bg-white bg-brand-hero">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-accent">{service.name}</p>
              <h1 className="mt-4 text-4xl font-heading font-bold tracking-tight text-brand-slate sm:text-5xl">{service.detail.headline}</h1>
              <p className="mt-4 text-lg text-brand-slate/80">{service.shortDescription}</p>
            </div>
          </div>
        </section>

        <section className="bg-brand-light">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <article className="space-y-12">
                <section>
                  <h2 className="text-2xl font-heading font-semibold text-brand-slate">Who it&apos;s for</h2>
                  <p className="mt-3 text-base text-brand-slate/80">{service.detail.whoItsFor}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-semibold text-brand-slate">What&apos;s included</h2>
                  <ul className="mt-4 space-y-3 text-base text-brand-slate/80">
                    {service.detail.whatsIncluded.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span aria-hidden className="mt-2 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-brand-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-semibold text-brand-slate">What to expect</h2>
                  <ol className="mt-4 space-y-3 text-base text-brand-slate/80">
                    {service.detail.whatToExpect.map((step, index) => (
                      <li key={step} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-brand-primary to-brand-accent text-sm font-semibold text-white">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-semibold text-brand-slate">Pricing approach</h2>
                  <p className="mt-3 text-base text-brand-slate/80">{service.detail.pricingApproach}</p>
                </section>

                <section>
                  <h2 className="text-2xl font-heading font-semibold text-brand-slate">Service FAQs</h2>
                  <div className="mt-4 space-y-6">
                    {service.detail.faqs.map((faq) => (
                      <div key={faq.question}>
                        <h3 className="text-lg font-heading font-semibold text-brand-slate">{faq.question}</h3>
                        <p className="mt-2 text-base text-brand-slate/80">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </article>
            </div>
            <aside className="flex flex-col gap-6 rounded-2xl border border-brand-primary/20 bg-white/95 p-6 shadow-brand">
              <div>
                <h2 className="text-lg font-heading font-semibold text-brand-slate">Call to get started</h2>
                <p className="mt-2 text-sm text-brand-slate/75">
                  We will review your needs, map out the timeline, and confirm the next steps.
                </p>
                <a
                  href={firmInfo.phoneHref}
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-brand-primary to-brand-accent px-4 py-2 text-sm font-semibold text-white shadow-brand transition hover:from-brand-accent hover:to-brand-primary focus:outline-none focus-visible:ring focus-visible:ring-brand-accent/40"
                >
                  Call {firmInfo.phone}
                </a>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-accent">Need documents?</h3>
                <p className="mt-2 text-sm text-brand-slate/75">
                  Use the client portal to upload tax records, bookkeeping files, or IRS notices securely.
                </p>
                <Link
                  href="/portal"
                  className="mt-3 inline-flex items-center text-sm font-semibold text-brand-primary transition hover:text-brand-accent"
                >
                  Visit client portal
                  <span aria-hidden className="ml-2">→</span>
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <section className="bg-gradient-to-r from-brand-primary to-brand-accent">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-12 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-2xl font-semibold">Call (716) 417-6395</h2>
              <p className="mt-2 text-sm text-white/80">Let&apos;s schedule a time to review your situation and outline the path forward.</p>
            </div>
            <a
              href={firmInfo.phoneHref}
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-brand-primary transition hover:bg-brand-light focus:outline-none focus-visible:ring focus-visible:ring-white"
            >
              Call to book
            </a>
          </div>
        </section>
      </PageLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: services.map((service) => ({ params: { slug: service.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ServicePageProps> = async ({ params }) => {
  const slug = params?.slug;
  const service = typeof slug === 'string' ? servicesBySlug.get(slug) : undefined;

  if (!service) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      service,
    },
  };
};

export default ServiceDetailPage;
