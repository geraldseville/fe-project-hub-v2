import React, { useEffect, useState } from 'react';

import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import clsx from 'clsx';

import SkeletonLoading from '@/components/elements/SkeletonLoading';

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
  isLoading?: boolean;
  columns: KanbanColumnData<T>[];
  renderColumnTitle?: (column: KanbanColumnData<T>) => React.ReactNode;
  getCardId: (item: T) => string | number;
  renderCard?: (item: T) => React.ReactNode;
  onCardClick?: (item: T) => void;
  onCardMove?: (
    item: T,
    fromColumn: KanbanColumnData<T>,
    toColumn: KanbanColumnData<T>,
  ) => void;
  addCardRender?: React.ReactNode;
  onAddCardClick?: () => void;
}

export default function KanbanBoard<T>({
  classNames,
  isLoading = false,
  columns: initialColumns,
  renderColumnTitle,
  getCardId,
  renderCard,
  onCardClick,
  onCardMove,
  addCardRender,
  onAddCardClick,
}: KanbanBoardProps<T>) {
  const [columns, setColumns] = useState<KanbanColumnData<T>[]>(initialColumns);

  const [activeItem, setActiveItem] = useState<T | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const findColumn = (itemId: string | number) => {
    return columns.find((column) =>
      column.items.some((item) => getCardId(item) === itemId),
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const itemId = event.active.id;

    const column = findColumn(itemId);

    if (!column) {
      return;
    }

    const item = column.items.find((item) => getCardId(item) === itemId);

    setActiveItem(item ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveItem(null);

    if (!over) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;

    const fromColumn = findColumn(activeId);

    if (!fromColumn) {
      return;
    }

    const toColumn =
      columns.find((column) => column.id === overId) ?? findColumn(overId);

    if (!toColumn) {
      return;
    }

    if (fromColumn.id === toColumn.id) {
      return;
    }

    const item = fromColumn.items.find((item) => getCardId(item) === activeId);

    if (!item) {
      return;
    }

    setColumns((currentColumns) =>
      currentColumns.map((column) => {
        if (column.id === fromColumn.id) {
          return {
            ...column,
            items: column.items.filter((item) => getCardId(item) !== activeId),
          };
        }

        if (column.id === toColumn.id) {
          return {
            ...column,
            items: [...column.items, item],
          };
        }

        return column;
      }),
    );

    onCardMove?.(item, fromColumn, toColumn);
  };

  useEffect(() => {
    if (!isLoading) {
      setColumns(initialColumns);
    }
  }, [initialColumns, isLoading]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className={clsx(
          'overflow-x-auto',
          'flex gap-4',
          'w-full max-h-150 min-h-150 h-150',
          'pb-4',
          classNames?.root,
        )}
      >
        {isLoading
          ? Array.from({ length: 5 }).map((_, colIndex) => {
              return (
                <div
                  className={clsx(
                    'flex flex-col gap-4',
                    'w-80 min-w-80 h-full',
                  )}
                  key={`skeleton-loading-col-${colIndex}`}
                >
                  {/* Column Header */}
                  <div
                    className={clsx(
                      'flex justify-between items-center',
                      'min-h-14',
                      'p-4',
                      'rounded-lg',
                      'bg-[#131B2E]',
                      'border-b border-[#334155]',
                    )}
                  >
                    <SkeletonLoading className="w-20 h-full" />
                    <SkeletonLoading className="w-6 h-6 rounded-full" />
                  </div>
                  {/* Column Body */}
                  <div className="overflow-y-auto">
                    {/* Cards */}
                    <div
                      className={clsx('flex flex-col gap-4', 'flex-1 min-h-0')}
                    >
                      {Array.from({ length: 3 }).map((_, cardIndex) => {
                        return (
                          <div
                            className={clsx(
                              // 'flex justify-center items-center',
                              'p-4',
                              'min-h-20 h-auto',
                              'rounded-md',
                              'bg-[#1E293B]',
                              'border border-[#908FA0]/20',
                              classNames?.cardContent,
                            )}
                            key={`skeleton-loading-card-${cardIndex}`}
                          >
                            <SkeletonLoading className="w-40 h-5" />
                            <div className="flex flex-col gap-2 mt-4">
                              <SkeletonLoading className="w-full h-5" />
                              {/* <SkeletonLoading className="w-full h-5" /> */}
                              <SkeletonLoading className="w-1/4 h-5" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Add Card */}
                    <div
                      className={clsx(
                        'flex justify-center items-center gap-4',
                        'mt-4 p-4',
                        'min-h-20',
                        'rounded-md',
                        'border-2 border-dashed border-[#908FA0]/20',
                        classNames?.cardContent,
                      )}
                    >
                      <SkeletonLoading className="w-8 h-8" />
                      <SkeletonLoading className="w-1/4 h-5" />
                    </div>
                  </div>
                </div>
              );
            })
          : columns.map((column) => (
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
      {!isLoading && (
        <DragOverlay>
          {activeItem && renderCard ? renderCard(activeItem) : null}
        </DragOverlay>
      )}
    </DndContext>
  );
}
