import { Button } from './ui/button';
import { Camera, LeaderboardStar } from 'iconoir-react';
import { usePlayers } from '@/contexts/PlayersContext';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

type HeaderProps = {
  setUseCamera: (value: boolean) => void;
  useCamera: boolean;
};

export const Header = ({ setUseCamera, useCamera }: HeaderProps) => {
  const [isMounted, setIsMounted] = useState(false);

  const { handleClearStats, players } = usePlayers();
  const searchParams = useSearchParams();
  const showCameraControl = searchParams.get('useCamera') === 'true';
  const { toast, dismiss } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleConfirmFinishRound = (id: string) => {
    dismiss(id);
    handleClearStats();
  };

  const handleFinishRound = () => {
    const { id } = toast({
      title: 'Start a new round?',
      description:
        'This will clear the player stats and give a win to the killer.',
      variant: 'default',
      action: (
        <Button size="sm" onClick={() => handleConfirmFinishRound(id)}>
          Let&apos;s go!
        </Button>
      ),
      secondaryAction: (
        <Button size="sm" variant="outline" onClick={() => dismiss(id)}>
          Cancel
        </Button>
      ),
    });
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex justify-between w-full pb-4">
      {showCameraControl && (
        <div className="fixed top-4 left-[50%] -translate-x-[50%] flex items-center space-x-2">
          <Switch
            className="relative"
            id="show-camera"
            checked={useCamera}
            onCheckedChange={setUseCamera}
          />
          <Label
            className={`absolute cursor-pointer transition-translate duration-150 ${
              useCamera ? 'translate-x-7' : '-translate-x-[1px]'
            }`}
            htmlFor="show-camera"
          >
            <Camera
              color={
                useCamera ? 'var(--app-blue)' : 'hsl(var(--muted-foreground))'
              }
            />
          </Label>
        </div>
      )}

      {players.length > 0 && (
        <Button
          className="w-full"
          onClick={handleFinishRound}
          variant="outline"
        >
          <span>Finish round</span>
          <LeaderboardStar
            strokeWidth={1}
            fontSize={18}
            className="-translate-y-1"
          />
        </Button>
      )}
    </div>
  );
};
