
import { type Player } from '../types';

const convertToCSV = (players: Player[]): string => {
  const headers = ['Name', 'Score'];
  const rows = players.map(player => [player.name, player.score]);

  let csvContent = headers.join(',') + '\r\n';
  rows.forEach(row => {
    csvContent += row.join(',') + '\r\n';
  });

  return csvContent;
};

export const exportToCsv = (players: Player[], filename: string): void => {
  if (players.length === 0) {
    console.warn('No players to export.');
    return;
  }

  const csvString = convertToCSV(players);
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
