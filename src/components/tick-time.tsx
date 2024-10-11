'use client';

import { formatDuration, isNull } from '@/lib/shared';
import { useEffect, useMemo, useState } from 'react';

interface Props {
  time?: number;
  delay?: number;
  weight?: number;
}

export default function TickTime({ time, delay = 1000, weight = 1000 }: Props) {
  const [value, setValue] = useState(time);

  useEffect(() => {
    setValue(time);
    if (isNull(time) || !delay || !weight) return;
    const timer = setInterval(() => {
      setValue(prev => {
        const next = (prev ?? 0) + weight;
        if (next < 0) clearInterval(timer);
        return next;
      });
    }, delay);
    return () => clearInterval(timer);
  }, [time, delay, weight]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(formatDuration.bind(null, value), [value]);
}
