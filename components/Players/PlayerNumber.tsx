import { usePlayers } from '@/contexts/PlayersContext';
import { Player } from '../KillerDart';

type PlayerNumberProps = {
  player: Player;
};

export const PlayerNumber = ({ player }: PlayerNumberProps) => {
  const { setIsUpdatingPlayerNumber } = usePlayers();
  return (
    <div
      onClick={() => setIsUpdatingPlayerNumber(true)}
      className={`relative rounded-full
        w-8 h-8 mx-6 flex-shrink-0 flex items-center justify-center
        ${player.score === 5 ? 'text-app-red' : 'text-app-blue'}
        ${
          player.number
            ? 'bg-white shadow-md'
            : 'bg-transparent border border-white border-dashed'
        } ${playerNumberIcon(player.score)}`}
    >
      {player.number}
    </div>
  );
};

const playerNumberIcon = (score: number) => `before:content-[''] 
before:absolute before:top-1/2 before:left-1/2
before:-translate-x-1/2 before:-translate-y-1/2
before:w-[90%] before:aspect-square before:rounded-full
before:border ${
  score === 5 ? 'before:border-app-red' : 'before:border-app-blue'
}`;
