'use client';

import clsx from 'clsx';

import type { Pagination } from '@/types/generic.types';

import Button from '@/components/elements/Button';
import SingleSelect from '@/components/elements/SingleSelect';

interface PaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  pageSizeOptions?: number[];
}

export default function Pagination({
  pagination,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [10, 20, 50, 100],
}: PaginationProps) {
  const { page, limit, total, totalPages, hasNextPage, hasPreviousPage } =
    pagination;

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    pages.push(1);

    if (page > 4) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let currentPage = start; currentPage <= end; currentPage++) {
      pages.push(currentPage);
    }

    if (page < totalPages - 3) {
      pages.push('ellipsis');
    }

    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const firstItemIndex = (pagination.page - 1) * pagination.limit;
  const lastItemIndex = Math.min(
    pagination.page * pagination.limit,
    pagination.total,
  );

  return (
    <div
      className={clsx(
        'flex flex-wrap justify-between items-center gap-4 shrink-0',
        'p-4',
        'border-t border-t-[#334155]',
      )}
    >
      {/* Left */}
      <div className="flex justify-start items-center gap-4 flex-1">
        {/* Per page */}
        <SingleSelect
          classNames={{ root: 'w-40!', trigger: 'h-8!' }}
          id="rowsPerPage"
          placeholder="Rows per page"
          value={{
            id: `rowPerPage-${limit}`,
            label: `${limit} per page`,
            value: limit,
          }}
          options={pageSizeOptions.map((opt) => ({
            id: `rowPerPage-${opt}`,
            label: `${opt} per page`,
            value: opt,
          }))}
          onChange={(e) => {
            const newLimit = Number(e.value);

            onLimitChange?.(newLimit);

            // Reset to first page when changing page size.
            onPageChange(1);
          }}
        />
        <div className="whitespace-nowrap">
          Showing {pagination.total === 0 ? 0 : firstItemIndex + 1} -{' '}
          {lastItemIndex} of {pagination.total}
        </div>
      </div>
      {/* Center */}
      <div className="flex items-center gap-1">
        {/* Page numbers */}
        {pageNumbers.map((pageNumber, index) =>
          pageNumber === 'ellipsis' ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={clsx(
                'flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm',
                'transition-colors',
                pageNumber === page
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted',
              )}
            >
              {pageNumber}
            </button>
          ),
        )}
      </div>
      {/* Right */}
      <div className="flex justify-end items-center gap-4 flex-1">
        {/* Previous */}
        <Button
          className={clsx(
            'hover:text-neutral',
            'min-w-20! h-8!',
            'py-1 px-3',
            'hover:bg-[#C0C1FF]',
            'border-[#C0C1FF]',
            page === 1 && 'opacity-50!',
          )}
          buttonStyle="outlined"
          type="button"
          text="Prev"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(page - 1)}
        />
        {/* Next */}
        <Button
          className={clsx(
            'hover:text-neutral',
            'min-w-20! h-8!',
            'py-1 px-3',
            'hover:bg-[#C0C1FF]',
            'border-[#C0C1FF]',
            page === totalPages && 'opacity-50!',
          )}
          buttonStyle="outlined"
          type="button"
          text="Next"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </div>
  );
}
