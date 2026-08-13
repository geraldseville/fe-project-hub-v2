import React from 'react';

import { useDraggable } from '@dnd-kit/core';
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
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: getCardId(cardItem),
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      className={clsx(
        'relative overflow-hidden',
        'cursor-grab active:cursor-grabbing',
        classNames?.card,
        isDragging && 'opacity-40',
      )}
      data-id={getCardId(cardItem)}
      ref={setNodeRef}
      onClick={() => onCardClick?.(cardItem)}
      style={style}
      {...listeners}
      {...attributes}
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
          <div>Card {cardIndex}</div>
        </div>
      )}
    </div>
  );
}
