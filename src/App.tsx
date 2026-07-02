import React, { useCallback, useMemo, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { Inspector } from './components/Inspector';
import { ExportDialog } from './components/ExportDialog';
import { VariantsDrawer } from './components/VariantsDrawer';
import { openPreview } from './components/Preview';
import { getPaletteItem, makeField } from './lib/componentRegistry';
import type { Field, FieldKind, Prototype, Step } from './types';

const newStepId = () => `s${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;

const DEFAULT_DESCRIPTION = 'Placeholder for step description.';
const REVIEW_DEFAULT_TITLE = 'Review your application';
const REVIEW_DEFAULT_DESCRIPTION =
  'Kindly thoroughly review your application prior to proceeding further.';
  const REVIEW_DEFAULT_INSTRUCTIONS_HEADING = 'Now send your application';
const REVIEW_DEFAULT_INSTRUCTIONS =
  'By submitting this application you are confirming that, to the best of your knowledge, the details you are providing are correct.';

const initialState: Prototype = {
  serviceTitle: 'Form section title',
  contentHeader: 'Service name',
  steps: [
    { id: newStepId(), title: 'Step 1', description: DEFAULT_DESCRIPTION, kind: 'form', fields: [] },
    { id: newStepId(), title: 'Step 2', description: DEFAULT_DESCRIPTION, kind: 'form', fields: [] },
  ],
};

const App: React.FC = () => {
  const [prototype, setPrototype] = useState<Prototype>(initialState);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [stepperSelected, setStepperSelected] = useState(false);
  const [selectedPaletteKind, setSelectedPaletteKind] = useState<FieldKind | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  const selectedField = useMemo(() => {
    if (!selectedFieldId) return null;
    for (const step of prototype.steps) {
      const found = step.fields.find((f) => f.id === selectedFieldId);
      if (found) return found;
    }
    return null;
  }, [selectedFieldId, prototype.steps]);

  const selectedPaletteItem = useMemo(
    () => (selectedPaletteKind ? getPaletteItem(selectedPaletteKind) ?? null : null),
    [selectedPaletteKind],
  );

  const updateState = useCallback(
    (mut: (p: Prototype) => Prototype) => setPrototype((p) => mut(p)),
    [],
  );

  const selectField = useCallback((id: string | null) => {
    setSelectedFieldId(id);
    if (id) setStepperSelected(false);
  }, []);

  const selectStepper = useCallback(() => {
    setStepperSelected(true);
    setSelectedFieldId(null);
  }, []);

  const handleDropField = useCallback(
    (stepId: string, kind: FieldKind, index: number, variantPatch?: Partial<Field>) => {
      const field = makeField(kind, variantPatch);
      updateState((p) => ({
        ...p,
        steps: p.steps.map((s) =>
          s.id === stepId
            ? { ...s, fields: [...s.fields.slice(0, index), field, ...s.fields.slice(index)] }
            : s,
        ),
      }));
      selectField(field.id);
    },
    [updateState, selectField],
  );

  const handleReorderField = useCallback(
    (stepId: string, fieldId: string, targetIndex: number) => {
      updateState((p) => ({
        ...p,
        steps: p.steps.map((s) => {
          if (s.id !== stepId) return s;
          const currentIdx = s.fields.findIndex((f) => f.id === fieldId);
          if (currentIdx === -1 || currentIdx === targetIndex) return s;
          const next = [...s.fields];
          const [moved] = next.splice(currentIdx, 1);
          next.splice(targetIndex, 0, moved);
          return { ...s, fields: next };
        }),
      }));
    },
    [updateState],
  );

  const handleRemoveField = useCallback(
    (stepId: string, id: string) => {
      updateState((p) => ({
        ...p,
        steps: p.steps.map((s) => (s.id === stepId ? { ...s, fields: s.fields.filter((f) => f.id !== id) } : s)),
      }));
      if (selectedFieldId === id) setSelectedFieldId(null);
    },
    [selectedFieldId, updateState],
  );

  const handlePatchField = useCallback(
    (patch: Partial<Field>) => {
      if (!selectedFieldId) return;
      updateState((p) => ({
        ...p,
        steps: p.steps.map((s) => ({
          ...s,
          fields: s.fields.map((f) => (f.id === selectedFieldId ? { ...f, ...patch } : f)),
        })),
      }));
    },
    [selectedFieldId, updateState],
  );

  const handleAddStep = useCallback(() => {
    updateState((p) => {
      const newStep: Step = {
        id: newStepId(),
        title: `Step ${p.steps.length + 1}`,
        description: DEFAULT_DESCRIPTION,
        kind: 'form',
        fields: [],
      };
      return { ...p, steps: [...p.steps, newStep] };
    });
  }, [updateState]);

  const handleAddReviewStep = useCallback(() => {
    let newIdx = 0;
    updateState((p) => {
      const newStep: Step = {
        id: newStepId(),
        title: REVIEW_DEFAULT_TITLE,
        description: REVIEW_DEFAULT_DESCRIPTION,
        reviewIntructionsHeading: REVIEW_DEFAULT_INSTRUCTIONS_HEADING,
        reviewInstructions: REVIEW_DEFAULT_INSTRUCTIONS,
        kind: 'review',
        referenceNumber: '0000000000',
        fields: [],
      };
      newIdx = p.steps.length;
      return { ...p, steps: [...p.steps, newStep] };
    });
    setCurrentStep(newIdx);
  }, [updateState]);

  const handleSetStepKind = useCallback(
    (stepId: string, kind: Step['kind']) => {
      updateState((p) => ({
        ...p,
        steps: p.steps.map((s) => {
          if (s.id !== stepId) return s;
          if (s.kind === kind) return s;
          if (kind === 'review') {
            return {
              ...s,
              kind: 'review',
              title: s.title.startsWith('Step ') ? REVIEW_DEFAULT_TITLE : s.title,
              description:
                s.description === DEFAULT_DESCRIPTION ? REVIEW_DEFAULT_DESCRIPTION : s.description,
              referenceNumber: s.referenceNumber ?? '0000000000',
              reviewIntructionsHeading:
                s.reviewIntructionsHeading ?? REVIEW_DEFAULT_INSTRUCTIONS_HEADING,
              reviewInstructions: s.reviewInstructions ?? REVIEW_DEFAULT_INSTRUCTIONS,
              fields: [],
            };
          }
          return { ...s, kind: 'form' };
        }),
      }));
    },
    [updateState],
  );

  const handleRemoveStep = useCallback(
    (stepId: string) => {
      updateState((p) => {
        if (p.steps.length <= 1) return p;
        const idx = p.steps.findIndex((s) => s.id === stepId);
        const next = p.steps.filter((s) => s.id !== stepId);
        setCurrentStep((c) => {
          if (idx === -1) return c;
          if (c >= next.length) return next.length - 1;
          if (idx < c) return c - 1;
          return c;
        });
        return { ...p, steps: next };
      });
    },
    [updateState],
  );

  const handleSetStepCount = useCallback(
    (count: number) => {
      updateState((p) => {
        const target = Math.max(1, count);
        if (target === p.steps.length) return p;
        if (target > p.steps.length) {
          const extra: Step[] = [];
          for (let i = p.steps.length; i < target; i++) {
            extra.push({
              id: newStepId(),
              title: `Step ${i + 1}`,
              description: DEFAULT_DESCRIPTION,
              kind: 'form',
              fields: [],
            });
          }
          return { ...p, steps: [...p.steps, ...extra] };
        }
        const next = p.steps.slice(0, target);
        setCurrentStep((c) => Math.min(c, target - 1));
        return { ...p, steps: next };
      });
    },
    [updateState],
  );

  const changeStepTitle = useCallback(
    (stepId: string, v: string) =>
      updateState((p) => ({
        ...p,
        steps: p.steps.map((s) => (s.id === stepId ? { ...s, title: v } : s)),
      })),
    [updateState],
  );

  const changeStepDescription = useCallback(
    (stepId: string, v: string) =>
      updateState((p) => ({
        ...p,
        steps: p.steps.map((s) => (s.id === stepId ? { ...s, description: v } : s)),
      })),
    [updateState],
  );

  const changeStepReference = useCallback(
    (stepId: string, v: string) =>
      updateState((p) => ({
        ...p,
        steps: p.steps.map((s) => (s.id === stepId ? { ...s, referenceNumber: v } : s)),
      })),
    [updateState],
  );

  const changeReviewHeading = useCallback(
    (stepId: string, v: string) =>
      updateState((p) => ({
        ...p,
        steps: p.steps.map((s) => (s.id === stepId ? { ...s, reviewIntructionsHeading: v } : s)),
      })),
    [updateState],
  );

  const changeReviewInstructions = useCallback(
    (stepId: string, v: string) =>
      updateState((p) => ({
        ...p,
        steps: p.steps.map((s) => (s.id === stepId ? { ...s, reviewInstructions: v } : s)),
      })),
    [updateState],
  );

  return (
    <div className={`app${selectedPaletteItem ? ' app--drawer-open' : ''}`}>
      <Sidebar
        selectedKind={selectedPaletteKind}
        onSelectKind={setSelectedPaletteKind}
        onPreview={() => openPreview(prototype)}
        onExport={() => setExportOpen(true)}
      />
      <VariantsDrawer item={selectedPaletteItem} onClose={() => setSelectedPaletteKind(null)} />
      <main className="workspace">
        <Canvas
          contentHeader={prototype.contentHeader}
          steps={prototype.steps}
          currentStep={currentStep}
          selectedFieldId={selectedFieldId}
          stepperSelected={stepperSelected}
          onChangeContentHeader={(v) => updateState((p) => ({ ...p, contentHeader: v }))}
          onChangeStepTitle={changeStepTitle}
          onChangeStepDescription={changeStepDescription}
          onChangeStepReference={changeStepReference}
          onChangeReviewHeading={changeReviewHeading}
          onChangeReviewInstructions={changeReviewInstructions}
          onDropField={handleDropField}
          onReorderField={handleReorderField}
          onSelectField={selectField}
          onSelectStepper={selectStepper}
          onRemoveField={handleRemoveField}
          onBack={() => setCurrentStep((c) => Math.max(0, c - 1))}
          onContinue={() => setCurrentStep((c) => Math.min(prototype.steps.length - 1, c + 1))}
        />
      </main>
      <Inspector
        field={selectedField}
        stepperSelected={stepperSelected}
        steps={prototype.steps}
        onChange={handlePatchField}
        onClose={() => {
          setSelectedFieldId(null);
          setStepperSelected(false);
        }}
        onChangeStepTitle={changeStepTitle}
        onAddStep={handleAddStep}
        onAddReviewStep={handleAddReviewStep}
        onRemoveStep={handleRemoveStep}
        onSetStepCount={handleSetStepCount}
        onSetStepKind={handleSetStepKind}
      />
      {exportOpen && <ExportDialog prototype={prototype} onClose={() => setExportOpen(false)} />}
    </div>
  );
};

export default App;
