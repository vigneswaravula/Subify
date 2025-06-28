import React from 'react';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#374151',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e5e7eb',
          borderRadius: '0.75rem',
          padding: '16px',
        },
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {t.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {t.type === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                {t.type === 'loading' && <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
                {!['success', 'error', 'loading'].includes(t.type) && <AlertCircle className="w-5 h-5 text-blue-500" />}
              </div>
              <div className="flex-1 text-sm font-medium">{message}</div>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

export const showToast = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  loading: (message: string) => toast.loading(message),
  info: (message: string) => toast(message),
};