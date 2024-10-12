import { Chain } from '@/lib/chain'

export class IntervalScheduler implements Scheduler {
  private timerId?: ReturnType<typeof setTimeout>
  private active: boolean = false
  private nextRunTime?: number

  constructor(private interval: number = 0) {}

  start(execute: () => any): void {
    this.stop()
    this.active = true
    Chain(() => execute())
      .then(() => {
        this.nextRunTime = Date.now() + this.interval
        if (this.active)
          this.timerId = setTimeout(() => this.start(() => execute()), Math.max(this.interval, 0))
      })
      .catch(err => {
        this.stop()
        throw err
      })
      .apply()
  }
  stop(): void {
    clearTimeout(this.timerId)
    this.timerId = undefined
    this.nextRunTime = undefined
    this.active = false
  }
  isActive() {
    return this.active
  }
  timeToNextRun() {
    return this.nextRunTime == undefined ? undefined : this.nextRunTime - Date.now()
  }
}
