import type { Field, Prototype } from "../types";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function renderAttrs(o: Record<string, unknown>): string {
  return Object.entries(o)
    .filter(([, v]) => v !== undefined && v !== null && v !== false && v !== "")
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(String(v))}"`))
    .join("");
}

const hintSlot = (h?: string) =>
  h ? `<span slot="hint">${esc(h)}</span>` : "";

function renderField(field: Field): string {
  switch (field.kind) {
    case "input-field": {
      const a = renderAttrs({
        name: field.id,
        type: field.type ?? "text",
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
        "error-message": field.errorMessage,
      });
      return `<gup-input-field${a}>${esc(field.label)}${hintSlot(
        field.hint
      )}</gup-input-field>`;
    }
    case "textarea": {
      const a = renderAttrs({
        name: field.id,
        placeholder: field.placeholder,
        rows: field.rows,
        maxlength: field.maxlength,
        required: field.required,
        disabled: field.disabled,
        "error-message": field.errorMessage,
      });
      return `<gup-textarea-field${a}>${esc(field.label)}${hintSlot(
        field.hint
      )}</gup-textarea-field>`;
    }
    case "checkbox": {
      const a = renderAttrs({
        name: field.id,
        checked: field.checked,
        indeterminate: field.indeterminate,
        size: field.size,
        required: field.required,
        disabled: field.disabled,
        "error-message": field.errorMessage,
      });
      return `<gup-checkbox${a}>${esc(field.label)}${hintSlot(
        field.hint
      )}</gup-checkbox>`;
    }
    case "toggle": {
      const a = renderAttrs({
        name: field.id,
        checked: field.checked,
        disabled: field.disabled,
        "knob-location": field.knobLocation,
      });
      return `<gup-toggle${a}>${esc(field.label)}${hintSlot(
        field.hint
      )}</gup-toggle>`;
    }
    case "radio-group": {
      const a = renderAttrs({
        name: field.id,
        required: field.required,
        disabled: field.disabled,
        "error-message": field.errorMessage,
      });
      const opts = (field.options ?? [])
        .map(
          (o, i) =>
            `      <gup-radio-button value="opt-${i}">${esc(
              o
            )}</gup-radio-button>`
        )
        .join("\n");
      return `<gup-radio-button-group${a}>
      <span slot="label">${esc(field.label)}</span>
      ${hintSlot(field.hint)}
${opts}
    </gup-radio-button-group>`;
    }
    case "dropdown": {
      const a = renderAttrs({
        name: field.id,
        placeholder: field.placeholder ?? "Select an item",
        required: field.required,
        disabled: field.disabled,
        multiple: field.multiple,
        clearable: field.clearable,
        "error-message": field.errorMessage,
      });
      const opts = (field.options ?? [])
        .map(
          (o, i) =>
            `        <gup-dropdown-menu-item value="opt-${i}">${esc(
              o
            )}</gup-dropdown-menu-item>`
        )
        .join("\n");
      return `<gup-dropdown-field${a}>
      <span slot="label-slot">${esc(field.label)}</span>
      ${hintSlot(field.hint)}
      <gup-dropdown-menu>
${opts}
      </gup-dropdown-menu>
    </gup-dropdown-field>`;
    }
    case "file-upload": {
      const a = renderAttrs({
        name: field.id,
        "file-input-label": field.fileInputLabel ?? "Choose file",
        multiple: field.multipleFiles,
        "allow-thumbnails": field.allowThumbnails,
        "full-width": field.fullWidth,
        required: field.required,
        disabled: field.disabled,
        "error-message": field.errorMessage,
      });
      return `<gup-file-upload${a}>${esc(field.label)}${hintSlot(
        field.hint
      )}</gup-file-upload>`;
    }
    case "form-section":
      return `<h3 style="font-size:1.25rem;font-weight:700;margin-top:var(--gup-spacing-between-text,1.5rem);">${esc(
        field.label
      )}</h3>`;
    case "form-hint":
      return `<gup-form-hint>${esc(field.label)}</gup-form-hint>`;
    case "validation-message":
      return `<gup-form-validation-message>${esc(
        field.label
      )}</gup-form-validation-message>`;
    case "button": {
      const a = renderAttrs({
        appearance: field.appearance ?? "primary",
        disabled: field.disabled,
      });
      return `<gup-button${a}>${esc(field.label)}</gup-button>`;
    }
  }
}

