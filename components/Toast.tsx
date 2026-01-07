
import React, { useEffect } from 'react';
import { ToastMessage, ToastType } from '../types';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onClose: () => void }> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    [ToastType.SUCCESS]: { icon: <CheckCircle className="w-5 h-5 text-green-500" />, bg: 'bg-green-50 border-green-200 text-green-800' },
    [ToastType.ERROR]: { icon: <AlertCircle className="w-5 h-5 text-red-500" />, bg: 'bg-red-50 border-red-200 text-red-800' },
    [ToastType.INFO]: { icon: <Info className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50 border-blue-200 text-blue-800' },
  };

  const { icon, bg } = config[toast.type];

  return (
    <div className={`pointer-events-auto flex items-center p-4 rounded-lg border shadow-lg animate-slide-in ${bg} min-w-[280px]`}>
      <div className="flex-shrink-0 mr-3">{icon}</div>
      <div className="flex-grow text-sm font-medium">{toast.message}</div>
      <button onClick={onClose} className="ml-3 hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
