import React from 'react';

import clsx from 'clsx';

import { generateProjectColors } from '@/lib/project-colors';

interface ProjectAsTagProps {
  title: string | undefined;
  color: string;
}

export default function ProjectAsTag({ title, color }: ProjectAsTagProps) {
  if (!title) return;

  const {
    primary,
    primaryActive,
    primaryForeground,
    primaryHover,
    secondary,
    secondaryActive,
    secondaryForeground,
    secondaryHover,
    border,
    ring,
  } = generateProjectColors(color);

  return (
    <div
      className={clsx(
        'flex justify-center items-center gap-1',
        'w-fit',
        'ml-auto py-2 px-2',
        'rounded-lg',
        'bg-[var(--project-primary)] hover:bg-[var(--project-primary-hover)]',
        'border border-[var(--project-primary-active)]',
      )}
      style={
        {
          '--project-primary': primary,
          '--project-primary-active': primaryActive,
          '--project-primary-foreground': primaryForeground,
          '--project-primary-hover': primaryHover,
          '--project-secondary': secondary,
          '--project-secondary-active': secondaryActive,
          '--project-secondary-foreground': secondaryForeground,
          '--project-secondary-hover': secondaryHover,
          '--project-border': border,
          '--project-ring': ring,
        } as React.CSSProperties
      }
    >
      <div
        className={clsx(
          'min-w-2 5 w-2 5 h-2 5',
          'rounded-full',
          'bg-[var(--project-secondary-foreground)]',
        )}
      />
      <div
        className={clsx(
          'font-jetbrains-mono font-medium',
          'text-[var(--project-secondary-foreground)] text-[12px] leading-none',
        )}
      >
        {title}
      </div>
    </div>
  );
}
