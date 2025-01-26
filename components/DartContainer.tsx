import DartSvg from './DartSvg';
import styles from '../styles/Home.module.css';
type DartContainerProps = {
  playerScore: number;
};

const DartContainer = ({ playerScore }: DartContainerProps) => {
  return (
    <div className={styles.dartContainer}>
      {new Array(5).fill(0).map((_, i) => {
        return (
          <div className={styles.dartImageContainer} key={i}>
            <DartSvg
              className={styles.dartImage}
              style={{
                opacity: playerScore <= i ? 0.2 : 1,
                transform:
                  playerScore > i ? 'translateY(10px) translateX(-10px)' : '',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DartContainer;
