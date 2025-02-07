import { ChangeEvent, useState } from 'react';
import { DartContainer } from './DartContainer';
import { ScoreButton } from './ScoreButton';
import { motion, usePresence } from 'framer-motion';
import { Crown, SelectiveTool } from 'iconoir-react';
import { usePlayers } from '@/contexts/PlayersContext';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSwipeable } from 'react-swipeable';
import type { Player } from '../KillerDart';

type PlayerProps = {
  player: Player;
};

export const PlayerItem = ({ player }: PlayerProps) => {
  const [showDelete, setShowDelete] = useState(false);
  const [isPresent, safeToRemove] = usePresence();
  const { updatePlayer, handleRemovePlayer } = usePlayers();
  const handlers = useSwipeable({
    onSwipedLeft: () => setShowDelete(true),
    onSwipedRight: () => setShowDelete(false),
    trackMouse: true,
  });

  const animations = {
    layout: true,
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
    transition: { type: 'spring', stiffness: 700, damping: 40 },
    onAnimationComplete: () => !isPresent && safeToRemove(),
  };

  const handlePlayerNumber = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (!/^\d{0,2}$/gi.test(value)) {
      return;
    }

    updatePlayer(player.id, { number: Number(value) });
  };

  return (
    <motion.li {...animations} {...handlers} className="relative flex">
      <motion.div
        className="flex-shrink-0 w-full"
        animate={showDelete ? 'showDelete' : 'initial'}
        variants={{
          initial: { x: 0 },
          showDelete: { x: '-8rem' },
        }}
      >
        <motion.div
          animate={
            player.isDead
              ? 'isDead'
              : player.score === 5
              ? 'isKiller'
              : 'initial'
          }
          transition={{
            stiffness: 100,
            damping: 5,
            duration: 0.2,
          }}
          variants={{
            initial: { scale: 1 },
            isDead: { scale: [0.3, 1] },
            isKiller: { scale: [2, 1] },
          }}
          className={`relative flex flex-col items-center
          w-full px-6 mx-auto max-w-[400px] bg-app-blue text-white border-white border border-solid
          shadow-md rounded-md transition-all duration-300 backdrop-filter-blur ${
            showDelete ? 'pointer-events-none' : ''
          }
          ${
            player.isDead
              ? 'brightness-75'
              : player.score === 5
              ? 'bg-app-red'
              : ''
          }`}
        >
          <header
            className="flex justify-between items-center w-full py-3 border-b border-[#ffffff99] border-solid"
            style={{
              opacity: player.isDead ? 0.3 : 1,
            }}
          >
            <h3 className="text-xl flex-1 font-medium">{player.name}</h3>
            <p className="flex flex-g items-center justify-center h-full gap-2">
              <Crown fontSize={16} />
              <span className="text-lg">{player.wins}</span>
            </p>
            <div className="relative flex flex-1 items-center justify-end gap-2">
              <Input
                className="webkit-appearance-none bg-none w-16 text-lg md:text-lg text-right text-white rounded-none shadow-none p-0.5"
                type="numeric"
                placeholder="__"
                max={2}
                onChange={handlePlayerNumber}
                value={player.number ? String(player.number) : ''}
              />
              <SelectiveTool fontSize={14} />
            </div>
          </header>

          <div className="flex items-center justify-center w-full h-16 gap-6 py-3">
            <ScoreButton player={player} operator={'minus'} />
            <DartContainer playerScore={player.score} />
            <ScoreButton player={player} operator={'plus'} />
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute h-full w-32 top-0 right-0 -translate-y-1/2 invisible"
        animate={showDelete ? 'showDelete' : 'initial'}
        variants={{
          initial: { scaleX: 0, originX: 1, visibility: 'hidden' },
          showDelete: { scaleX: 1, originX: 1, visibility: 'visible' },
        }}
        transition={{
          stiffness: 100,
          damping: 5,
          duration: 0.1,
        }}
      >
        <Button
          className="bg-app-red text-white h-full w-full shadow-md"
          onClick={() => handleRemovePlayer(player.id)}
        >
          Remove
        </Button>
      </motion.div>
    </motion.li>
  );
};
