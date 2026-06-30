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
  onDropField: (stepId: string, kind: FieldKind, index: number, variantPatch?: Partial<Field>) => void;
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
    onDropField,
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
      {/* @ts-expect-error custom element */}
      <gup-header>
        {/* @ts-expect-error custom element */}
        <gup-track slot="start">
          <GupButton appearance="text">
            Save &amp; exit
            {/* @ts-expect-error custom element */}
            <gup-icon slot="icon-start" icon-name="close" height="24" width="24"></gup-icon>
          </GupButton>
        {/* @ts-expect-error custom element */}
        </gup-track>
        {/* @ts-expect-error custom element */}
        <gup-track slot="end" horizontal-alignment="right">
          <GupButton appearance="text">
            Do you need help?
            {/* @ts-expect-error custom element */}
            <gup-icon slot="icon-start" icon-name="live-help" height="24" width="24"></gup-icon>
          </GupButton>
        {/* @ts-expect-error custom element */}
        </gup-track>
      {/* @ts-expect-error custom element */}
      </gup-header>

      {/* @ts-expect-error custom element */}
      <gup-content-header>
        <span slot="page-title">
          <EditableText
            value={contentHeader}
            onChange={onChangeContentHeader}
            ariaLabel="Page title"
          />
        </span>
      {/* @ts-expect-error custom element */}
      </gup-content-header>

      {/* @ts-expect-error custom element */}
      <gup-wizard-main>
        <div
          className={`stepper-area${stepperSelected ? ' stepper-area--selected' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelectField(null);
            onSelectStepper();
          }}
        >
          {/* @ts-expect-error custom element */}
          <gup-details open content-appearance="sink" closed-icon="add-circle" open-icon="remove-circle">
            <span slot="label">{`Step ${currentStep + 1} of ${steps.length}`}</span>
            {/* @ts-expect-error custom element */}
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
                  // @ts-expect-error custom element
                  <gup-stepper-item key={s.id} {...itemProps}>
                    <span slot="label">{s.title}</span>
                  {/* @ts-expect-error custom element */}
                  </gup-stepper-item>
                );
              })}
            {/* @ts-expect-error custom element */}
            </gup-stepper>
          {/* @ts-expect-error custom element */}
          </gup-details>
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 700, marginTop: 'var(--gup-spacing-between-text, 1.5rem)' }}>
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

        <form onSubmit={(e) => e.preventDefault()}>
          {/* @ts-expect-error custom element */}
          <gup-form-section>
            {/* @ts-expect-error custom element */}
            <gup-form-list>
              <DropZone
                stepId={step.id}
                fields={step.fields}
                selectedFieldId={selectedFieldId}
                onDropField={(kind, index, variantPatch) => onDropField(step.id, kind, index, variantPatch)}
                onSelectField={onSelectField}
                onRemoveField={(id) => onRemoveField(step.id, id)}
              />
            {/* @ts-expect-error custom element */}
            </gup-form-list>
          {/* @ts-expect-error custom element */}
          </gup-form-section>
        </form>
      {/* @ts-expect-error custom element */}
      </gup-wizard-main>

      {/* @ts-expect-error custom element */}
      <gup-wizard-footer>
        <GupButton slot="start" appearance="secondary" onClick={onBack} disabled={currentStep === 0}>
          {/* @ts-expect-error custom element */}
          <gup-icon slot="icon-start" icon-name="arrow-back" height="24" width="24"></gup-icon>
          Back
        </GupButton>
        <GupButton slot="end" appearance="primary" onClick={onContinue}>
          {isLastStep ? 'Review' : 'Continue'}
          {/* @ts-expect-error custom element */}
          <gup-icon slot="icon-end" icon-name="arrow-forward" height="24" width="24"></gup-icon>
        </GupButton>
      {/* @ts-expect-error custom element */}
      </gup-wizard-footer>
    </div>
  );
};

const DropZone: React.FC<{
  stepId: string;
  fields: Field[];
  selectedFieldId: string | null;
  onDropField: (kind: FieldKind, index: number, variantPatch?: Partial<Field>) => void;
  onSelectField: (id: string | null) => void;
  onRemoveField: (id: string) => void;
}> = ({ fields, selectedFieldId, onDropField, onSelectField, onRemoveField }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isDragInside, setIsDragInside] = useState(false);
  const dragDepth = useRef(0);

  const isOurDrag = (e: React.DragEvent) =>
    e.dataTransfer.types.includes('application/x-gup-field');

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

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    const raw = e.dataTransfer.getData('application/x-gup-field');
    dragDepth.current = 0;
    setIsDragInside(false);
    setHoverIndex(null);
    if (!raw) return;
    try {
      const data = JSON.parse(raw) as { kind: FieldKind; variantPatch?: Partial<Field> };
      onDropField(data.kind, index, data.variantPatch);
    } catch {
      /* ignored */
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (!isOurDrag(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setHoverIndex(index);
  };

  const handleFieldDragOver = (e: React.DragEvent, fieldIndex: number) => {
    if (!isOurDrag(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    const rect = e.currentTarget.getBoundingClientRect();
    const above = e.clientY < rect.top + rect.height / 2;
    setHoverIndex(above ? fieldIndex : fieldIndex + 1);
  };

  const handleFieldDrop = (e: React.DragEvent, fieldIndex: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const above = e.clientY < rect.top + rect.height / 2;
    handleDrop(e, above ? fieldIndex : fieldIndex + 1);
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
            className="field-drop-target"
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
