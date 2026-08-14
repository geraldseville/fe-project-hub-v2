import React from 'react';

import { useDraggable, useDroppable } from '@dnd-kit/core';
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
  isPreview?: boolean;
}

export default function KanbanCard<T>({
  classNames,
  cardIndex,
  cardItem,
  getCardId,
  renderCard,
  onCardClick,
  isPreview = false,
}: KanbanCardProps<T>) {
  const cardId = getCardId(cardItem);
  // The preview renders the same item as the active card. Give it a distinct
  // DnD id so it never replaces the real card's draggable registration.
  const dndId = isPreview ? `preview-${cardId}` : cardId;

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableNodeRef,
    isDragging,
  } = useDraggable({
    id: dndId,
    disabled: isPreview,
  });

  const { setNodeRef: setDroppableNodeRef } = useDroppable({
    id: dndId,
    disabled: isPreview,
  });

  const setNodeRef = (node: HTMLDivElement | null) => {
    setDraggableNodeRef(node);
    setDroppableNodeRef(node);
  };

  return (
    <div
      className={clsx(
        'relative overflow-hidden',
        !isPreview && 'cursor-grab active:cursor-grabbing',
        classNames?.card,
        (isDragging || isPreview) && 'opacity-40',
      )}
      data-id={cardId}
      ref={setNodeRef}
      onClick={isPreview ? undefined : () => onCardClick?.(cardItem)}
      {...(isPreview ? {} : listeners)}
      {...(isPreview ? {} : attributes)}
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
