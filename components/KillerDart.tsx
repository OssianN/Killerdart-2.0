'use client';
import { GameSettings } from './GameSettings';
import PlayersList from '../components/PlayersList';
import { NewPlayerForm } from './Form';

export type Player = {
  id: number;
  name: string;
  score: number;
  number: number | null;
  wins: number;
  active?: boolean;
  isDead?: boolean;
};

export const KillerDart = () => {
  return (
    <div className="flex flex-col items-center w-full mx-auto max-w-[400px]">
      <GameSettings />
      <PlayersList />
      <NewPlayerForm />
    </div>
  );
};
