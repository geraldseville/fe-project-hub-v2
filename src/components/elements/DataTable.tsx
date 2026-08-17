import React, { useMemo, useState } from 'react';

import clsx from 'clsx';

import InputCheckbox from '@/components/elements/InputCheckbox';
import SkeletonLoading from '@/components/elements/SkeletonLoading';
import { IconCaretDown, IconCaretUp } from '@/components/svgs/icons';

interface Column<T> {
  field?: keyof T | string;
  header: string;
  sortable?: boolean;
  thClassName?: string;
  tdClassName?: string;
  render?: (row: T) => React.ReactNode;
}

type SelectionMode = 'none' | 'single' | 'multiple';
type SortDirection = 'asc' | 'desc';

interface DataTableProps<T extends Record<string, unknown>> {
  classNames?: {
    root?: string;
    table?: string;
  };

  value: T[];
  columns: Column<T>[];

  selectionMode?: SelectionMode;
  selectedRows?: T[];
  onSelectionChange?: (rows: T[]) => void;
  onRowClick?: (row: T) => void;
  getRowId: (row: T) => string | number;

  emptyMessage?: React.ReactNode;
  isLoading?: boolean;
  loadingRows?: number;
}

export default function DataTable<T extends Record<string, unknown>>({
  classNames,

  value,
  columns,

  selectionMode = 'none',
  selectedRows = [],
  onSelectionChange,
  onRowClick,
  getRowId,

  emptyMessage,
  isLoading = false,
  loadingRows = 5,
}: DataTableProps<T>) {
  const selectable = selectionMode !== 'none';
  const multiple = selectionMode === 'multiple';

  const [sortField, setSortField] = useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const allSelected =
    multiple && value.length > 0 && selectedRows.length === value.length;

  const sortedValue = useMemo(() => {
    if (!sortField) {
      return value;
    }

    return [...value].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue == null && bValue == null) {
        return 0;
      }

      if (aValue == null) {
        return 1;
      }

      if (bValue == null) {
        return -1;
      }

      let result = 0;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        result = aValue - bValue;
      } else if (aValue instanceof Date && bValue instanceof Date) {
        result = aValue.getTime() - bValue.getTime();
      } else {
        result = String(aValue).localeCompare(String(bValue), undefined, {
          numeric: true,
          sensitivity: 'base',
        });
      }

      return sortDirection === 'asc' ? result : -result;
    });
  }, [value, sortField, sortDirection]);

  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !column.field) {
      return;
    }

    if (sortField !== column.field) {
      setSortField(column.field);
      setSortDirection('asc');
      return;
    }

    setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className={clsx('overflow-auto', classNames?.root)}>
      <table className={clsx('text-left', 'w-full', classNames?.table)}>
        <thead
          className={clsx(
            'sticky top-0 z-20',
            'h-13',
            'bg-[#131B2E]',
            'border-y border-[#334155]',
          )}
        >
          <tr>
            {multiple && (
              <th className="w-12 p-4">
                <InputCheckbox
                  id="selectAll"
                  type="checkbox"
                  value={allSelected}
                  onChange={(checked) => {
                    onSelectionChange?.(checked ? value : []);
                  }}
                />
              </th>
            )}

            {columns.map((column) => {
              const isSorted = sortField === column.field;

              return (
                <th
                  className={clsx(
                    'whitespace-nowrap',
                    'p-4',
                    column.thClassName,
                  )}
                  key={String(column.field ?? column.header)}
                >
                  {column.sortable && column.field ? (
                    <button
                      className={clsx(
                        'inline-flex items-center gap-2',
                        'cursor-pointer',
                        'select-none',
                        'hover:text-primary',
                      )}
                      type="button"
                      onClick={() => handleSort(column)}
                    >
                      <span>{column.header}</span>
                      <div className="flex flex-col justify-center items-center -space-y-[1px]">
                        <IconCaretUp
                          className={clsx(
                            'w-2.5 h-2.5',
                            isSorted && sortDirection === 'asc'
                              ? 'text-primary'
                              : 'text-[#908FA0]/50',
                          )}
                        />

                        <IconCaretDown
                          className={clsx(
                            'w-2.5 h-2.5',
                            isSorted && sortDirection === 'desc'
                              ? 'text-primary'
                              : 'text-[#908FA0]/50',
                          )}
                        />
                      </div>
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            Array.from({ length: loadingRows }).map((_, index) => (
              <tr className="h-10" key={`loading-${index}`}>
                {multiple && (
                  <td className="w-12 p-4">
                    <SkeletonLoading className="h-4 w-4" />
                  </td>
                )}

                {columns.map((column, columnIndex) => (
                  <td
                    className={clsx('p-4', column.tdClassName)}
                    key={`loading-${index}-${columnIndex}`}
                  >
                    <SkeletonLoading className="h-4 w-full max-w-48" />
                  </td>
                ))}
              </tr>
            ))
          ) : sortedValue.length > 0 ? (
            sortedValue.map((row) => {
              const isSelected = selectedRows.some(
                (item) => getRowId(item) === getRowId(row),
              );

              return (
                <tr
                  className={clsx(
                    'cursor-pointer',
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-transparent',
                    'hover:bg-primary/8',
                  )}
                  key={getRowId(row)}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className="w-12 p-4">
                      <InputCheckbox
                        id={getRowId(row).toString()}
                        value={isSelected}
                        onChange={(checked) => {
                          if (multiple) {
                            if (checked) {
                              onSelectionChange?.([...selectedRows, row]);
                            } else {
                              onSelectionChange?.(
                                selectedRows.filter(
                                  (item) => getRowId(item) !== getRowId(row),
                                ),
                              );
                            }
                          } else {
                            onSelectionChange?.(checked ? [row] : []);
                          }
                        }}
                      />
                    </td>
                  )}

                  {columns.map((column) => (
                    <td
                      className={clsx('p-4', column.tdClassName)}
                      key={String(column.field ?? column.header)}
                    >
                      {column.render
                        ? column.render(row)
                        : column.field
                          ? String(row[column.field] ?? '')
                          : null}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                className="p-4"
                colSpan={columns.length + (selectable ? 1 : 0)}
              >
                {emptyMessage ? (
                  emptyMessage
                ) : (
                  <div className="text-center">No Data Found</div>
                )}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
