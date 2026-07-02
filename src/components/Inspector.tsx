import React from 'react';
import type { Field, InputType, Step } from '../types';

interface Props {
  field: Field | null;
  stepperSelected: boolean;
  steps: Step[];
  onChange: (patch: Partial<Field>) => void;
  onClose: () => void;
  onChangeStepTitle: (stepId: string, v: string) => void;
  onAddStep: () => void;
  onAddReviewStep: () => void;
  onRemoveStep: (stepId: string) => void;
  onSetStepCount: (n: number) => void;
  onSetStepKind: (stepId: string, kind: Step['kind']) => void;
}

const INPUT_TYPES: InputType[] = ['text', 'numeric', 'number', 'email', 'tel', 'url', 'date', 'time', 'password'];

export const Inspector: React.FC<Props> = ({
  field,
  stepperSelected,
  steps,
  onChange,
  onClose,
  onChangeStepTitle,
  onAddStep,
  onAddReviewStep,
  onRemoveStep,
  onSetStepCount,
  onSetStepKind,
}) => {
  if (stepperSelected) {
    return (
      <StepperEditor
        steps={steps}
        onChangeStepTitle={onChangeStepTitle}
        onAddStep={onAddStep}
        onAddReviewStep={onAddReviewStep}
        onRemoveStep={onRemoveStep}
        onSetStepCount={onSetStepCount}
        onSetStepKind={onSetStepKind}
        onClose={onClose}
      />
    );
  }

  if (!field) {
    return (
      <aside className="inspector inspector--empty">
        <div className="inspector__hint">
          Click a field on the canvas to edit it, or click the stepper to configure steps.
        </div>
      </aside>
    );
  }

  return (
    <aside className="inspector">
      <div className="inspector__header">
        <span>Edit {field.kind}</span>
        <button className="inspector__close" type="button" onClick={onClose}>×</button>
      </div>

      <TextRow label="Label" value={field.label} onChange={(v) => onChange({ label: v })} />

      {hasPlaceholder(field) && (
        <TextRow
          label="Placeholder"
          value={field.placeholder ?? ''}
          onChange={(v) => onChange({ placeholder: v })}
        />
      )}

      {hasHint(field) && (
        <TextRow
          label="Hint text"
          value={field.hint ?? ''}
          onChange={(v) => onChange({ hint: v })}
        />
      )}

      {hasErrorMessage(field) && (
        <TextRow
          label="Error message"
          value={field.errorMessage ?? ''}
          onChange={(v) => onChange({ errorMessage: v })}
        />
      )}

      {field.kind === 'input-field' && (
        <>
          <SelectRow
            label="Input type"
            value={field.type ?? 'text'}
            options={INPUT_TYPES.map((t) => ({ value: t, label: t }))}
            onChange={(v) => onChange({ type: v as InputType })}
          />
          <TextRow label="Initial value" value={field.value ?? ''} onChange={(v) => onChange({ value: v })} />
          {(field.type === 'number' || field.type === 'date' || field.type === 'time') && (
            <Row2>
              <TextRow label="Min" value={field.min ?? ''} onChange={(v) => onChange({ min: v })} />
              <TextRow label="Max" value={field.max ?? ''} onChange={(v) => onChange({ max: v })} />
            </Row2>
          )}
          {field.type === 'number' && (
            <NumberRow label="Step" value={field.step} onChange={(v) => onChange({ step: v })} />
          )}
          {(field.type === 'numeric' || field.type === 'tel' || field.type === 'text') && (
            <TextRow label="Pattern (regex)" value={field.pattern ?? ''} onChange={(v) => onChange({ pattern: v })} />
          )}
          <NumberRow label="Max length" value={field.maxlength} onChange={(v) => onChange({ maxlength: v })} />
        </>
      )}

      {field.kind === 'textarea' && (
        <>
          <NumberRow label="Rows" value={field.rows} onChange={(v) => onChange({ rows: v })} />
          <NumberRow label="Max length" value={field.maxlength} onChange={(v) => onChange({ maxlength: v })} />
        </>
      )}

      {field.kind === 'checkbox' && (
        <>
          <CheckRow label="Initially checked" value={field.checked} onChange={(v) => onChange({ checked: v })} />
          <CheckRow label="Indeterminate" value={field.indeterminate} onChange={(v) => onChange({ indeterminate: v })} />
          <SelectRow
            label="Size"
            value={field.size ?? 'm'}
            options={[
              { value: 'm', label: 'Medium' },
              { value: 's', label: 'Small' },
            ]}
            onChange={(v) => onChange({ size: v as 's' | 'm' })}
          />
        </>
      )}

      {field.kind === 'toggle' && (
        <>
          <CheckRow label="Initially on" value={field.checked} onChange={(v) => onChange({ checked: v })} />
          <SelectRow
            label="Knob location"
            value={field.knobLocation ?? 'before'}
            options={[
              { value: 'before', label: 'Before label' },
              { value: 'after', label: 'After label' },
            ]}
            onChange={(v) => onChange({ knobLocation: v as 'before' | 'after' })}
          />
        </>
      )}

      {field.kind === 'dropdown' && (
        <>
          <CheckRow label="Multiple" value={field.multiple} onChange={(v) => onChange({ multiple: v })} />
          <CheckRow label="Clearable" value={field.clearable} onChange={(v) => onChange({ clearable: v })} />
        </>
      )}

      {field.kind === 'file-upload' && (
        <>
          <TextRow
            label="File input label"
            value={field.fileInputLabel ?? ''}
            onChange={(v) => onChange({ fileInputLabel: v })}
          />
          <CheckRow label="Allow multiple files" value={field.multipleFiles} onChange={(v) => onChange({ multipleFiles: v })} />
          <CheckRow label="Allow thumbnails" value={field.allowThumbnails} onChange={(v) => onChange({ allowThumbnails: v })} />
          <CheckRow label="Full width" value={field.fullWidth} onChange={(v) => onChange({ fullWidth: v })} />
        </>
      )}

      {field.kind === 'button' && (
        <SelectRow
          label="Appearance"
          value={field.appearance ?? 'primary'}
          options={[
            { value: 'primary', label: 'Primary' },
            { value: 'secondary', label: 'Secondary' },
            { value: 'text', label: 'Text' },
          ]}
          onChange={(v) => onChange({ appearance: v as 'primary' | 'secondary' | 'text' })}
        />
      )}

      {(field.kind === 'radio-group' || field.kind === 'dropdown') && (
        <OptionsEditor field={field} onChange={onChange} />
      )}

      {hasRequired(field) && (
        <CheckRow label="Required" value={field.required} onChange={(v) => onChange({ required: v })} />
      )}
      {hasDisabled(field) && (
        <CheckRow label="Disabled" value={field.disabled} onChange={(v) => onChange({ disabled: v })} />
      )}
      {field.kind === 'input-field' && (
        <CheckRow label="Read-only" value={field.readonly} onChange={(v) => onChange({ readonly: v })} />
      )}
    </aside>
  );
};

