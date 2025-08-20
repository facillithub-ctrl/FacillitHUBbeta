import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Fecha automaticamente após 3 segundos
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-brand-teal' : 'bg-red-500';
  const icon = type === 'success' ? 'check_circle' : 'error';

  return (
    <div className="fixed top-5 right-5 z-50">
      <div className={`flex items-center p-4 rounded-lg shadow-lg text-white ${bgColor}`}>
        <span className="material-symbols-outlined mr-3">{icon}</span>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Toast;