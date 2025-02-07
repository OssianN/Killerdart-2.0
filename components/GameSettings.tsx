import { useState } from 'react';
import { Button } from './ui/button';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from './ui/drawer';
import { Camera, Settings, Xmark } from 'iconoir-react';
import { VideoStream } from './FingersAI/VideoStream';

export const GameSettings = () => {
  const [useCamera, setUseCamera] = useState(false);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <Settings />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="flex flex-col mx-auto w-full max-w-sm h-[50dvh] min-h-fit overflow-y-auto pb-10">
          <DrawerHeader className="mb-4 border-b border-solid border-neutral-200">
            <DrawerTitle>Fingers AI</DrawerTitle>
            <DrawerDescription>
              Activate your camera in order to be able to hold up fingers to
              give points. Left hand = player. Right hand = points.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex justify-center items-center h-full">
            {!useCamera ? (
              <Button className="w-32" onClick={() => setUseCamera(true)}>
                <Camera />
                Start Camera
              </Button>
            ) : (
              <VideoStream setUseCamera={setUseCamera} />
            )}
          </div>
          <DrawerFooter>
            <DrawerClose
              asChild
              className="absolute top-2 right-2 [&_svg]:size-8"
            >
              <Button variant="ghost">
                <Xmark className="text-3xl" />
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
