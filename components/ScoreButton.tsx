import type { Player, UpdatePlayerProps } from './KillerDart';
import { motion, useAnimate } from 'framer-motion';

type ScoreButtonProps = {
  player: Player;
  operator: 'plus' | 'minus';
  updatePlayer: (id: number, updatedPlayer: UpdatePlayerProps) => void;
};

const ScoreButton = ({ player, operator, updatePlayer }: ScoreButtonProps) => {
  const [scope, animate] = useAnimate();
  const changeScore = (newValue: number) =>
    newValue > 5 ? 5 : newValue < 0 ? 0 : newValue;

  const handleScoreChange = () => {
    const score =
      operator === 'plus'
        ? changeScore(player.score + 1)
        : changeScore(player.score - 1);

    updatePlayer(player.id, {
      score,
    });

    animate(scope.current, {
      scale: [1, 0.5, 1],
      rotate: operator === 'minus' ? [1, -90, 1] : [1, 90, 1],
      transition: {
        duration: 200,
      },
    });
  };

  return (
    <motion.button
      ref={scope}
      className="h-full w-full text-white text-4xl flex justify-center touch-manipulation"
      onClick={handleScoreChange}
    >
      <span className="h-[2px] w-4 bg-white inline-block absolute self-center"></span>
      {operator === 'plus' && (
        <span className="h-[2px] w-4 bg-white inline-block absolute self-center rotate-90"></span>
      )}
    </motion.button>
  );
};

export default ScoreButton;
