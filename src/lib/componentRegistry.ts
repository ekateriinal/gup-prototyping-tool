import type { Field, FieldKind } from '../types';

export interface VariantPreset {
  id: string;
  label: string;
  description: string;
  /** Partial Field applied on top of the kind's default */
  patch: Partial<Field>;
}

export interface PaletteItem {
  kind: FieldKind;
  label: string;
  hint: string;
  variants: VariantPreset[];
}

export const PALETTE: PaletteItem[] = [
  {
    kind: 'input-field',
    label: 'Input field',
    hint: 'Single-line text input (gup-input-field)',
    variants: [
      { id: 'default', label: 'Default', description: 'Plain text input.', patch: { type: 'text', label: 'Your message' } },
      { id: 'numeric', label: 'Numeric', description: 'Numeric pattern [0-9]*.', patch: { type: 'numeric', label: 'Your numeric value' } },
      { id: 'number', label: 'Number', description: 'Native number input with min/max.', patch: { type: 'number', label: 'Your age' } },
      { id: 'email', label: 'Email', description: 'Email-validated input.', patch: { type: 'email', label: 'Your email', placeholder: 'name@example.com' } },
      { id: 'tel', label: 'Phone', description: 'Tel input with country pattern.', patch: { type: 'tel', label: 'Your phone number', placeholder: '+96812345678', pattern: '\\+968[0-9]{8}' } },
      { id: 'url', label: 'URL', description: 'URL-validated input.', patch: { type: 'url', label: 'Your website' } },
      { id: 'date', label: 'Date', description: 'Native date picker.', patch: { type: 'date', label: 'Your birthdate' } },
      { id: 'time', label: 'Time', description: 'Native time picker.', patch: { type: 'time', label: 'Select time' } },
      { id: 'password', label: 'Password', description: 'Masked password input.', patch: { type: 'password', label: 'Your password' } },
      { id: 'with-hint', label: 'With hint', description: 'Hint text below the label.', patch: { type: 'text', label: 'Civil ID Number', hint: 'Enter the number as shown on your ID card' } },
      { id: 'required', label: 'Required', description: 'Marked required for form submit.', patch: { type: 'text', label: 'Your message', required: true } },
      { id: 'disabled', label: 'Disabled', description: 'Non-interactive.', patch: { type: 'text', label: 'Your message', disabled: true } },
      { id: 'with-placeholder', label: 'With placeholder', description: 'Placeholder text.', patch: { type: 'text', label: 'Your message', placeholder: 'Some placeholder' } },
      { id: 'max-length', label: 'With max length', description: 'Limited character count.', patch: { type: 'text', label: 'Your message', maxlength: 10 } },
      { id: 'readonly', label: 'Readonly with value', description: 'Read-only prefilled value.', patch: { type: 'text', label: 'Your message', value: 'Some value', readonly: true } },
    ],
  },
  {
    kind: 'textarea',
    label: 'Textarea',
    hint: 'Multi-line text (gup-textarea-field)',
    variants: [
      { id: 'default', label: 'Default', description: 'Plain textarea.', patch: { label: 'Description' } },
      { id: 'with-rows', label: 'With rows', description: '6 rows tall.', patch: { label: 'Description', rows: 6 } },
      { id: 'with-hint', label: 'With hint', description: 'Hint text below the label.', patch: { label: 'Description', hint: 'Add as much detail as you can' } },
      { id: 'max-length', label: 'With max length', description: 'Capped at 200 chars.', patch: { label: 'Description', maxlength: 200 } },
      { id: 'required', label: 'Required', description: 'Marked required.', patch: { label: 'Description', required: true } },
      { id: 'disabled', label: 'Disabled', description: 'Non-interactive.', patch: { label: 'Description', disabled: true } },
      { id: 'with-placeholder', label: 'With placeholder', description: 'Placeholder text.', patch: { label: 'Description', placeholder: 'Describe your request' } },
    ],
  },
  {
    kind: 'checkbox',
    label: 'Checkbox',
    hint: 'Single checkbox (gup-checkbox)',
    variants: [
      { id: 'default', label: 'Default', description: 'Plain checkbox.', patch: { label: 'I agree to the terms' } },
      { id: 'small', label: 'Small', description: 'Size s.', patch: { label: 'I agree to the terms', size: 's' } },
      { id: 'checked', label: 'Checked', description: 'Initially checked.', patch: { label: 'I agree to the terms', checked: true } },
      { id: 'indeterminate', label: 'Indeterminate', description: 'Partial state.', patch: { label: 'Select all', indeterminate: true } },
      { id: 'required', label: 'Required', description: 'Form-required.', patch: { label: 'I agree to the terms', required: true } },
      { id: 'with-hint', label: 'With hint', description: 'Hint text below.', patch: { label: 'I agree to the terms', hint: 'Read the terms before continuing' } },
      { id: 'disabled', label: 'Disabled', description: 'Non-interactive.', patch: { label: 'I agree to the terms', disabled: true } },
    ],
  },
  {
    kind: 'toggle',
    label: 'Toggle',
    hint: 'On/off switch (gup-toggle)',
    variants: [
      { id: 'default', label: 'Default', description: 'Knob before the label.', patch: { label: 'Enable notifications' } },
      { id: 'checked', label: 'Checked', description: 'Initially on.', patch: { label: 'Enable notifications', checked: true } },
      { id: 'knob-after', label: 'Knob after', description: 'Knob on the right.', patch: { label: 'Enable notifications', knobLocation: 'after' } },
      { id: 'with-hint', label: 'With hint', description: 'Hint text below.', patch: { label: 'Enable notifications', hint: 'You can change this any time' } },
      { id: 'disabled', label: 'Disabled', description: 'Non-interactive.', patch: { label: 'Enable notifications', disabled: true } },
    ],
  },
  {
    kind: 'radio-group',
    label: 'Radio button group',
    hint: 'Mutually exclusive choices (gup-radio-button-group)',
    variants: [
      { id: 'default', label: 'Default', description: 'Three options.', patch: { label: 'Choose one', options: ['Option A', 'Option B', 'Option C'] } },
      { id: 'with-hint', label: 'With hint', description: 'Helper text.', patch: { label: 'Choose one', options: ['Option A', 'Option B', 'Option C'], hint: 'Pick the option that best fits' } },
      { id: 'required', label: 'Required', description: 'Form-required.', patch: { label: 'Choose one', options: ['Option A', 'Option B', 'Option C'], required: true } },
    ],
  },
  {
    kind: 'dropdown',
    label: 'Dropdown',
    hint: 'Select from a list (gup-dropdown-field)',
    variants: [
      { id: 'default', label: 'Default', description: 'Single-select.', patch: { label: 'Select an item', options: ['Item 1', 'Item 2', 'Item 3'] } },
      { id: 'multiple', label: 'Multiple', description: 'Multi-select.', patch: { label: 'Select items', options: ['Item 1', 'Item 2', 'Item 3'], multiple: true } },
      { id: 'multiple-clearable', label: 'Multiple clearable', description: 'Multi + clear button.', patch: { label: 'Select items', options: ['Item 1', 'Item 2', 'Item 3'], multiple: true, clearable: true } },
      { id: 'with-hint', label: 'With hint', description: 'Helper text.', patch: { label: 'Select an item', options: ['Item 1', 'Item 2', 'Item 3'], hint: 'Pick what fits best' } },
      { id: 'required', label: 'Required', description: 'Form-required.', patch: { label: 'Select an item', options: ['Item 1', 'Item 2', 'Item 3'], required: true } },
      { id: 'disabled', label: 'Disabled', description: 'Non-interactive.', patch: { label: 'Select an item', options: ['Item 1', 'Item 2', 'Item 3'], disabled: true } },
    ],
  },
  {
    kind: 'file-upload',
    label: 'File upload',
    hint: 'Upload one or more files (gup-file-upload)',
    variants: [
      { id: 'default', label: 'Default', description: 'Single-file upload.', patch: { label: 'Upload a file', fileInputLabel: 'Choose file' } },
      { id: 'multiple', label: 'Multiple', description: 'Allow multiple files.', patch: { label: 'Upload files', fileInputLabel: 'Choose files', multipleFiles: true } },
      { id: 'thumbnails', label: 'With thumbnails', description: 'Show image previews.', patch: { label: 'Upload images', fileInputLabel: 'Choose images', multipleFiles: true, allowThumbnails: true } },
      { id: 'with-hint', label: 'With hint', description: 'Helper text.', patch: { label: 'Upload a file', fileInputLabel: 'Choose file', hint: 'Maximum size 50 MB' } },
      { id: 'required', label: 'Required', description: 'Form-required.', patch: { label: 'Upload a file', fileInputLabel: 'Choose file', required: true } },
      { id: 'full-width', label: 'Full width', description: 'Fills the row.', patch: { label: 'Upload a file', fileInputLabel: 'Choose file', fullWidth: true } },
    ],
  },
  {
    kind: 'form-section',
    label: 'Section heading',
    hint: 'Visual grouping (gup-form-section title)',
    variants: [
      { id: 'default', label: 'Default', description: 'Plain section heading.', patch: { label: 'Section title' } },
    ],
  },
  {
    kind: 'form-hint',
    label: 'Form hint',
    hint: 'Standalone hint text (gup-form-hint)',
    variants: [
      { id: 'default', label: 'Default', description: 'Plain hint text.', patch: { label: 'Some additional guidance for the user.' } },
    ],
  },
  {
    kind: 'validation-message',
    label: 'Validation message',
    hint: 'Standalone error text (gup-form-validation-message)',
    variants: [
      { id: 'default', label: 'Default', description: 'Plain error message.', patch: { label: 'Please correct the highlighted fields.' } },
    ],
  },
  {
    kind: 'button',
    label: 'Button',
    hint: 'Action button (gup-button)',
    variants: [
      { id: 'primary', label: 'Primary', description: 'Filled action.', patch: { label: 'Submit', appearance: 'primary' } },
      { id: 'secondary', label: 'Secondary', description: 'Outlined action.', patch: { label: 'Cancel', appearance: 'secondary' } },
      { id: 'text', label: 'Text', description: 'Inline link-like.', patch: { label: 'Learn more', appearance: 'text' } },
    ],
  },
];

