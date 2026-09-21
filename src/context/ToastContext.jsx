import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'info', duration = 4000) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      const newToast = { id, message, type };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container" role="region" aria-label="Notifications">
        {toasts.map((toast) => {
          let IconComponent = Info;
          let iconColor = 'var(--primary)';

          if (toast.type === 'success') {
            IconComponent = CheckCircle2;
            iconColor = 'var(--success)';
          } else if (toast.type === 'error') {
            IconComponent = AlertCircle;
            iconColor = 'var(--danger)';
          } else if (toast.type === 'warning') {
            IconComponent = AlertTriangle;
            iconColor = 'var(--warning)';
          }

          return (
            <div key={toast.id} className={`toast toast-${toast.type}`} role="alert">
              <div className="toast-icon">
                <IconComponent size={18} color={iconColor} />
              </div>
              <div className="toast-content">{toast.message}</div>
              <button
                type="button"
                className="toast-close"
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
