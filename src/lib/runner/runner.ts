import { isNull, isPromiseLike, noop } from '@/lib/shared';
import { Chain } from '@/lib/chain';
import { STATUS } from './status';

export class Runner<T extends (...args: any[]) => any = (...args: any[]) => any>
  implements RunnerModel
{
  protected status!: Status;

  private promise?: ReturnType<T>;

  constructor(protected task: T = noop as T) {
    this.reset();
  }
  protected setTask(task: T) {
    this.task = task;
  }
  reset() {
    this.status = STATUS.ready();
  }
  getStatus(): Status {
    const duration = (() => {
      if (!isNull(this.status.duration)) return this.status.duration;
      if (!isNull(this.status.startedAt))
        return Date.now() - this.status.startedAt;
    })();
    return { ...this.status, duration: duration! };
  }
  execute(...args: Parameters<T>): ReturnType<T> {
    if (this.promise) return this.promise!;
    this.status = STATUS.start();
    const result = Chain(this.task)
      .then(data => {
        this.status = STATUS.success(this.status as RunningStatus);
        return data;
      })
      .catch(error => {
        this.status = STATUS.fail(this.status as RunningStatus, error);
        throw error;
      })
      .finally(() => {
        this.promise = undefined;
      })
      .apply(...args);
    if (isPromiseLike(result)) this.promise = result as ReturnType<T>;

    return result;
  }
}
