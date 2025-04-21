import { useRef } from 'react';
import { PlayerItem } from './Player';
import { AnimatePresence } from 'framer-motion';
import { usePlayers } from '@/contexts/PlayersContext';
import { NewPlayerForm } from './Form';

const PlayersList = () => {
  const listRef = useRef<HTMLUListElement>(null);
  const { players } = usePlayers();

  return (
    <AnimatePresence>
      <ul className="flex flex-col w-full gap-2" ref={listRef}>
        {players.map((player, i) => (
          <PlayerItem key={player.id} player={player} order={i} />
        ))}
      </ul>
      <NewPlayerForm key="player-form" />
    </AnimatePresence>
  );
};

export default PlayersList;
