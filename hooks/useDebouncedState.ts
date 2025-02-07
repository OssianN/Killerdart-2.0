import { useEffect, useRef } from 'react';
import { usePlayers } from '../contexts/PlayersContext';
import type { PlayerData } from '@/components/FingersAI/VideoStream';

type UseDebouncedStateProps = {
  data: PlayerData | null;
  delay: number;
};

export const useDebouncedState = ({
  data,
  delay = 1500,
}: UseDebouncedStateProps) => {
  const { players, updatePlayer } = usePlayers();

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      players.map((player, i) => {
        if (i + 1 === data?.player) {
          updatePlayer(player.id, {
            score: data?.points + player.score,
          });
        }
      });
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, delay, players, updatePlayer]);
};
