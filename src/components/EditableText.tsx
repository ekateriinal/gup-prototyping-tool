import React, { useEffect, useRef } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
  className?: string;
  /** When true, surface a focus ring so users see it's editable. */
  decorated?: boolean;
}

export const EditableText: React.FC<Props> = ({ value, onChange, ariaLabel, className, decorated = true }) => {
  const ref = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.textContent !== value) {
      el.textContent = value;
    }
  }, [value]);

  return (
    <span
      ref={ref}
      role="textbox"
      aria-label={ariaLabel}
      className={`editable${decorated ? ' editable--decorated' : ''} ${className ?? ''}`}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onBlur={(e) => {
        const v = (e.target as HTMLSpanElement).textContent ?? '';
        const next = v.trim() === '' ? value : v;
        if (next !== value) onChange(next);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          (e.target as HTMLSpanElement).blur();
        }
      }}
    />
  );
};
