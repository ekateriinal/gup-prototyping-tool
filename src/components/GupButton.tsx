import React, { useEffect, useRef } from 'react';

interface Props {
  appearance?: 'primary' | 'secondary' | 'text';
  slot?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const GupButton: React.FC<Props> = ({ appearance, slot, className, onClick, disabled, children }) => {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !onClick) return;
    const handler = () => onClick();
    el.addEventListener('gup-click', handler);
    return () => el.removeEventListener('gup-click', handler);
  }, [onClick]);

  const props: Record<string, unknown> = {
    ref,
    slot,
    class: className,
  };
  if (appearance) props.appearance = appearance;
  if (disabled) props.disabled = '';

  return <gup-button {...props}>{children}</gup-button>;
};
