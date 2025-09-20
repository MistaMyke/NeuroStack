import Head from 'next/head';

import { PageLayout } from '../../components/PageLayout';
import { meta } from '../../lib/seo';
import { firmInfo } from '../../lib/siteConfig';

const PrivacyPage = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>{meta.privacy.title}</title>
        <meta name="description" content={meta.privacy.description} />
      </Head>
      <PageLayout>
        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Privacy policy</h1>
            <p className="mt-4 text-sm text-slate-500">Last updated: September 20, 2025</p>
            <div className="mt-8 space-y-6 text-base text-slate-600">
              <p>
                VH Tax + Accounting Inc. collects limited personal information such as your name, contact details, and documents you choose to share with us. We use this information to deliver accounting services, respond to inquiries, and support your client portal experience.
              </p>
              <p>
                We do not sell your information. We may share data with trusted service providers who assist with secure document storage, communication, or analytics. Those providers are contractually required to safeguard your information and use it only for the services we request.
              </p>
              <p>
                Documents uploaded through the client portal are encrypted in transit and at rest. Access is restricted to authorized team members who need the information to perform their work.
              </p>
              <p>
                If you have questions about this policy or wish to update your information, contact us at <a href={firmInfo.emailHref} className="text-blue-600 hover:text-blue-700">{firmInfo.email}</a> or call <a href={firmInfo.phoneHref} className="text-blue-600 hover:text-blue-700">{firmInfo.phone}</a>.
              </p>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
};

export default PrivacyPage;
