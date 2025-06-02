'use client';
// import { getServerSideProps } from '@/actions/getServersideProps';
import type { PlayerData } from '@/components/FingersAI/VideoStream';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

type UseSocketProps = {
  onMessage: Dispatch<SetStateAction<PlayerData | null>>;
};

export const useSocket = ({ onMessage }: UseSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  // const [token, setToken] = useState<string | undefined>();
  const uri =
    'wss://hand-recognition-backend-349308198137.europe-west1.run.app/ws?token=123';
  const savedData = useRef<PlayerData | null>(null);
  const socket = useRef<WebSocket | null>(null);
  let attempts = 0;

  const connectWs = useCallback(() => {
    socket.current = new WebSocket(uri);

    if (!socket.current) return;

    socket.current.onopen = () => {
      console.log('connected');
      setIsConnected(true);
    };

    socket.current.onclose = () => {
      setIsConnected(false);
    };

    socket.current.onerror = error => {
      console.error('WebSocket Error ', error);

      if (attempts > 5) {
        console.error('Max attempts reached. Closing socket.');
        socket.current?.close();
        return;
      }

      attempts++;

      setTimeout(() => {
        connectWs();
      }, 1000 * attempts);
    };
  }, [attempts]);

  useEffect(() => {
    connectWs();

    if (!socket.current) return;

    socket.current.onmessage = message => {
      const { player, points } = JSON.parse(message.data);
      const isSameData =
        savedData.current?.player === player &&
        savedData.current?.points === points;

      if (isSameData) return;

      savedData.current = { player, points };
      onMessage({ player: Number(player), points: Number(points) });
    };

    return () => socket.current?.close();
  }, [connectWs, onMessage, socket]);

  return { socket: socket.current, isConnected };
};
