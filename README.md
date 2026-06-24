# GUP Prototyper

A drag-and-drop prototyping playground for the [@govom/components](https://www.npmjs.com/package/@govom/components) Oman GUP design system.

Managers and designers can quickly assemble a multi-step form using real GUP components, navigate through it like a user would, and export a standalone HTML file.

## What you can do

- **Drag form components** (text input, textarea, checkbox, radio group, dropdown, etc.) from the left sidebar into a canvas
- **Edit the service title, the content header, and each step's title** inline by clicking on them
- **Add or remove steps** with one click; navigate the canvas with Back / Continue just like a real wizard
- **Tweak a field's label, placeholder, and options** in the right inspector
- **Preview** the prototype in a new tab - it's the same HTML you'd export
- **Export** the prototype as either a self-contained HTML (JS in `<script>`) or as separate HTML + `app.js` files. Components are loaded from a CDN - no build step required for the exported page

> Prototypes are kept in memory only. Refreshing the page clears your work.

## Run locally

```bash
npm install
npm run dev
```

Then open <http://localhost:5180>.

## Project layout

```
src/
  App.tsx              # top-level state, layout
  components/
    Sidebar.tsx        # draggable palette
    Canvas.tsx         # editable service-start template + stepper + drop zones
    FieldRenderer.tsx  # renders each dropped field as a <gup-*> web component
    Inspector.tsx      # right-hand property editor
    ExportDialog.tsx   # HTML / JS export tabs
    Preview.tsx        # opens the prototype in a new tab
  lib/
    componentRegistry.ts  # palette catalogue + field factories
    serialize.ts          # prototype → standalone HTML/JS
```
