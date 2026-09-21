import React from 'react';

export default function Skeleton({
  width = '100%',
  height = '1rem',
  borderRadius = 'var(--radius-md)',
  className = '',
  count = 1,
}) {
  const skeletons = Array.from({ length: count });

  return (
    <>
      {skeletons.map((_, index) => (
        <div
          key={index}
          className={`skeleton ${className}`.trim()}
          style={{
            width,
            height,
            borderRadius,
            marginBottom: count > 1 && index < count - 1 ? '0.5rem' : undefined,
          }}
        />
      ))}
    </>
  );
}
