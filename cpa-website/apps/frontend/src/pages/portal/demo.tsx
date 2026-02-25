import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';

import { PageLayout } from '../../components/PageLayout';

type DemoUser = {
  id: string;
  role: 'client' | 'staff';
  name: string;
  email: string;
};

type Engagement = {
  id: string;
  status: string;
  taxYear?: number | null;
  notes?: string | null;
  createdAt: string;
};

type DocumentItem = {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  status: string;
  createdAt: string;
};

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

const DemoPortalPage = (): JSX.Element => {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [engagements, setEngagements] = useState<Engagement[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState<'idle' | 'loading' | 'error'>('idle');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>(
    'idle',
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const activeEngagement = useMemo(() => engagements[0], [engagements]);

  const loadDocuments = async (engagementId: string) => {
    const response = await fetch(buildEndpoint(`/portal/engagements/${engagementId}/documents`), {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('doc_fetch_failed');
    }

    const data = (await response.json()) as { documents: DocumentItem[] };
    setDocuments(data.documents ?? []);
  };

  const loadData = async () => {
    setLoading('loading');

    try {
      const meResponse = await fetch(buildEndpoint('/demo/me'), { credentials: 'include' });
      if (!meResponse.ok) {
        throw new Error('unauthenticated');
      }

      const meData = (await meResponse.json()) as { user: DemoUser };
      setUser(meData.user);

      const engagementsResponse = await fetch(buildEndpoint('/portal/engagements'), {
        credentials: 'include',
      });
      if (!engagementsResponse.ok) {
        throw new Error('engagement_fetch_failed');
      }

      const engagementData = (await engagementsResponse.json()) as { engagements: Engagement[] };
      setEngagements(engagementData.engagements ?? []);

      if (engagementData.engagements?.[0]) {
        await loadDocuments(engagementData.engagements[0].id);
      }

      setLoading('idle');
    } catch (error) {
      setLoading('error');
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile || !activeEngagement) {
      return;
    }

    setUploadStatus('loading');

    try {
      const presignResponse = await fetch(
        buildEndpoint(`/portal/engagements/${activeEngagement.id}/documents/presign`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            filename: selectedFile.name,
            mimeType: selectedFile.type || 'application/octet-stream',
            size: selectedFile.size,
          }),
        },
      );

      if (!presignResponse.ok) {
        throw new Error('presign_failed');
      }

      const presignData = (await presignResponse.json()) as { uploadUrl: string; documentId: string };

      const uploadResult = await fetch(presignData.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': selectedFile.type || 'application/octet-stream',
        },
        body: selectedFile,
      });

      if (!uploadResult.ok) {
        throw new Error('upload_failed');
      }

      await fetch(buildEndpoint(`/portal/documents/${presignData.documentId}/confirm`), {
        method: 'POST',
        credentials: 'include',
      });

      await loadDocuments(activeEngagement.id);
      setSelectedFile(null);
      setUploadStatus('idle');
    } catch (error) {
      setUploadStatus('error');
    }
  };

  const handleDownload = async (documentId: string) => {
    const response = await fetch(buildEndpoint(`/portal/documents/${documentId}/download`), {
      credentials: 'include',
    });

    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as { downloadUrl: string };
    if (data.downloadUrl) {
      window.open(data.downloadUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleMockPayment = async () => {
    if (!activeEngagement) {
      return;
    }

    setPaymentStatus('processing');

    try {
      const createResponse = await fetch(buildEndpoint('/payments/mock/create'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount: 15000, engagementId: activeEngagement.id }),
      });

      if (!createResponse.ok) {
        throw new Error('payment_create_failed');
      }

      const data = (await createResponse.json()) as { paymentId: string };

      const completeResponse = await fetch(buildEndpoint('/payments/mock/complete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ paymentId: data.paymentId, status: 'PAID' }),
      });

      if (!completeResponse.ok) {
        throw new Error('payment_complete_failed');
      }

      setPaymentStatus('success');
    } catch (error) {
      setPaymentStatus('error');
    }
  };

  return (
    <>
      <Head>
        <title>Portal Demo</title>
        <meta name="description" content="Demo view of the client portal." />
      </Head>
      <PageLayout>
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Portal demo</h1>
                <p className="mt-2 text-slate-600">
                  {user
                    ? `Signed in as ${user.name} (${user.role}).`
                    : 'Sign in from the demo page to continue.'}
                </p>
              </div>
              <a
                href="/demo"
                className="rounded-md border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Switch user
              </a>
            </div>

            {loading === 'error' ? (
              <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                We could not load the demo data. Make sure you are signed in via the demo page.
              </div>
            ) : null}

            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-lg font-semibold text-slate-900">Engagement status</h2>
                {activeEngagement ? (
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-semibold text-slate-800">Status:</span>{' '}
                      {activeEngagement.status.replace(/_/g, ' ')}
                    </p>
                    {activeEngagement.taxYear ? (
                      <p>
                        <span className="font-semibold text-slate-800">Tax year:</span>{' '}
                        {activeEngagement.taxYear}
                      </p>
                    ) : null}
                    {activeEngagement.notes ? (
                      <p className="text-slate-500">{activeEngagement.notes}</p>
                    ) : null}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-slate-500">No engagements found yet.</p>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Payments (mock)</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Demonstrates a sample payment flow without real charges.
                </p>
                <button
                  type="button"
                  className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                  onClick={handleMockPayment}
                  disabled={paymentStatus === 'processing' || !activeEngagement}
                >
                  {paymentStatus === 'processing' ? 'Processing...' : 'Simulate payment'}
                </button>
                {paymentStatus === 'success' ? (
                  <p className="mt-3 text-sm text-emerald-600">Payment marked as paid.</p>
                ) : null}
                {paymentStatus === 'error' ? (
                  <p className="mt-3 text-sm text-red-600">Payment could not be processed.</p>
                ) : null}
              </section>
            </div>

            <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Documents</h2>
              <p className="mt-2 text-sm text-slate-600">
                Upload files to the demo MinIO bucket and download them back.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  className="text-sm text-slate-600"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                />
                <button
                  type="button"
                  className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadStatus === 'loading' || !activeEngagement}
                >
                  {uploadStatus === 'loading' ? 'Uploading...' : 'Upload document'}
                </button>
              </div>

              {uploadStatus === 'error' ? (
                <p className="mt-3 text-sm text-red-600">Upload failed. Try again.</p>
              ) : null}

              <div className="mt-6 space-y-3 text-sm text-slate-600">
                {documents.length === 0 ? (
                  <p>No documents uploaded yet.</p>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-100 bg-slate-50 px-3 py-2"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">{doc.filename}</p>
                        <p className="text-xs text-slate-500">
                          {doc.status} · {(doc.size / 1024 / 1024).toFixed(1)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        className="rounded-md border border-blue-600 px-3 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                        onClick={() => handleDownload(doc.id)}
                      >
                        Download
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </section>
      </PageLayout>
    </>
  );
};

export default DemoPortalPage;
