import { Button } from './ui/button';

type GameSettingsProps = {
  handleClearStats: () => void;
};

export const GameSettings = ({ handleClearStats }: GameSettingsProps) => {
  return (
    <section className="flex w-full mb-4 gap-2">
      <Button className="bg-[#a1e3ff]" onClick={handleClearStats}>
        New round
      </Button>
    </section>
  );
};
