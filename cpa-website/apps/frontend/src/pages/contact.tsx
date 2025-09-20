import Head from 'next/head';
import { useState } from 'react';

import { PageLayout } from '../components/PageLayout';
import { meta } from '../lib/seo';
import { firmInfo } from '../lib/siteConfig';

type FormStatus = 'idle' | 'success' | 'error';

const ContactPage = (): JSX.Element => {
  const [status, setStatus] = useState<FormStatus>('idle');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const hasRequiredFields = formData.get('name') && formData.get('email') && formData.get('message');

    if (hasRequiredFields) {
      setStatus('success');
      form.reset();
    } else {
      setStatus('error');
    }
  };

  return (
    <>
      <Head>
        <title>{meta.contact.title}</title>
        <meta name="description" content={meta.contact.description} />
      </Head>
      <PageLayout>
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Contact</h1>
                <p className="mt-4 text-lg text-slate-600">
                  Call the office or send a message and we will follow up to schedule your appointment.
                </p>
                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-600">Phone</h2>
                    <a href={firmInfo.phoneHref} className="mt-2 block text-lg font-semibold text-slate-900">
                      {firmInfo.phone}
                    </a>
                    <p className="mt-1 text-sm text-slate-600">{firmInfo.hoursNote}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-600">Email</h2>
                    <a href={firmInfo.emailHref} className="mt-2 block text-lg font-semibold text-slate-900">
                      {firmInfo.email}
                    </a>
                    <p className="mt-1 text-sm text-slate-600">We respond within one business day.</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 sm:col-span-2">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-600">Visit</h2>
                    <p className="mt-2 text-base text-slate-600">{firmInfo.formattedAddress}</p>
                    <p className="mt-1 text-sm text-slate-500">Parking available on-site.</p>
                  </div>
                </div>
              </div>
              <div>
                <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-slate-700">
                      Reason for contacting
                    </label>
                    <select
                      id="reason"
                      name="reason"
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      defaultValue="Tax Return"
                    >
                      <option>Tax Return</option>
                      <option>Business Taxes</option>
                      <option>Bookkeeping</option>
                      <option>Sales Tax</option>
                      <option>IRS Notice</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring focus-visible:ring-blue-500"
                  >
                    Send message
                  </button>
                  {status === 'success' ? (
                    <p className="text-sm font-semibold text-green-600" role="status">
                      Thank you! We received your message and will call or email soon.
                    </p>
                  ) : null}
                  {status === 'error' ? (
                    <p className="text-sm font-semibold text-red-600" role="alert">
                      Please complete the required fields (name, email, message).
                    </p>
                  ) : null}
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
              <iframe
                title="Map of VH Tax + Accounting"
                src="https://www.google.com/maps?q=395+Ontario+St,+Lockport,+NY+14094&output=embed"
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
};

export default ContactPage;
