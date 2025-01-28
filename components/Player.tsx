import {
  ChangeEvent,
  useLayoutEffect,
  type Dispatch,
  type SetStateAction,
} from 'react';
import DartContainer from './DartContainer';
import ScoreButton from './ScoreButton';
import { motion, useAnimate } from 'framer-motion';
import { Input } from './ui/input';
import { ArcheryMatch, Crown } from 'iconoir-react';
import { Button } from './ui/button';
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
  const [scope, animate] = useAnimate();

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

  useLayoutEffect(() => {
    if (player.isDead || player.score === 5) {
      animate(
        scope.current,
        {
          scale: player.isDead ? [0.5, 1] : [2, 1],
          transition: {
            duration: 0.5,
          },
        },
        { stiffness: 100, damping: 5, type: 'spring' }
      );
    }
  }, [animate, player.isDead, player.score, scope]);

  return (
    <motion.li
      ref={scope}
      className={`relative flex flex-col items-center w-full px-6 bg-[#a1e3ff] text-white mx-auto max-w-[400px] shadow-md rounded-md transition-all duration-300 ${
        player.isDead
          ? 'bg-[#47abd8]'
          : player.score === 5
          ? 'bg-[#ff4242]'
          : ''
      }`}
    >
      <header
        className="flex justify-between items-center w-full py-3 border-b border-[#ffffff99] border-solid"
        style={{
          opacity: player.isDead ? 0.3 : 1,
        }}
      >
        <h3 className="text-lg flex-1 font-medium">{player.name}</h3>
        <p className="flex flex-g items-center justify-center h-full gap-2">
          <Crown />
          <span className="text-lg font-medium">{player.wins}</span>
        </p>
        <div className="relative flex flex-1 items-center justify-end gap-2">
          <Input
            className="webkit-appearance-none bg-none w-16 text-lg md:text-lg text-right text-white rounded-none shadow-none p-0.5 placeholder:text-neutral-100"
            type="numeric"
            placeholder="#"
            pattern="[0-9]*"
            onChange={handlePlayerNumber}
            value={player.number ? String(player.number) : ''}
          />
          <ArcheryMatch className="text-sm" />
        </div>
      </header>

      <div className="flex items-center justify-center w-full h-16 gap-4 py-3">
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

      <Button
        className="absolute border-2 rounded-md p-2 m-1 bg-[#ff4242] text-white font-semibold hidden"
        // style={{
        //   transform: showRemove ? 'translateX(250px)' : 'translateX(300px)',
        //   opacity: !showRemove ? '0' : '1',
        // }}
        onClick={handleRemovePlayer}
      >
        Remove
      </Button>
    </motion.li>
  );
};
