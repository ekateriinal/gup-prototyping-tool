import React, { useRef, useState } from 'react';
import type { Field, FieldKind, Step } from '../types';
import { FieldRenderer } from './FieldRenderer';
import { EditableText } from './EditableText';
import { GupButton } from './GupButton';

interface Props {
  contentHeader: string;
  steps: Step[];
  currentStep: number;
  selectedFieldId: string | null;
  stepperSelected: boolean;
  onChangeContentHeader: (v: string) => void;
  onChangeStepTitle: (stepId: string, v: string) => void;
  onChangeStepDescription: (stepId: string, v: string) => void;
  onChangeStepReference?: (stepId: string, v: string) => void;
  onChangeReviewHeading?: (stepId: string, v: string) => void;
  onChangeReviewInstructions?: (stepId: string, v: string) => void;
  onDropField: (stepId: string, kind: FieldKind, index: number, variantPatch?: Partial<Field>) => void;
  onReorderField: (stepId: string, fieldId: string, targetIndex: number) => void;
  onSelectField: (id: string | null) => void;
  onSelectStepper: () => void;
  onRemoveField: (stepId: string, id: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

export const Canvas: React.FC<Props> = (props) => {
  const {
    contentHeader,
    steps,
    currentStep,
    selectedFieldId,
    stepperSelected,
    onChangeContentHeader,
    onChangeStepTitle,
    onChangeStepDescription,
    onChangeStepReference,
    onChangeReviewHeading,
    onChangeReviewInstructions,
    onDropField,
    onReorderField,
    onSelectField,
    onSelectStepper,
    onRemoveField,
    onBack,
    onContinue,
  } = props;

  const step = steps[currentStep];
  const isLastStep = currentStep >= steps.length - 1;

  return (
    <div className="canvas-shell" onClick={() => onSelectField(null)}>
      <gup-header role="banner">
        <gup-track slot="start">
          <GupButton appearance="text">
            Save &amp; exit
            <gup-icon slot="icon-start" icon-name="close" height="24" width="24"></gup-icon>
          </GupButton>
        </gup-track>
        <gup-track slot="end" horizontal-alignment="right">
          <GupButton appearance="text">
            Do you need help?
            <gup-icon slot="icon-start" icon-name="live-help" height="24" width="24"></gup-icon>
          </GupButton>
        </gup-track>
      </gup-header>

      <gup-content-header>
        <span slot="page-title">
          <EditableText
            value={contentHeader}
            onChange={onChangeContentHeader}
            ariaLabel="Page title"
          />
        </span>
      </gup-content-header>

      <gup-wizard-main role="main" aria-label="Wizard steps">
        <div
          className={`stepper-area${stepperSelected ? ' stepper-area--selected' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelectField(null);
            onSelectStepper();
          }}
        >
          <gup-details open content-appearance="sink" closed-icon="add-circle" open-icon="remove-circle">
            <span slot="label">{`Step ${currentStep + 1} of ${steps.length}`}</span>
            <gup-stepper static-mode>
              {steps.map((s, i) => {
                const stepType =
                  i < currentStep ? 'done' : i === currentStep ? 'selected' : undefined;
                const itemProps: Record<string, unknown> = {
                  'step-number': i + 1,
                  'static-mode': '',
                };
                if (stepType) itemProps['step-type'] = stepType;
                return (
                  <gup-stepper-item key={s.id} {...itemProps}>
                    <span slot="label">{s.title}</span>
                  </gup-stepper-item>
                );
              })}
            </gup-stepper>
          </gup-details>
        </div>

        <h2 id={`step-${currentStep}-heading`} style={{ fontSize: 28, fontWeight: 700, marginTop: 'var(--gup-spacing-between-text, 1.5rem)' }}>
          <EditableText
            value={step.title}
            onChange={(v) => onChangeStepTitle(step.id, v)}
            ariaLabel="Step heading"
          />
        </h2>
        <p className="step-description">
          <EditableText
            value={step.description}
            onChange={(v) => onChangeStepDescription(step.id, v)}
            ariaLabel="Step description"
          />
        </p>

        {step.kind === 'review' ? (
          <ReviewContent
            priorFormSteps={steps.slice(0, currentStep).filter((s) => s.kind === 'form')}
            reviewStep={step}
            onChangeHeading={(v) => onChangeReviewHeading?.(step.id, v)}
            onChangeInstructions={(v) => onChangeReviewInstructions?.(step.id, v)}
          />
        ) : (
          <form onSubmit={(e) => e.preventDefault()} aria-labelledby={`step-${currentStep}-heading`}>
            <gup-form-section>
              <gup-form-list>
                <DropZone
                  stepId={step.id}
                  fields={step.fields}
                  selectedFieldId={selectedFieldId}
                  onDropField={(kind, index, variantPatch) => onDropField(step.id, kind, index, variantPatch)}
                  onReorderField={(fieldId, index) => onReorderField(step.id, fieldId, index)}
                  onSelectField={onSelectField}
                  onRemoveField={(id) => onRemoveField(step.id, id)}
                />
              </gup-form-list>
            </gup-form-section>
          </form>
        )}
      </gup-wizard-main>

      <gup-wizard-footer role="contentinfo">
        <GupButton slot="start" appearance="secondary" onClick={onBack} disabled={currentStep === 0}>
          <gup-icon slot="icon-start" icon-name="arrow-back" height="24" width="24"></gup-icon>
          Back
        </GupButton>
        <GupButton slot="end" appearance="primary" onClick={onContinue}>
          {continueLabel(step, isLastStep)}
          <gup-icon slot="icon-end" icon-name="arrow-forward" height="24" width="24"></gup-icon>
        </GupButton>
      </gup-wizard-footer>
    </div>
  );
};

const NEW_FIELD_TYPE = 'application/x-gup-field';
const REORDER_TYPE = 'application/x-gup-reorder';

const DropZone: React.FC<{
  stepId: string;
  fields: Field[];
  selectedFieldId: string | null;
  onDropField: (kind: FieldKind, index: number, variantPatch?: Partial<Field>) => void;
  onReorderField: (fieldId: string, targetIndex: number) => void;
  onSelectField: (id: string | null) => void;
  onRemoveField: (id: string) => void;
}> = ({ fields, selectedFieldId, onDropField, onReorderField, onSelectField, onRemoveField }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isDragInside, setIsDragInside] = useState(false);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const dragDepth = useRef(0);

  const isOurDrag = (e: React.DragEvent) =>
    e.dataTransfer.types.includes(NEW_FIELD_TYPE) ||
    e.dataTransfer.types.includes(REORDER_TYPE);

  const isReorderDrag = (e: React.DragEvent) =>
    e.dataTransfer.types.includes(REORDER_TYPE);

  const handleZoneEnter = (e: React.DragEvent) => {
    if (!isOurDrag(e)) return;
    dragDepth.current++;
    setIsDragInside(true);
  };
  const handleZoneLeave = (e: React.DragEvent) => {
    if (!isOurDrag(e)) return;
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) {
      setIsDragInside(false);
      setHoverIndex(null);
    }
  };

  const finishDrag = () => {
    dragDepth.current = 0;
    setIsDragInside(false);
    setHoverIndex(null);
    setReorderingId(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    const reorderRaw = e.dataTransfer.getData(REORDER_TYPE);
    const newRaw = e.dataTransfer.getData(NEW_FIELD_TYPE);
    finishDrag();

    if (reorderRaw) {
      try {
        const { fieldId } = JSON.parse(reorderRaw) as { fieldId: string };
        const currentIdx = fields.findIndex((f) => f.id === fieldId);
        if (currentIdx === -1) return;
        const landIndex = currentIdx < targetIndex ? targetIndex - 1 : targetIndex;
        if (landIndex === currentIdx) return;
        onReorderField(fieldId, landIndex);
      } catch {
        /* ignored */
      }
      return;
    }

    if (newRaw) {
      try {
        const data = JSON.parse(newRaw) as { kind: FieldKind; variantPatch?: Partial<Field> };
        onDropField(data.kind, targetIndex, data.variantPatch);
      } catch {
        /* ignored */
      }
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (!isOurDrag(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = isReorderDrag(e) ? 'move' : 'copy';
    setHoverIndex(index);
  };

  const handleFieldDragOver = (e: React.DragEvent, fieldIndex: number) => {
    if (!isOurDrag(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = isReorderDrag(e) ? 'move' : 'copy';
    const rect = e.currentTarget.getBoundingClientRect();
    const above = e.clientY < rect.top + rect.height / 2;
    setHoverIndex(above ? fieldIndex : fieldIndex + 1);
  };

  const handleFieldDrop = (e: React.DragEvent, fieldIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const above = e.clientY < rect.top + rect.height / 2;
    handleDrop(e, above ? fieldIndex : fieldIndex + 1);
  };

  const handleFieldDragStart = (e: React.DragEvent, field: Field) => {
    e.dataTransfer.setData(REORDER_TYPE, JSON.stringify({ fieldId: field.id }));
    e.dataTransfer.effectAllowed = 'move';
    setReorderingId(field.id);
  };

  return (
    <div
      className={`drop-zone${isDragInside ? ' drop-zone--dragging' : ''}`}
      onDragEnter={handleZoneEnter}
      onDragLeave={handleZoneLeave}
    >
      {fields.length === 0 && (
        <div
          className={`drop-zone__empty${hoverIndex === 0 ? ' drop-zone__empty--hover' : ''}`}
          onDragOver={(e) => handleDragOver(e, 0)}
          onDrop={(e) => handleDrop(e, 0)}
        >
          Drag form components here
        </div>
      )}
      {fields.map((field, i) => (
        <React.Fragment key={field.id}>
          <DropSlot
            active={hoverIndex === i}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={(e) => handleDrop(e, i)}
          />
          <div
            className={`field-drop-target${reorderingId === field.id ? ' field-drop-target--dragging' : ''}`}
            draggable
            onDragStart={(e) => handleFieldDragStart(e, field)}
            onDragEnd={finishDrag}
            onDragOver={(e) => handleFieldDragOver(e, i)}
            onDrop={(e) => handleFieldDrop(e, i)}
          >
            <FieldRenderer
              field={field}
              selected={selectedFieldId === field.id}
              onSelect={() => onSelectField(field.id)}
              onRemove={() => onRemoveField(field.id)}
            />
          </div>
        </React.Fragment>
      ))}
      {fields.length > 0 && (
        <DropSlot
          active={hoverIndex === fields.length}
          onDragOver={(e) => handleDragOver(e, fields.length)}
          onDrop={(e) => handleDrop(e, fields.length)}
        />
      )}
    </div>
  );
};

const DropSlot: React.FC<{
  active: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}> = ({ active, onDragOver, onDrop }) => (
  <div
    className={`drop-slot${active ? ' drop-slot--active' : ''}`}
    onDragOver={onDragOver}
    onDrop={onDrop}
  />
);

function continueLabel(step: Step, isLastStep: boolean): string {
  if (step.kind === 'review') return 'Accept and send';
  if (isLastStep) return 'Review';
  return 'Continue';
}

const REVIEWABLE_KINDS: FieldKind[] = [
  'input-field',
  'textarea',
  'checkbox',
  'toggle',
  'radio-group',
  'dropdown',
  'file-upload',
];

function reviewValue(field: Field): string {
  if (field.value?.trim()) return field.value.trim();
  switch (field.kind) {
    case 'checkbox':
      return field.checked === false ? 'No' : 'Yes';
    case 'toggle':
      return field.checked === true ? 'On' : 'Off';
    case 'file-upload':
      return 'document.pdf';
    case 'radio-group':
    case 'dropdown':
      return field.options?.[0] ?? 'Option A';
    case 'input-field':
      switch (field.type) {
        case 'email': return 'abdullah@email.com';
        case 'tel': return '+96812345678';
        case 'number': return '123456';
        case 'numeric': return '123456';
        case 'url': return 'https://example.om';
        case 'date': return '2024-01-01';
        case 'time': return '12:00';
        case 'password': return '••••••••';
        default: return field.placeholder || 'Sample response';
      }
    case 'textarea':
      return field.placeholder || 'Sample response text.';
    default:
      return field.placeholder || '—';
  }
}

const SUBMIT_HEADING = 'Now send your application';
const SUBMIT_COPY =
  'By submitting this application you are confirming that, to the best of your knowledge, the details you are providing are correct.';

const ReviewContent: React.FC<{
  priorFormSteps: Step[];
  reviewStep: Step;
  onChangeHeading?: (v: string) => void;
  onChangeInstructions?: (v: string) => void;
}> = ({ priorFormSteps, reviewStep, onChangeHeading, onChangeInstructions }) => {
  return (
    <div className="review-step">
      <gup-track direction="vertical" gap="9">
        {priorFormSteps.map((s) => {
          const rows = s.fields.filter((f) => REVIEWABLE_KINDS.includes(f.kind));
          if (rows.length === 0) return null;
          return (
            <gup-track direction="vertical" gap="4" key={s.id}>
              <h3 className="review-step__section-title">{s.title}</h3>
              <gup-table>
                {rows.map((f) => (
                  <gup-table-row key={f.id}>
                    <gup-table-cell type="rowheader" style={{ whiteSpace: 'nowrap' }}>{f.label}</gup-table-cell>
                    <gup-table-cell>{reviewValue(f)}</gup-table-cell>
                    <gup-table-cell style={{ textAlign: 'end' as const, whiteSpace: 'nowrap' }}>
                      <gup-button appearance="text">Change</gup-button>
                    </gup-table-cell>
                  </gup-table-row>
                ))}
              </gup-table>
            </gup-track>
          );
        })}

        {reviewStep.reviewIntructionsHeading && (
          <gup-track direction="vertical" gap="4">
            <h3 className="review-step__section-title">
              <EditableText
                value={reviewStep.reviewIntructionsHeading}
                onChange={(v) => onChangeHeading?.(v)}
                ariaLabel="Review instructions heading"
              />
            </h3>
            <p className="step-description">
              <EditableText
                value={reviewStep.reviewInstructions || ''}
                onChange={(v) => onChangeInstructions?.(v)}
                ariaLabel="Review instructions"
              />
            </p>
          </gup-track>
        )}
      </gup-track>
    </div>
  );
};
