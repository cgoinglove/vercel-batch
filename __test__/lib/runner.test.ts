// task.test.ts

import { Runner } from '@/lib/runner/runner'
import { describe, it, expect, vi } from 'vitest'

describe('Runner Class', () => {
  it('동기 작업이 성공적으로 실행되어야 합니다', () => {
    const syncRunner = new Runner(() => {
      return '동기 작업 결과'
    })

    const result = syncRunner.execute()
    expect(result).toBe('동기 작업 결과')

    const status = syncRunner.getStatus() as SuccessStatus
    expect(status.status).toBe('SUCCESS')
    expect(status.duration).toBeGreaterThanOrEqual(0)
  })

  it('비동기 작업이 성공적으로 실행되어야 합니다', async () => {
    const asyncRunner = new Runner(async () => {
      return new Promise<string>(resolve => setTimeout(() => resolve('비동기 작업 결과'), 100))
    })

    const result = await asyncRunner.execute()
    expect(result).toBe('비동기 작업 결과')

    const status = asyncRunner.getStatus() as SuccessStatus
    expect(status.status).toBe('SUCCESS')
    expect(status.duration).toBeGreaterThanOrEqual(100)
  })

  it('작업 실행 중 에러가 발생하면 FAIL 상태가 되어야 합니다', () => {
    const failingRunner = new Runner(() => {
      throw new Error('작업 실패')
    })

    expect(() => failingRunner.execute()).toThrow('작업 실패')

    const status = failingRunner.getStatus() as FailStatus
    expect(status.status).toBe('FAIL')
    expect(status.error).toBeDefined()
    expect(status.error.message).toBe('작업 실패')
  })

  it('실행 중인 비동기 작업을 다시 실행하면 실행중인 결과를 같이 받습니다.', async () => {
    const longRunner = vi.fn(async () => {
      return new Promise<string>(resolve => setTimeout(() => resolve('긴 작업'), 200))
    })
    const task = new Runner(longRunner)

    task.execute()
    task.execute()
    await task.execute()
    expect(longRunner).toHaveBeenCalledTimes(1)

    await task.execute()
    await task.execute()
    await task.execute()
    expect(longRunner).toHaveBeenCalledTimes(4)
  })
})
