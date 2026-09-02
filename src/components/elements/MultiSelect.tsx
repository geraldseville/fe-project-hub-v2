'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import clsx from 'clsx';

import SingleLineField from '@/components/elements/SingleLineField';
import Avatar from '@/components/reusable/Avatar';
import { IconAngleDown, IconClose1, IconSearch } from '@/components/svgs/icons';

export type SelectOption<T = unknown> = {
  id: string;
  color?: string;
  icon?: React.ReactNode;
  image?: string;
  label: string;
  value: string;
  data: T;
};

interface MultiSelectProps<T = unknown> {
  classNames?: {
    root?: string;
    trigger?: string;
    dropdown?: string;
    list?: string;
    option?: string;
    optionSelected?: string;
  };
  id?: string;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  value?: SelectOption<T>[] | null;
  options?: SelectOption<T>[];
  onChange: (selected: SelectOption<T>[]) => void;
}

export default function MultiSelect<T = unknown>({
  classNames,
  id,
  placeholder = 'Select...',
  searchable = false,
  disabled = false,
  value,
  options = [],
  onChange,
}: MultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const hasValues = value && value.length > 0;
  const hasOptions = options.length > 0;

  const filteredOptions = useMemo(() => {
    if (!searchable) return options;

    return options.filter((item: SelectOption<T>) => {
      return item.label.toLowerCase().includes(searchValue.toLowerCase());
    });
  }, [searchValue, options, searchable]);

  const handleSelect = (selectedValue: SelectOption<T>) => {
    const currentValue = value ?? [];
    const isAlreadySelected = currentValue.some(
      (item) => item.id === selectedValue.id,
    );

    if (isAlreadySelected) {
      const updated = currentValue.filter(
        (item) => item.id !== selectedValue.id,
      );
      onChange(updated);
    } else {
      const updated = [...currentValue, selectedValue];
      onChange(updated);
    }
    // Keep dropdown open for multi-select convenience, or close if preferred
  };

  const handleRemove = (e: React.MouseEvent, idToRemove: string) => {
    e.stopPropagation(); // <-- Stops the click event from bubbling up to the trigger button
    const currentValue = value ?? [];
    const updated = currentValue.filter((item) => item.id !== idToRemove);
    onChange(updated);
  };

  useEffect(() => {
    if (isOpen && searchable) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, searchable]);

  // Floating UI setup
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip(),
      shift({ padding: 8 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
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
    <div className={clsx('relative', 'w-full', classNames?.root)} id={id}>
      {/* Trigger */}
      <button
        className={clsx(
          'group',
          'flex justify-start items-center gap-4',
          'w-full min-h-[47px] h-[47px]',
          'py-2 px-4',
          'rounded-lg',
          'bg-[#060E20]',
          'border border-[#464554]',
          'focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-0 focus:ring-offset-[#060E20]',
          disabled && 'is-disabled bg-[#222A3D]',
          classNames?.trigger,
        )}
        ref={setReferenceRef}
        type="button"
        {...getReferenceProps()}
        disabled={disabled}
      >
        <div
          className={clsx(
            'overflow-x-auto scrollbar-hide',
            'flex justify-start items-center gap-2',
            'w-full h-full',
          )}
        >
          {hasValues ? (
            value.map((item) => (
              <div
                className={clsx(
                  'flex justify-center items-center gap-2',
                  'py-1 px-2',
                  'rounded-sm',
                  'bg-[#8083FF]/20',
                )}
                key={item.id}
              >
                {/* Color */}
                {item?.color && (
                  <div
                    className="min-w-2 w-2 h-2 rounded-full bg-white"
                    style={{ backgroundColor: item?.color }}
                  />
                )}
                {/* Icon */}
                {item?.icon && (
                  <div className="min-w-2 w-2 h-2 rounded-full bg-white">
                    {item?.icon}
                  </div>
                )}
                {/* Image */}
                {item?.image ? (
                  <Image
                    className={clsx(
                      'min-w-5 w-5 h-5',
                      'object-cover',
                      'rounded-full',
                    )}
                    src={item.image}
                    alt={item.value}
                    title={item.value}
                    width={24}
                    height={24}
                  />
                ) : (
                  <Avatar
                    className="text-[8px]! min-w-5! w-5! h-5!"
                    initial={item.label.charAt(0)}
                  />
                )}
                {/* Label */}
                <div
                  className={clsx('text-white text-sm leading-tight truncate')}
                >
                  {item.label}
                </div>
                {/* Remove Button with stopPropagation */}
                <div
                  className="cursor-pointer hover:opacity-80"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => handleRemove(e, item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleRemove(e as unknown as React.MouseEvent, item.id);
                    }
                  }}
                >
                  <IconClose1 className="text-white min-w-2.5 w-2.5 h-2.5" />
                </div>
              </div>
            ))
          ) : (
            <div
              className={clsx(
                'italic',
                'text-placeholder text-sm',
                'leading-tight truncate',
              )}
            >
              {placeholder}
            </div>
          )}
        </div>
        {hasOptions && (
          <IconAngleDown
            className={clsx(
              'text-placeholder group-hover:text-white',
              'min-w-2.5 w-2.5 h-2.5',
              'ml-auto',
              isOpen ? 'rotate-180' : 'rotate-0',
              'transition-all duration-200',
            )}
          />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && hasOptions && (
        <FloatingPortal>
          <div
            className={clsx(
              'z-50 overflow-hidden',
              'rounded-lg',
              'bg-[#060E20]',
              'border border-[#464554]',
              'shadow-xl',
              classNames?.dropdown,
            )}
            ref={setFloatingRef}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {/* Search Field */}
            {searchable && (
              <div className={clsx('w-full', 'border-b border-b-[#464554]')}>
                <SingleLineField
                  classNames={{
                    root: 'w-full',
                    input:
                      'w-full rounded-none !border-none outline-none bg-[#171F33]',
                  }}
                  id={`multi-select-search-${id}`}
                  type="search"
                  ref={searchInputRef}
                  placeholder="Search..."
                  icon={<IconSearch />}
                  value={searchValue}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    setSearchValue(newValue);
                  }}
                />
              </div>
            )}
            {/* Dropdown List */}
            {filteredOptions.length ? (
              <div
                className={clsx(
                  'overflow-auto',
                  'w-full max-h-[180px] min-h-auto',
                  classNames?.list,
                )}
              >
                {filteredOptions.map((optionItem) => {
                  const isSelected =
                    value?.some((item) => item.id === optionItem.id) ?? false;

                  return (
                    <button
                      className={clsx(
                        'text-white text-sm text-left',
                        'flex justify-start items-center gap-4',
                        'w-full h-[42px]',
                        'py-2 px-4',
                        'cursor-pointer',
                        isSelected
                          ? [
                              'bg-[#8083FF]/20',
                              'border-l-4 border-l-[#C0C1FF]',
                              classNames?.optionSelected,
                            ]
                          : [
                              'bg-transparent',
                              'hover:bg-[#222A3D]',
                              'border-l-4 border-l-transparent',
                            ],
                        classNames?.option,
                      )}
                      key={optionItem.id}
                      id={`multi-select-${id}-${optionItem.id}`}
                      type="button"
                      aria-label={`Select ${optionItem.label}`}
                      onClick={() => handleSelect(optionItem)}
                    >
                      {/* Color */}
                      {optionItem.color && (
                        <div
                          className="min-w-2 w-2 h-2 rounded-full bg-white"
                          style={{ backgroundColor: optionItem.color }}
                        />
                      )}
                      {/* Icon */}
                      {optionItem.icon && (
                        <div className="min-w-2 w-2 h-2 rounded-full bg-white">
                          {optionItem.icon}
                        </div>
                      )}
                      {/* Image */}
                      {optionItem.image ? (
                        <Image
                          className={clsx(
                            'min-w-6 w-6 h-6',
                            'object-cover',
                            'rounded-full',
                          )}
                          src={optionItem.image}
                          alt={optionItem.value}
                          title={optionItem.value}
                          width={36}
                          height={36}
                        />
                      ) : (
                        <Avatar
                          className="text-[10px]! min-w-6! w-6! h-6!"
                          initial={optionItem.label.charAt(0)}
                        />
                      )}
                      {/* Label */}
                      <div className={clsx('text-white text-sm text-left')}>
                        {optionItem.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div
                className={clsx(
                  'italic',
                  'text-placeholder text-sm',
                  'truncate',
                  'flex justify-start items-center',
                  'h-[42px]',
                  'py-2 px-4',
                )}
              >
                NO MATCHES FOUND
              </div>
            )}
          </div>
        </FloatingPortal>
      )}
    </div>
  );
}
