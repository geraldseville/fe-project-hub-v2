import clsx from 'clsx';

import Breadcrumb from '@/components/Breadcrumbs';
import { IconQuestionMarkCircle1, IconSearch } from '@/components/svgs/icons';

interface AppShellHeadProps {
  breadcrumb?: {
    label: string;
    href?: string;
  };
}

export default function AppShellHead({ breadcrumb }: AppShellHeadProps) {
  return (
    <div
      className={clsx(
        'min-h-16 h-16',
        'py-2 px-6',
        'border-b border-[#464554]',
      )}
    >
      <div
        className={clsx('flex justify-between items-center gap-4', 'h-full')}
      >
        {/* Left */}
        <div className="flex-1 min-w-40">
          <Breadcrumb secondLevel={breadcrumb} />
        </div>
        {/* Center */}
        <div className="min-w-40">
          {/* Global Search */}
          <button
            className={clsx(
              'flex justify-start items-center gap-3',
              'min-w-50 w-50 h-10',
              'py-1 px-3',
              'rounded-md',
              'transition-colors duration-200 ease-in-out',
              'bg-[#060E20]',
              'border border-[#464554] hover:border-white',
            )}
            type="button"
          >
            <IconSearch className="min-w-3.5 w-3.5 h-3.5" />
            <div>Search</div>
            <div className="ml-auto">Ctrl + K</div>
          </button>
        </div>
        {/* Right */}
        <div className="flex-1 min-w-40">
          <IconQuestionMarkCircle1
            className={clsx('min-w-5 w-5 h-5', 'ml-auto')}
          />
        </div>
      </div>
    </div>
  );
}
