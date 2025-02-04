'use client';
import PlayersList from '../components/PlayersList';
import { NewPlayerForm } from './Form';
import { PlayersProvider } from '@/contexts/PlayersContext';
import { Header } from './Header';

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
