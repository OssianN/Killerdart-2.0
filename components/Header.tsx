import { Button } from './ui/button';
import { Camera, Restart } from 'iconoir-react';
import { usePlayers } from '@/contexts/PlayersContext';
import { Switch } from './ui/switch';
import { motion as m, useAnimation } from 'framer-motion';
import { Label } from './ui/label';
import { useState } from 'react';

type HeaderProps = {
  setUseCamera: (value: boolean) => void;
  useCamera: boolean;
};

export const Header = ({ setUseCamera, useCamera }: HeaderProps) => {
  const controls = useAnimation();
  const { handleClearStats } = usePlayers();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNewRound = () => {
    handleRotate();
    handleClearStats();
  };

  const handleRotate = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      controls
        .start({
          rotate: 360,
          transition: {
            type: 'spring',
            stiffness: 200,
            damping: 20,
          },
        })
        .then(() => {
          controls.set({ rotate: 0 });
          setIsAnimating(false);
        });
    }
  };

  return (
    <div className="flex justify-between w-full py-4">
      {/* <div className="fixed top-4 left-[50%] -translate-x-[50%] flex items-center space-x-2">
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
          <Camera color="var(--app-blue)" />
        </Label>
      </div> */}

      <Button onClick={handleNewRound} variant="outline">
        New round
        <m.div animate={controls}>
          <Restart />
        </m.div>
      </Button>
    </div>
  );
};
