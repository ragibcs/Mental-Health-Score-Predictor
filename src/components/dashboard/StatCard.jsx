import React from 'react';
import Skeleton from '../ui/Skeleton';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'var(--primary)',
  tint = 'violet', // violet | emerald | cyan | amber — vivid bento wash
  badgeText,
  badgeBg,
  badgeColor,
  badgeBorder,
  isLoading = false,
  className = '',
}) {
  const tintClass = tint ? `tint-${tint}` : '';

  if (isLoading) {
    return (
      <div className={`stat-card ${tintClass} ${className}`.trim()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <Skeleton width="45%" height="1.25rem" />
          <Skeleton width="2.5rem" height="2.5rem" borderRadius="50%" />
        </div>
        <Skeleton width="60%" height="2rem" />
        <div style={{ marginTop: '0.5rem' }}>
          <Skeleton width="80%" height="0.875rem" />
        </div>
      </div>
    );
  }

  return (
    <div className={`stat-card ${tintClass} ${className}`.trim()}>
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        {Icon && (
          <div
            className="stat-icon-wrapper"
            // A bento tint drives the icon colour via CSS; `color` is the
            // fallback for tiles that opt out of a tint.
            style={
              tint
                ? undefined
                : {
                    backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
                    color: color,
                  }
            }
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      <div className="stat-body">
        <div className="stat-value-row">
          <span className="stat-value">{value}</span>
          {badgeText && (
            <span
              className="stat-pill-badge"
              style={{
                backgroundColor: badgeBg || 'var(--primary-soft)',
                color: badgeColor || 'var(--primary)',
                borderColor: badgeBorder || 'var(--border)',
              }}
            >
              <span
                className="stat-badge-dot"
                style={{ backgroundColor: badgeColor || 'var(--primary)' }}
              />
              <span>{badgeText}</span>
            </span>
          )}
        </div>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}
