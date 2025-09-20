import Head from 'next/head';
import Link from 'next/link';

import { PageLayout } from '../components/PageLayout';
import { generalFaq } from '../lib/faq';
import { meta } from '../lib/seo';
import { firmInfo } from '../lib/siteConfig';

const FaqPage = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>{meta.faq.title}</title>
        <meta name="description" content={meta.faq.description} />
      </Head>
      <PageLayout>
        <section className="bg-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_280px]">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Frequently asked questions</h1>
              <p className="mt-4 text-lg text-slate-600">
                Straight answers about scheduling, documents, and how we support individuals and businesses across Lockport and Niagara County.
              </p>
              <div className="mt-10 space-y-10">
                {generalFaq.map((faq) => (
                  <article key={faq.id} id={faq.id} className="scroll-mt-24">
                    <h2 className="text-xl font-semibold text-slate-900">{faq.question}</h2>
                    <p className="mt-3 text-base text-slate-600">{faq.answer}</p>
                  </article>
                ))}
              </div>
            </div>
            <aside className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-600">Jump to a question</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {generalFaq.map((faq) => (
                    <li key={faq.id}>
                      <a href={`#${faq.id}`} className="hover:text-blue-600">
                        {faq.question}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-blue-100 bg-white p-5 text-sm text-slate-600 shadow-sm">
                <p className="font-semibold text-slate-900">Still need help?</p>
                <p className="mt-2">Call or send a message and we&apos;ll follow up quickly.</p>
                <div className="mt-4 flex flex-col gap-2">
                  <a href={firmInfo.phoneHref} className="font-semibold text-blue-600 hover:text-blue-700">
                    {firmInfo.phone}
                  </a>
                  <a href={firmInfo.emailHref} className="text-blue-600 hover:text-blue-700">
                    {firmInfo.email}
                  </a>
                  <Link href="/contact" className="text-blue-600 hover:text-blue-700">
                    Contact form
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </PageLayout>
    </>
  );
};

export default FaqPage;
