import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';

import { PageLayout } from '../../components/PageLayout';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? '';

type ContactStatus = 'RECEIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';

type ContactRequest = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  reason?: string | null;
  message: string;
  status: ContactStatus;
  createdAt: string;
  notes: Array<{
    id: string;
    body: string;
    staffEmail: string;
    createdAt: string;
  }>;
};

const statusOptions: ContactStatus[] = ['RECEIVED', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'];

const storageKey = 'vh-staff-auth';

type AuthState = {
  email: string;
  code: string;
};

const loadAuth = (): AuthState => {
  if (typeof window === 'undefined') {
    return { email: '', code: '' };
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return { email: '', code: '' };
    }

    const parsed = JSON.parse(raw);
    return {
      email: parsed.email ?? '',
      code: parsed.code ?? '',
    };
  } catch {
    return { email: '', code: '' };
  }
};

const saveAuth = (auth: AuthState) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(auth));
};

const StaffContactPage = (): JSX.Element => {
  const [auth, setAuth] = useState<AuthState>(() => loadAuth());
  const [statusFilter, setStatusFilter] = useState<ContactStatus | 'ALL'>('RECEIVED');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  const isAuthenticated = useMemo(() => auth.email.length > 0 && auth.code.length > 0, [auth]);

  const endpoint = useMemo(() => {
    if (!apiBase) {
      return '/staff/contact-requests';
    }

    return `${apiBase.replace(/\/$/, '')}/staff/contact-requests`;
  }, []);

  const headers = useMemo(() => {
    return isAuthenticated
      ? {
          'x-staff-email': auth.email,
          'x-staff-access': auth.code,
        }
      : undefined;
  }, [auth, isAuthenticated]);

  const fetchRequests = async () => {
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = new URL(endpoint, window.location.origin);
      if (statusFilter !== 'ALL') {
        url.searchParams.set('status', statusFilter);
      }

      const response = await fetch(url.toString(), {
        headers,
      });

      if (!response.ok) {
        throw new Error('Unable to load contact requests');
      }

      const payload = (await response.json()) as { results: ContactRequest[] };
      setRequests(payload.results ?? []);
    } catch (err) {
      setError('Could not load contact requests. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests().catch(() => {
      /* handled above */
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, auth.email, auth.code]);

  const handleAuthSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const code = String(formData.get('code') ?? '').trim();

    if (!email || !code) {
      setError('Email and access code are required.');
      return;
    }

    const nextAuth = { email, code };
    setAuth(nextAuth);
    saveAuth(nextAuth);
    setError(null);
  };

  const handleStatusChange = async (id: string, nextStatus: ContactStatus) => {
    if (!headers) {
      return;
    }

    try {
      const response = await fetch(`${endpoint}/${id}`, {
        method: 'PATCH',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        throw new Error('Unable to update status');
      }

      await fetchRequests();
    } catch (err) {
      setError('Could not update the status.');
    }
  };

  const handleAddNote = async (id: string) => {
    if (!headers) {
      return;
    }

    const body = noteDrafts[id]?.trim();
    if (!body) {
      setError('Note must not be empty.');
      return;
    }

    try {
      const response = await fetch(`${endpoint}/${id}/notes`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body }),
      });

      if (!response.ok) {
        throw new Error('Unable to save note');
      }

      setNoteDrafts((prev) => ({ ...prev, [id]: '' }));
      await fetchRequests();
    } catch (err) {
      setError('Could not add note.');
    }
  };

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <Head>
          <title>Staff Login | VH Tax + Accounting</title>
        </Head>
        <div className="mx-auto max-w-md space-y-4 py-16">
          <h1 className="text-2xl font-semibold text-slate-900">Staff access</h1>
          <p className="text-sm text-slate-600">
            Enter your staff email and access code to review contact requests. Codes are temporary until the
            full magic-link auth is launched.
          </p>
          <form onSubmit={handleAuthSubmit} className="space-y-4">
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
                defaultValue={auth.email}
              />
            </div>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-slate-700">
                Access code
              </label>
              <input
                id="code"
                name="code"
                type="password"
                required
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                defaultValue={auth.code}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring focus-visible:ring-blue-500"
            >
              Continue
            </button>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </form>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <Head>
        <title>Contact Requests | Staff</title>
      </Head>
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Contact requests</h1>
              <p className="text-sm text-slate-600">Review incoming inquiries and track follow-ups.</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as ContactStatus | 'ALL')}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="ALL">All statuses</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={fetchRequests}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-500"
              >
                Refresh
              </button>
            </div>
          </div>
          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
          {loading ? <p className="mt-6 text-sm text-slate-600">Loading…</p> : null}
          <div className="mt-6 space-y-6">
            {requests.map((request) => (
              <article key={request.id} className="rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{request.name}</h2>
                    <p className="text-sm text-slate-600">{new Date(request.createdAt).toLocaleString()}</p>
                    <p className="mt-2 text-sm text-slate-700">
                      <span className="font-medium">Email:</span> {request.email}
                    </p>
                    {request.phone ? (
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Phone:</span> {request.phone}
                      </p>
                    ) : null}
                    {request.reason ? (
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Reason:</span> {request.reason}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </label>
                    <select
                      value={request.status}
                      onChange={(event) =>
                        handleStatusChange(request.id, event.target.value as ContactStatus)
                      }
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{request.message}</p>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-slate-900">Internal notes</h3>
                  <div className="mt-2 space-y-2">
                    {request.notes.map((note) => (
                      <div key={note.id} className="rounded border border-slate-200 bg-white px-3 py-2">
                        <p className="text-xs text-slate-500">
                          {note.staffEmail} • {new Date(note.createdAt).toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{note.body}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={noteDrafts[request.id] ?? ''}
                      onChange={(event) =>
                        setNoteDrafts((prev) => ({ ...prev, [request.id]: event.target.value }))
                      }
                      placeholder="Add a note"
                      rows={2}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddNote(request.id)}
                      className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus-visible:ring focus-visible:ring-blue-500"
                    >
                      Save note
                    </button>
                  </div>
                </div>
              </article>
            ))}
            {requests.length === 0 && !loading ? (
              <p className="text-sm text-slate-600">No contact requests match this filter.</p>
            ) : null}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default StaffContactPage;
