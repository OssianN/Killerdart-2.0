import type { Player } from '@/components/KillerDart';
import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from 'react';

export type UpdatedPlayerProps = {
  score?: number;
  number?: number | null;
  wins?: number;
  active?: boolean;
  isDead?: boolean;
};

const PlayersContext = createContext<PlayersContextProps>({
  players: [],
  addNewPlayer: () => {},
  updatePlayer: () => {},
  handleClearStats: () => {},
  handleRemovePlayer: () => {},
});

// fix  <0 & >5
export const PlayersProvider = ({ children }: { children: ReactNode }) => {
  const [players, setPlayers] = useState<Player[]>([]);

  const addNewPlayer = useCallback((name: string) => {
    const newPlayer = { id: Date.now(), name, score: 0, number: null, wins: 0 };
    setPlayers(prev => {
      setLocalStorage([...prev, newPlayer]);
      return [...prev, newPlayer];
    });
  }, []);

  const updatePlayer = useCallback(
    (id: number, updatedPlayer: UpdatedPlayerProps) => {
      const newList: Player[] = players
        .map(player => {
          return player.id === id
            ? {
                ...player,
                ...updatedPlayer,
                ...(updatedPlayer.score !== undefined && {
                  isDead: updatedPlayer.score < 1,
                  score: changeScore(updatedPlayer.score),
                  active: true,
                }),
              }
            : player;
        })
        .sort((a, b) => (b.number ?? 0) - (a.number ?? 0));

      setPlayers([...newList]);
      setLocalStorage(newList);
    },
    [players]
  );

  const handleRemovePlayer = useCallback((playerId: number) => {
    setPlayers(prev => {
      const newList = prev.filter(p => p.id !== playerId);
      setLocalStorage(newList);
      return newList;
    });
  }, []);

  const handleClearStats = useCallback(() => {
    const winnerId = isWinner(players);
    const newList = resetPlayerStats(players, winnerId);

    setLocalStorage(newList);
    setPlayers(newList);
  }, [players]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storage = localStorage.getItem('players');
    const localList = storage ? JSON.parse(storage) : [];
    setPlayers(localList);
  }, []);

  return (
    <PlayersContext.Provider
      value={{
        players,
        addNewPlayer,
        updatePlayer,
        handleClearStats,
        handleRemovePlayer,
      }}
    >
      {children}
    </PlayersContext.Provider>
  );
};

export const usePlayers = () => {
  const context = useContext(PlayersContext);
  if (!context) {
    throw new Error('usePlayers must be used within a PlayersProvider');
  }
  return context;
};

const resetPlayerStats = (players: Player[], winnerId?: number) =>
  players.map(player => ({
    ...player,
    score: 0,
    number: null,
    active: false,
    isDead: false,
    wins: player.id === winnerId ? player.wins + 1 : player.wins,
  }));

const isWinner = (players: Player[]) => {
  const winners = players.filter(player => player.score === 5);
  return winners.length === 1 ? winners[0].id : undefined;
};

const setLocalStorage = (players: Player[]) => {
  localStorage.setItem('players', JSON.stringify(players));
};

const changeScore = (newValue: number) =>
  newValue > 5 ? 5 : newValue < 0 ? 0 : newValue;

type PlayersContextProps = {
  players: Player[];
  addNewPlayer: (name: string) => void;
  updatePlayer: (id: number, updatedPlayer: UpdatedPlayerProps) => void;
  handleClearStats: () => void;
  handleRemovePlayer: (playerId: number) => void;
};
