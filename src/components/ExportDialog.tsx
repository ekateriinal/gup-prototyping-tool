import React, { useMemo, useState } from 'react';
import type { Prototype } from '../types';
import { buildExportHtmlMarkup, buildExportJs, buildExportSingleFile } from '../lib/serialize';

interface Props {
  prototype: Prototype;
  onClose: () => void;
}

type Tab = 'html-markup' | 'js' | 'single-file';

const TAB_CONFIG: Record<Tab, { label: string; filename: string; mime: string; hint: string }> = {
  'html-markup': {
    label: 'HTML markup',
    filename: 'prototype.html',
    mime: 'text/html',
    hint: 'Just the page markup. Paste it into a template, route, or partial in your app.',
  },
  js: {
    label: 'JavaScript',
    filename: 'app.js',
    mime: 'text/javascript',
    hint: 'Imports the components + styles from @govom/components and wires Back / Continue.',
  },
  'single-file': {
    label: 'Single file',
    filename: 'index.html',
    mime: 'text/html',
    hint: 'One HTML file with the markup and a <script type="module"> that imports from @govom/components. Serve through your bundler.',
  },
};

export const ExportDialog: React.FC<Props> = ({ prototype, onClose }) => {
  const [tab, setTab] = useState<Tab>('html-markup');

  const code = useMemo(() => {
    switch (tab) {
      case 'html-markup':
        return buildExportHtmlMarkup(prototype);
      case 'js':
        return buildExportJs();
      case 'single-file':
        return buildExportSingleFile(prototype);
    }
  }, [tab, prototype]);

  const cfg = TAB_CONFIG[tab];

  const download = () => {
    const blob = new Blob([code], { type: cfg.mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = cfg.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      /* fallback ignored */
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Export</h2>
          <button type="button" className="modal__close" onClick={onClose}>×</button>
        </div>
        <div className="modal__tabs" role="tablist">
          {(Object.keys(TAB_CONFIG) as Tab[]).map((id) => (
            <TabButton key={id} active={tab === id} onClick={() => setTab(id)}>
              {TAB_CONFIG[id].label}
            </TabButton>
          ))}
        </div>
        <div className="modal__hint">
          <strong>Assumes <code>@govom/components</code> is installed via npm in your project.</strong>
          {' '}
          {cfg.hint}
        </div>
        <textarea className="modal__code" value={code} readOnly />
        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={copy}>Copy</button>
          <button type="button" className="btn btn--primary" onClick={download}>
            Download {cfg.filename}
          </button>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({
  active,
  onClick,
  children,
}) => (
  <button
    type="button"
    role="tab"
    aria-selected={active}
    className={`modal__tab${active ? ' modal__tab--active' : ''}`}
    onClick={onClick}
  >
    {children}
  </button>
);
