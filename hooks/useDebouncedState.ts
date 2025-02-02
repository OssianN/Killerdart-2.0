import { type Dispatch, type SetStateAction, useEffect, useRef } from 'react';

type UseDebouncedStateProps<T> = {
  data: T;
  setConfirmedData: Dispatch<SetStateAction<T>>;
  delay: number;
};

export const useDebouncedState = <T>({
  data,
  setConfirmedData,
  delay = 1500,
}: UseDebouncedStateProps<T>) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setConfirmedData(data);
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, delay, setConfirmedData]);
};
