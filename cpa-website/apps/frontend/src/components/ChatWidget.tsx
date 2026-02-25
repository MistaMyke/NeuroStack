import { useMemo, useRef, useState } from 'react';

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
};

type TicketState = {
  name: string;
  email: string;
  message: string;
};

type ChatWidgetProps = {
  channel: 'public' | 'portal';
};

type ChatStatus = 'idle' | 'loading' | 'error';
type TicketStatus = 'idle' | 'loading' | 'success' | 'error';

const initialMessages: ChatMessage[] = [
  {
    id: 'intro',
    role: 'assistant',
    content:
      'Hi! I can help with scheduling, document checklists, portal access, and general questions. Please do not share sensitive personal or account information.',
  },
];

const createId = (): string =>
  `msg-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

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

export const ChatWidget = ({ channel }: ChatWidgetProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [chatStatus, setChatStatus] = useState<ChatStatus>('idle');
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>('idle');
  const [showTicket, setShowTicket] = useState(false);
  const [ticket, setTicket] = useState<TicketState>({
    name: '',
    email: '',
    message: '',
  });
  const sessionId = useRef(`session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`);

  const canSend = input.trim().length > 1 && chatStatus !== 'loading';
  const canSubmitTicket = useMemo(
    () =>
      ticket.name.trim().length > 1 &&
      ticket.email.trim().includes('@') &&
      ticket.message.trim().length > 9,
    [ticket],
  );

  const appendMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleSend = async () => {
    if (!canSend) {
      return;
    }

    const message = input.trim();
    setInput('');
    appendMessage({ id: createId(), role: 'user', content: message });
    setChatStatus('loading');

    try {
      const response = await fetch(buildEndpoint('/ai/chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          channel,
          sessionId: sessionId.current,
        }),
      });

      if (!response.ok) {
        throw new Error('chat_failed');
      }

      const data = (await response.json()) as {
        reply?: string;
        needsEscalation?: boolean;
      };

      appendMessage({
        id: createId(),
        role: 'assistant',
        content:
          data.reply ??
          'I had trouble finding the right answer. You can ask me to send this to the team.',
      });

      if (data.needsEscalation) {
        setShowTicket(true);
        setTicket((prev) => ({
          ...prev,
          message,
        }));
      }

      setChatStatus('idle');
    } catch (error) {
      setChatStatus('error');
      appendMessage({
        id: createId(),
        role: 'assistant',
        content:
          'Sorry, I ran into an issue. Please try again or use the send-to-team option.',
      });
      setShowTicket(true);
    }
  };

  const handleTicketSubmit = async () => {
    if (!canSubmitTicket || ticketStatus === 'loading') {
      return;
    }

    setTicketStatus('loading');

    try {
      const response = await fetch(buildEndpoint('/ai/ticket'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: ticket.name.trim(),
          email: ticket.email.trim(),
          message: ticket.message.trim(),
          channel,
          sessionId: sessionId.current,
        }),
      });

      if (!response.ok) {
        throw new Error('ticket_failed');
      }

      setTicketStatus('success');
    } catch (error) {
      setTicketStatus('error');
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen ? (
        <div className="pointer-events-auto w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">VH Tax Assistant</p>
              <p className="text-xs text-slate-500">General questions only</p>
            </div>
            <button
              type="button"
              className="text-xs font-semibold text-slate-500 transition hover:text-slate-700"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
          <div className="max-h-72 space-y-3 overflow-y-auto px-4 py-3 text-sm text-slate-700">
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === 'assistant'
                    ? 'rounded-xl bg-slate-100 px-3 py-2'
                    : 'rounded-xl bg-blue-600 px-3 py-2 text-white'
                }
              >
                {message.content}
              </div>
            ))}
          </div>
          <div className="border-t border-slate-200 px-4 py-3">
            <label className="text-xs font-semibold text-slate-600" htmlFor="ai-input">
              Ask a question
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="ai-input"
                type="text"
                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
                placeholder="How do I schedule an appointment?"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                type="button"
                className="rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                onClick={handleSend}
                disabled={!canSend}
              >
                Send
              </button>
            </div>
            {chatStatus === 'error' ? (
              <p className="mt-2 text-xs text-red-600">We hit a snag. Try again or send to the team.</p>
            ) : null}
            <p className="mt-2 text-xs text-slate-500">
              Please avoid sharing SSNs, account numbers, or other sensitive data here.
            </p>
          </div>
          <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
            {!showTicket ? (
              <button
                type="button"
                className="text-xs font-semibold text-blue-600"
                onClick={() => setShowTicket(true)}
              >
                Send this to the team
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-600">Need follow-up? Send a request.</p>
                <input
                  type="text"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Your name"
                  value={ticket.name}
                  onChange={(event) => setTicket((prev) => ({ ...prev, name: event.target.value }))}
                />
                <input
                  type="email"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Email address"
                  value={ticket.email}
                  onChange={(event) => setTicket((prev) => ({ ...prev, email: event.target.value }))}
                />
                <textarea
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Tell us what you need help with"
                  value={ticket.message}
                  onChange={(event) => setTicket((prev) => ({ ...prev, message: event.target.value }))}
                />
                <button
                  type="button"
                  className="w-full rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  onClick={handleTicketSubmit}
                  disabled={!canSubmitTicket || ticketStatus === 'loading'}
                >
                  {ticketStatus === 'loading' ? 'Sending...' : 'Send to team'}
                </button>
                {ticketStatus === 'success' ? (
                  <p className="text-xs text-emerald-600">Thanks! We will follow up shortly.</p>
                ) : null}
                {ticketStatus === 'error' ? (
                  <p className="text-xs text-red-600">We could not send that. Please call the office.</p>
                ) : null}
              </div>
            )}
          </div>
        </div>
      ) : null}
      <button
        type="button"
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? 'Hide chat' : 'Ask a question'}
      </button>
    </div>
  );
};
