import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

export default function Select({
  label,
  optional = false,
  error,
  hint,
  icon: Icon,
  options = [],
  id,
  className = '',
  wrapperClassName = '',
  placeholder = 'Select an option...',
  value,
  onChange,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`form-group ${wrapperClassName}`.trim()}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          <span>{label}</span>
          {optional && <span className="form-label-optional">(Optional)</span>}
        </label>
      )}

      <div className="input-wrapper">
        {Icon && (
          <div className="input-icon-left">
            <Icon size={18} />
          </div>
        )}

        <select
          id={selectId}
          className={`form-select ${Icon ? 'has-icon-left' : ''} ${error ? 'is-invalid' : ''} ${className}`.trim()}
          value={value}
          onChange={onChange}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            if (typeof opt === 'string') {
              return (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              );
            }
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label || opt.value}
              </option>
            );
          })}
        </select>

        <div className="input-icon-right" style={{ pointerEvents: 'none', color: 'var(--text-muted)' }}>
          <ChevronDown size={18} />
        </div>
      </div>

      {hint && !error && <p className="form-hint">{hint}</p>}
      {error && (
        <div className="form-error" role="alert">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
