import { type PropsWithChildren } from 'react';

export const PageLayout = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-xl font-semibold text-blue-700">NeuroStack CPA</span>
          <nav className="flex gap-6 text-sm font-medium text-slate-600">
            <a className="transition hover:text-blue-600" href="#services">
              Services
            </a>
            <a className="transition hover:text-blue-600" href="#industries">
              Industries
            </a>
            <a className="transition hover:text-blue-600" href="#contact">
              Contact
            </a>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-slate-500">
          © {new Date().getFullYear()} NeuroStack CPA. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
