'use client';
import { getServerSideProps } from '@/actions/getServersideProps';
import type { PlayerData } from '@/components/VideoStream';
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
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
      onMessage(prev => {
        if (prev && prev.player === player && prev.points === points) {
          return prev;
        }

        return { player: Number(player), points: Number(points) };
      });
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
