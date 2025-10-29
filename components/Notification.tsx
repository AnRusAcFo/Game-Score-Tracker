
import React, { useEffect, useState } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true); // Trigger fade-in
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Allow fade-out before unmounting
    }, 2700);

    return () => clearTimeout(timer);
  }, [message, type, onClose]);
  
  const baseClasses = 'fixed top-5 right-5 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300';
  const typeClasses = {
    success: 'bg-accent',
    error: 'bg-error',
  };
  const visibilityClasses = visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10';

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${visibilityClasses}`}>
      <i className={`fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} mr-3`}></i>
      {message}
    </div>
  );
};

export default Notification;
