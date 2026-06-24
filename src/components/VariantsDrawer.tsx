import React from 'react';
import type { PaletteItem } from '../lib/componentRegistry';
import type { Field, FieldKind } from '../types';

interface Props {
  item: PaletteItem | null;
  onClose: () => void;
}

export interface DragPayload {
  kind: FieldKind;
  variantPatch?: Partial<Field>;
}

export const VariantsDrawer: React.FC<Props> = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <aside className="variants-drawer">
      <div className="variants-drawer__header">
        <div>
          <div className="variants-drawer__title">{item.label}</div>
          <div className="variants-drawer__subtitle">{item.hint}</div>
        </div>
        <button type="button" className="variants-drawer__close" onClick={onClose} title="Close">
          ×
        </button>
      </div>
      <div className="variants-drawer__hint">Drag any variant onto a step.</div>
      <ul className="variants-list">
        {item.variants.map((v) => (
          <li
            key={v.id}
            className="variant-card"
            draggable
            onDragStart={(e) => {
              const payload: DragPayload = { kind: item.kind, variantPatch: v.patch };
              e.dataTransfer.setData('application/x-gup-field', JSON.stringify(payload));
              e.dataTransfer.effectAllowed = 'copy';
            }}
            title={v.description}
          >
            <div className="variant-card__label">{v.label}</div>
            <div className="variant-card__desc">{v.description}</div>
          </li>
        ))}
      </ul>
    </aside>
  );
};
