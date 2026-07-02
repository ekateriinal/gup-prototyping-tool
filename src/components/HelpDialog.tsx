import React from 'react';
import {
  DragFromPaletteSvg,
  EditInlineSvg,
  InspectorSvg,
  ReorderSvg,
  StepperSvg,
  ReviewSvg,
  ExportSvg,
} from './HelpIllustrations';

interface Props {
  onClose: () => void;
}

export const HelpDialog: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal help-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>How to use the prototyper</h2>
          <button type="button" className="modal__close" onClick={onClose}>×</button>
        </div>

        <div className="help-body">
          <p className="help-intro">
            Assemble a multi-step service prototype using real Oman GUP components.
            Drag fields into the canvas, tweak them in the right inspector, and
            finish with an auto-populated review page.
          </p>

          <HelpSection
            title="1. Drag components from the palette"
            body={
              <>
                Every entry in the left sidebar is a real <code>gup-*</code> component.
                Drag any chip onto the canvas to add it. Click a chip to open a
                second drawer with ready-to-drag <b>variants</b> (Default,
                Required, Disabled, With hint, …).
              </>
            }
            illustration={<DragFromPaletteSvg />}
          />

          <HelpSection
            title="2. Edit text inline"
            body={
              <>
                Click any text on the canvas: the service title, the step
                heading, the review description and type. Press <kbd>Enter</kbd>
                or click away to save.
              </>
            }
            illustration={<EditInlineSvg />}
          />

          <HelpSection
            title="3. Tweak field properties in the inspector"
            body={
              <>
                Click a dropped field to select it. The right panel exposes every
                editable prop the component supports: label, placeholder, hint,
                error message, required, disabled, and type-specific settings
                (input type, min/max, options, rows, etc.).
              </>
            }
            illustration={<InspectorSvg />}
          />

          <HelpSection
            title="4. Reorder existing fields"
            body={
              <>
                Grab any field on the canvas and drag it up or down. Drop on
                a field's <b>top half</b> to insert above; <b>bottom half</b> to
                insert below. The insertion line lights up where the drop will
                land.
              </>
            }
            illustration={<ReorderSvg />}
          />

          <HelpSection
            title="5. Configure the stepper"
            body={
              <>
                Click the stepper on the canvas. The right panel switches to a
                stepper editor where you set the number of steps, rename each
                one, or remove one. Back / Continue navigates between them so
                you can drop fields into any step.
              </>
            }
            illustration={<StepperSvg />}
          />

          <HelpSection
            title="6. Add a review step"
            body={
              <>
                In the stepper editor, click{' '}
                <span className="help-inline-btn">+ Add review step</span>. It
                appends an "Application Completed" page and jumps you to it. The
                review auto-populates a <code>gup-table</code> per prior step
                summarising each field, plus <b>Change</b> buttons that jump the
                user back to the source step.
              </>
            }
            illustration={<ReviewSvg />}
          />

          <HelpSection
            title="7. Preview and export"
            body={
              <>
                <b>Preview</b> opens the current prototype in a new tab as a
                standalone page. <b>Export</b> gives you three tabs:
                <ul>
                  <li><b>HTML markup</b> - paste into a template</li>
                  <li><b>JavaScript</b> - imports <code>@govom/components</code> and wires navigation</li>
                  <li><b>Single file</b> - self-contained page for a bundler</li>
                </ul>
                All export code assumes <code>@govom/components</code> is installed via
                npm in your project.
              </>
            }
            illustration={<ExportSvg />}
          />
        </div>

        <div className="modal__actions">
          <button type="button" className="btn btn--primary" onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  );
};

const HelpSection: React.FC<{
  title: string;
  body: React.ReactNode;
  illustration: React.ReactNode;
}> = ({ title, body, illustration }) => (
  <section className="help-section">
    <div className="help-section__illustration" aria-hidden>{illustration}</div>
    <div className="help-section__text">
      <h3>{title}</h3>
      <div className="help-section__body">{body}</div>
    </div>
  </section>
);

