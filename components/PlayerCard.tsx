import React, { useState, useEffect, useRef } from 'react';
import { type Player } from '../types';

interface PlayerCardProps {
  player: Player;
  onDelete: (id: number) => void;
  onUpdateScore: (id: number, amount: number) => void;
  rank?: 'first' | 'second' | null;
}

const ScoreButton: React.FC<{
    amount: number;
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
}> = ({ amount, onClick, className = '', children }) => {
    const baseClasses = 'px-2 py-1 text-xs font-bold rounded-md transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800';
    const colorClasses = amount > 0 ? 'bg-green-600 hover:bg-green-500 focus:ring-green-500' : 'bg-red-600 hover:bg-red-500 focus:ring-red-500';
    return (
        <button onClick={onClick} className={`${baseClasses} ${colorClasses} ${className}`}>
            {children}
        </button>
    );
};

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onDelete, onUpdateScore, rank }) => {
  const [scoreChange, setScoreChange] = useState<number | null>(null);
  const [oldScore, setOldScore] = useState<number | null>(null);
  const prevScoreRef = useRef<number>(player.score);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (prevScoreRef.current !== player.score) {
      const change = player.score - prevScoreRef.current;
      setScoreChange(change);
      setOldScore(prevScoreRef.current); // Set the old score to persist
      setAnimationKey(prev => prev + 1); // Reset animation for score change pop-up
      
      const scoreChangeTimer = setTimeout(() => {
        setScoreChange(null); // Clear only the pop-up animation state
      }, 1200);

      prevScoreRef.current = player.score;
      
      return () => clearTimeout(scoreChangeTimer);
    }
  }, [player.score]);

  const crownConfig = {
    first: { icon: 'fa-crown', color: 'text-yellow-400', classes: '-rotate-12' },
    second: { icon: 'fa-crown', color: 'text-slate-400', classes: '-rotate-12' },
  };

  const CrownIcon = rank && crownConfig[rank] ? (
    <i
      className={`fas ${crownConfig[rank].icon} ${crownConfig[rank].color} ${crownConfig[rank].classes} absolute -top-3 -left-2 text-2xl transform`}
      style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
      aria-hidden="true"
    ></i>
  ) : null;


  return (
    <div className="bg-neutral rounded-lg shadow-xl overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl flex flex-col">
      <div className="p-4 flex items-center justify-between bg-gray-900/50">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={player.avatarUrl}
              alt={`${player.name}'s avatar`}
              className="w-14 h-14 rounded-full border-2 border-accent"
            />
            {CrownIcon}
          </div>
          <h2 className="text-xl font-bold text-white truncate">{player.name}</h2>
        </div>
        <button
          onClick={() => onDelete(player.id)}
          className="text-gray-500 hover:text-error transition-colors"
          aria-label={`Delete ${player.name}`}
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>

      <div className="p-5 flex-grow flex flex-col justify-center items-center bg-neutral/80">
        <p className="text-gray-400 text-sm font-semibold mb-2">SCORE</p>
        <div className="relative mb-4 flex flex-col justify-center items-center" style={{ minHeight: '4.5rem' }}>
          <p className="text-5xl font-extrabold text-white tracking-tighter">
            {player.score}
          </p>
          {scoreChange !== null && (
            <span
              key={animationKey}
              className={`absolute text-3xl font-bold animate-score-change pointer-events-none ${
                scoreChange > 0 ? 'text-green-400' : 'text-red-400'
              }`}
              style={{ textShadow: '0 0 5px rgba(0,0,0,0.7)' }}
            >
              {scoreChange > 0 ? `+${scoreChange}` : scoreChange}
            </span>
          )}
          {oldScore !== null ? (
            <span className="text-xs text-gray-500 h-4">
              (was {oldScore})
            </span>
          ) : (
             <span className="h-4"></span>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="grid grid-cols-3 gap-2">
            <ScoreButton amount={-5} onClick={() => onUpdateScore(player.id, -5)}>-5</ScoreButton>
            <ScoreButton amount={-10} onClick={() => onUpdateScore(player.id, -10)}>-10</ScoreButton>
            <ScoreButton amount={-20} onClick={() => onUpdateScore(player.id, -20)}>-20</ScoreButton>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <ScoreButton amount={5} onClick={() => onUpdateScore(player.id, 5)}>+5</ScoreButton>
            <ScoreButton amount={10} onClick={() => onUpdateScore(player.id, 10)}>+10</ScoreButton>
            <ScoreButton amount={20} onClick={() => onUpdateScore(player.id, 20)}>+20</ScoreButton>
          </div>
        </div>
      </div>
       <style>{`
        @keyframes score-change-pop {
          from {
            opacity: 1;
            transform: translateY(0) scale(0.8);
          }
          to {
            opacity: 0;
            transform: translateY(-50px) scale(1.2);
          }
        }
        .animate-score-change {
          animation: score-change-pop 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PlayerCard;