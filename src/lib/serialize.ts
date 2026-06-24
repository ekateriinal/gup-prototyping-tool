import type { Field, Prototype } from '../types';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function renderAttrs(o: Record<string, unknown>): string {
  return Object.entries(o)
    .filter(([, v]) => v !== undefined && v !== null && v !== false && v !== '')
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(String(v))}"`))
    .join('');
}

const hintSlot = (h?: string) => (h ? `<span slot="hint">${esc(h)}</span>` : '');

function renderField(field: Field): string {
  switch (field.kind) {
    case 'input-field': {
      const a = renderAttrs({
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
      return `<gup-input-field${a}>${esc(field.label)}${hintSlot(field.hint)}</gup-input-field>`;
    }
    case 'textarea': {
      const a = renderAttrs({
        name: field.id,
        placeholder: field.placeholder,
        rows: field.rows,
        maxlength: field.maxlength,
        required: field.required,
        disabled: field.disabled,
        'error-message': field.errorMessage,
      });
      return `<gup-textarea-field${a}>${esc(field.label)}${hintSlot(field.hint)}</gup-textarea-field>`;
    }
    case 'checkbox': {
      const a = renderAttrs({
        name: field.id,
        checked: field.checked,
        indeterminate: field.indeterminate,
        size: field.size,
        required: field.required,
        disabled: field.disabled,
        'error-message': field.errorMessage,
      });
      return `<gup-checkbox${a}>${esc(field.label)}${hintSlot(field.hint)}</gup-checkbox>`;
    }
    case 'toggle': {
      const a = renderAttrs({
        name: field.id,
        checked: field.checked,
        disabled: field.disabled,
        'knob-location': field.knobLocation,
      });
      return `<gup-toggle${a}>${esc(field.label)}${hintSlot(field.hint)}</gup-toggle>`;
    }
    case 'radio-group': {
      const a = renderAttrs({
        name: field.id,
        required: field.required,
        disabled: field.disabled,
        'error-message': field.errorMessage,
      });
      const opts = (field.options ?? [])
        .map((o, i) => `      <gup-radio-button value="opt-${i}">${esc(o)}</gup-radio-button>`)
        .join('\n');
      return `<gup-radio-button-group${a}>
      <span slot="label">${esc(field.label)}</span>
      ${hintSlot(field.hint)}
${opts}
    </gup-radio-button-group>`;
    }
    case 'dropdown': {
      const a = renderAttrs({
        name: field.id,
        placeholder: field.placeholder ?? 'Select an item',
        required: field.required,
        disabled: field.disabled,
        multiple: field.multiple,
        clearable: field.clearable,
        'error-message': field.errorMessage,
      });
      const opts = (field.options ?? [])
        .map((o, i) => `        <gup-dropdown-menu-item value="opt-${i}">${esc(o)}</gup-dropdown-menu-item>`)
        .join('\n');
      return `<gup-dropdown-field${a}>
      <span slot="label-slot">${esc(field.label)}</span>
      ${hintSlot(field.hint)}
      <gup-dropdown-menu>
${opts}
      </gup-dropdown-menu>
    </gup-dropdown-field>`;
    }
    case 'file-upload': {
      const a = renderAttrs({
        name: field.id,
        'file-input-label': field.fileInputLabel ?? 'Choose file',
        multiple: field.multipleFiles,
        'allow-thumbnails': field.allowThumbnails,
        'full-width': field.fullWidth,
        required: field.required,
        disabled: field.disabled,
        'error-message': field.errorMessage,
      });
      return `<gup-file-upload${a}>${esc(field.label)}${hintSlot(field.hint)}</gup-file-upload>`;
    }
    case 'form-section':
      return `<h3 style="font-size:1.25rem;font-weight:700;margin-top:var(--gup-spacing-between-text,1.5rem);">${esc(field.label)}</h3>`;
    case 'form-hint':
      return `<gup-form-hint>${esc(field.label)}</gup-form-hint>`;
    case 'validation-message':
      return `<gup-form-validation-message>${esc(field.label)}</gup-form-validation-message>`;
    case 'button': {
      const a = renderAttrs({
        appearance: field.appearance ?? 'primary',
        disabled: field.disabled,
      });
      return `<gup-button${a}>${esc(field.label)}</gup-button>`;
    }
  }
}

function renderStep(p: Prototype, stepIdx: number): string {
  const step = p.steps[stepIdx];
  const stepperItems = p.steps
    .map((s, i) => {
      const type = i < stepIdx ? ' step-type="done"' : i === stepIdx ? ' step-type="selected"' : '';
      return `        <gup-stepper-item static-mode step-number="${i + 1}"${type}><span slot="label">${esc(s.title)}</span></gup-stepper-item>`;
    })
    .join('\n');
  const fields = step.fields.map((f) => `      ${renderField(f)}`).join('\n');
  const counterLabel = `Step ${stepIdx + 1} of ${p.steps.length}`;
  return `<section class="step" data-step-index="${stepIdx}"${stepIdx === 0 ? '' : ' hidden'}>
  <gup-details open content-appearance="sink" closed-icon="add-circle" open-icon="remove-circle">
    <span slot="label">${esc(counterLabel)}</span>
    <gup-stepper static-mode>
${stepperItems}
    </gup-stepper>
  </gup-details>
  <h2 style="font-size:1.75rem;font-weight:700;margin-top:var(--gup-spacing-between-text,1.5rem);">${esc(step.title)}</h2>
  <p class="step-description" style="color:var(--gup-color-content-primary,#27272a);font-family:'Readex Pro',sans-serif;font-size:24px;font-weight:400;line-height:32px;margin:0;">${esc(step.description)}</p>
  <form>
    <gup-form-section>
      <gup-form-list>
${fields}
      </gup-form-list>
    </gup-form-section>
  </form>
</section>`;
}

export function renderPrototypeBody(p: Prototype): string {
  const steps = p.steps.map((_, i) => renderStep(p, i)).join('\n');
  return `<div class="prototype-shell">
  <gup-header>
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
  <gup-wizard-main id="wizard-main">
${steps}
  </gup-wizard-main>
  <gup-wizard-footer>
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
html, body { margin: 0; height: 100%; }
.prototype-shell { display: flex; flex-direction: column; height: 100vh; min-height: 0; }
.prototype-shell > gup-wizard-main { flex: 1 1 0; min-height: 0; overflow-y: auto; }
.prototype-shell > gup-wizard-footer { flex: 0 0 auto; }
.step-description {
  color: var(--gup-color-content-primary, #27272a);
  font-family: 'Readex Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px;
  margin: 0;
}
`.trim();

export const NAV_SCRIPT = `
(function () {
  var steps = document.querySelectorAll('.step');
  var backBtn = document.getElementById('back-btn');
  var continueBtn = document.getElementById('continue-btn');
  var continueLabel = continueBtn.childNodes[0];
  var idx = 0;
  function setText(node, text) {
    while (node && node.nodeType !== 3) node = node.nextSibling;
    if (node) node.textContent = text;
  }
  function render() {
    steps.forEach(function (el, i) { el.hidden = i !== idx; });
    backBtn.disabled = idx === 0;
    var label = idx >= steps.length - 1 ? 'Review' : 'Continue';
    // The button's text node is the first child (the icon follows it).
    setText(continueBtn.firstChild, label + ' ');
  }
  backBtn.addEventListener('gup-click', function () { if (idx > 0) { idx--; render(); } });
  continueBtn.addEventListener('gup-click', function () {
    if (idx < steps.length - 1) { idx++; render(); }
    else { alert('Review the entered information.'); }
  });
  render();
})();
`.trim();

const CDN_BASE = 'https://cdn.jsdelivr.net/npm/@govom/components@3.27.0';

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
