// Scheduler.test.ts

import { IntervalScheduler, SpecificTimeScheduler } from '@/lib/runner'
import { TIME } from '@/lib/shared'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Scheduler 클래스', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllTimers()
  })

  // SpecificTimeScheduler 테스트
  describe('SpecificTimeScheduler 클래스', () => {
    it('execute가 지정된 시간에 호출되어야 합니다', async () => {
      const execute = vi.fn()

      // 현재 시간을 10:00으로 설정
      const mockDate = new Date()
      mockDate.setHours(10, 0, 0, 0)
      vi.setSystemTime(mockDate)

      // 10:05 및 10:10에 execute가 호출되도록 설정
      const scheduler = new SpecificTimeScheduler([
        [10, 5],
        [10, 10],
      ])

      scheduler.start(execute)

      // 현재 시간: 10:00
      // 다음 실행 시간: 10:05
      // 대기 시간: 5분
      vi.advanceTimersByTime(TIME.MINUTES(5))

      expect(execute).toHaveBeenCalledTimes(1)

      // 다음 실행 시간: 10:10
      vi.advanceTimersByTime(TIME.MINUTES(5))

      expect(execute).toHaveBeenCalledTimes(2)

      // 추가 실행 시간: 10:05 다음 날 10:05
      vi.advanceTimersByTime(TIME.HOURS(23) + TIME.MINUTES(59))

      expect(execute).toHaveBeenCalledTimes(3)

      // 추가 실행 시간: 10:05 다음 날 10:05
      vi.advanceTimersByTime(TIME.MINUTES(1))

      expect(execute).toHaveBeenCalledTimes(4)
    })

    it('scheduler가 중단되면 execute가 더 이상 호출되지 않아야 합니다', async () => {
      const execute = vi.fn()

      // 현재 시간을 10:00으로 설정
      const mockDate = new Date()
      mockDate.setHours(10, 0, 0, 0)
      vi.setSystemTime(mockDate)

      const scheduler = new SpecificTimeScheduler([[10, 5]])

      scheduler.start(execute)

      // 현재 시간: 10:00
      // 다음 실행 시간: 10:05
      vi.advanceTimersByTime(TIME.MINUTES(5))

      expect(execute).toHaveBeenCalledTimes(1)

      // 스케줄러 중단
      scheduler.stop()

      // 추가 대기 시간: 24시간
      vi.advanceTimersByTime(TIME.HOURS(24))

      expect(execute).toHaveBeenCalledTimes(1) // 더 이상 호출되지 않음
    })

    it('isActive가 올바르게 동작해야 합니다', () => {
      const execute = vi.fn()

      // 현재 시간을 10:00으로 설정
      const mockDate = new Date()
      mockDate.setHours(10, 0, 0, 0)
      vi.setSystemTime(mockDate)

      const scheduler = new SpecificTimeScheduler([[10, 5]])

      expect(scheduler.isActive()).toBe(false)

      scheduler.start(execute)
      expect(scheduler.isActive()).toBe(true)

      scheduler.stop()
      expect(scheduler.isActive()).toBe(false)
    })

    it('stopEvent가 호출되면 이후 이벤트가 발생하지 않아야 합니다', async () => {
      const execute = vi.fn()

      // 현재 시간을 10:00으로 설정
      const mockDate = new Date()
      mockDate.setHours(10, 0, 0, 0)
      vi.setSystemTime(mockDate)

      const scheduler = new SpecificTimeScheduler([
        [10, 5],
        [10, 10],
        [10, 15],
      ])

      scheduler.start(execute)

      // 10:05 실행
      vi.advanceTimersByTime(TIME.MINUTES(5))

      expect(execute).toHaveBeenCalledTimes(1)

      // 10:10 실행
      vi.advanceTimersByTime(TIME.MINUTES(5))

      expect(execute).toHaveBeenCalledTimes(2)

      // stop scheduler before 10:15
      scheduler.stop()

      // 24시간 후 다음 실행 시간: 10:15 다음 날 10:15
      vi.advanceTimersByTime(TIME.HOURS(24))

      expect(execute).toHaveBeenCalledTimes(2) // 더 이상 호출되지 않음
    })
  })

  // IntervalScheduler 테스트
  describe('IntervalScheduler 클래스', () => {
    it('execute가 지정된 간격마다 호출되어야 합니다', async () => {
      const execute = vi.fn()

      const scheduler = new IntervalScheduler(TIME.MINUTES(1))

      scheduler.start(execute)
      expect(execute).toHaveBeenCalledTimes(1)
      // 현재 시간: 00:00
      expect(scheduler.isActive()).toBe(true)

      // 1분 후
      vi.advanceTimersByTime(TIME.MINUTES(1))
      expect(execute).toHaveBeenCalledTimes(2)

      // // 1분 후
      vi.advanceTimersByTime(TIME.MINUTES(1))
      expect(execute).toHaveBeenCalledTimes(3)

      // // 1분 후
      vi.advanceTimersByTime(TIME.MINUTES(1))
      expect(execute).toHaveBeenCalledTimes(4)
    })

    it('scheduler가 중단되면 execute가 더 이상 호출되지 않아야 합니다', async () => {
      const execute = vi.fn()

      const scheduler = new IntervalScheduler(TIME.MINUTES(1))

      scheduler.start(execute)
      expect(execute).toHaveBeenCalledTimes(1)

      // 1분 후
      vi.advanceTimersByTime(TIME.MINUTES(1))

      // 스케줄러 중단
      scheduler.stop()
      expect(scheduler.isActive()).toBe(false)

      // 추가 2분 대기
      vi.advanceTimersByTime(TIME.MINUTES(2))
      expect(execute).toHaveBeenCalledTimes(2) // 더 이상 호출되지 않음
    })

    it('isActive가 올바르게 동작해야 합니다', () => {
      const execute = vi.fn()

      const scheduler = new IntervalScheduler(TIME.MINUTES(1))

      expect(scheduler.isActive()).toBe(false)

      scheduler.start(execute)
      expect(scheduler.isActive()).toBe(true)

      scheduler.stop()
      expect(scheduler.isActive()).toBe(false)
    })

    it('stopEvent가 호출되면 이후 이벤트가 발생하지 않아야 합니다', async () => {
      const execute = vi.fn()

      const scheduler = new IntervalScheduler(TIME.MINUTES(1))

      scheduler.start(execute)

      // 1분 후 실행
      expect(execute).toHaveBeenCalledTimes(1)
      vi.advanceTimersByTime(TIME.MINUTES(1))
      expect(execute).toHaveBeenCalledTimes(2)

      // 스케줄러 중단
      scheduler.stop()

      // 추가 2분 대기
      vi.advanceTimersByTime(TIME.MINUTES(2))
      expect(execute).toHaveBeenCalledTimes(2) // 더 이상 호출되지 않음
    })
    it('에러가 난다면 스케줄이 멈춰야 합니다.', async () => {
      const execute = vi.fn()
      const errorExecute = vi.fn(() => {
        throw new Error('Error')
      })

      const scheduler = new IntervalScheduler(TIME.MINUTES(1))

      scheduler.start(execute)

      // 1분 후 실행
      expect(execute).toHaveBeenCalledTimes(1)
      vi.advanceTimersByTime(TIME.MINUTES(1))
      expect(execute).toHaveBeenCalledTimes(2)

      // 스케줄러 중단
      scheduler.stop()
      try {
        scheduler.start(errorExecute)
      } catch {}
      expect(errorExecute).toHaveBeenCalledTimes(1) // 더 이상 호출되지 않음
      // 추가 2분 대기
      vi.advanceTimersByTime(TIME.MINUTES(10))
      expect(errorExecute).toHaveBeenCalledTimes(1) // 더 이상 호출되지 않음
      expect(scheduler.isActive()).toBe(false) // 더 이상 호출되지 않음
    })
  })
})
