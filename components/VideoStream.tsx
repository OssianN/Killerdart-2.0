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
import { AnimatePresence, motion } from 'framer-motion';

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

      <AnimatePresence>
        <div className="flex gap-6">
          <p className="flex gap-2 items-center">
            <motion.img
              layout
              // initial={{ scale: 1 }}
              // animate={{ scale: [1, 0.8, 1] }}
              // transition={{ duration: 1 }}
              src={`/${
                data?.player
                  ? dataToFingersMap[data.player]
                  : 'zero-fingers.png'
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
                data?.points
                  ? dataToFingersMap[data.points]
                  : 'zero-fingers.png'
              }`}
              alt="one finger"
              width={40}
              height={40}
            />
          </p>
        </div>
      </AnimatePresence>

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

const dataToFingersMap: Record<number, string> = {
  1: 'one-finger.png',
  2: 'two-fingers.png',
  3: 'three-fingers.png',
  4: 'four-fingers.png',
  5: 'five-fingers.png',
};
