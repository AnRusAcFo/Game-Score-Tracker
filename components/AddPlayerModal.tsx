
import React, { useState, useEffect, useRef } from 'react';

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPlayer: (name: string) => void;
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ isOpen, onClose, onAddPlayer }) => {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPlayer(name);
    setName('');
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-neutral rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 transform transition-all scale-95 opacity-0 animate-scale-in"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
        style={{ animation: 'scale-in 0.2s forwards' }}
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Add New Player</h2>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter player's name"
            className="w-full px-4 py-2 bg-base-100 border-2 border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-white"
          />
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors text-white font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-accent hover:bg-emerald-500 transition-colors text-white font-semibold"
            >
              Add Player
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes scale-in {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default AddPlayerModal;
