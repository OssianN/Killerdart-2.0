import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { usePlayers } from '@/hooks/usePlayers';

export const NewPlayerForm = () => {
  const { addNewPlayer } = usePlayers();
  const [input, setInput] = useState({
    name: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInput(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.name) return;

    addNewPlayer(input.name);
    setInput({ name: '' });
  };

  return (
    <form
      className="relative flex w-full shadow-sm rounded-md mt-6"
      onSubmit={handleSubmit}
    >
      <Input
        className="border-[#a1e3ff] border rounded-r-none border-r-none text-[#a1e3ff] placeholder-[#a1e3ff] shadow-none placeholder:text-neutral-400"
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
