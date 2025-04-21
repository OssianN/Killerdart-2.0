import { Minus, Plus } from 'iconoir-react';
import { motion } from 'framer-motion';
import { usePlayers } from '@/contexts/PlayersContext';
import { Button } from '../ui/button';
import type { Player } from '../KillerDart';

type ScoreButtonProps = {
  player: Player;
  operator: 'plus' | 'minus';
};

export const ScoreButton = ({ player, operator }: ScoreButtonProps) => {
  const { updatePlayer } = usePlayers();

  const handleScoreChange = () => {
    updatePlayer(player.id, {
      score: operator === 'plus' ? player.score + 1 : player.score - 1,
    });
  };

  return (
    <Button
      className="h-full w-20 bg-white [&_svg]:size-6 p-0"
      onClick={handleScoreChange}
    >
      <motion.div
        className={`w-full h-full flex items-center justify-center
          ${player.score === 5 ? 'text-app-red' : 'text-app-blue'}`}
        variants={{
          initial: { rotate: 0 },
          isTap: { rotate: operator === 'plus' ? 270 : -270 },
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 50,
        }}
        whileTap="isTap"
      >
        {operator === 'plus' ? (
          <Plus strokeWidth={2} />
        ) : (
          <Minus strokeWidth={2} />
        )}
      </motion.div>
    </Button>
  );
};
