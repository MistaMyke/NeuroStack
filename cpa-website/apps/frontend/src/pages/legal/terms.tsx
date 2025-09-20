import Head from 'next/head';

import { PageLayout } from '../../components/PageLayout';
import { meta } from '../../lib/seo';
import { firmInfo } from '../../lib/siteConfig';

const TermsPage = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>{meta.terms.title}</title>
        <meta name="description" content={meta.terms.description} />
      </Head>
      <PageLayout>
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Terms of service</h1>
            <p className="mt-4 text-sm text-slate-500">Last updated: September 20, 2025</p>
            <div className="mt-8 space-y-6 text-base text-slate-600">
              <p>
                By accessing the VH Tax + Accounting Inc. website or client portal, you agree to use the information provided for lawful purposes and to respect all applicable privacy and security requirements.
              </p>
              <p>
                Content on this website is provided for informational purposes and should not be considered formal tax or legal advice. Engagements begin only after we agree in writing on services and deliverables.
              </p>
              <p>
                You are responsible for maintaining the confidentiality of your portal login. Notify us immediately if you suspect unauthorized access so we can secure your account.
              </p>
              <p>
                We may update these terms from time to time. Continued use of the site after changes are posted constitutes acceptance of the revised terms. For questions, contact us at <a href={firmInfo.emailHref} className="text-blue-600 hover:text-blue-700">{firmInfo.email}</a>.
              </p>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
};

export default TermsPage;
