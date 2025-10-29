
import { type Player } from '../types';

const STORAGE_KEY = 'gameScoreTrackerData';

export const savePlayers = (players: Player[]): void => {
  try {
    const data = JSON.stringify(players);
    localStorage.setItem(STORAGE_KEY, data);
  } catch (error) {
    console.error('Failed to save players to local storage:', error);
  }
};

export const loadPlayers = (): Player[] | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as Player[];
    }
    return null;
  } catch (error) {
    console.error('Failed to load players from local storage:', error);
    return null;
  }
};
