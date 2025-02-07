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
import { Button } from '../ui/button';
import { VideoFeedback } from './VideoFeedback';

export type PlayerData = {
  player: number;
  points: number;
};

type VideoStreamProps = {
  setUseCamera: Dispatch<SetStateAction<boolean>>;
};

export const VideoStream = ({ setUseCamera }: VideoStreamProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [data, setData] = useState<PlayerData | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { socket, isConnected } = useSocket({ onMessage: setData });
  useDebouncedState({ data, delay: 1000 });
  useSendVideoData({ videoRef, stream, isConnected, socket });

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  useEffect(() => {
    startCamera();
  }, []);

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
    setUseCamera(false);
  };

  return (
    <div className="w-full flex flex-col gap-8 items-center justify-center">
      {stream && (
        <Button className="button" onClick={stopCamera} disabled={!stream}>
          Stop Camera
        </Button>
      )}

      <VideoFeedback data={data} />

      <video
        ref={videoRef}
        autoPlay
        className={`-scale-x-100 w-full h-full rounded-xl ${
          !stream ? 'hidden' : ''
        }`}
      />
    </div>
  );
};
