import Head from 'next/head';

import { PageLayout } from '../components/PageLayout';
import { resourceDownloads } from '../lib/resources';
import { meta } from '../lib/seo';
import { firmInfo } from '../lib/siteConfig';

const ResourcesPage = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>{meta.resources.title}</title>
        <meta name="description" content={meta.resources.description} />
      </Head>
      <PageLayout>
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Resources</h1>
              <p className="mt-4 text-lg text-slate-600">
                Download simple checklists to get organized before your appointment. We will add more resources as the portal expands.
              </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {resourceDownloads.map((resource) => (
                <article key={resource.id} className="flex h-full flex-col rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">{resource.title}</h2>
                  <p className="mt-3 text-sm text-slate-600">{resource.description}</p>
                  <a
                    href={resource.href}
                    className="mt-auto inline-flex items-center text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Download PDF
                    <span aria-hidden className="ml-2">↓</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-blue-600">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-12 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-2xl font-semibold">Need something specific?</h2>
              <p className="mt-2 text-sm text-blue-100">Call the office and we will prepare the documents or checklist you need.</p>
            </div>
            <a
              href={firmInfo.phoneHref}
              className="inline-flex items-center justify-center rounded-md bg-white px-5 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-white"
            >
              Call {firmInfo.phone}
            </a>
          </div>
        </section>
      </PageLayout>
    </>
  );
};

export default ResourcesPage;
