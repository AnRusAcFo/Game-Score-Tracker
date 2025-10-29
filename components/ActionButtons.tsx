
import React, { useState } from 'react';

interface ActionButtonsProps {
  onAddPlayer: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onResetScores: () => void;
}

const ActionButton: React.FC<{
    onClick: () => void;
    icon: string;
    label: string;
    className?: string;
}> = ({ onClick, icon, label, className = 'bg-primary hover:bg-indigo-700' }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center space-y-1 p-2 rounded-lg transition-all transform hover:-translate-y-1 text-white text-xs sm:text-sm w-16 h-16 sm:w-20 sm:h-20 ${className}`}
        aria-label={label}
    >
        <i className={`fas ${icon} text-lg sm:text-xl`}></i>
        <span>{label}</span>
    </button>
);

const ActionButtons: React.FC<ActionButtonsProps> = ({ onAddPlayer, onSave, onLoad, onExport, onResetScores }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleResetClick = () => {
    if (showConfirm) {
        onResetScores();
        setShowConfirm(false);
    } else {
        setShowConfirm(true);
        setTimeout(() => setShowConfirm(false), 3000); // Hide after 3 seconds
    }
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-neutral/80 backdrop-blur-sm shadow-t-xl z-40">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
            <ActionButton onClick={onSave} icon="fa-save" label="Save"/>
            <ActionButton onClick={onLoad} icon="fa-upload" label="Load"/>
            <button 
              onClick={onAddPlayer}
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent hover:bg-emerald-500 text-white shadow-lg transform transition hover:scale-110 -translate-y-4"
              aria-label="Add Player"
            >
              <i className="fas fa-plus text-2xl"></i>
            </button>
            <ActionButton onClick={onExport} icon="fa-file-csv" label="Export" />
            <ActionButton 
              onClick={handleResetClick} 
              icon="fa-sync-alt" 
              label={showConfirm ? "Confirm?" : "Reset"} 
              className={showConfirm ? 'bg-error hover:bg-red-500' : 'bg-warning hover:bg-orange-500'}
            />
        </div>
      </div>
    </footer>
  );
};

export default ActionButtons;
