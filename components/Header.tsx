import { Button } from './ui/button';
import { Camera, Restart } from 'iconoir-react';
import { usePlayers } from '@/contexts/PlayersContext';

type HeaderProps = {
  setUseCamera: (value: boolean) => void;
};

export const Header = ({ setUseCamera }: HeaderProps) => {
  const { handleClearStats } = usePlayers();

  return (
    <div className="flex justify-between w-full pb-4">
      <Button onClick={handleClearStats}>
        <Restart />
        New round
      </Button>

      <Button onClick={() => setUseCamera(true)} variant="outline">
        <Camera />
        Open camera
      </Button>
    </div>
  );
};
