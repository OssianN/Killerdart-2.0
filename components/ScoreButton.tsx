import { Minus, Plus } from 'iconoir-react';
import type { Player } from './KillerDart';
import { useAnimate } from 'framer-motion';
import { Button } from './ui/button';
import { usePlayers } from '@/hooks/usePlayers';

type ScoreButtonProps = {
  player: Player;
  operator: 'plus' | 'minus';
};

const ScoreButton = ({ player, operator }: ScoreButtonProps) => {
  const { updatePlayer } = usePlayers();
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
      variant="outline"
      className="h-full w-full bg-white flex items-center justify-center [&_svg]:size-6"
      onClick={handleScoreChange}
    >
      <div ref={scope}>{operator === 'plus' ? <Plus /> : <Minus />}</div>
    </Button>
  );
};

export default ScoreButton;
