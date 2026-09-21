import React from 'react';

export default function Badge({
  children,
  variant = 'primary', // primary | success | warning | danger | neutral
  size = 'md',        // sm | md
  withDot = false,
  className = '',
}) {
  return (
    <span className={`badge badge-${variant} ${size === 'sm' ? 'badge-sm' : ''} ${className}`.trim()}>
      {withDot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'currentColor',
            display: 'inline-block',
          }}
        />
      )}
      {children}
    </span>
  );
}
