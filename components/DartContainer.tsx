import { motion } from 'framer-motion';
import DartSvg from './DartSvg';
type DartContainerProps = {
  playerScore: number;
};

const DartContainer = ({ playerScore }: DartContainerProps) => {
  const initial = { translateY: -7, translateX: 7, opacity: 0.2 };
  return (
    <div className="flex">
      {new Array(5).fill(0).map((_, i) => {
        return (
          <motion.div
            className="relative w-6 h-6"
            key={i}
            initial={initial}
            animate={
              playerScore > i
                ? { translateY: 0, translateX: 0, opacity: 1 }
                : initial
            }
          >
            <DartSvg className="w-full h-full" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default DartContainer;
