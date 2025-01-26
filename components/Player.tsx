import {
  useState,
  // useLayoutEffect,
  ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useSwipeable } from 'react-swipeable';
import DartContainer from './DartContainer';
import ScoreButton from './ScoreButton';
import { motion } from 'framer-motion';
import { Input } from './ui/input';
import type { Player, UpdatePlayerProps } from './KillerDart';

type PlayerProps = {
  player: Player;
  updatePlayer: (id: number, updatePlayer: UpdatePlayerProps) => void;
  setPlayers: Dispatch<SetStateAction<Player[]>>;
  setLocalStorage: (players: Player[]) => void;
};

export const PlayerItem = ({
  player,
  updatePlayer,
  setPlayers,
  setLocalStorage,
}: PlayerProps) => {
  const [showRemove, setShowRemove] = useState(false);
  // const [animateListItem, setAnimateListItem] = useState(false);

  // const setBackgroundOnScore = (player: Player) => {
  //   if (player.score === 5) {
  //     return '#FF4242';
  //   }

  //   if (player.isDead) {
  //     return '#47abd8';
  //   }
  // };

  const handlers = useSwipeable({
    onSwipedLeft: () => setShowRemove(true),
    onSwipedRight: () => setShowRemove(false),
    trackMouse: true,
  });

  const handleRemovePlayer = () => {
    setPlayers(prev => {
      const newList = prev.filter(p => p.id !== player.id);
      setLocalStorage(newList);
      return newList;
    });
  };

  const handlePlayerNumber = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (!/^[0-9]*$/gi.test(value)) {
      return;
    }

    updatePlayer(player.id, { number: Number(value) });
  };

  // useLayoutEffect(() => {
  //   if (player.isDead || player.score === 5) {
  //     setAnimateListItem(true);

  //     setTimeout(() => {
  //       setAnimateListItem(false);
  //     }, 600);
  //   }
  // }, [player.isDead, player.score]);

  return (
    <motion.li
      key={player.id}
      // style={{
      //   background: setBackgroundOnScore(player),
      //   transform: showRemove ? 'translateX(-250px)' : 'translateX(0)',
      // }}
      className="relative flex flex-col items-center w-full bg-[#a1e3ff] text-white l mx-auto max-w-[400px] shadow-md rounded-md transition-all duration-300"
      {...handlers}
      animate={{ opacity: 1, x: 0 }}
      layout
      transition={{ stiffness: 500, damping: 30 }}
    >
      <header
        className="flex justify-between items-center w-full p-4"
        style={{
          opacity: player.isDead ? 0.3 : 1,
        }}
      >
        <h3 className="text-xl font-medium">{player.name}</h3>
        <Input
          className="webkit-appearance-none bg-none w-16 text-xl font-medium text-center text-white border-2 border-solid border-white p-0.5 rounded-md"
          type="numeric"
          pattern="[0-9]*"
          placeholder="--"
          onChange={handlePlayerNumber}
          value={player.number ? String(player.number) : ''}
        />
      </header>
      <div
        className="flex items-center justify-center w-full h-20 gap-4 p-1"
        style={{
          opacity: player.isDead ? 0.3 : 1,
        }}
      >
        <ScoreButton
          player={player}
          operator={'minus'}
          updatePlayer={updatePlayer}
        />

        <DartContainer playerScore={player.score} />

        <ScoreButton
          player={player}
          operator={'plus'}
          updatePlayer={updatePlayer}
        />
      </div>
      <p>Wins: {player.wins}</p>

      <button
        className="absolute border-2 rounded-md p-2 m-1 bg-[#ff4242] text-white font-semibold"
        style={{
          transform: showRemove ? 'translateX(250px)' : 'translateX(300px)',
          opacity: !showRemove ? '0' : '1',
        }}
        onClick={handleRemovePlayer}
      >
        Remove
      </button>
    </motion.li>
  );
};
