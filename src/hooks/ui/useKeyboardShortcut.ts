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
      const isCtrlOrMeta = ctrl && (event.ctrlKey || event.metaKey);

      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        isCtrlOrMeta &&
        event.shiftKey === shift &&
        event.altKey === alt
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, ctrl, shift, alt, callback]);
}
