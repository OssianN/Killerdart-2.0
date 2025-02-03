'use client';
import { KillerDart } from '@/components/KillerDart';
import { Button } from '@/components/ui/button';
import { VideoStream } from '@/components/VideoStream';
import { PlayersProvider } from '@/contexts/PlayersContext';
import { Camera } from 'iconoir-react';
import { useState } from 'react';

export default function Home() {
  const [useCamera, setUseCamera] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] overflow-x-hidden">
      <PlayersProvider>
        {!useCamera ? (
          <Button className="w-32" onClick={() => setUseCamera(true)}>
            <Camera />
            Start Camera
          </Button>
        ) : (
          <VideoStream setUseCamera={setUseCamera} />
        )}
        <KillerDart />
      </PlayersProvider>
    </main>
  );
}