const REVIEWABLE_KINDS: Field["kind"][] = [
  "input-field",
  "textarea",
  "checkbox",
  "toggle",
  "radio-group",
  "dropdown",
  "file-upload",
];

function reviewValue(field: Field): string {
  if (field.value?.trim()) return field.value.trim();

  switch (field.kind) {
    case "checkbox":
      return field.checked === false ? "No" : "Yes";
    case "toggle":
      return field.checked === true ? "On" : "Off";
    case "file-upload":
      return "document.pdf";
    case "radio-group":
    case "dropdown":
      return field.options?.[0] ?? "Option A";
    case "input-field":
      switch (field.type) {
        case "email":
          return "abdullah@email.com";
        case "tel":
          return "+96812345678";
        case "number":
          return "123456";
        case "numeric":
          return "123456";
        case "url":
          return "https://example.om";
        case "date":
          return "2024-01-01";
        case "time":
          return "12:00";
        case "password":
          return "••••••••";
        default:
          return field.placeholder || "Sample response";
      }
    case "textarea":
      return field.placeholder || "Sample response text.";
    default:
      return field.placeholder || "—";
  }
}

const SUBMIT_HEADING = "Now send your application";
const SUBMIT_COPY =
  "By submitting this application you are confirming that, to the best of your knowledge, the details you are providing are correct.";

function renderReviewStep(p: Prototype, stepIdx: number): string {
  const step = p.steps[stepIdx];
  const headingId = `step-${stepIdx}-heading`;
  const priorFormSteps = p.steps
    .slice(0, stepIdx)
    .filter((s) => s.kind === "form");
  const stepperItems = p.steps
    .map((s, i) => {
      const type =
        i < stepIdx
          ? ' step-type="done"'
          : i === stepIdx
          ? ' step-type="selected"'
          : "";
      return `        <gup-stepper-item static-mode step-number="${
        i + 1
      }"${type}><span slot="label">${esc(s.title)}</span></gup-stepper-item>`;
    })
    .join("\n");
  const counterLabel = `Step ${stepIdx + 1} of ${p.steps.length}`;
  const sections = priorFormSteps
    .map((s) => {
      const rows = s.fields.filter((f) => REVIEWABLE_KINDS.includes(f.kind));
      if (rows.length === 0) return "";
      const rowHtml = rows
        .map(
          (f) => `<gup-table-row>
          <gup-table-cell type="rowheader" class="review-cell-header">${esc(
            f.label
          )}</gup-table-cell>
          <gup-table-cell class="review-cell-value" data-field-id="${esc(
            f.id
          )}" data-field-kind="${f.kind}">${esc(
            reviewValue(f)
          )}</gup-table-cell>
          <gup-table-cell class="review-cell-action"><gup-button appearance="text">Change</gup-button></gup-table-cell>
        </gup-table-row>`
        )
        .join("\n");
      return `      <gup-track direction="vertical" gap="4">
        <h3 class="review-step__section-title" style="font-size:20px;font-weight:700;line-height:28px;color:var(--gup-color-content-primary,#27272a);margin:0;">${esc(
          s.title
        )}</h3>
        <gup-table class="review-table">
${rowHtml}
        </gup-table>
      </gup-track>`;
    })
    .filter(Boolean)
    .join("\n");

  return `
    <section class="step review-step" data-step-index="${stepIdx}" data-step-kind="review" aria-labelledby="${headingId}"${
    stepIdx === 0 ? "" : " hidden"
  }>
      <gup-details open content-appearance="sink" closed-icon="add-circle" open-icon="remove-circle">
        <span slot="label">${esc(counterLabel)}</span>
        <gup-stepper static-mode>
          ${stepperItems}
        </gup-stepper>
      </gup-details>
      <h2 id="${headingId}" style="font-size:1.75rem;font-weight:700;margin-top:var(--gup-spacing-between-text,1.5rem);">${esc(
    step.title
  )}</h2>
      <p class="step-description" style="color:var(--gup-color-content-primary,#27272a);font-family:'Readex Pro',sans-serif;font-size:24px;font-weight:400;line-height:32px;margin:0; margin-block-end:48px;">${esc(
        step.description
      )}</p>
      <gup-track direction="vertical" gap="9">
        ${sections}
        <gup-track direction="vertical" gap="4">
          <h3 class="review-step__section-title" style="font-size:20px;font-weight:700;line-height:28px;color:var(--gup-color-content-primary,#27272a);margin:0;">${esc(
            SUBMIT_HEADING
          )}</h3>
          <p class="step-description" style="color:var(--gup-color-content-primary,#27272a);font-family:'Readex Pro',sans-serif;font-size:16px;font-weight:400;line-height:24px;margin:0;">${esc(
            SUBMIT_COPY
          )}</p>
        </gup-track>
      </gup-track>
    </section>
  `;
}

