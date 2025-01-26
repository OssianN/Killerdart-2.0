'use client';
import React, {
  useState,
  useEffect,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { GameSettings } from './GameSettings';
import PlayersList from '../components/PlayersList';
import type { PlayerData } from './VideoStream';

export type Player = {
  id: number;
  name: string;
  score: number;
  number: number | null;
  wins: number;
  active?: boolean;
  isDead?: boolean;
};

export type UpdatePlayerProps = {
  score?: number;
  number?: number | null;
  wins?: number;
  active?: boolean;
  isDead?: boolean;
};

type KillerDartProps = {
  confirmedData: PlayerData | null;
  setConfirmedData: Dispatch<SetStateAction<PlayerData | null>>;
};

export const KillerDart = ({
  confirmedData,
  setConfirmedData,
}: KillerDartProps) => {
  const [players, setPlayers] = useState<Player[]>([]);

  const updatePlayer = useCallback(
    (id: number, updatePlayer: UpdatePlayerProps) => {
      const newList: Player[] = players.map(player => {
        handlePlayerActive(player);
        return player.id === id
          ? {
              ...player,
              ...updatePlayer,
              isDead: updatePlayer.score === 0,
            }
          : player;
      });

      setPlayers(newList);
      setLocalStorage(newList);
    },
    [players]
  );

  const handleClearStats = () => {
    const winnerId = isWinner(players);
    const newList = resetPlayerStats(players, winnerId);

    setLocalStorage(newList);
    setPlayers(newList);
  };

  //   const handleRemoveAll = () => {
  //     setLocalStorage([]);
  //     setPlayers([]);
  //   };

  useEffect(() => {
    if (!confirmedData || !confirmedData.player || !confirmedData.points)
      return;

    players.map((player, i) => {
      if (i + 1 === confirmedData.player) {
        updatePlayer(player.id, { score: confirmedData.points + player.score });
        setConfirmedData(null);
      }
    });
  }, [confirmedData, players, setConfirmedData, updatePlayer]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storage = localStorage.getItem('players');
    const localList = storage ? JSON.parse(storage) : [];
    setPlayers(localList);
  }, []);

  return (
    <div className="flex flex-col items-center w-full mx-auto max-w-[400px]">
      <GameSettings
        handleClearStats={handleClearStats}
        setPlayers={setPlayers}
        setLocalStorage={setLocalStorage}
      />
      <PlayersList
        players={players}
        updatePlayer={updatePlayer}
        setPlayers={setPlayers}
        setLocalStorage={setLocalStorage}
      />
    </div>
  );
};

const setLocalStorage = (players: Player[]) => {
  localStorage.setItem('players', JSON.stringify(players));
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
