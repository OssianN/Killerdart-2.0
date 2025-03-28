import Image from 'next/image';
import { Progress } from '../ui/progress';

type VideoFeedbackProps = {
  data: { player: number; points: number } | null;
  isConfirmingData?: boolean;
};

export const VideoFeedback = ({
  data,
  isConfirmingData,
}: VideoFeedbackProps) => {
  return (
    <div className="flex w-full justify-center items-center">
      <p className="flex flex-col justify-center items-center">
        <Image
          src={`/${
            data?.player ? dataToFingersMap[data.player] : 'zero-fingers.png'
          }`}
          alt="one finger"
          width={40}
          height={40}
        />
        <span className="w-20 text-center">Player {data?.player}</span>
      </p>

      <Progress value={isConfirmingData ? 100 : 0} />

      <p className="flex flex-col justify-center items-center">
        <Image
          src={`/${
            data?.points ? dataToFingersMap[data.points] : 'zero-fingers.png'
          }`}
          alt="one finger"
          width={40}
          height={40}
        />
        <span className="w-20 text-center"> Points {data?.points}</span>
      </p>
    </div>
  );
};

export const dataToFingersMap: Record<number, string> = {
  1: 'one-finger.png',
  2: 'two-fingers.png',
  3: 'three-fingers.png',
  4: 'four-fingers.png',
  5: 'five-fingers.png',
};
