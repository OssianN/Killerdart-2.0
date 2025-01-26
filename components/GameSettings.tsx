import { Dispatch, SetStateAction } from 'react';
import { NewPlayerForm } from './Form';
import { Button } from './ui/button';
import { Player } from './KillerDart';

type GameSettingsProps = {
  handleClearStats: () => void;
  setPlayers: Dispatch<SetStateAction<Player[]>>;
  setLocalStorage: (players: Player[]) => void;
};

export const GameSettings = ({
  handleClearStats,
  setPlayers,
  setLocalStorage,
}: GameSettingsProps) => {
  return (
    <section className="flex w-full mb-4 gap-2">
      <Button className="bg-[#a1e3ff] font-semibold" onClick={handleClearStats}>
        New round
      </Button>
      <NewPlayerForm
        setPlayers={setPlayers}
        setLocalStorage={setLocalStorage}
      />
    </section>
  );
};
