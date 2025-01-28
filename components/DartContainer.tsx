import DartSvg from './DartSvg';
type DartContainerProps = {
  playerScore: number;
};

const DartContainer = ({ playerScore }: DartContainerProps) => {
  return (
    <div className="flex">
      {new Array(5).fill(0).map((_, i) => {
        return (
          <div className="relative w-6 h-6" key={i}>
            <DartSvg
              className={`w-full h-full transition duration-300 ${
                playerScore <= i
                  ? 'opacity-20 -translate-y-3 translate-x-2'
                  : 'opacity-100 -translate-y-0 -translate-x-1'
              }`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DartContainer;
