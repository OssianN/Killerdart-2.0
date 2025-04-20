import { useRef } from 'react';
import { PlayerItem } from './Player';
import { AnimatePresence } from 'framer-motion';
import { usePlayers } from '@/contexts/PlayersContext';
import { NewPlayerForm } from './Form';

const PlayersList = () => {
  const listRef = useRef<HTMLUListElement>(null);
  const { players } = usePlayers();

  if (!players.length) return null;

  return (
    <ul className="flex flex-col w-full gap-2" ref={listRef}>
      <AnimatePresence>
        {players.map((player, i) => (
          <PlayerItem key={player.id} player={player} order={i} />
        ))}
        <NewPlayerForm />
      </AnimatePresence>
    </ul>
  );
};

export default PlayersList;
