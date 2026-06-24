import React from 'react';
import { PALETTE, type PaletteItem } from '../lib/componentRegistry';
import type { Field, FieldKind } from '../types';

interface Props {
  selectedKind: FieldKind | null;
  onSelectKind: (kind: FieldKind | null) => void;
  onPreview: () => void;
  onExport: () => void;
}

export const Sidebar: React.FC<Props> = ({ selectedKind, onSelectKind, onPreview, onExport }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">GUP Prototyper</div>
      <div className="sidebar__section-label">Form components</div>
      <ul className="palette">
        {PALETTE.map((item) => (
          <PaletteChip
            key={item.kind}
            item={item}
            selected={selectedKind === item.kind}
            onClick={() => onSelectKind(selectedKind === item.kind ? null : item.kind)}
          />
        ))}
      </ul>
      <div className="sidebar__hint">
        Drag a chip to drop the default, or click to see variants.
      </div>
      <div className="sidebar__actions">
        <button className="btn btn--ghost" type="button" onClick={onPreview}>
          Preview
        </button>
        <button className="btn btn--primary" type="button" onClick={onExport}>
          Export
        </button>
      </div>
    </aside>
  );
};

interface ChipProps {
  item: PaletteItem;
  selected: boolean;
  onClick: () => void;
}

interface DragPayload {
  kind: FieldKind;
  variantPatch?: Partial<Field>;
}

const PaletteChip: React.FC<ChipProps> = ({ item, selected, onClick }) => {
  const hasVariants = item.variants.length > 1;
  return (
    <li
      className={`palette__chip${selected ? ' palette__chip--selected' : ''}`}
      draggable
      onClick={onClick}
      onDragStart={(e) => {
        const payload: DragPayload = {
          kind: item.kind,
          variantPatch: item.variants[0]?.patch,
        };
        e.dataTransfer.setData('application/x-gup-field', JSON.stringify(payload));
        e.dataTransfer.effectAllowed = 'copy';
      }}
      title={item.hint}
    >
      <span className="palette__chip-grip" aria-hidden>
        ⋮⋮
      </span>
      <span className="palette__chip-label">{item.label}</span>
      {hasVariants && (
        <span className="palette__chip-count" title={`${item.variants.length} variants`}>
          {item.variants.length}
        </span>
      )}
    </li>
  );
};
