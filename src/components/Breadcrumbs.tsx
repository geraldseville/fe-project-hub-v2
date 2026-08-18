'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import clsx from 'clsx';

interface BreadcrumbProps {
  secondLevel?: {
    label: string;
    href?: string;
  };
}

export default function Breadcrumb({ secondLevel }: BreadcrumbProps) {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);

  const root = segments[0];

  const rootConfig = {
    dashboard: {
      label: 'Dashboard',
      href: '/dashboard',
    },
    projects: {
      label: 'Projects',
      href: '/projects',
    },
    teams: {
      label: 'Team',
      href: '/teams',
    },
    settings: {
      label: 'Settings',
      href: '/settings',
    },
  }[root];

  if (!rootConfig) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb">
      <div className="flex items-center gap-2">
        {/* Root */}
        <Link
          className={clsx(
            'font-hanken-grotesk font-medium',
            'text-[14px] leading-tight',
            'text-[#8E94A7]',
            'hover:text-[#DAE2FD]',
            'transition-colors',
          )}
          href={rootConfig.href}
        >
          {rootConfig.label}
        </Link>

        {/* Second level */}
        {secondLevel && (
          <>
            {'/'}
            {secondLevel.href ? (
              <Link
                className={clsx(
                  'font-hanken-grotesk font-medium',
                  'text-[16px] leading-tight',
                  'text-[#DAE2FD]',
                  'hover:text-white',
                  'transition-colors',
                  'truncate',
                  'max-w-60',
                )}
                href={secondLevel.href}
              >
                {secondLevel.label}
              </Link>
            ) : (
              <span
                className={clsx(
                  'font-hanken-grotesk font-medium',
                  'text-[16px] leading-tight',
                  'text-[#DAE2FD]',
                  'truncate',
                  'max-w-60',
                )}
              >
                {secondLevel.label}
              </span>
            )}
          </>
        )}
      </div>
    </nav>
  );
}