function renderStep(p: Prototype, stepIdx: number): string {
  const step = p.steps[stepIdx];
  if (step.kind === "review") return renderReviewStep(p, stepIdx);
  const stepperItems = p.steps
    .map((s, i) => {
      const type =
        i < stepIdx
          ? ' step-type="done"'
          : i === stepIdx
          ? ' step-type="selected"'
          : "";
      return `<gup-stepper-item static-mode step-number="${
        i + 1
      }"${type}><span slot="label">${esc(s.title)}</span></gup-stepper-item>`;
    })
    .join("\n");
  const fields = step.fields.map((f) => `      ${renderField(f)}`).join("\n");
  const counterLabel = `Step ${stepIdx + 1} of ${p.steps.length}`;
  const headingId = `step-${stepIdx}-heading`;
  return `
    <section class="step" data-step-index="${stepIdx}" data-step-kind="form" aria-labelledby="${headingId}"${
    stepIdx === 0 ? "" : " hidden"
  }>
      <gup-details open content-appearance="sink" closed-icon="add-circle" open-icon="remove-circle">
        <span slot="label">${esc(counterLabel)}</span>
        <gup-stepper static-mode>
          ${stepperItems}
        </gup-stepper>
      </gup-details>
      <h2 id="${headingId}" style="font-size:1.75rem;font-weight:700;margin-top:var(--gup-spacing-between-text,1.5rem);">${esc(
    step.title
  )}</h2>
      <p class="step-description" style="color:var(--gup-color-content-primary,#27272a);font-family:'Readex Pro',sans-serif;font-size:24px;font-weight:400;line-height:32px;margin:0;">${esc(
        step.description
      )}</p>
      <form aria-labelledby="${headingId}">
        <gup-form-section>
          <gup-form-list>
            ${fields}
          </gup-form-list>
        </gup-form-section>
      </form>
    </section>
  `;
}

