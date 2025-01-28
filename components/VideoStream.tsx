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
        <p>Player: {data?.player}</p>
        <p>Points: {data?.points}</p>
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
