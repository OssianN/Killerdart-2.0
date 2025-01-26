import {
  useState,
  useLayoutEffect,
  ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { useSwipeable } from 'react-swipeable';
import DartContainer from './DartContainer';
import ScoreButton from './ScoreButton';
import { motion } from 'framer-motion';
import styles from '../styles/Home.module.css';
import type { Player, UpdatePlayerProps } from './KillerDart';

type PlayerProps = {
  player: Player;
  updatePlayer: (id: number, updatePlayer: UpdatePlayerProps) => void;
  setPlayers: Dispatch<SetStateAction<Player[]>>;
  setLocalStorage: (players: Player[]) => void;
};

export const PlayerItem = ({
  player,
  updatePlayer,
  setPlayers,
  setLocalStorage,
}: PlayerProps) => {
  const [showRemove, setShowRemove] = useState(false);
  const [animateListItem, setAnimateListItem] = useState(false);

  const setBackgroundOnScore = (player: Player) => {
    if (player.score === 5) {
      return '#FF4242';
    }

    if (player.isDead) {
      return '#47abd8';
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => setShowRemove(true),
    onSwipedRight: () => setShowRemove(false),
    trackMouse: true,
  });

  const handleRemovePlayer = () => {
    setPlayers(prev => {
      const newList = prev.filter(p => p.id !== player.id);
      setLocalStorage(newList);
      return newList;
    });
  };

  const handlePlayerNumber = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    if (!/^[0-9]*$/gi.test(value)) {
      return;
    }

    updatePlayer(player.id, { number: Number(value) });
  };

  useLayoutEffect(() => {
    if (player.isDead || player.score === 5) {
      setAnimateListItem(true);

      setTimeout(() => {
        setAnimateListItem(false);
      }, 600);
    }
  }, [player.isDead, player.score]);

  return (
    <motion.li
      key={player.id}
      className={`${styles.playerItem} ${
        animateListItem ? styles.animateListItem : ''
      }`}
      style={{
        background: setBackgroundOnScore(player),
        transform: showRemove ? 'translateX(-250px)' : 'translateX(0)',
      }}
      {...handlers}
      animate={{ opacity: 1, x: 0 }}
      layout
      transition={{ stiffness: 500, damping: 30 }}
    >
      <header
        className={styles.playerHeader}
        style={{
          opacity: player.isDead ? 0.3 : 1,
        }}
      >
        <h3 className={styles.playerName}>{player.name}</h3>
        <input
          className={styles.playerTargetInput}
          type="numeric"
          pattern="[0-9]*"
          placeholder="--"
          onChange={handlePlayerNumber}
          value={player.number ? String(player.number) : ''}
        />
      </header>
      <div
        className={styles.playersContent}
        style={{
          opacity: player.isDead ? 0.3 : 1,
        }}
      >
        <ScoreButton
          player={player}
          operator={'minus'}
          updatePlayer={updatePlayer}
        />

        <DartContainer playerScore={player.score} />

        <ScoreButton
          player={player}
          operator={'plus'}
          updatePlayer={updatePlayer}
        />
      </div>
      <p className={styles.playerWinsParagraph}>W: {player.wins}</p>

      <button
        className={styles.removePlayerButton}
        style={{
          transform: showRemove ? 'translateX(250px)' : 'translateX(300px)',
          opacity: !showRemove ? '0' : '1',
        }}
        onClick={handleRemovePlayer}
      >
        Remove
      </button>
    </motion.li>
  );
};
