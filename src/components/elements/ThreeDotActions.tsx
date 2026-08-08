'use client';

import { useCallback, useState } from 'react';

import {
  autoUpdate,
  flip,
  offset,
  type Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import clsx from 'clsx';

import { IconKebab1, IconMeatballs1 } from '@/components/svgs/icons';

type Action = {
  id: string;
  color?: string;
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
};

interface ThreeDotActionsProps {
  classNames?: {
    root?: string;
    trigger?: string;
    dropdown?: string;
  };
  orientation?: 'Vertical' | 'Horizontal';
  placement?: Placement;
  actions?: Action[];
}

export default function ThreeDotActions({
  classNames,
  orientation = 'Vertical',
  actions,
  placement = 'bottom-start',
}: ThreeDotActionsProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const hasActions = actions && actions.length > 0;

  // Floating UI setup
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  });

  const click = useClick(context);

  const dismiss = useDismiss(context);

  const role = useRole(context, { role: 'listbox' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const setReferenceRef = useCallback(
    (node: HTMLButtonElement | null) => {
      refs.setReference(node);
    },
    [refs],
  );

  const setFloatingRef = useCallback(
    (node: HTMLDivElement | null) => {
      refs.setFloating(node);
    },
    [refs],
  );

  return (
    <>
      {/* Trigger */}
      <button
        className={clsx(
          'group',
          'flex justify-center items-center',
          'min-w-8 w-8 h-8 p-1',
          'rounded-md',
          'hover:bg-[#8083FF]/20',
          classNames?.trigger,
        )}
        ref={setReferenceRef}
        type="button"
        {...getReferenceProps({
          onClick(e) {
            e.stopPropagation();
            e.preventDefault();
          },
        })}
      >
        {orientation === 'Vertical' && <IconKebab1 className="" />}
        {orientation === 'Horizontal' && <IconMeatballs1 className="" />}
      </button>

      {/* Dropdown */}
      {isOpen && hasActions && (
        <div
          className={clsx(
            'z-50 overflow-hidden',
            'max-w-[195px] min-w-[195px] w-full',
            'p-1',
            'rounded-lg',
            'bg-[#060E20]',
            'border border-[#908FA0]/30',
            'shadow-xl',
            classNames?.dropdown,
          )}
          ref={setFloatingRef}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <div className="flex flex-col gap-1">
            {actions?.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  className={clsx(
                    'flex justify-start items-center gap-4',
                    'w-full h-10',
                    'py-3 px-4',
                    'rounded-sm',
                    'bg-transparent hover:bg-[#8083FF]/20',
                  )}
                  key={`action-${item.id}`}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    item.onClick();
                    setIsOpen(false);
                  }}
                  style={{
                    color: item.color,
                  }}
                >
                  {Icon}
                  <div
                    className={clsx('font-medium', 'text-[14px] leading-tight')}
                  >
                    {item.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
