import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { PageLayout } from '../components/PageLayout';

const getApiBase = (): string => {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  const safeBase =
    typeof window !== 'undefined' && configured?.includes('backend')
      ? window.location.origin
      : configured;

  return safeBase ? safeBase.replace(/\/$/, '') : '';
};

const buildEndpoint = (path: string): string => {
  const base = getApiBase();
  return base ? `${base}${path}` : path;
};

const isDemoEnabled = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

const DemoPage = (): JSX.Element => {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const handleLogin = async (role: 'client' | 'staff') => {
    setStatus('loading');

    try {
      const response = await fetch(buildEndpoint('/demo/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        throw new Error('login_failed');
      }

      await fetch(buildEndpoint('/demo/seed'), {
        method: 'POST',
        credentials: 'include',
      });

      await router.push('/portal/demo');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <>
      <Head>
        <title>Portal Demo</title>
        <meta name="description" content="Preview the client portal demo experience." />
      </Head>
      <PageLayout>
        <section className="bg-white">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
            <h1 className="text-3xl font-bold text-slate-900">Portal demo</h1>
            <p className="mt-3 text-slate-600">
              Sign in as a demo client or staff member to preview the portal experience.
            </p>

            {!isDemoEnabled ? (
              <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Demo mode is disabled in this environment.
              </p>
            ) : (
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                  onClick={() => handleLogin('client')}
                  disabled={status === 'loading'}
                >
                  Enter as client
                </button>
                <button
                  type="button"
                  className="rounded-md border border-blue-600 px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => handleLogin('staff')}
                  disabled={status === 'loading'}
                >
                  Enter as staff
                </button>
              </div>
            )}

            {status === 'error' ? (
              <p className="mt-4 text-sm text-red-600">
                We could not start the demo. Check that the demo API is running.
              </p>
            ) : null}
          </div>
        </section>
      </PageLayout>
    </>
  );
};

export default DemoPage;
