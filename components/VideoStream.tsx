'use client';
import { useSocket } from '@/hooks/useSocket';
import { useEffect, useRef, useState } from 'react';

export const VideoStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [data, setData] = useState<{ player: string; points: string } | null>(
    null
  );
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { socket, isConnected } = useSocket({ onMessage: setData });

  useEffect(() => {
    if (!isConnected || !videoRef.current || !stream) return;
    const intervalId = setInterval(() => {
      try {
        const canvas = document.createElement('canvas');
        const video = videoRef.current;

        canvas.width = video?.videoWidth ?? 0;
        canvas.height = video?.videoHeight ?? 0;

        const ctx = canvas.getContext('2d');
        if (!ctx || !video) return;

        ctx.drawImage(video, 0, 0);
        const base64Frame = canvas.toDataURL('image/jpeg;base64');
        socket.send(base64Frame);
      } catch (error) {
        console.error('Error sending frame:', error);
      }
    }, 200);

    return () => clearInterval(intervalId);
  }, [isConnected, socket, stream]);

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
      <div>
        <p>Player: {data?.player}</p>
        <p>Points: {data?.points}</p>
      </div>

      <div className="flex items-center justify-center gap-4 border border-white-100 rounded-xl p-4 w-full max-w-[640px] min-h-[460px] flex-1">
        {!stream && (
          <button className="w-32" onClick={startCamera}>
            Start Camera
          </button>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`-scale-x-100 w-full h-full rounded-xl ${
            !stream ? 'hidden' : ''
          }`}
        />
      </div>

      {stream && (
        <button className="button" onClick={stopCamera} disabled={!stream}>
          Stop Camera
        </button>
      )}
    </div>
  );
};
