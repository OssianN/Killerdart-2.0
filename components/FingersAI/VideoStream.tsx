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
import { Card } from '../ui/card';
import { Camera, Xmark } from 'iconoir-react';
import { motion } from 'framer-motion';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

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
  const [isConfirmingData, setIsConfirmingData] = useState(false);

  const [isShowCamera, setIsShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { socket, isConnected } = useSocket({
    onMessage: setData,
  });
  useDebouncedState({ data, setIsConfirmingData });
  useSendVideoData({ videoRef, stream, isConnected, socket });

  const animations = {
    variants: {
      initial: { scale: 0, height: '1rem', opacity: 0 },
      visible: { scale: 1, height: '100%', opacity: 1 },
    },
    transition: { type: 'spring', stiffness: 700, damping: 40 },
  };

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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

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
    <Card className={`mb-8 w-full relative p-4 ${!stream ? 'invisible' : ''}`}>
      <div className="flex justify-between gap-2">
        <div className="flex items-center space-x-2 m-auto">
          <Switch
            id="show-camera"
            checked={isShowCamera}
            onCheckedChange={setIsShowCamera}
          />
          <Label htmlFor="show-camera">
            <Camera />
          </Label>
        </div>

        <Button
          className="absolute top-2 right-2"
          variant="ghost"
          onClick={stopCamera}
          disabled={!stream}
        >
          <Xmark />
        </Button>
      </div>

      <motion.div
        animate={isShowCamera ? 'visible' : 'initial'}
        {...animations}
        className="w-full"
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`-scale-x-100 w-full h-full rounded-xl mt-4 ${
            !stream ? 'hidden' : ''
          }`}
        />
      </motion.div>

      <VideoFeedback data={data} isConfirmingData={isConfirmingData} />
    </Card>
  );
};
