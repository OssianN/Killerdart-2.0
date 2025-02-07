'use client';
import { PlayersProvider } from '@/contexts/PlayersContext';
import { Header } from './Header';
import PlayersList from './Players/PlayersList';
import { NewPlayerForm } from './Players/Form';

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
    <PlayersProvider>
      <div className="flex flex-col items-center w-full mx-auto max-w-[400px]">
        <Header />
        <PlayersList />
        <NewPlayerForm />
      </div>
    </PlayersProvider>
  );
};
