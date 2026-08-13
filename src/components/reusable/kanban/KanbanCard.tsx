import React from 'react';

import clsx from 'clsx';

interface KanbanCardProps<T> {
  classNames?: {
    root?: string;
    column?: string;
    columnEmpty?: string;
    card?: string;
    cardContent?: string;
    cardAddButton?: string;
  };
  cardIndex: number;
  cardItem: T;
  getCardId: (cardItem: T) => string | number;
  renderCard?: (cardItem: T) => React.ReactNode;
  onCardClick?: (cardItem: T) => void;
}

export default function KanbanCard<T>({
  classNames,
  cardIndex,
  cardItem,
  getCardId,
  renderCard,
  onCardClick,
}: KanbanCardProps<T>) {
  return (
    <div
      className={clsx('relative overflow-hidden', classNames?.card)}
      data-id={getCardId(cardItem)}
      onClick={() => onCardClick?.(cardItem)}
    >
      {renderCard ? (
        renderCard(cardItem)
      ) : (
        <div
          className={clsx(
            'flex justify-center items-center',
            'min-h-20',
            'rounded-md',
            'bg-[#1E293B]',
            'border border-[#908FA0]/20',
            classNames?.cardContent,
          )}
        >
          Card {cardIndex}
        </div>
      )}
    </div>
  );
}
