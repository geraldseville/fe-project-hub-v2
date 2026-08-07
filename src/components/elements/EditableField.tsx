import { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';

import { IconPen2 } from '@/components/svgs/icons';

interface EditableFieldProps {
  classNames?: {
    root?: string;
    input?: string;
    button?: string;
  };
  label?: string;
  value: string;
  disabled?: boolean;
  placeholder?: string;
  onSave: (value: string) => void;
}

export default function EditableField({
  classNames,
  label = 'Edit',
  value,
  disabled,
  placeholder,
  onSave,
}: EditableFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState<boolean>(false);

  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const handleSave = () => {
    setEditing(false);

    if (draft !== value) {
      onSave(draft);
    }
  };

  return (
    <div
      className={clsx(
        'group/editable-field',
        'flex items-center gap-2',
        'p-1',
        'border border-transparent hover:border-[#464554]',
        classNames?.root,
      )}
      onDoubleClick={() => {
        if (!disabled) {
          setEditing(true);
        }
      }}
    >
      <input
        className={clsx(
          'flex-1 shrink-0 min-w-10 w-fit',
          'bg-transparent',
          'outline-none',
          !editing && 'pointer-events-none',
          classNames?.input,
        )}
        ref={inputRef}
        value={draft}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSave();
          }

          if (e.key === 'Escape') {
            setDraft(value);
            setEditing(false);
          }
        }}
      />

      {!editing && (
        <button
          className={clsx(
            'invisible group-hover/editable-field:visible',
            classNames?.button,
          )}
          type="button"
          title={label}
          aria-label={label}
          onClick={() => setEditing(true)}
        >
          <IconPen2 className="min-w-3 w-3 h-3" />
        </button>
      )}
    </div>
  );
}
