import Head from 'next/head';

import { PageLayout } from '../components/PageLayout';
import { meta } from '../lib/seo';
import { firmInfo } from '../lib/siteConfig';

const plannedFeatures = [
  'Secure file uploads and downloads for tax returns and supporting documents.',
  'Simple status tracking so you always know where your return stands.',
  'AI chat to answer common questions and outline required documents.',
];

const PortalPage = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>{meta.portal.title}</title>
        <meta name="description" content={meta.portal.description} />
      </Head>
      <PageLayout>
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Client portal</h1>
              <p className="mt-4 text-lg text-slate-600">
                Securely upload documents, review completed returns, and send quick questions to the VH Tax + Accounting team. Portal access is available for current clients—call if you need an invite or forgot your login.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="https://portal.vhtaxaccounting.com/login"
                  className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring focus-visible:ring-blue-500"
                >
                  Launch portal
                </a>
                <a
                  href={firmInfo.phoneHref}
                  className="rounded-md border border-blue-600 px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 focus:outline-none focus-visible:ring focus-visible:ring-blue-500"
                >
                  Request access
                </a>
              </div>
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">Portal features</h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {plannedFeatures.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span aria-hidden className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-violet-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="relative overflow-hidden rounded-2xl border border-blue-200 bg-white p-6 shadow-sm">
                <div className="absolute inset-0 bg-blue-600/5" aria-hidden />
                <div className="relative space-y-4">
                  <h2 className="text-xl font-semibold text-slate-900">Payment options (visible after login)</h2>
                  <p className="text-sm text-slate-600">
                    Access to Venmo and Cash App details appears once you sign in. Handles are only shared with active clients.
                  </p>
                  <div className="flex flex-wrap gap-3" aria-hidden>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#3D95CE] px-4 py-2 text-sm font-semibold text-white shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-white" aria-hidden />
                      Venmo — available in portal
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#00C244] px-4 py-2 text-sm font-semibold text-white shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-white" aria-hidden />
                      Cash App — available in portal
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Need to make a payment now? Call the office and we will send your secure link.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
};

export default PortalPage;
