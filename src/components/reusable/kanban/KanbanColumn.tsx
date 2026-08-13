import React from 'react';

import clsx from 'clsx';

import { IconPlus1 } from '@/components/svgs/icons';

import KanbanCard from './KanbanCard';

export interface KanbanColumnData<T> {
  id: string;
  title: string;
  items: T[];
}

interface KanbanColumnProps<T> {
  classNames?: {
    root?: string;
    column?: string;
    columnEmpty?: string;
    card?: string;
    cardContent?: string;
    cardAddButton?: string;
  };
  column: KanbanColumnData<T>;
  renderColumnTitle?: (column: KanbanColumnData<T>) => React.ReactNode;
  getCardId: (item: T) => string | number;
  renderCard?: (item: T) => React.ReactNode;
  onCardClick?: (item: T) => void;
  addCardRender?: React.ReactNode;
  onAddCardClick?: () => void;
}

export default function KanbanColumn<T>({
  classNames,
  column,
  renderColumnTitle,
  getCardId,
  renderCard,
  onCardClick,
  addCardRender,
  onAddCardClick,
}: KanbanColumnProps<T>) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-4',
        'w-80 min-w-80',
        'h-full',
        classNames?.column,
      )}
    >
      {/* Column Header */}
      <div
        className={clsx(
          'flex justify-between items-center',
          'p-4',
          'rounded-lg',
          'bg-[#131B2E]',
          'border-b border-[#334155]',
        )}
      >
        {renderColumnTitle ? (
          renderColumnTitle(column)
        ) : (
          <h3 className="font-semibold text-[#DAE2FD]">{column.title}</h3>
        )}
        <span
          className={clsx(
            'flex justify-center items-center',
            'min-w-6 h-6',
            'px-2',
            'rounded-full',
            'bg-[#334155]',
            'text-[#C7C4D7] text-xs',
          )}
        >
          {column.items.length}
        </span>
      </div>

      {/* Column Body */}
      <div className="overflow-y-auto">
        {/* Cards */}
        <div className={clsx('flex flex-col gap-4', 'flex-1 min-h-0')}>
          {column.items.length > 0 ? (
            column.items.map((cardItem, cardIndex) => (
              <KanbanCard
                key={getCardId(cardItem)}
                cardItem={cardItem}
                cardIndex={cardIndex}
                getCardId={getCardId}
                renderCard={renderCard}
                onCardClick={onCardClick}
              />
            ))
          ) : (
            <div
              className={clsx(
                'text-[#64748B] text-sm',
                'flex justify-center items-center',
                'min-h-20',
                'rounded-lg',
                'border-2 border-dashed border-[#334155]',
                classNames?.columnEmpty,
              )}
            >
              No items
            </div>
          )}
        </div>
        {/* Add Card */}
        <button
          className={clsx(
            'group/add-card',
            'w-full',
            'mt-4',
            classNames?.cardAddButton,
          )}
          type="button"
          onClick={onAddCardClick}
        >
          {addCardRender ? (
            addCardRender
          ) : (
            <div
              className={clsx(
                'flex justify-center items-center gap-4',
                'min-h-20',
                'rounded-lg',
                'hover:bg-[#1E293B]',
                'border-2 border-dashed',
                'border-transparent group-hover/add-card:border-primary',
              )}
            >
              <div
                className={clsx(
                  'flex justify-center items-center',
                  'w-12 h-12',
                  'rounded-xl',
                  'bg-[#171F33]',
                )}
              >
                <IconPlus1 className="min-w-3.5 w-3.5 h-auto" />
              </div>
              <div>Add Card</div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
