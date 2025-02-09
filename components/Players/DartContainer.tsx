import { motion } from 'framer-motion';
import DartSvg from './DartSvg';
import { useEffect, useState } from 'react';
type DartContainerProps = {
  playerScore: number;
};

export const DartContainer = ({ playerScore }: DartContainerProps) => {
  const [currentScore, setCurrentScore] = useState(playerScore);

  useEffect(() => {
    setCurrentScore(playerScore);
  }, [currentScore, playerScore]);

  return (
    <div className="flex">
      {new Array(5).fill(0).map((_, i) => {
        return (
          <motion.div
            key={i}
            className="relative w-6 h-6"
            variants={arrowAnimation}
            animate={playerScore > i ? 'visible' : 'initial'}
            transition={{
              delay:
                playerScore - currentScore > 1
                  ? i * 0.1
                  : currentScore - playerScore > 1
                  ? 0.4 - i * 0.1
                  : 0,
            }}
          >
            <DartSvg className="w-full h-full" />
          </motion.div>
        );
      })}
    </div>
  );
};

const arrowAnimation = {
  initial: { translateY: -7, translateX: 7, opacity: 0.2 },
  visible: { translateY: 0, translateX: 0, opacity: 1 },
};
