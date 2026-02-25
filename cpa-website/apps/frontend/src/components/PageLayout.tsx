import { type PropsWithChildren } from 'react';
import { useRouter } from 'next/router';

import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import { ChatWidget } from './ChatWidget';

export const PageLayout = ({ children }: PropsWithChildren): JSX.Element => {
  const router = useRouter();
  const isStaffRoute = router.pathname.startsWith('/staff');
  const channel = router.pathname === '/portal' ? 'portal' : 'public';

  return (
    <div className="flex min-h-screen flex-col bg-brand-light text-brand-slate">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-brand-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      {isStaffRoute ? null : <ChatWidget channel={channel} />}
    </div>
  );
};
