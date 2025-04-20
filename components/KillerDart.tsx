'use client';
import { PlayersProvider } from '@/contexts/PlayersContext';
import { Header } from './Header';
import PlayersList from './Players/PlayersList';

import { VideoStream } from './FingersAI/VideoStream';
import { useState } from 'react';

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
  const [useCamera, setUseCamera] = useState(false);

  return (
    <PlayersProvider>
      <div className="flex flex-col items-center w-full mx-auto max-w-[400px]">
        {useCamera && <VideoStream />}
        <Header setUseCamera={setUseCamera} useCamera={useCamera} />
        <PlayersList />
      </div>
    </PlayersProvider>
  );
};
