import { useCallback, useEffect, useRef } from 'react';

type UseSendVideoDataProps = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  isConnected: boolean;
  socket: WebSocket | null;
};

export const useSendVideoData = ({
  videoRef,
  stream,
  isConnected,
  socket,
}: UseSendVideoDataProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const lastFrameTime = useRef(0);
  const frameInterval = 200;

  const sendFrame = useCallback(() => {
    if (!socket) return;

    const video = videoRef.current;
    let canvas = canvasRef.current;

    if (!canvas) {
      canvas = document.createElement('canvas');
      canvasRef.current = canvas;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      blob => {
        if (blob && socket.readyState === WebSocket.OPEN) {
          console.log(blob);
          socket.send(blob);
        }
      },
      'image/jpeg',
      0.8
    );
  }, [socket, videoRef]);

  const scheduleNextFrame = useCallback(() => {
    animationFrameId.current = requestAnimationFrame(timestamp => {
      if (timestamp - lastFrameTime.current >= frameInterval) {
        lastFrameTime.current = timestamp;
        sendFrame();
      }
      scheduleNextFrame();
    });
  }, [sendFrame]);

  useEffect(() => {
    if (!videoRef?.current || !stream) return;

    lastFrameTime.current = performance.now();
    scheduleNextFrame();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isConnected, scheduleNextFrame, stream, videoRef]);
};