const TextRow: React.FC<{ label: string; value: string; onChange: (v: string) => void }> = ({ label, value, onChange }) => (
  <label className="inspector__field">
    <span>{label}</span>
    <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
  </label>
);

const NumberRow: React.FC<{ label: string; value: number | undefined; onChange: (v: number | undefined) => void }> = ({
  label,
  value,
  onChange,
}) => (
  <label className="inspector__field">
    <span>{label}</span>
    <input
      type="number"
      value={value ?? ''}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === '' ? undefined : Number(v));
      }}
    />
  </label>
);

const CheckRow: React.FC<{ label: string; value: boolean | undefined; onChange: (v: boolean) => void }> = ({ label, value, onChange }) => (
  <label className="inspector__check">
    <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
    <span>{label}</span>
  </label>
);

const SelectRow: React.FC<{
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}> = ({ label, value, options, onChange }) => (
  <label className="inspector__field">
    <span>{label}</span>
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </label>
);

const Row2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="inspector__row2">{children}</div>
);

const OptionsEditor: React.FC<{ field: Field; onChange: (patch: Partial<Field>) => void }> = ({ field, onChange }) => (
  <div className="inspector__field">
    <span>Options</span>
    {(field.options ?? []).map((opt, i) => (
      <div className="inspector__option-row" key={i}>
        <input
          type="text"
          value={opt}
          onChange={(e) => {
            const next = [...(field.options ?? [])];
            next[i] = e.target.value;
            onChange({ options: next });
          }}
        />
        <button
          type="button"
          onClick={() => onChange({ options: (field.options ?? []).filter((_, j) => j !== i) })}
          title="Remove option"
        >
          ×
        </button>
      </div>
    ))}
    <button
      type="button"
      className="inspector__add-option"
      onClick={() =>
        onChange({
          options: [...(field.options ?? []), `Option ${(field.options?.length ?? 0) + 1}`],
        })
      }
    >
      + Add option
    </button>
  </div>
);

