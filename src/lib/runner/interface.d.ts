type StatusType = 'RUNNING' | 'FAIL' | 'SUCCESS' | 'READY'

interface StatusField<S extends StatusType> {
  status: S
  startedAt: number
  finishedAt: number
  duration: number
  error: Error
}

type SuccessStatus = PickPartial<StatusField<'SUCCESS'>, 'error'>
type FailStatus = StatusField<'FAIL'>
type RunningStatus = PickPartial<StatusField<'RUNNING'>, 'error' | 'duration' | 'finishedAt'>
type ReadyStatus = PickPartial<
  StatusField<'READY'>,
  'error' | 'duration' | 'finishedAt' | 'startedAt'
>

type EndedStatus = SuccessStatus | FailStatus

type Status = EndedStatus | RunningStatus | ReadyStatus

interface RunnerModel<T extends Func = Func> {
  getStatus(): Status
  execute: T
}

type JOBStatus<Type extends Status = Status> = Type & {
  name: string
  description: string
  thread: Array<
    Status & {
      name: string
      logs: Serializable[]
    }
  >
}

type JobHistory = JOBStatus & { executor: string; id: string }

interface Scheduler {
  start(execute: () => any): void
  stop(): void
  isActive(): boolean
  timeToNextRun(): number | undefined
}
