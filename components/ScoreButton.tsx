import type { MouseEvent } from 'react';
import type { Player, UpdatePlayerProps } from './KillerDart';

type ScoreButtonProps = {
  player: Player;
  operator: 'plus' | 'minus';
  updatePlayer: (id: number, updatedPlayer: UpdatePlayerProps) => void;
};

const ScoreButton = ({ player, operator, updatePlayer }: ScoreButtonProps) => {
  const changeScore = (newValue: number) => {
    if (newValue > 5) {
      return 5;
    }

    if (newValue < 0) {
      player.active = true;
      return 0;
    }

    return newValue;
  };

  const handleScoreChange = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // const target = e.target as HTMLButtonElement;

    const score =
      operator === 'plus'
        ? changeScore(player.score + 1)
        : changeScore(player.score - 1);

    updatePlayer(player.id, {
      score,
    });

    // target.classList.add(styles.animateScoreButton);
    setTimeout(() => {
      // target.classList.remove(styles.animateScoreButton);
    }, 300);
  };

  return (
    <button
      className="h-full w-full text-white text-4xl flex justify-center touch-manipulation"
      onClick={handleScoreChange}
    >
      <span className="h-[2px] w-4 bg-white inline-block absolute self-center"></span>
      {operator === 'plus' && (
        <span className="h-[2px] w-4 bg-white inline-block absolute self-center rotate-90"></span>
      )}
    </button>
  );
};

export default ScoreButton;
