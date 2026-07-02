import React from 'react';

const ARROW_MARKER = (
  <defs>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M0 0 L8 4 L0 8 Z" fill="#2563eb" />
    </marker>
  </defs>
);

export const DragFromPaletteSvg: React.FC = () => (
  <svg width="200" height="110" viewBox="0 0 200 110">
    {ARROW_MARKER}
    <rect x="6" y="20" width="70" height="24" rx="4" fill="#f4f7ff" stroke="#2563eb" />
    <circle cx="14" cy="32" r="1.5" fill="#6e6e73" />
    <circle cx="14" cy="36" r="1.5" fill="#6e6e73" />
    <text x="22" y="36" fontSize="10" fill="#1d1d1f">Input field</text>
    <path d="M78 32 L108 40" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arr)" fill="none" />
    <rect x="110" y="14" width="84" height="82" rx="6" fill="#fafafd" stroke="#2563eb" strokeDasharray="4 3" />
    <text x="123" y="60" fontSize="10" fill="#2563eb">Drop here</text>
  </svg>
);

export const EditInlineSvg: React.FC = () => (
  <svg width="200" height="110" viewBox="0 0 200 110">
    <rect x="10" y="26" width="180" height="58" rx="4" fill="#ffffff" stroke="#d6d6dc" />
    <text x="24" y="52" fontSize="14" fontWeight="700" fill="#1d1d1f">Service name</text>
    {/* Text cursor */}
    <line x1="118" y1="42" x2="118" y2="58" stroke="#2563eb" strokeWidth="1.5">
      <animate attributeName="opacity" values="0;1;0" dur="1.2s" repeatCount="indefinite" />
    </line>
    <text x="24" y="74" fontSize="9" fill="#6e6e73">Click to edit</text>
  </svg>
);

export const InspectorSvg: React.FC = () => (
  <svg width="200" height="110" viewBox="0 0 200 110">
    <rect x="10" y="20" width="90" height="72" rx="4" fill="#f4f7ff" stroke="#2563eb" />
    <text x="20" y="34" fontSize="8" fill="#6e6e73">LABEL</text>
    <rect x="20" y="40" width="70" height="18" rx="3" fill="#ffffff" stroke="#d6d6dc" />
    <text x="20" y="72" fontSize="8" fill="#6e6e73">HINT</text>
    <line x1="20" y1="78" x2="80" y2="78" stroke="#d6d6dc" />
    <rect x="112" y="6" width="82" height="98" rx="4" fill="#ffffff" stroke="#d6d6dc" />
    <text x="120" y="20" fontSize="9" fontWeight="700" fill="#1d1d1f">Edit field</text>
    <line x1="120" y1="24" x2="186" y2="24" stroke="#d6d6dc" />
    {['Label', 'Placeholder', 'Required', 'Disabled'].map((t, i) => (
      <g key={t}>
        <text x="120" y={38 + i * 16} fontSize="8" fill="#6e6e73">{t}</text>
        <rect x="120" y={40 + i * 16} width="66" height="8" rx="2" fill="#fafafd" stroke="#d6d6dc" />
      </g>
    ))}
  </svg>
);

export const ReorderSvg: React.FC = () => (
  <svg width="200" height="110" viewBox="0 0 200 110">
    {ARROW_MARKER}
    <rect x="30" y="10" width="140" height="22" rx="4" fill="#f4f7ff" stroke="#2563eb" opacity="0.35" />
    <text x="42" y="25" fontSize="10" fill="#1d1d1f" opacity="0.6">Field A</text>
    <rect x="30" y="38" width="140" height="4" rx="2" fill="#2563eb" />
    <rect x="30" y="46" width="140" height="22" rx="4" fill="#ffffff" stroke="#2563eb" strokeWidth="1.5" />
    <text x="42" y="61" fontSize="10" fill="#1d1d1f">Field B (dragging)</text>
    <path d="M100 76 L100 96" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arr)" fill="none" />
  </svg>
);

export const StepperSvg: React.FC = () => (
  <svg width="200" height="110" viewBox="0 0 200 110">
    <rect x="6" y="14" width="188" height="80" rx="4" fill="#fafafd" stroke="#2563eb" strokeDasharray="3 3" />
    {[0, 1, 2].map((i) => {
      const cx = 26 + i * 55;
      const done = i === 0;
      const cur = i === 1;
      const fill = done ? '#e7f5ec' : cur ? '#dbeafe' : '#ffffff';
      const stroke = done ? '#6bbf85' : cur ? '#2563eb' : '#d6d6dc';
      return (
        <g key={i}>
          <circle cx={cx} cy="42" r="10" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <text x={cx} y="46" fontSize="10" textAnchor="middle" fill="#1d1d1f">{i + 1}</text>
          <text x={cx} y="66" fontSize="8" textAnchor="middle" fill="#6e6e73">Step {i + 1}</text>
          {i < 2 && <line x1={cx + 12} y1="42" x2={cx + 43} y2="42" stroke="#d6d6dc" />}
        </g>
      );
    })}
    <text x="100" y="86" fontSize="8" textAnchor="middle" fill="#2563eb">Click to configure ↑</text>
  </svg>
);

export const ReviewSvg: React.FC = () => (
  <svg width="200" height="110" viewBox="0 0 200 110">
    <text x="10" y="18" fontSize="11" fontWeight="700" fill="#1d1d1f">Review your application</text>
    <text x="10" y="34" fontSize="8" fontWeight="700" fill="#1d1d1f">Step 1</text>
    <line x1="10" y1="38" x2="190" y2="38" stroke="#d6d6dc" />
    {[0, 1].map((i) => (
      <g key={i}>
        <text x="10" y={52 + i * 18} fontSize="9" fontWeight="700" fill="#1d1d1f">Field {i + 1}</text>
        <text x="90" y={52 + i * 18} fontSize="9" fill="#1d1d1f">Value</text>
        <text x="170" y={52 + i * 18} fontSize="9" fill="#2563eb" textDecoration="underline">Change</text>
        <line x1="10" y1={56 + i * 18} x2="190" y2={56 + i * 18} stroke="#d6d6dc" />
      </g>
    ))}
  </svg>
);

export const ExportSvg: React.FC = () => (
  <svg width="200" height="110" viewBox="0 0 200 110">
    <rect x="10" y="12" width="180" height="86" rx="4" fill="#ffffff" stroke="#d6d6dc" />
    <rect x="10" y="12" width="60" height="20" fill="#dbeafe" />
    <text x="18" y="26" fontSize="9" fontWeight="700" fill="#2563eb">HTML</text>
    <text x="82" y="26" fontSize="9" fill="#6e6e73">JS</text>
    <text x="110" y="26" fontSize="9" fill="#6e6e73">Single file</text>
    <line x1="10" y1="32" x2="190" y2="32" stroke="#d6d6dc" />
    {[42, 54, 66, 78].map((y, i) => (
      <line key={i} x1="18" y1={y} x2={110 + i * 10} y2={y} stroke="#6e6e73" strokeWidth="0.8" />
    ))}
  </svg>
);
