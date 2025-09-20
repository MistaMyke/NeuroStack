import Link from 'next/link';

import { firmInfo, navigationLinks, quickLinks } from '../lib/siteConfig';

export const SiteFooter = (): JSX.Element => {
  const legalLinks = [
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms of Service', href: '/legal/terms' },
  ];

  return (
    <footer className="border-t border-brand-primary/10 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-brand-slate/80 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="text-base font-semibold text-brand-primary">
            {firmInfo.name}
          </Link>
          <p className="mt-3 max-w-xs text-brand-slate/70">
            Clear, friendly accounting support for individuals and small businesses across Lockport and Niagara County.
          </p>
          <div className="mt-4 space-y-1">
            <p className="font-medium text-brand-slate">Visit or call</p>
            <address className="not-italic text-brand-slate/70">
              {firmInfo.formattedAddress}
            </address>
            <a href={firmInfo.phoneHref} className="block text-brand-primary hover:text-brand-accent">
              {firmInfo.phone}
            </a>
            <a href={firmInfo.emailHref} className="block text-brand-primary hover:text-brand-accent">
              {firmInfo.email}
            </a>
            <p className="text-brand-slate/60">{firmInfo.hoursNote}</p>
          </div>
        </div>
        <div>
          <p className="font-semibold text-brand-slate">Quick links</p>
          <ul className="mt-3 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brand-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-brand-slate">Explore</p>
          <ul className="mt-3 space-y-2">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brand-primary">
                  {link.label}
                </Link>
              </li>
            ))}
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brand-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-primary/10 bg-brand-light/60">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-4 text-xs text-brand-slate/70 sm:flex-row sm:items-center sm:px-6">
          <span>© {new Date().getFullYear()} {firmInfo.name}. All rights reserved.</span>
          <span>Serving Lockport, Niagara County, and neighboring communities.</span>
        </div>
      </div>
    </footer>
  );
};
