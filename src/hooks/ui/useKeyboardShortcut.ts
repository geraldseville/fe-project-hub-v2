import { useEffect } from 'react';

interface UseKeyboardShortcutOptions {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
}

export function useKeyboardShortcut({
  key,
  ctrl = false,
  meta = false,
  shift = false,
  alt = false,
  callback,
}: UseKeyboardShortcutOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMatches = event.key.toLowerCase() === key.toLowerCase();

      const ctrlMatches = event.ctrlKey === ctrl;
      const metaMatches = event.metaKey === meta;
      const shiftMatches = event.shiftKey === shift;
      const altMatches = event.altKey === alt;

      if (
        keyMatches &&
        ctrlMatches &&
        metaMatches &&
        shiftMatches &&
        altMatches
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, ctrl, meta, shift, alt, callback]);
}