export function renderPrototypeBody(p: Prototype): string {
  const steps = p.steps.map((_, i) => renderStep(p, i)).join("\n");

  return `<div class="prototype-shell">
  <!-- Visually-hidden h1 mirrors the page title so scanners that don't
       traverse shadow DOM still see a top-level heading. -->
  <h1 class="sr-only-h1" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0;">${esc(
    p.contentHeader
  )}</h1>
  <gup-header role="banner">
    <gup-track slot="start">
      <gup-button appearance="text">
        Save &amp; exit
        <gup-icon slot="icon-start" icon-name="close" height="24" width="24"></gup-icon>
      </gup-button>
    </gup-track>
    <gup-track slot="end" horizontal-alignment="right">
      <gup-button appearance="text">
        Do you need help?
        <gup-icon slot="icon-start" icon-name="live-help" height="24" width="24"></gup-icon>
      </gup-button>
    </gup-track>
  </gup-header>
  <gup-content-header page-title="${esc(p.contentHeader)}"></gup-content-header>
  <gup-wizard-main id="wizard-main" role="main" aria-label="Wizard steps">
${steps}
  </gup-wizard-main>
  <gup-wizard-footer role="contentinfo">
    <gup-button id="back-btn" slot="start" appearance="secondary">
      <gup-icon slot="icon-start" icon-name="arrow-back" height="24" width="24"></gup-icon>
      Back
    </gup-button>
    <gup-button id="continue-btn" slot="end" appearance="primary">
      Continue
      <gup-icon slot="icon-end" icon-name="arrow-forward" height="24" width="24"></gup-icon>
    </gup-button>
  </gup-wizard-footer>
</div>`;
}

export const SHELL_CSS = `
html, body { margin: 0; }
/* Whole page scrolls: header and content-header scroll away with the wizard
   content; only the footer stays pinned via position: sticky.
   min-height:100vh keeps the footer at the viewport bottom when the content
   is shorter than one screen. */
.prototype-shell { display: flex; flex-direction: column; min-height: 100vh; }
.prototype-shell > gup-header { flex: 0 0 auto; }
.prototype-shell > gup-content-header { flex: 0 0 auto; }
.prototype-shell > gup-wizard-main { flex: 1 1 auto; }
.prototype-shell > gup-wizard-footer { position: sticky; bottom: 0; z-index: 10; }
.step-description {
  color: var(--gup-color-content-primary, #27272a);
  font-family: 'Readex Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px;
  margin: 0;
  margin-block-end: 48px;
}

.review-table { width: 100%; table-layout: fixed; }
.review-table gup-table-cell.review-cell-header { width: 40%; }
.review-table gup-table-cell.review-cell-value  { width: 40%; }
.review-table gup-table-cell.review-cell-action { max-width: 20%; text-align: end; }
`.trim();

