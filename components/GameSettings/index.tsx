import styles from './gameSettings.module.css';

const index = ({ handleClearStats }) => {
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

export default index;
