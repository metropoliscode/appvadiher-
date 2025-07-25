import React from 'react';
import { ToastMessage } from '@/types';
// ajusta la ruta si usas alias

type AlertProps = {
  type?: ToastMessage;
  message: string;
};

const ToastAlert: React.FC<AlertProps> = ({ type = 'info', message }) => {
  const colors: Record<ToastMessage, string> = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  return (
    <div className={`border-l-4 p-4 mb-4 rounded ${colors[type]}`}>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default ToastAlert;
