import React, { useId } from 'react';

import clsx from 'clsx';
import { motion } from 'motion/react';

type TabItem = {
  id: string;
  className?: string;
  icon?: React.ReactNode;
  label?: string;
};

interface SegmentedTabProps {
  classNames?: {
    root?: string;
    tabItem?: string;
    tabItemSelected?: string;
    tabIndicator?: string;
  };
  id?: string;
  disabled?: boolean;
  selected: TabItem;
  options: TabItem[];
  onSelect: (selected: TabItem) => void;
}

export default function SegmentedTab({
  classNames,
  id = 'segmented-tab',
  disabled = false,
  selected,
  options,
  onSelect,
}: SegmentedTabProps) {
  const generatedId = useId();

  const componentId = id || generatedId;

  return (
    <div
      className={clsx(
        'relative overflow-hidden',
        'flex justify-center items-center',
        'h-[47px]',
        'p-1',
        'rounded-md',
        'bg-[#060e20]',
        'border border-[#464554]',
        disabled && 'is-disabled',
        classNames?.root,
      )}
      id={id}
    >
      {options.map((tabItem) => {
        const isSelected = selected.id === tabItem.id;

        return (
          <button
            className={clsx(
              isSelected ? 'text-[#C0C1FF]' : 'text-[#C7C4D7]',
              isSelected && classNames?.tabItemSelected,
              'relative z-10',
              'flex justify-center items-center gap-4',
              'flex-1 min-w-12 w-12 h-full',
              'transition-colors duration-200',
              classNames?.tabItem,
              tabItem.className,
            )}
            key={tabItem.id}
            id={`tab-item-${tabItem.id}`}
            type="button"
            aria-label={tabItem.label || tabItem.id}
            disabled={disabled}
            onClick={() => onSelect(tabItem)}
          >
            {tabItem.icon}
            {tabItem.label && (
              <div className="font-semibold leading-tight">{tabItem.label}</div>
            )}
            {isSelected && (
              <motion.div
                className={clsx(
                  'absolute z-[-1] inset-0',
                  'h-full',
                  'rounded',
                  'bg-[#8083FF]/20',
                  classNames?.tabIndicator,
                )}
                layoutId={`active-view-${componentId}`}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
