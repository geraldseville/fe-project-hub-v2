import {
  ComponentType,
  SVGProps,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import clsx from 'clsx';
import { motion } from 'motion/react';

import Button from '@/components/elements/Button';
import { IconPlus2 } from '@/components/svgs/icons';

export type NavItem = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
};

interface SidebarProps {
  navList?: NavItem[];
  onNewProject?: () => void;
}

export default function Sidebar({ navList, onNewProject }: SidebarProps) {
  const pathname = usePathname();

  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const activeIndex = navList?.findIndex((item) =>
    pathname.includes(item.href),
  );

  const [activeMenuIndicator, setActiveMenuIndicator] = useState({
    top: 0,
    height: 36,
  });

  useLayoutEffect(() => {
    if (activeIndex === undefined) return;

    const el = navRefs.current[activeIndex];

    if (!el) return;

    setActiveMenuIndicator({
      top: el.offsetTop,
      height: el.offsetHeight,
    });
  }, [pathname, activeIndex]);

  return (
    <div
      className={clsx(
        'relative overflow-auto',
        'max-w-[256px] min-w-[256px] w-full h-full',
        'border-r border-[#464554]',
        'bg-[#171F33]',
      )}
      data-sidebar
    >
      {/* Head */}
      <div
        className={clsx(
          'sticky z-2 top-0',
          'flex flex-row justify-start items-center gap-2',
          'pt-6 px-4 pb-10',
          'bg-[#171F33]',
        )}
      >
        <div className={clsx('min-w-8 w-8 h-8', 'bg-[#C0C1FF]')} />
        <div className="w-full">
          <div className="font-hanken-grotesk font-bold text-[#C0C1FF] text-[20px] leading-tigh">
            Project Hub
          </div>
          <div className="font-jetbrains-mono font-medium text-[#C7C4D7] text-[12px] leading-tight tracking-[0.48px]">
            Enterprise Suite
          </div>
        </div>
      </div>
      {/* Body */}
      <div className={clsx('relative z-1', 'px-4')}>
        <Button
          className="w-full mb-6"
          icon={<IconPlus2 className="min-w-3.5 w-3.5 h-auto" />}
          text="New Project"
          onClick={onNewProject}
        />
        {navList && navList.length > 0 && (
          <nav className="relative flex flex-col gap-1">
            {navList.map((navItem, index) => {
              const Icon = navItem.icon;

              return (
                <Link
                  className={clsx(
                    activeIndex === index ? 'text-[#0D0096]' : 'text-[#C7C4D7]',
                    'relative z-2',
                    'flex items-center gap-4',
                    'h-9',
                    'px-4 py-1',
                  )}
                  key={`nav-${index}-${navItem.label}`}
                  href={navItem.href}
                  ref={(el) => {
                    navRefs.current[index] = el;
                  }}
                >
                  <Icon className="w-4 h-auto" />
                  <span>{navItem.label}</span>
                </Link>
              );
            })}
            {activeMenuIndicator && (
              <motion.div
                className={clsx(
                  'absolute z-1 left-0 top-0 bottom-0',
                  'w-full',
                  'rounded-xs',
                  'bg-[#8083FF]',
                )}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 35,
                }}
                animate={{
                  height: activeMenuIndicator.height,
                  y: activeMenuIndicator.top,
                }}
              />
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
