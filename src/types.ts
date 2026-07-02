export type InputType =
  | 'text'
  | 'numeric'
  | 'number'
  | 'email'
  | 'tel'
  | 'url'
  | 'date'
  | 'time'
  | 'password';

export type FieldKind =
  | 'input-field'
  | 'textarea'
  | 'checkbox'
  | 'toggle'
  | 'radio-group'
  | 'dropdown'
  | 'file-upload'
  | 'form-section'
  | 'form-hint'
  | 'validation-message'
  | 'button';

export interface Field {
  id: string;
  kind: FieldKind;
  label: string;
  placeholder?: string;
  hint?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;

  // input-field
  type?: InputType;
  value?: string;
  min?: string;
  max?: string;
  step?: number;
  pattern?: string;
  maxlength?: number;

  // textarea
  rows?: number;

  // checkbox / toggle
  checked?: boolean;
  indeterminate?: boolean;
  size?: 's' | 'm';
  knobLocation?: 'before' | 'after';

  // dropdown / radio-group
  options?: string[];
  multiple?: boolean;
  clearable?: boolean;

  // file-upload
  multipleFiles?: boolean;
  allowThumbnails?: boolean;
  fullWidth?: boolean;
  fileInputLabel?: string;

  // button
  appearance?: 'primary' | 'secondary' | 'text';
}

export type StepKind = 'form' | 'review';

export interface Step {
  id: string;
  title: string;
  description: string;
  kind: StepKind;
  reviewIntructionsHeading?: string;
  reviewInstructions?: string;
  /** Only used when kind === 'review' */
  referenceNumber?: string;
  fields: Field[];
}

export interface Prototype {
  serviceTitle: string;
  contentHeader: string;
  steps: Step[];
}
