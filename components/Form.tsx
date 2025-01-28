import {
  useState,
  type FormEvent,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react';
import type { Player } from './KillerDart';
import { Button } from './ui/button';
import { Input } from './ui/input';

type FormComponentProps = {
  setPlayers: Dispatch<SetStateAction<Player[]>>;
  setLocalStorage: (players: Player[]) => void;
};

export const NewPlayerForm = ({
  setPlayers,
  setLocalStorage,
}: FormComponentProps) => {
  const [input, setInput] = useState({
    name: '',
  });

  const createNewPlayer = (name: string): Player => {
    return { id: Date.now(), name, score: 0, number: null, wins: 0 };
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInput(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.name) {
      return;
    }

    const newPlayer = createNewPlayer(input.name);
    setPlayers(prev => {
      setLocalStorage([...prev, newPlayer]);
      return [...prev, newPlayer];
    });
    setInput({ name: '' });
  };

  return (
    <form
      className="relative flex w-full shadow-sm rounded-md mt-6"
      onSubmit={handleSubmit}
    >
      <Input
        className="border-[#a1e3ff] border rounded-r-none border-r-none text-[#a1e3ff] placeholder-[#a1e3ff] shadow-none"
        name="name"
        type="text"
        value={input.name}
        onChange={handleChange}
        placeholder="Add player..."
        maxLength={12}
      />
      <Button
        className="w-16 bg-[#a1e3ff] rounded-l-none shadow-none"
        type="submit"
      >
        Add
      </Button>
    </form>
  );
};
