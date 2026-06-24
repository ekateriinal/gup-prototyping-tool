import React from 'react';
import type { Field } from '../types';

interface Props {
  field: Field;
  selected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export const FieldRenderer: React.FC<Props> = ({ field, selected, onSelect, onRemove }) => {
  return (
    <div
      className={`field-wrap${selected ? ' field-wrap--selected' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <button
        type="button"
        className="field-wrap__remove"
        title="Remove"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        ×
      </button>
      <FieldBody field={field} />
    </div>
  );
};

function attrs(o: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(o)) {
    if (v === undefined || v === null || v === false || v === '') continue;
    // Booleans become bare attributes (e.g. <gup-checkbox required>)
    out[k] = v === true ? '' : v;
  }
  return out;
}

const FieldBody: React.FC<{ field: Field }> = ({ field }) => {
  switch (field.kind) {
    case 'input-field': {
      const a = attrs({
        name: field.id,
        type: field.type ?? 'text',
        placeholder: field.placeholder,
        value: field.value,
        min: field.min,
        max: field.max,
        step: field.step,
        pattern: field.pattern,
        maxlength: field.maxlength,
        required: field.required,
        disabled: field.disabled,
        readonly: field.readonly,
        'error-message': field.errorMessage,
      });
      return (
        // @ts-expect-error custom element
        <gup-input-field {...a}>
          {field.label}
          {field.hint && <span slot="hint">{field.hint}</span>}
        {/* @ts-expect-error custom element */}
        </gup-input-field>
      );
    }
    case 'textarea': {
      const a = attrs({
        name: field.id,
        placeholder: field.placeholder,
        rows: field.rows,
        maxlength: field.maxlength,
        required: field.required,
        disabled: field.disabled,
        'error-message': field.errorMessage,
      });
      return (
        // @ts-expect-error custom element
        <gup-textarea-field {...a}>
          {field.label}
          {field.hint && <span slot="hint">{field.hint}</span>}
        {/* @ts-expect-error custom element */}
        </gup-textarea-field>
      );
    }
    case 'checkbox': {
      const a = attrs({
        name: field.id,
        checked: field.checked,
        indeterminate: field.indeterminate,
        size: field.size,
        required: field.required,
        disabled: field.disabled,
        'error-message': field.errorMessage,
      });
      return (
        // @ts-expect-error custom element
        <gup-checkbox {...a}>
          {field.label}
          {field.hint && <span slot="hint">{field.hint}</span>}
        {/* @ts-expect-error custom element */}
        </gup-checkbox>
      );
    }
    case 'toggle': {
      const a = attrs({
        name: field.id,
        checked: field.checked,
        disabled: field.disabled,
        'knob-location': field.knobLocation,
      });
      return (
        // @ts-expect-error custom element
        <gup-toggle {...a}>
          {field.label}
          {field.hint && <span slot="hint">{field.hint}</span>}
        {/* @ts-expect-error custom element */}
        </gup-toggle>
      );
    }
    case 'radio-group': {
      const a = attrs({
        name: field.id,
        required: field.required,
        disabled: field.disabled,
        'error-message': field.errorMessage,
      });
      return (
        // @ts-expect-error custom element
        <gup-radio-button-group {...a}>
          <span slot="label">{field.label}</span>
          {field.hint && <span slot="hint">{field.hint}</span>}
          {(field.options ?? []).map((opt, i) => (
            // @ts-expect-error custom element
            <gup-radio-button key={i} value={`opt-${i}`}>
              {opt}
            {/* @ts-expect-error custom element */}
            </gup-radio-button>
          ))}
        {/* @ts-expect-error custom element */}
        </gup-radio-button-group>
      );
    }
    case 'dropdown': {
      const a = attrs({
        name: field.id,
        placeholder: field.placeholder ?? 'Select an item',
        required: field.required,
        disabled: field.disabled,
        multiple: field.multiple,
        clearable: field.clearable,
        'error-message': field.errorMessage,
      });
      return (
        // @ts-expect-error custom element
        <gup-dropdown-field {...a}>
          <span slot="label-slot">{field.label}</span>
          {field.hint && <span slot="hint">{field.hint}</span>}
          {/* @ts-expect-error custom element */}
          <gup-dropdown-menu>
            {(field.options ?? []).map((opt, i) => (
              // @ts-expect-error custom element
              <gup-dropdown-menu-item key={i} value={`opt-${i}`}>
                {opt}
              {/* @ts-expect-error custom element */}
              </gup-dropdown-menu-item>
            ))}
          {/* @ts-expect-error custom element */}
          </gup-dropdown-menu>
        {/* @ts-expect-error custom element */}
        </gup-dropdown-field>
      );
    }
    case 'file-upload': {
      const a = attrs({
        name: field.id,
        'file-input-label': field.fileInputLabel ?? 'Choose file',
        multiple: field.multipleFiles,
        'allow-thumbnails': field.allowThumbnails,
        'full-width': field.fullWidth,
        required: field.required,
        disabled: field.disabled,
        'error-message': field.errorMessage,
      });
      return (
        // @ts-expect-error custom element
        <gup-file-upload {...a}>
          {field.label}
          {field.hint && <span slot="hint">{field.hint}</span>}
        {/* @ts-expect-error custom element */}
        </gup-file-upload>
      );
    }
    case 'form-section':
      return <h3 className="canvas-section-title">{field.label}</h3>;
    case 'form-hint':
      // @ts-expect-error custom element
      return <gup-form-hint>{field.label}</gup-form-hint>;
    case 'validation-message':
      // @ts-expect-error custom element
      return <gup-form-validation-message>{field.label}</gup-form-validation-message>;
    case 'button':
      return (
        // @ts-expect-error custom element
        <gup-button appearance={field.appearance ?? 'primary'} disabled={field.disabled ? '' : undefined}>
          {field.label}
        {/* @ts-expect-error custom element */}
        </gup-button>
      );
  }
};
