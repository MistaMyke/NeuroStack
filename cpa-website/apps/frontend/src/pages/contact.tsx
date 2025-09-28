import { contactRequestSchema } from '@cpa/shared-types';
import { Button } from '@cpa/ui-library';
import Head from 'next/head';
import type { ChangeEvent, FocusEvent, FormEvent } from 'react';
import { useMemo, useState } from 'react';

import { PageLayout } from '../components/PageLayout';
import { meta } from '../lib/seo';
import { firmInfo } from '../lib/siteConfig';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

const fieldLabels: Record<string, string> = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone number',
  reason: 'Reason for contacting',
  message: 'Message',
};

const ContactPage = (): JSX.Element => {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    message: '',
  });
  const [touched, setTouched] = useState<Record<keyof typeof values, boolean>>({
    name: false,
    email: false,
    phone: false,
    reason: false,
    message: false,
  });

  const parsedPayload = useMemo(() => {
    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim() ? values.phone.trim() : undefined,
      reason: values.reason.trim() ? values.reason.trim() : undefined,
      message: values.message.trim(),
    };

    const validation = contactRequestSchema.safeParse(payload);
    const fieldErrors = validation.success ? {} : validation.error.flatten().fieldErrors;

    return {
      isValid: validation.success,
      data: validation.success ? validation.data : payload,
      fieldErrors,
    };
  }, [values]);

  const getFieldError = (field: keyof typeof values): string | undefined => {
    if (!touched[field]) {
      return undefined;
    }

    return parsedPayload.fieldErrors[field]?.[0];
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const name = event.target.name as keyof typeof values;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setTouched({
      name: true,
      email: true,
      phone: true,
      reason: true,
      message: true,
    });

    if (!parsedPayload.isValid) {
      type FieldKey = keyof typeof fieldLabels;
      const fieldErrors = parsedPayload.fieldErrors as Partial<Record<FieldKey, string[]>>;
      const firstInvalidField = (Object.keys(fieldErrors) as FieldKey[]).find((key) => (fieldErrors[key]?.length ?? 0) > 0);

      if (firstInvalidField) {
        const label = fieldLabels[firstInvalidField] ?? 'Form';
        const detail = fieldErrors[firstInvalidField]?.[0] ?? 'Please review the highlighted fields.';
        setErrorMessage(`${label}: ${detail}`);
      } else {
        setErrorMessage('Please review the highlighted fields.');
      }

      setStatus('error');
      return;
    }

    const configuredBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
    const safeBaseUrl =
      typeof window !== 'undefined' && configuredBaseUrl?.includes('backend')
        ? window.location.origin
        : configuredBaseUrl;

    const endpoint = safeBaseUrl ? `${safeBaseUrl.replace(/\/$/, '')}/contact` : '/contact';

    setStatus('loading');
    setErrorMessage(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedPayload.data),
      });

      if (!response.ok) {
        let message = 'We could not send your message. Please try again or call the office.';

        try {
          const error = await response.json();
          if (error?.error === 'invalid_request' && error.fieldErrors) {
            const invalidFields = Object.keys(error.fieldErrors)
              .filter((key) => (error.fieldErrors?.[key]?.length ?? 0) > 0)
              .map((key) => fieldLabels[key] ?? key);

            if (invalidFields.length > 0) {
              message = `Please double-check: ${invalidFields.join(', ')}.`;
            }
          }
        } catch (parseError) {
          // ignore body parse issues; fall back to default message
        }

        setStatus('error');
        setErrorMessage(message);
        return;
      }

      setStatus('success');
      setValues({
        name: '',
        email: '',
        phone: '',
        reason: '',
        message: '',
      });
      setTouched({
        name: false,
        email: false,
        phone: false,
        reason: false,
        message: false,
      });
    } catch (networkError) {
      setStatus('error');
      setErrorMessage('We could not reach the server. Please try again or call the office.');
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
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      aria-invalid={Boolean(getFieldError('name'))}
                      aria-describedby={getFieldError('name') ? 'contact-name-error' : undefined}
                    />
                    {getFieldError('name') ? (
                      <p id="contact-name-error" className="mt-1 text-xs text-red-600">
                        {getFieldError('name')}
                      </p>
                    ) : null}
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
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      aria-invalid={Boolean(getFieldError('email'))}
                      aria-describedby={getFieldError('email') ? 'contact-email-error' : undefined}
                    />
                    {getFieldError('email') ? (
                      <p id="contact-email-error" className="mt-1 text-xs text-red-600">
                        {getFieldError('email')}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      aria-invalid={Boolean(getFieldError('phone'))}
                      aria-describedby={getFieldError('phone') ? 'contact-phone-error' : undefined}
                    />
                    {getFieldError('phone') ? (
                      <p id="contact-phone-error" className="mt-1 text-xs text-red-600">
                        {getFieldError('phone')}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-slate-700">
                      Reason for contacting
                    </label>
                    <select
                      id="reason"
                      name="reason"
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      value={values.reason}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select a reason</option>
                      <option value="Tax Return">Tax Return</option>
                      <option value="Business Taxes">Business Taxes</option>
                      <option value="Bookkeeping">Bookkeeping</option>
                      <option value="Sales Tax">Sales Tax</option>
                      <option value="IRS Notice">IRS Notice</option>
                      <option value="Other">Other</option>
                    </select>
                    {getFieldError('reason') ? (
                      <p id="contact-reason-error" className="mt-1 text-xs text-red-600">
                        {getFieldError('reason')}
                      </p>
                    ) : null}
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
                      value={values.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      aria-invalid={Boolean(getFieldError('message'))}
                      aria-describedby={getFieldError('message') ? 'contact-message-error' : undefined}
                    />
                    {getFieldError('message') ? (
                      <p id="contact-message-error" className="mt-1 text-xs text-red-600">
                        {getFieldError('message')}
                      </p>
                    ) : null}
                  </div>
                  <Button
                    type="submit"
                    className="w-full transition focus-visible:ring focus-visible:ring-blue-500 disabled:cursor-not-allowed"
                    disabled={status === 'loading' || !parsedPayload.isValid}
                  >
                    {status === 'loading' ? 'Sending…' : 'Send message'}
                  </Button>
                  {status === 'success' ? (
                    <p className="text-sm font-semibold text-green-600" role="status">
                      Thank you! We received your message and will call or email soon.
                    </p>
                  ) : null}
                  {status === 'error' && errorMessage ? (
                    <p className="text-sm font-semibold text-red-600" role="alert">
                      {errorMessage}
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
