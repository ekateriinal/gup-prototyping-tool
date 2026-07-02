// Ambient JSX declaration so every gup-* (or any other) custom element
// type-checks without an @ts-expect-error escape hatch on each use.

// List desired components for usage one by one
// declare namespace JSX {
//   interface IntrinsicElements {
//     "gup-table": any;
//     "gup-table-cell": any;
//     "gup-table-row": any;
//     "gup-track": any;
//     "gup-badge-chip": any;
//   }
// }

declare namespace JSX {
  interface IntrinsicElements {
    [key: string]: any;
  }
}

interface GupDialogContainer extends HTMLElement {
  createDialog(options: {
    heading: string;
    content?: string;
    actionButtons?: string;
    hideCloseButton?: boolean;
    closeLabel?: string;
  }): HTMLElement;

  closeDialog(dialog: HTMLElement): void;
  closeAllDialogs(): void;
}
