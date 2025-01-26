import styles from './gameSettings.module.css';

type GameSettingsProps = {
  handleClearStats: () => void;
};

export const GameSettings = ({ handleClearStats }: GameSettingsProps) => {
  return (
    <section className={styles.container}>
      <button
        className={`${styles.settingsButton} ${styles.clearButton}`}
        onClick={handleClearStats}
      >
        New round
      </button>
    </section>
  );
};
