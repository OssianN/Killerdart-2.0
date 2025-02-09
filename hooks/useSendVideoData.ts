import { useEffect } from 'react';

type UseSendVideoDataProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  isConnected: boolean;
  socket: WebSocket;
};

export const useSendVideoData = ({
  videoRef,
  stream,
  isConnected,
  socket,
}: UseSendVideoDataProps) => {
  useEffect(() => {
    if (!isConnected || !videoRef?.current || !stream) return;
    const intervalId = setInterval(() => {
      try {
        const canvas = document.createElement('canvas');
        const video = videoRef.current;

        canvas.width = video?.videoWidth ?? 0;
        canvas.height = video?.videoHeight ?? 0;

        const ctx = canvas.getContext('2d');
        if (!ctx || !video) return;

        ctx.drawImage(video, 0, 0);
        const base64Frame = canvas.toDataURL('image/jpeg');
        socket.send(base64Frame);
      } catch (error) {
        console.error('Error sending frame:', error);
      }
    }, 200);

    return () => clearInterval(intervalId);
  }, [isConnected, socket, stream, videoRef]);
};
