'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';

import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import clsx from 'clsx';

import SingleLineField from '@/components/elements/SingleLineField';
import Avatar from '@/components/reusable/Avatar';
import { IconAngleDown, IconSearch } from '@/components/svgs/icons';

type SelectOption = {
  id: string;
  color?: string;
  icon?: React.ReactNode;
  image?: string;
  custom?: React.ReactNode;
  label: string;
  value: string;
};

interface SingleSelectProps {
  classNames?: {
    root?: string;
    trigger?: string;
    dropdown?: string;
    list?: string;
    option?: string;
  };
  id?: string;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  value?: SelectOption | null;
  options?: SelectOption[];
  onChange: (selected: SelectOption) => void;
}

export default function SingleSelect({
  classNames,
  id,
  placeholder = 'Select...',
  searchable = false,
  disabled = false,
  value,
  options = [],
  onChange,
}: SingleSelectProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [searchValue, setSearchValue] = useState<string>('');

  const hasOptions = options.length > 0;

  const filteredOptions = useMemo(() => {
    if (!searchable) return options;

    return options.filter((item: SelectOption) => {
      return item.label.toLowerCase().includes(searchValue.toLowerCase());
    });
  }, [searchValue, options, searchable]);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const selectedOptionRef = useRef<HTMLButtonElement | null>(null);

  const handleSelect = (selectedValue: SelectOption) => {
    onChange(selectedValue);
    setIsOpen(false);
    setSearchValue('');
  };

  useEffect(() => {
    if (isOpen && searchable) {
      // Use a small timeout to ensure the element is fully mounted and rendered in the DOM
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    if (!isOpen || !value) return;

    const timer = setTimeout(() => {
      selectedOptionRef.current?.scrollIntoView({
        block: 'nearest',
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen, value?.id]);

  // Floating UI setup
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'bottom-start',
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
    <div className={clsx('relative w-full', classNames?.root)} id={id}>
      {/* Trigger */}
      <button
        className={clsx(
          'group',
          'flex justify-start items-center gap-4',
          'w-full h-[47px]',
          'py-2 px-4',
          'rounded-lg',
          'bg-[#060E20]',
          'border border-[#464554]',
          'focus:outline-none focus:ring-1 focus:ring-white focus:ring-offset-0 focus:ring-offset-[#060E20]',
          classNames?.trigger,
          disabled && 'is-disabled bg-[#222A3D]',
        )}
        ref={setReferenceRef}
        {...getReferenceProps()}
        type="button"
        disabled={disabled}
      >
        <SelectOptionContent option={value} placeholder={placeholder} />
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
        <div
          className={clsx(
            'z-50 overflow-hidden',
            'w-full',
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
                id="singleSelectSearch"
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
                const isSelected = value?.id === optionItem.id;

                return (
                  <button
                    className={clsx(
                      'text-white text-sm text-left',
                      'flex justify-start items-center gap-4',
                      'w-full h-[42px]',
                      'py-2 px-4',
                      'cursor-pointer',
                      isSelected
                        ? 'bg-[#8083FF]/20 border-l-4 border-l-[#C0C1FF]'
                        : 'bg-transparent hover:bg-[#222A3D] border-l-4 border-l-transparent',
                      classNames?.option,
                    )}
                    ref={isSelected ? selectedOptionRef : null}
                    key={optionItem.id}
                    type="button"
                    onClick={() => handleSelect(optionItem)}
                  >
                    <SelectOptionContent option={optionItem} />
                  </button>
                );
              })}
            </div>
          ) : (
            <div
              className={clsx(
                'italic truncate',
                'flex justify-start items-center',
                'h-[42px]',
                'py-2 px-4',
              )}
            >
              NO MATCHES FOUND
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SelectOptionContent({
  option,
  placeholder,
}: {
  option?: SelectOption | null;
  placeholder?: string;
}) {
  if (option?.custom) {
    return option.custom;
  }

  return (
    <>
      {option?.color && (
        <div
          className="min-w-2 w-2 h-2 rounded-full"
          style={{ backgroundColor: option.color }}
        />
      )}

      {option?.icon && <div className="min-w-2 w-2 h-2">{option.icon}</div>}

      {option?.image && (
        <Image
          className="min-w-6 w-6 h-6 object-cover rounded-full"
          src={option.image}
          alt={option.value}
          width={36}
          height={36}
        />
      )}

      <div className="text-white text-sm truncate">
        {option ? option.label : placeholder}
      </div>
    </>
  );
}
