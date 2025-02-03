import { Minus, Plus } from 'iconoir-react';
import type { Player } from './KillerDart';
import { useAnimate } from 'framer-motion';
import { Button } from './ui/button';
import { usePlayers } from '@/contexts/PlayersContext';

type ScoreButtonProps = {
  player: Player;
  operator: 'plus' | 'minus';
};

const ScoreButton = ({ player, operator }: ScoreButtonProps) => {
  const { updatePlayer } = usePlayers();
  const [scope, animate] = useAnimate();

  const handleScoreChange = () => {
    updatePlayer(player.id, {
      score: operator === 'plus' ? player.score + 1 : player.score - 1,
    });

    animate(scope.current, {
      rotate: operator === 'plus' ? [1, 180] : [1, -180],
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 50,
      },
    });
  };

  return (
    <Button
      className="h-full w-full bg-white flex items-center justify-center [&_svg]:size-6"
      onClick={handleScoreChange}
    >
      <div ref={scope}>
        {operator === 'plus' ? (
          <Plus className="text-[#a1e3ff]" />
        ) : (
          <Minus className="text-[#a1e3ff]" />
        )}
      </div>
    </Button>
  );
};

export default ScoreButton;
