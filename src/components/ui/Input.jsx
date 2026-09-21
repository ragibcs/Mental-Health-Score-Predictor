import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Input({
  label,
  optional = false,
  error,
  hint,
  icon: Icon,
  type = 'text',
  id,
  className = '',
  wrapperClassName = '',
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`form-group ${wrapperClassName}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="form-label">
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

        <input
          id={inputId}
          type={resolvedType}
          className={`form-input ${Icon ? 'has-icon-left' : ''} ${isPassword ? 'has-icon-right' : ''} ${error ? 'is-invalid' : ''} ${className}`.trim()}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className="input-icon-right"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
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
