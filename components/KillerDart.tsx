'use client';
import React, { useEffect, type Dispatch, type SetStateAction } from 'react';
import { GameSettings } from './GameSettings';
import PlayersList from '../components/PlayersList';
import type { PlayerData } from './VideoStream';
import { NewPlayerForm } from './Form';
import { usePlayers } from '@/hooks/usePlayers';

export type Player = {
  id: number;
  name: string;
  score: number;
  number: number | null;
  wins: number;
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
  const { players, updatePlayer } = usePlayers();

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

  return (
    <div className="flex flex-col items-center w-full mx-auto max-w-[400px]">
      <GameSettings />
      <PlayersList />
      <NewPlayerForm />
    </div>
  );
};
