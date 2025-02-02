import { useRef } from 'react';
import { PlayerItem } from './Player';
import { AnimatePresence } from 'framer-motion';
import { usePlayers } from '@/hooks/usePlayers';

const PlayersList = () => {
  const listRef = useRef<HTMLUListElement>(null);
  const { players } = usePlayers();
  console.log(players, 'list');

  if (!players.length) return null;

  return (
    <ul className="flex flex-col w-full gap-2" ref={listRef}>
      <AnimatePresence>
        {players.length > 0 &&
          players.map(player => <PlayerItem key={player.id} player={player} />)}
      </AnimatePresence>
    </ul>
  );
};

export default PlayersList;
