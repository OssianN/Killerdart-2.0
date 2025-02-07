import { Button } from './ui/button';
import { Restart } from 'iconoir-react';
import { GameSettings } from './GameSettings';
import { usePlayers } from '@/contexts/PlayersContext';
import { useSearchParams } from 'next/navigation';

export const Header = () => {
  const { handleClearStats } = usePlayers();
  const params = useSearchParams();

  return (
    <div className="flex justify-between w-full pb-4">
      <Button onClick={handleClearStats}>
        <Restart />
        New round
      </Button>

      {params.get('camera') === 'true' && <GameSettings />}
    </div>
  );
};