export function getPaletteItem(kind: FieldKind): PaletteItem | undefined {
  return PALETTE.find((p) => p.kind === kind);
}

let counter = 0;
const nextId = () => `f${Date.now().toString(36)}${(counter++).toString(36)}`;

const DEFAULTS: Record<FieldKind, Partial<Field>> = {
  'input-field': { type: 'text', label: 'Your message' },
  textarea: { label: 'Description', rows: 4 },
  checkbox: { label: 'I agree to the terms' },
  toggle: { label: 'Enable notifications' },
  'radio-group': { label: 'Choose one', options: ['Option A', 'Option B', 'Option C'] },
  dropdown: { label: 'Select an item', options: ['Item 1', 'Item 2', 'Item 3'] },
  'file-upload': { label: 'Upload a file', fileInputLabel: 'Choose file' },
  'form-section': { label: 'Section title' },
  'form-hint': { label: 'Some additional guidance for the user.' },
  'validation-message': { label: 'Please correct the highlighted fields.' },
  button: { label: 'Submit', appearance: 'primary' },
};

export function makeField(kind: FieldKind, variantPatch?: Partial<Field>): Field {
  return {
    id: nextId(),
    kind,
    label: DEFAULTS[kind].label ?? 'Untitled',
    ...DEFAULTS[kind],
    ...variantPatch,
  } as Field;
}
