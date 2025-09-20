import Link from 'next/link';
import { useState } from 'react';

import { firmInfo, navigationLinks } from '../lib/siteConfig';

export const SiteHeader = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-brand-primary/15 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-semibold text-brand-primary md:text-xl">
            {firmInfo.name}
          </Link>
          <span className="hidden text-sm text-brand-slate/70 lg:inline">
            {firmInfo.hoursNote}
          </span>
        </div>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-brand-primary/30 px-3 py-2 text-sm font-medium text-brand-slate transition hover:bg-brand-primary/10 focus:outline-none focus-visible:ring focus-visible:ring-brand-accent md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          Menu
        </button>
        <div className="hidden items-center gap-6 md:flex">
          <nav aria-label="Primary" className="flex items-center gap-4 text-sm font-medium text-brand-slate/80">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-blue-600">
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href={firmInfo.phoneHref}
            className="rounded-full bg-gradient-to-r from-brand-primary to-brand-accent px-4 py-2 text-sm font-semibold text-white shadow-brand transition hover:from-brand-accent hover:to-brand-primary focus:outline-none focus-visible:ring focus-visible:ring-brand-accent/40"
          >
            Call {firmInfo.phone}
          </a>
        </div>
      </div>
      {isMenuOpen ? (
        <div className="border-t border-brand-primary/15 bg-white md:hidden" id="primary-navigation">
          <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-sm font-medium text-brand-slate sm:px-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 transition hover:bg-brand-primary/10 hover:text-brand-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={firmInfo.phoneHref}
              className="rounded-md bg-gradient-to-r from-brand-primary to-brand-accent px-3 py-2 text-center font-semibold text-white shadow-brand"
            >
              Call {firmInfo.phone}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
};
