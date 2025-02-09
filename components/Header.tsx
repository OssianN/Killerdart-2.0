import { Button } from './ui/button';
import { Camera, Restart } from 'iconoir-react';
import { usePlayers } from '@/contexts/PlayersContext';
import { useSearchParams } from 'next/navigation';

type HeaderProps = {
  setUseCamera: (value: boolean) => void;
};

export const Header = ({ setUseCamera }: HeaderProps) => {
  const { handleClearStats } = usePlayers();
  const params = useSearchParams();

  return (
    <div className="flex justify-between w-full pb-4">
      <Button onClick={handleClearStats}>
        <Restart />
        New round
      </Button>

      {params.get('camera') === 'true' && (
        <Button onClick={() => setUseCamera(true)}>
          <Camera />
          Open camera
        </Button>
      )}
    </div>
  );
};
