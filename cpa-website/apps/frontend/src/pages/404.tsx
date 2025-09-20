import Head from 'next/head';
import Link from 'next/link';

import { PageLayout } from '../components/PageLayout';
import { meta } from '../lib/seo';
import { firmInfo } from '../lib/siteConfig';

const NotFoundPage = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>{meta.notFound.title}</title>
        <meta name="description" content={meta.notFound.description} />
      </Head>
      <PageLayout>
        <section className="bg-white">
          <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-4 text-center sm:px-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">404</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">We could not find that page</h1>
            <p className="mt-4 text-base text-slate-600">
              The page you are looking for may have moved. Call us if you need help locating information or return to the homepage.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/"
                className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring focus-visible:ring-blue-500"
              >
                Go home
              </Link>
              <a
                href={firmInfo.phoneHref}
                className="rounded-md border border-blue-600 px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 focus:outline-none focus-visible:ring focus-visible:ring-blue-500"
              >
                Call {firmInfo.phone}
              </a>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
};

export default NotFoundPage;
