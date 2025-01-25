import { VideoStream } from '@/components/VideoStream';

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <VideoStream />
    </main>
  );
}
