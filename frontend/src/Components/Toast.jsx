import React, { useEffect } from 'react';

const TYPE_STYLES = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-brand-primary text-white',
};

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    if (!message) return undefined;
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-50 shadow-lg rounded-2xl px-5 py-3 text-sm font-medium flex items-center gap-3 ${TYPE_STYLES[type] ?? TYPE_STYLES.info}`}
    >
      {message}
    </div>
  );
};

export default Toast;
