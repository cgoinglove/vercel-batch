const READY = 'READY'
const FAIL = 'FAIL'
const SUCCESS = 'SUCCESS'
const RUNNING = 'RUNNING'

export const STATUS = {
  READY,
  FAIL,
  SUCCESS,
  RUNNING,

  ready(): ReadyStatus {
    return {
      status: READY,
    }
  },
  start(): RunningStatus {
    return {
      startedAt: Date.now(),
      status: RUNNING,
    }
  },
  fail(status: RunningStatus, error: any): FailStatus {
    const finishedAt = Date.now()
    return {
      status: FAIL,
      startedAt: status.startedAt,
      finishedAt,
      duration: finishedAt - status.startedAt,
      error: {
        cause: error?.cause,
        stack: error?.stack,
        message: error?.message,
        name: error?.name,
      },
    }
  },
  success(status: RunningStatus): SuccessStatus {
    const finishedAt = Date.now()
    return {
      status: SUCCESS,
      startedAt: status.startedAt,
      finishedAt,
      duration: finishedAt - status.startedAt,
    }
  },
}
