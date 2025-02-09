import { type Dispatch, type SetStateAction, useEffect, useRef } from 'react';
import { usePlayers } from '../contexts/PlayersContext';
import type { PlayerData } from '@/components/FingersAI/VideoStream';

type UseDebouncedStateProps = {
  data: PlayerData | null;
  setIsConfirmingData: Dispatch<SetStateAction<boolean>>;
};

export const useDebouncedState = ({
  data,
  setIsConfirmingData,
}: UseDebouncedStateProps) => {
  const { players, updatePlayer } = usePlayers();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const savedData = useRef<PlayerData | null>(null);

  useEffect(() => {
    setIsConfirmingData(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    const isValidData = data && data.player > 0 && data?.points > 0;
    const isCurrentData =
      data?.player == savedData.current?.player &&
      data?.points == savedData.current?.points;

    if (!isValidData || isCurrentData) {
      savedData.current = null;
      return;
    }

    setTimeout(() => {
      setIsConfirmingData(true);
    }, 200);

    timerRef.current = setTimeout(() => {
      players.map((player, i) => {
        if (i + 1 === data?.player) {
          updatePlayer(player.id, {
            score: data?.points + player.score,
          });
        }
      });
      setIsConfirmingData(false);
      savedData.current = data;
    }, 1700);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, players, setIsConfirmingData, updatePlayer]);
};
