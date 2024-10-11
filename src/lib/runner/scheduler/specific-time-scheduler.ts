import { Chain } from '@/lib/chain';
import { TIME } from '@/lib/shared';

const compare = (a: [number, number], b: [number, number]) => {
  if (a[0] != b[0]) return a[0] - b[0];
  return a[1] - b[1];
};

type SpecificTime = [HH24: number, mm: number];
export class SpecificTimeScheduler implements Scheduler {
  private timerId?: ReturnType<typeof setTimeout>;
  private times: SpecificTime[];
  private nextRunTime?: number;
  constructor(times: SpecificTime[]) {
    this.times = times.map(([HH, MM]) => [
      Math.min(23, Math.max(0, HH)),
      Math.min(59, Math.max(0, MM)),
    ]);
  }

  start(execute: () => any): void {
    this.stop();
    const now = new Date();
    const current = [now.getHours(), now.getMinutes()] as [number, number];

    const nextTime = [
      ...this.times,
      ...this.times.map(([HH, MM]) => [HH + 24, MM] as [number, number]),
    ]
      .sort(compare)
      .find(time => compare(time, current) > 0)!;
    const delay =
      TIME.HOURS(nextTime[0] - current[0]) +
      TIME.MINUTES(nextTime[1] - current[1]);
    this.nextRunTime = Date.now() + delay;
    this.timerId = setTimeout(() => {
      Chain(execute)
        .then(() => this.start(execute))
        .catch(err => {
          this.stop();
          throw err;
        })
        .apply();
    }, delay);
  }
  stop(): void {
    clearTimeout(this.timerId);
    this.timerId = undefined;
    this.nextRunTime = undefined;
  }
  isActive() {
    return this.timerId != undefined;
  }
  timeToNextRun() {
    return this.nextRunTime == undefined
      ? undefined
      : this.nextRunTime - Date.now();
  }
}
