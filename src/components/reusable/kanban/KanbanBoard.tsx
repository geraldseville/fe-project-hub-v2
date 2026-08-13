import React from 'react';

import clsx from 'clsx';

import KanbanColumn, { type KanbanColumnData } from './KanbanColumn';

interface KanbanBoardProps<T> {
  classNames?: {
    root?: string;
    column?: string;
    columnEmpty?: string;
    card?: string;
    cardContent?: string;
    cardAddButton?: string;
  };
  columns: KanbanColumnData<T>[];
  renderColumnTitle?: (column: KanbanColumnData<T>) => React.ReactNode;
  getCardId: (item: T) => string | number;
  renderCard?: (item: T) => React.ReactNode;
  onCardClick?: (item: T) => void;
  addCardRender?: React.ReactNode;
  onAddCardClick?: () => void;
}

export default function KanbanBoard<T>({
  classNames,
  columns,
  renderColumnTitle,
  getCardId,
  renderCard,
  onCardClick,
  addCardRender,
  onAddCardClick,
}: KanbanBoardProps<T>) {
  return (
    <div
      className={clsx(
        'overflow-x-auto',
        'flex gap-4',
        'w-full max-h-150 min-h-150 h-150',
        'pb-4',
        classNames?.root,
      )}
    >
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          classNames={classNames}
          column={column}
          renderColumnTitle={renderColumnTitle}
          getCardId={getCardId}
          renderCard={renderCard}
          onCardClick={onCardClick}
          addCardRender={addCardRender}
          onAddCardClick={onAddCardClick}
        />
      ))}
    </div>
  );
}
