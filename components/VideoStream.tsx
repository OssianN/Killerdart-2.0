'use client';
import { useDebouncedState } from '@/hooks/useDebouncedState';
import { useSendVideoData } from '@/hooks/useSendVideoData';
import { useSocket } from '@/hooks/useSocket';
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button } from './ui/button';
import Image from 'next/image';

export type PlayerData = {
  player: number;
  points: number;
};

type VideoStreamProps = {
  setConfirmedData: Dispatch<SetStateAction<PlayerData | null>>;
};

export const VideoStream = ({ setConfirmedData }: VideoStreamProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [data, setData] = useState<PlayerData | null>(null);
  const { socket, isConnected } = useSocket({ onMessage: setData });
  const [stream, setStream] = useState<MediaStream | null>(null);
  useDebouncedState<PlayerData | null>({ data, setConfirmedData, delay: 1000 });
  useSendVideoData({ videoRef, stream, isConnected, socket });

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      if (!videoRef.current) return;
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      setStream(stream);
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error starting camera:', error);
    }
  };

  const stopCamera = () => {
    if (!stream) return;
    stream.getTracks().forEach(track => track.stop());
    setStream(null);
  };

  return (
    <div className="w-full flex flex-col gap-8 items-center justify-center">
      {stream ? (
        <Button className="button" onClick={stopCamera} disabled={!stream}>
          Stop Camera
        </Button>
      ) : (
        <Button className="w-32" onClick={startCamera}>
          Start Camera
        </Button>
      )}

      <div className="flex gap-6">
        <p className="flex gap-2 items-center">
          <Image
            src={`/${
              data?.player ? dataToFingersMap[data.player] : 'zero-fingers.png'
            }`}
            alt="one finger"
            width={40}
            height={40}
          />
          Player: {data?.player}
        </p>
        <p className="flex gap-2 items-center">
          Points: {data?.points}
          <Image
            src={`/${
              data?.points ? dataToFingersMap[data.points] : 'zero-fingers.png'
            }`}
            alt="one finger"
            width={40}
            height={40}
          />
        </p>
      </div>

      <video
        ref={videoRef}
        autoPlay
        className={`-scale-x-100 w-full h-full rounded-xl hidden ${
          !stream ? 'hidden' : ''
        }`}
      />
    </div>
  );
};

const dataToFingersMap: Record<number, string> = {
  1: 'one-finger.png',
  2: 'two-fingers.png',
  3: 'three-fingers.png',
  4: 'four-fingers.png',
  5: 'five-fingers.png',
};
