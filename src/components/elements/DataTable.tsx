import React from 'react';

import clsx from 'clsx';

import InputCheckbox from '@/components/elements/InputCheckbox';
import SkeletonLoading from '@/components/elements/SkeletonLoading';

interface Column<T> {
  field?: keyof T | string;
  header: string;
  thClassName?: string;
  tdClassName?: string;
  render?: (row: T) => React.ReactNode;
}

type SelectionMode = 'none' | 'single' | 'multiple';

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

  const allSelected =
    multiple && value.length > 0 && selectedRows.length === value.length;

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

            {columns.map((column) => (
              <th
                className={clsx('whitespace-nowrap', 'p-4', column.thClassName)}
                key={String(column.field ?? column.header)}
              >
                {column.header}
              </th>
            ))}
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
          ) : value.length > 0 ? (
            value.map((row) => {
              const isSelected = selectedRows.some(
                (item) => getRowId(item) === getRowId(row),
              );

              return (
                <tr
                  className={clsx(
                    // 'h-10',
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
