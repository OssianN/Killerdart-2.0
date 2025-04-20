import { useCallback, useState } from 'react';
import { DartContainer } from './DartContainer';
import { ScoreButton } from './ScoreButton';
import {
  motion,
  useMotionValue,
  usePresence,
  useTransform,
  animate,
} from 'framer-motion';
import { Trophy } from 'iconoir-react';
import { usePlayers } from '@/contexts/PlayersContext';
import { Button } from '../ui/button';
import { useSwipeable } from 'react-swipeable';
import { Separator } from '../ui/separator';
import { PlayerNumberForm } from './PlayerNumberForm';
import type { Player } from '../KillerDart';

type PlayerProps = {
  player: Player;
  order: number;
};

export const PlayerItem = ({ player }: PlayerProps) => {
  const [isPresent, safeToRemove] = usePresence();
  const { handleRemovePlayer } = usePlayers();
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);

  const x = useMotionValue(0);
  const deleteButtonWidth = 128;

  const contentX = useTransform(
    x,
    [-deleteButtonWidth, 0],
    [-deleteButtonWidth, 0]
  );

  const deleteButtonX = useTransform(
    x,
    [-deleteButtonWidth, 0],
    [0, deleteButtonWidth]
  );

  const animateX = useCallback(
    (to: number) => {
      animate(x, to, {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      });
    },
    [x]
  );

  const handlers = useSwipeable({
    onSwiping: ({ deltaX }) => {
      const newX = Math.min(0, deltaX);
      const constrainedX = Math.max(-deleteButtonWidth, newX);
      x.set(constrainedX);
    },
    onSwipedLeft: () => {
      if (x.get() < -deleteButtonWidth / 2) {
        animateX(-deleteButtonWidth);
        setIsDeleteVisible(true);
      } else {
        animateX(0);
        setIsDeleteVisible(false);
      }
    },
    onSwipedRight: () => {
      animateX(0);
      setIsDeleteVisible(false);
    },
    trackMouse: true,
  });

  const handleCardClick = () => {
    if (isDeleteVisible) {
      animateX(0);
      setIsDeleteVisible(false);
    }
  };

  const statusTransition = {
    transition: {
      type: 'normal',
      duration: 0.2,
    },
  };

  const animations = {
    layout: true,
    animate: player.isDead
      ? 'isDead'
      : player.score === 5
      ? 'isKiller'
      : 'visible',
    exit: { scale: 0.5, opacity: 0 },
    initial: { scale: 0, opacity: 0 },
    variants: {
      visible: { scale: 1, opacity: 1, transition: { delay: 0.2 } },
      isDead: {
        scale: [1, 0.95, 1],
        opacity: 1,
        ...statusTransition,
      },
      isKiller: {
        scale: [1, 1.05, 1],
        opacity: 1,
        ...statusTransition,
      },
      transition: { type: 'spring', stiffness: 700, damping: 40 },
    },
    onAnimationComplete: () => !isPresent && safeToRemove(),
  };

  const playerNumberIcon = `before:content-[''] 
  before:absolute before:top-1/2 before:left-1/2
  before:-translate-x-1/2 before:-translate-y-1/2
  before:w-[90%] before:aspect-square before:rounded-full
  before:border ${
    player.score === 5 ? 'before:border-app-red' : 'before:border-app-blue'
  }`;

  return (
    <motion.li
      {...animations}
      className="relative overflow-hidden w- shadow-md rounded-md border-white border border-solid"
    >
      <div className="flex" {...handlers}>
        <motion.div
          className="flex-shrink-0 w-full"
          style={{ x: contentX }}
          onMouseDown={handleCardClick}
        >
          <motion.div
            className={`relative flex flex-col items-center
            w-full px-3 mx-auto max-w-[400px] bg-app-blue text-white
            transition-all duration-300 backdrop-filter-blur ${
              player.isDead
                ? 'brightness-75'
                : player.score === 5
                ? 'bg-app-red'
                : ''
            } ${isDeleteVisible ? 'pointer-events-none' : ''}`}
            onUpdate={() => {
              setIsDeleteVisible(x.get() < -deleteButtonWidth / 2);
            }}
          >
            <header
              className="flex justify-between items-center w-full h-16 py-3 gap-4"
              style={{
                opacity: player.isDead ? 0.3 : 1,
              }}
            >
              <div className="relative flex flex-1 items-center justify-end gap-2">
                <div
                  className={`relative bg-white rounded-full
                    w-8 h-8 flex-shrink-0 flex items-center justify-center shadow-md
                    ${player.score === 5 ? 'text-app-red' : 'text-app-blue'}
                    ${player.number ? '' : 'opacity-75'} ${playerNumberIcon}`}
                >
                  {player.number ?? '?'}
                </div>
                <h3 className="flex gap-1 items-center w-full text-xl flex-2 font-medium">
                  {player.name}
                </h3>
              </div>

              <div className="flex flex-g items-center justify-center w-20 border-l border-white/75 border-solid h-full gap-1">
                <Trophy fontSize={12} strokeWidth={1} />
                <span className="text-lg font-light">{player.wins}</span>
              </div>
            </header>

            {!player.number ? (
              <PlayerNumberForm player={player} />
            ) : (
              <>
                <Separator className="opacity-75" />
                <div className="flex items-center justify-between w-full h-16 gap-6 py-3">
                  <ScoreButton player={player} operator={'minus'} />
                  <DartContainer playerScore={player.score} />
                  <ScoreButton player={player} operator={'plus'} />
                </div>
              </>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute inset-y-0 right-0 flex items-center border-l border-white border-solid"
          style={{
            x: deleteButtonX,
            width: deleteButtonWidth,
          }}
        >
          <Button
            className="bg-app-red text-white h-full w-full shadow-md rounded-none rounded-r-md"
            onClick={() => handleRemovePlayer(player.id)}
          >
            Remove
          </Button>
        </motion.div>
      </div>
    </motion.li>
  );
};
