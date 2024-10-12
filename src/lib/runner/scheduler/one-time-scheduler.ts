import { Chain } from '@/lib/chain'

export class OneTimeScheduler implements Scheduler {
  private active: boolean = false
  private canExecute: boolean = true
  private nextRunTime?: number
  private timerId?: ReturnType<typeof setTimeout>
  constructor(private delay: number = 0) {}

  start(execute: () => any): void {
    if (!this.canExecute) return
    this.active = true
    this.nextRunTime = Date.now() + this.delay
    this.timerId = setTimeout(() => {
      this.canExecute = false
      Chain(() => execute())
        .finally(() => {
          this.active = false
        })
        .apply()
    }, this.delay)
  }

  stop(): void {
    clearTimeout(this.timerId)
    this.active = false
  }

  isActive(): boolean {
    return this.active
  }
  timeToNextRun() {
    return !this.active ? undefined : this.nextRunTime! - Date.now()
  }
}
