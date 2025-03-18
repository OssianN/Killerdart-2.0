'use client';
import { useDebouncedState } from '@/hooks/useDebouncedState';
import { useSendVideoData } from '@/hooks/useSendVideoData';
import { useSocket } from '@/hooks/useSocket';
import { useEffect, useRef, useState } from 'react';
import { VideoFeedback } from './VideoFeedback';
import { Card } from '../ui/card';
import { motion } from 'framer-motion';
import { Switch } from '@radix-ui/react-switch';
import { ModernTv, NavArrowDown } from 'iconoir-react';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';

export type PlayerData = {
  player: number;
  points: number;
};

export const VideoStream = () => {
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

  return (
    <Card
      className={`flex flex-col mb-8 w-full relative p-4 ${
        !stream ? 'invisible' : ''
      }`}
    >
      <Switch
        checked={isShowCamera}
        onCheckedChange={setIsShowCamera}
        className="flex items-center gap-2 m-auto"
      >
        <NavArrowDown
          className={`h-4 w-4 duration-200 ${isShowCamera ? 'rotate-180' : ''}`}
        />
        <Label className="cursor-pointer">
          <ModernTv />
        </Label>
      </Switch>

      <motion.div
        animate={isShowCamera ? 'visible' : 'initial'}
        {...animations}
        className="w-full rounded-xl mt-4 overflow-hidden"
      >
        <video
          ref={videoRef}
          width={640}
          height={480}
          autoPlay
          playsInline
          className={`-scale-x-100 w-full h-full ${!stream ? 'hidden' : ''}`}
        />
      </motion.div>

      {isShowCamera && <Separator className="my-2" />}

      <VideoFeedback data={data} isConfirmingData={isConfirmingData} />
    </Card>
  );
};
