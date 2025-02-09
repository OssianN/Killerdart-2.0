'use client';
import { getServerSideProps } from '@/actions/getServersideProps';
import type { PlayerData } from '@/components/FingersAI/VideoStream';
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type UseSocketProps = {
  onMessage: Dispatch<SetStateAction<PlayerData | null>>;
};

export const useSocket = ({ onMessage }: UseSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useState<string | undefined>();
  const uri = 'wss://handrecognitionbackend-production.up.railway.app/ws';
  const socket = useMemo(() => new WebSocket(uri), []);
  const savedData = useRef<PlayerData | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const {
        props: { handRecognitionKey },
      } = await getServerSideProps();
      setToken(handRecognitionKey);
    };
    getToken();
  }, []);

  useEffect(() => {
    if (!token) return;

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'auth', token }));
      setIsConnected(true);
    };

    socket.onmessage = message => {
      const { player, points } = JSON.parse(message.data);
      const isSameData =
        savedData.current?.player == player &&
        savedData.current?.points == points;

      if (isSameData) return;

      savedData.current = { player, points };
      onMessage({ player: Number(player), points: Number(points) });
    };

    socket.onclose = () => {
      setIsConnected(false);
    };

    socket.onerror = error => {
      console.error('WebSocket Error ', error);
    };

    return () => socket.close();
  }, [onMessage, socket, token]);

  return { socket, isConnected };
};
