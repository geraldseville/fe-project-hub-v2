import React from 'react';

import clsx from 'clsx';

import InputCheckbox from '@/components/elements/InputCheckbox';

interface Column<T> {
  field: keyof T;
  header: string;
  render?: (row: T) => React.ReactNode;
}

type SelectionMode = 'none' | 'single' | 'multiple';

interface DataTableProps<T extends Record<string, unknown>> {
  className?: string;
  value: T[];
  columns: Column<T>[];

  selectionMode?: SelectionMode;
  selectedRows?: T[];
  onSelectionChange?: (rows: T[]) => void;
  getRowId: (row: T) => string | number;
}

export default function DataTable<T extends Record<string, unknown>>({
  className,
  value,
  columns,

  selectionMode = 'none',
  selectedRows = [],
  onSelectionChange,
  getRowId,
}: DataTableProps<T>) {
  const selectable = selectionMode !== 'none';

  const multiple = selectionMode === 'multiple';

  const allSelected =
    multiple && value.length > 0 && selectedRows.length === value.length;

  return (
    <div className={clsx('overflow-hidden')}>
      <table className={clsx('text-left', 'w-full', className)}>
        <thead className="h-13 bg-[#131B2E]">
          <tr>
            {multiple && (
              <th className="w-12 px-6">
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
              <th className="p-6" key={String(column.field)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {value.map((row) => {
            const isSelected = selectedRows.some(
              (item) => getRowId(item) === getRowId(row),
            );

            return (
              <tr className="h-10" key={getRowId(row)}>
                {selectable && (
                  <td className="w-12 px-6">
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
                  <td className="p-6" key={String(column.field)}>
                    {column.render
                      ? column.render(row)
                      : String(row[column.field] ?? '')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
