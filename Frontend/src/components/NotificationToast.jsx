import React, { useEffect } from 'react';

/**
 * Reusable Notification Toast Component
 * Aligned with Notification_System_Design.md specification.
 *
 * @param {string} type - 'success' | 'error' | 'warning' | 'info'
 * @param {string} message - Message text
 * @param {function} onClose - Callback on dismissal
 * @param {number} duration - Auto-dismiss duration in ms
 */
export default function NotificationToast({ type = 'info', message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!duration || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles = {
    success: 'bg-green-100 border-green-500 text-green-800',
    error: 'bg-red-100 border-red-500 text-red-800',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    info: 'bg-blue-100 border-blue-500 text-blue-800',
  };

  const typeIcons = {
    success: '✅',
    error: '⚠️',
    warning: '🔔',
    info: 'ℹ️',
  };

  return (
    <div
      className={`fixed bottom-5 right-5 flex items-center gap-3 p-4 rounded-lg border-l-4 shadow-lg transition-all z-50 ${
        typeStyles[type] || typeStyles.info
      }`}
    >
      <span className="text-lg">{typeIcons[type] || typeIcons.info}</span>
      <p className="text-sm font-medium">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto text-xs opacity-60 hover:opacity-100 transition"
          aria-label="Close notification"
        >
          ✕
        </button>
      )}
    </div>
  );
}
