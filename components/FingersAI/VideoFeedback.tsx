import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

type VideoFeedbackProps = {
  data: { player: number; points: number } | null;
};

export const VideoFeedback = ({ data }: VideoFeedbackProps) => {
  if (!data) return null;

  return (
    <AnimatePresence>
      <div className="flex gap-6">
        <p className="flex gap-2 items-center">
          <motion.img
            layout
            // initial={{ scale: 1 }}
            // animate={{ scale: [1, 0.8, 1] }}
            // transition={{ duration: 1 }}
            src={`/${
              data?.player ? dataToFingersMap[data.player] : 'zero-fingers.png'
            }`}
            alt="one finger"
            width={40}
            height={40}
          />
          Player: {data?.player}
        </p>
        <p className="flex gap-2 items-center">
          Points: {data?.points}
          <Image
            src={`/${
              data?.points ? dataToFingersMap[data.points] : 'zero-fingers.png'
            }`}
            alt="one finger"
            width={40}
            height={40}
          />
        </p>
      </div>
    </AnimatePresence>
  );
};

const dataToFingersMap: Record<number, string> = {
  1: 'one-finger.png',
  2: 'two-fingers.png',
  3: 'three-fingers.png',
  4: 'four-fingers.png',
  5: 'five-fingers.png',
};