const StepperEditor: React.FC<{
  steps: Step[];
  onChangeStepTitle: (stepId: string, v: string) => void;
  onAddStep: () => void;
  onAddReviewStep: () => void;
  onRemoveStep: (stepId: string) => void;
  onSetStepCount: (n: number) => void;
  onSetStepKind: (stepId: string, kind: Step['kind']) => void;
  onClose: () => void;
}> = ({ steps, onChangeStepTitle, onAddStep, onAddReviewStep, onRemoveStep, onSetStepCount, onSetStepKind, onClose }) => {
  const hasReview = steps.some((s) => s.kind === 'review');
  return (
  <aside className="inspector">
    <div className="inspector__header">
      <span>Stepper</span>
      <button className="inspector__close" type="button" onClick={onClose}>×</button>
    </div>
    <label className="inspector__field">
      <span>Number of steps</span>
      <input
        type="number"
        min={1}
        max={20}
        value={steps.length}
        onChange={(e) => onSetStepCount(Number(e.target.value))}
      />
    </label>
    <div className="inspector__field">
      <span>Steps</span>
      {steps.map((s, i) => (
        <div className="inspector__step-block" key={s.id}>
          <div className="inspector__option-row">
            <span className="inspector__step-num">{i + 1}</span>
            <input
              type="text"
              value={s.title}
              onChange={(e) => onChangeStepTitle(s.id, e.target.value)}
            />
            <button
              type="button"
              onClick={() => onRemoveStep(s.id)}
              disabled={steps.length <= 1}
              title="Remove step"
            >
              ×
            </button>
          </div>
          <label className="inspector__check inspector__check--indent">
            <input
              type="checkbox"
              checked={s.kind === 'review'}
              onChange={(e) => onSetStepKind(s.id, e.target.checked ? 'review' : 'form')}
            />
            <span>Review step (auto-summary of previous fields)</span>
          </label>
        </div>
      ))}
      <div className="inspector__row2">
        <button type="button" className="inspector__add-option" onClick={onAddStep}>
          + Add step
        </button>
        <button
          type="button"
          className="inspector__add-option"
          onClick={onAddReviewStep}
          disabled={hasReview}
          title={hasReview ? 'You already have a review step — only one allowed.' : 'Append a review step (Application Completed template)'}
        >
          + Add review step
        </button>
      </div>
    </div>
  </aside>
  );
};

function hasPlaceholder(f: Field) {
  return f.kind === 'input-field' || f.kind === 'textarea' || f.kind === 'dropdown';
}
function hasHint(f: Field) {
  return (
    f.kind === 'input-field' ||
    f.kind === 'textarea' ||
    f.kind === 'checkbox' ||
    f.kind === 'toggle' ||
    f.kind === 'radio-group' ||
    f.kind === 'dropdown' ||
    f.kind === 'file-upload'
  );
}
function hasErrorMessage(f: Field) {
  return (
    f.kind === 'input-field' ||
    f.kind === 'textarea' ||
    f.kind === 'checkbox' ||
    f.kind === 'radio-group' ||
    f.kind === 'dropdown' ||
    f.kind === 'file-upload'
  );
}
function hasRequired(f: Field) {
  return (
    f.kind === 'input-field' ||
    f.kind === 'textarea' ||
    f.kind === 'checkbox' ||
    f.kind === 'radio-group' ||
    f.kind === 'dropdown' ||
    f.kind === 'file-upload'
  );
}
function hasDisabled(f: Field) {
  return f.kind !== 'form-section' && f.kind !== 'form-hint' && f.kind !== 'validation-message';
}
