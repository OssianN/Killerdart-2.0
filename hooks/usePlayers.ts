import type { Player } from '@/components/KillerDart';
import { useEffect, useState } from 'react';

export type UpdatedPlayerProps = {
  score?: number;
  number?: number | null;
  wins?: number;
  active?: boolean;
  isDead?: boolean;
};
// fix  <0 & >5
export const usePlayers = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  const addNewPlayer = (name: string) => {
    const newPlayer = { id: Date.now(), name, score: 0, number: null, wins: 0 };
    setPlayers(prev => {
      setLocalStorage([...prev, newPlayer]);
      return [...prev, newPlayer];
    });
  };

  const updatePlayer = (id: number, updatedPlayer: UpdatedPlayerProps) => {
    const newList: Player[] = players
      .map(player => {
        handlePlayerActive(player);
        return player.id === id
          ? {
              ...player,
              ...updatedPlayer,
              isDead: updatedPlayer.score === 0,
            }
          : player;
      })
      .sort((a, b) => (b.number ?? 0) - (a.number ?? 0));

    setPlayers([...newList]);
    setLocalStorage(newList);
  };

  const handleRemovePlayer = (playerId: number) => {
    setPlayers(prev => {
      const newList = prev.filter(p => p.id !== playerId);
      setLocalStorage(newList);
      return newList;
    });
  };

  const handleClearStats = () => {
    const winnerId = isWinner(players);
    const newList = resetPlayerStats(players, winnerId);

    setLocalStorage(newList);
    setPlayers(newList);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storage = localStorage.getItem('players');
    const localList = storage ? JSON.parse(storage) : [];
    setPlayers(localList);
  }, []);

  return {
    players,
    addNewPlayer,
    updatePlayer,
    handleClearStats,
    handleRemovePlayer,
  };
};

const resetPlayerStats = (players: Player[], winnerId?: number) =>
  players.map(player => ({
    ...player,
    score: 0,
    number: null,
    active: false,
    isDead: false,
    wins: player.id === winnerId ? player.wins + 1 : player.wins,
  }));

const isWinner = (players: Player[]) => {
  const winners = players.filter(player => player.score === 5);
  return winners.length === 1 ? winners[0].id : undefined;
};

const handlePlayerActive = (player: Player) => {
  if (player.score > 0) {
    player.active = true;
  }
};

const setLocalStorage = (players: Player[]) => {
  localStorage.setItem('players', JSON.stringify(players));
};
