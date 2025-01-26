import type { Dispatch, SetStateAction } from 'react';
import { PlayerItem } from './Player';
import { AnimatePresence } from 'framer-motion';
import type { Player, UpdatePlayerProps } from './KillerDart';

type PlayersListProps = {
  players: Player[];
  updatePlayer: (id: number, updatePlayer: UpdatePlayerProps) => void;
  setPlayers: Dispatch<SetStateAction<Player[]>>;
  setLocalStorage: (players: Player[]) => void;
};

const PlayersList = ({
  players,
  updatePlayer,
  setPlayers,
  setLocalStorage,
}: PlayersListProps) => {
  // Function to reorder items
  // const reorderItems = (fromIndex, toIndex) => {
  //   const newItems = [...players];
  //   const [movedItem] = newItems.splice(fromIndex, 1);
  //   newItems.splice(toIndex, 0, movedItem);
  //   setPlayers(newItems);
  // };

  // // For simplicity, let's just move an item to the top or bottom
  // const moveItem = (id, direction) => {
  //   const index = players.findIndex(item => item.id === id);
  //   let newIndex = index;
  //   if (direction === 'up' && index > 0) newIndex = index - 1;
  //   if (direction === 'down' && index < players.length - 1)
  //     newIndex = index + 1;
  //   reorderItems(index, newIndex);
  // };

  if (!players) {
    return null;
  }

  return (
    <AnimatePresence>
      <ul className="flex flex-col w-full gap-2">
        {players.map(player => (
          <PlayerItem
            key={player.id}
            player={player}
            updatePlayer={updatePlayer}
            setPlayers={setPlayers}
            setLocalStorage={setLocalStorage}
          />
        ))}
      </ul>
    </AnimatePresence>
  );
};

export default PlayersList;
