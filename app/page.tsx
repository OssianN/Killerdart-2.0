'use client';
import { KillerDart } from '@/components/KillerDart';
import { PlayerData } from '@/components/VideoStream';
import { useState } from 'react';

export default function Home() {
  const [confirmedData, setConfirmedData] = useState<PlayerData | null>(null);

  return (
    <main className="flex items-center justify-center min-h-screen p-4 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] overflow-x-hidden">
      {/* <VideoStream setConfirmedData={setConfirmedData} /> */}
      <KillerDart
        confirmedData={confirmedData}
        setConfirmedData={setConfirmedData}
      />
    </main>
  );
}
