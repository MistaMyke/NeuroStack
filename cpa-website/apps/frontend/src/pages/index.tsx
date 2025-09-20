import Head from 'next/head';

import { PageLayout } from '../components/PageLayout';

const HomePage = () => {
  return (
    <>
      <Head>
        <title>NeuroStack CPA</title>
        <meta name="description" content="CPA services powered by NeuroStack" />
      </Head>
      <PageLayout>
        <section className="mx-auto flex max-w-5xl flex-col items-center gap-6 py-16">
          <h1 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl">
            Smart Accounting For Modern Businesses
          </h1>
          <p className="text-center text-lg text-slate-600">
            NeuroStack CPA blends seasoned financial expertise with AI-driven insights to
            keep your books sharp and compliant.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              className="rounded-md bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
              href="#services"
            >
              Explore Services
            </a>
            <a
              className="rounded-md border border-blue-600 px-6 py-3 text-blue-600 transition hover:bg-blue-50"
              href="#contact"
            >
              Schedule A Call
            </a>
          </div>
        </section>
      </PageLayout>
    </>
  );
};

export default HomePage;
