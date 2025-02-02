import { ChangeEvent, useLayoutEffect } from 'react';
import DartContainer from './DartContainer';
import ScoreButton from './ScoreButton';
import { motion, motionValue, useAnimate, usePresence } from 'framer-motion';
import { Input } from './ui/input';
import { ArcheryMatch, Crown } from 'iconoir-react';
import { Button } from './ui/button';
import type { Player } from './KillerDart';
import { usePlayers } from '@/hooks/usePlayers';

type PlayerProps = {
  player: Player;
};

export const PlayerItem = ({ player }: PlayerProps) => {
  const [scope, animate] = useAnimate();
  const [isPresent, safeToRemove] = usePresence();
  const { updatePlayer, handleRemovePlayer } = usePlayers();

  const transition = { type: 'spring', stiffness: 500, damping: 50, mass: 1 };
  const animations = {
    layout: true,
    initial: 'in',
    style: {
      position: isPresent ? motionValue('static') : motionValue('absolute'),
    },
    animate: isPresent ? 'in' : 'out',
    variants: {
      in: { scaleY: 1 },
      out: { scaleY: 0 },
    },
    onAnimationComplete: () => !isPresent && safeToRemove(),
    transition,
  };

  const handlePlayerNumber = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (!/^\d{0,2}$/gi.test(value)) {
      return;
    }

    updatePlayer(player.id, { number: Number(value) });
  };

  useLayoutEffect(() => {
    if (player.isDead || player.score === 5) {
      animate(
        scope.current,
        {
          scale: player.isDead ? [0.3, 1] : [2, 1],
        },
        { stiffness: 100, damping: 5, duration: 0.2 }
      );
    }
  }, [player.isDead, animate, scope, player.score]);

  return (
    <motion.li {...animations}>
      <motion.div
        ref={scope}
        className={`relative flex flex-col items-center w-full px-6 bg-[#a1e3ff] text-white mx-auto max-w-[400px] shadow-md rounded-md transition-all duration-300 ${
          player.isDead
            ? 'brightness-75'
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
              className="webkit-appearance-none bg-none w-16 text-lg md:text-lg text-right text-white rounded-none shadow-none p-0.5"
              type="numeric"
              placeholder="__"
              max={2}
              onChange={handlePlayerNumber}
              value={player.number ? String(player.number) : ''}
            />
            <ArcheryMatch className="text-sm" />
          </div>
        </header>

        <div className="flex items-center justify-center w-full h-16 gap-6 py-3">
          <ScoreButton player={player} operator={'minus'} />
          <DartContainer playerScore={player.score} />
          <ScoreButton player={player} operator={'plus'} />
        </div>

        <Button
          className="absolute border rounded-md p-2 m-1 bg-[#ff4242] text-white border-white border-solid font-semibold hidden"
          // style={{
          //   transform: showRemove ? 'translateX(250px)' : 'translateX(300px)',
          //   opacity: !showRemove ? '0' : '1',
          // }}
          onClick={() => handleRemovePlayer(player.id)}
        >
          Remove
        </Button>
      </motion.div>
    </motion.li>
  );
};
