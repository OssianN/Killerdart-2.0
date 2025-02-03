import { usePlayers } from '@/contexts/PlayersContext';
import { Button } from './ui/button';
import { Restart } from 'iconoir-react';

export const GameSettings = () => {
  const { handleClearStats } = usePlayers();
  return (
    <section className="flex w-full mb-4 gap-2">
      <Button variant="outline" onClick={handleClearStats}>
        <Restart />
        New round
      </Button>
    </section>
  );
};