export const NAV_SCRIPT = `
(function () {
  var steps = document.querySelectorAll('.step');
  var backBtn = document.getElementById('back-btn');
  var continueBtn = document.getElementById('continue-btn');
  var pageSummary = document.getElementById('page-summary');
  var idx = 0;
  var formData = {};

  function setText(node, text) {
    while (node && node.nodeType !== 3) node = node.nextSibling;
    if (node) node.textContent = text;
  }
  function labelFor(i) {
    var kind = steps[i].getAttribute('data-step-kind');
    if (kind === 'review') return 'Accept and send';
    if (i >= steps.length - 1) return 'Review';
    return 'Continue';
  }
  function syncPageSummary() {
    if (!pageSummary) return;
    var cur = steps[idx];
    var kind = cur.getAttribute('data-step-kind');
    if (kind === 'review') {
      var refNum = cur.getAttribute('data-reference-number') || '';
      pageSummary.innerHTML = 'Reference Number: <strong>' + refNum + '</strong>';
      pageSummary.hidden = false;
    } else {
      pageSummary.textContent = '';
      pageSummary.hidden = true;
    }
  }
  // Look up an option label by its value attribute inside a container.
  // Radio and dropdown items store the human-readable text as textContent
  // and their identifier ("opt-0" etc.) as value.
  function labelForOption(container, selector, val) {
    if (val == null || val === '') return '';
    var opt = container.querySelector(selector + '[value="' + String(val).replace(/"/g, '\\\\"') + '"]');
    return opt ? (opt.textContent || '').trim() : String(val);
  }

  function snapshotStep(stepEl) {
    if (!stepEl) return;
    var nodes = stepEl.querySelectorAll('[name]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var name = el.getAttribute('name');
      if (!name) continue;
      var tag = el.tagName.toLowerCase();
      if (tag === 'gup-checkbox' || tag === 'gup-toggle') {
        formData[name] = !!(el.checked);
      } else if (tag === 'gup-file-upload') {
        var files = el.uploadedFiles || [];
        formData[name] = files.length ? files.map(function (f) { return f.name || 'file'; }).join(', ') : '';
      } else if (tag === 'gup-radio-button-group') {
        // el.value is "opt-N"; map it back to the corresponding button's label.
        formData[name] = labelForOption(el, 'gup-radio-button', el.value);
      } else if (tag === 'gup-dropdown-field') {
        // Single- or multi-select. Value can be a string or a string[].
        var v = el.value;
        if (Array.isArray(v)) {
          formData[name] = v
            .map(function (x) { return labelForOption(el, 'gup-dropdown-menu-item', x); })
            .filter(Boolean)
            .join(', ');
        } else {
          formData[name] = labelForOption(el, 'gup-dropdown-menu-item', v);
        }
      } else {
        formData[name] = el.value != null ? el.value : '';
      }
    }
  }
  function populateReviewStep(stepEl) {
    var cells = stepEl.querySelectorAll('[data-field-id]');
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      var id = cell.getAttribute('data-field-id');
      var kind = cell.getAttribute('data-field-kind');
      var v = formData[id];
      if (v === undefined || v === '') continue;
      if (kind === 'checkbox') { cell.textContent = v ? 'Yes' : 'No'; }
      else if (kind === 'toggle') { cell.textContent = v ? 'On' : 'Off'; }
      else { cell.textContent = String(v); }
    }
  }
  function render() {
    steps.forEach(function (el, i) { el.hidden = i !== idx; });
    backBtn.disabled = idx === 0;
    setText(continueBtn.firstChild, labelFor(idx) + ' ');
    syncPageSummary();
    if (steps[idx].getAttribute('data-step-kind') === 'review') {
      populateReviewStep(steps[idx]);
    }
  }
  backBtn.addEventListener('gup-click', function () {
    if (idx > 0) { snapshotStep(steps[idx]); idx--; render(); }
  });
  continueBtn.addEventListener('gup-click', function () {
    snapshotStep(steps[idx]);
    var isReview = steps[idx].getAttribute('data-step-kind') === 'review';
    if (isReview) { alert('Application accepted and sent.'); return; }
    if (idx < steps.length - 1) { idx++; render(); }
    else { alert('Review the entered information.'); }
  });

  document.addEventListener('gup-click', function (e) {
    var btn = e.target && e.target.closest ? e.target.closest('gup-button') : null;
    if (btn && btn.closest && btn.closest('.review-table')) {
      snapshotStep(steps[idx]);
      var target = 0;
      for (var i = steps.length - 1; i >= 0; i--) {
        if (steps[i].getAttribute('data-step-kind') === 'form') { target = i; break; }
      }
      idx = target;
      render();
    }
  });
  render();
})();
`.trim();

const CDN_BASE = "https://cdn.jsdelivr.net/npm/@govom/components@3.27.0";

export function buildPreviewHtml(p: Prototype): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(p.contentHeader)}</title>
<link rel="stylesheet" href="${CDN_BASE}/dist/styles.css" />
<style>${SHELL_CSS}</style>
</head>
<body>
${renderPrototypeBody(p)}
<script type="module">
import '${CDN_BASE}/dist/components.js';
window.addEventListener('load', function () {
${NAV_SCRIPT}
});
</script>
</body>
</html>`;
}

export function buildExportHtmlMarkup(p: Prototype): string {
  return renderPrototypeBody(p);
}

export function buildExportJs(): string {
  return `import '@govom/components';
import '@govom/components/styles';

window.addEventListener('load', function () {
${NAV_SCRIPT}
});
`;
}

export function buildExportSingleFile(p: Prototype): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(p.contentHeader)}</title>
  <style>
${SHELL_CSS}
  </style>
</head>
<body>
${renderPrototypeBody(p)}
  <script type="module">
    import '@govom/components';
    import '@govom/components/styles';

    window.addEventListener('load', function () {
${NAV_SCRIPT}
    });
  </script>
</body>
</html>`;
}
