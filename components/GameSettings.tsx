import { usePlayers } from '@/hooks/usePlayers';
import { Button } from './ui/button';

export const GameSettings = () => {
  const { handleClearStats } = usePlayers();
  return (
    <section className="flex w-full mb-4 gap-2">
      <Button className="" variant={'outline'} onClick={handleClearStats}>
        New round
      </Button>
    </section>
  );
};
