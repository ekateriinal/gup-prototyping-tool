import { buildPreviewHtml } from '../lib/serialize';
import type { Prototype } from '../types';

export function openPreview(p: Prototype) {
  const html = buildPreviewHtml(p);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener,noreferrer');
  // Revoke later so the new tab has time to load
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
