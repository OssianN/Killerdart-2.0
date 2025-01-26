import {
  useState,
  type FormEvent,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react';
import styles from '../styles/Home.module.css';
import type { Player } from './KillerDart';

type FormComponentProps = {
  setPlayers: Dispatch<SetStateAction<Player[]>>;
  setLocalStorage: (players: Player[]) => void;
};

const FormComponent = ({ setPlayers, setLocalStorage }: FormComponentProps) => {
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
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.formInput}
        name="name"
        type="text"
        value={input.name}
        onChange={handleChange}
        placeholder="Add player..."
        maxLength={12}
      />
      <button className={styles.submitButton} type="submit">
        &#43;
      </button>
    </form>
  );
};

export default FormComponent;
