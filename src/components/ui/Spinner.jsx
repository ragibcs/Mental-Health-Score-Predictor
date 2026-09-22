import React from 'react';

export default function Spinner({
  size = 'md', // sm | md | lg
  color = 'var(--primary)',
  className = '',
  centered = false,
}) {
  const sizeMap = {
    sm: '1rem',
    md: '1.5rem',
    lg: '2.5rem',
  };

  const spinnerElement = (
    <div
      className={`spinner ${className}`.trim()}
      style={{
        width: sizeMap[size] || size,
        height: sizeMap[size] || size,
        // color-mix lets this accept design tokens like 'var(--primary)'
        borderColor: `color-mix(in srgb, ${color} 22%, transparent)`,
        borderTopColor: color,
      }}
      role="status"
      aria-label="Loading"
    />
  );

  if (centered) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          width: '100%',
        }}
      >
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
}
