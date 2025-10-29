
import React, { useState, useEffect, useCallback } from 'react';
import { type Player } from './types';
import PlayerCard from './components/PlayerCard';
import AddPlayerModal from './components/AddPlayerModal';
import ActionButtons from './components/ActionButtons';
import { loadPlayers, savePlayers } from './services/storageService';
import { exportToCsv } from './services/exportService';
import Header from './components/Header';
import Notification from './components/Notification';

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const savedPlayers = loadPlayers();
    if (savedPlayers) {
      setPlayers(savedPlayers);
      showNotification('Game loaded from last session!', 'success');
    }
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleAddPlayer = (name: string) => {
    if (!name.trim()) {
        showNotification('Player name cannot be empty.', 'error');
        return;
    }
    const newPlayer: Player = {
      id: Date.now(),
      name,
      score: 0,
      avatarUrl: `https://picsum.photos/seed/${Date.now()}/100`,
    };
    setPlayers(prev => [...prev, newPlayer]);
    setIsModalOpen(false);
    showNotification(`${name} has joined the game!`, 'success');
  };

  const handleDeletePlayer = useCallback((id: number) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
    showNotification('Player removed.', 'success');
  }, []);

  const handleUpdateScore = useCallback((id: number, amount: number) => {
    setPlayers(prev =>
      prev.map(p =>
        p.id === id ? { ...p, score: p.score + amount } : p
      )
    );
  }, []);

  const handleSaveGame = () => {
    savePlayers(players);
    showNotification('Game state saved successfully!', 'success');
  };

  const handleLoadGame = () => {
    const savedPlayers = loadPlayers();
    if (savedPlayers) {
      setPlayers(savedPlayers);
      showNotification('Game loaded from storage!', 'success');
    } else {
      showNotification('No saved game found.', 'error');
    }
  };

  const handleExportData = () => {
    if (players.length === 0) {
        showNotification('Add some players first!', 'error');
        return;
    }
    exportToCsv(players, 'game-scores.csv');
    showNotification('Scores exported to CSV!', 'success');
  };
  
  const handleResetScores = () => {
    setPlayers(prev => prev.map(p => ({...p, score: 0})));
    showNotification('All scores have been reset!', 'success');
  }

  const sortedPlayers = players
    .slice()
    .sort((a, b) => b.score - a.score);

  const uniqueScores = [...new Set(sortedPlayers.map(p => p.score))];
  const showCrowns = uniqueScores.length > 1 && players.length > 1;

  let highestScore: number | null = null;
  let secondHighestScore: number | null = null;

  if (showCrowns) {
      highestScore = uniqueScores[0];
      secondHighestScore = uniqueScores.length > 1 ? uniqueScores[1] : null;
  }


  return (
    <div className="min-h-screen flex flex-col font-sans">
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 pb-32">
        {players.length === 0 ? (
            <div className="text-center mt-20">
                <p className="text-gray-400 text-2xl">No players yet.</p>
                <p className="text-gray-500 mt-2">Click "Add Player" to start the game!</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedPlayers.map(player => {
                let rank: 'first' | 'second' | null = null;
                if (showCrowns) {
                    if (player.score === highestScore) {
                        rank = 'first';
                    } else if (player.score === secondHighestScore) {
                        rank = 'second';
                    }
                }
                return (
                <PlayerCard
                    key={player.id}
                    player={player}
                    onDelete={handleDeletePlayer}
                    onUpdateScore={handleUpdateScore}
                    rank={rank}
                />
                )})}
            </div>
        )}
      </main>
      <ActionButtons
        onAddPlayer={() => setIsModalOpen(true)}
        onSave={handleSaveGame}
        onLoad={handleLoadGame}
        onExport={handleExportData}
        onResetScores={handleResetScores}
      />
      <AddPlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPlayer={handleAddPlayer}
      />
    </div>
  );
};

export default App;
