import { Chain } from '@/lib/chain'
import { isPromiseLike } from '@/lib/shared'
import { describe, it, expect, vi } from 'vitest'

describe('SafeChain 클래스', () => {
  // 1. 동기 함수만 사용하는 경우
  describe('동기 실행', () => {
    it('동기적인 then 체인을 올바르게 처리해야 합니다', () => {
      const executor = vi.fn(() => 'a')
      const then1 = vi.fn((value: string) => value + 'b')
      const then2 = vi.fn((value: string) => value + 'c')

      const result = Chain(() => executor())
        .then(then1)
        .then(then2)
        .catch(() => 'd')
        .apply()

      expect(result).toBe('abc')
      expect(executor).toHaveBeenCalledTimes(1)
      expect(then1).toHaveBeenCalledWith('a')
      expect(then2).toHaveBeenCalledWith('ab')
    })

    it('동기적인 then 핸들러에서 에러가 발생하면 catch 핸들러로 전달해야 합니다', () => {
      const executor = vi.fn(() => 'a')
      const then1 = vi.fn(() => {
        throw new Error('then1 에러')
      })
      const catch1 = vi.fn(() => 'catch1 처리')

      const result = Chain(() => executor())
        .then(then1)
        .catch(catch1)
        .apply()

      expect(result).toBe('catch1 처리')
      expect(executor).toHaveBeenCalledTimes(1)
      expect(then1).toHaveBeenCalledWith('a')
      expect(catch1).toHaveBeenCalledWith(new Error('then1 에러'))
    })

    it('여러 개의 catch 핸들러가 순차적으로 실행되어야 합니다', () => {
      const executor = vi.fn(() => 'a')
      const then1 = vi.fn(() => {
        throw new Error('then1 에러')
      })
      const catch1 = vi.fn(() => {
        throw new Error('catch1 에러')
      })
      const catch2 = vi.fn(() => 'catch2 처리')

      const result = Chain(() => executor())
        .then(then1)
        .catch(catch1)
        .catch(catch2)
        .apply()

      expect(result).toBe('catch2 처리')
      expect(executor).toHaveBeenCalledTimes(1)
      expect(then1).toHaveBeenCalledWith('a')
      expect(catch1).toHaveBeenCalledWith(new Error('then1 에러'))
      expect(catch2).toHaveBeenCalledWith(new Error('catch1 에러'))
    })
  })

  // 2. 비동기 함수가 포함된 경우
  describe('비동기 실행', () => {
    it('비동기적인 executor와 then 체인을 올바르게 처리해야 합니다', async () => {
      const executor = vi.fn(() => Promise.resolve('a'))
      const then1 = vi.fn((value: string) => value + 'b')
      const then2 = vi.fn((value: string) => Promise.resolve(value + 'c'))

      const result = Chain(() => executor())
        .then(then1)
        .then(then2)
        .catch(() => 'd')
        .apply()

      expect(isPromiseLike(result)).toBe(true)
      await expect(result).resolves.toBe('abc')
      expect(executor).toHaveBeenCalledTimes(1)
      expect(then1).toHaveBeenCalledWith('a')
      expect(then2).toHaveBeenCalledWith('ab')
    })

    it('비동기적인 then 핸들러에서 에러가 발생하면 catch 핸들러로 전달해야 합니다', async () => {
      const executor = vi.fn(() => Promise.resolve('a'))
      const then1 = vi.fn(() => Promise.reject('then1 에러'))
      const catch1 = vi.fn(() => 'catch1 처리')

      const result = Chain(() => executor())
        .then(then1)
        .catch(catch1)
        .apply()

      expect(isPromiseLike(result)).toBe(true)
      await expect(result).resolves.toBe('catch1 처리')
      expect(executor).toHaveBeenCalledTimes(1)
      expect(then1).toHaveBeenCalledWith('a')
      expect(catch1).toHaveBeenCalledWith('then1 에러')
    })

    it('여러 개의 비동기 catch 핸들러가 순차적으로 실행되어야 합니다', async () => {
      const executor = vi.fn(() => Promise.reject('초기 에러'))
      const catch1 = vi.fn(() => {
        throw 'catch1 에러'
      })
      const catch2 = vi.fn(() => 'catch2 처리')

      const result = Chain(() => executor())
        .catch(catch1)
        .catch(catch2)
        .apply()

      expect(isPromiseLike(result)).toBe(true)
      await expect(result).resolves.toBe('catch2 처리')
      expect(executor).toHaveBeenCalledTimes(1)
      expect(catch1).toHaveBeenCalledWith('초기 에러')
      expect(catch2).toHaveBeenCalledWith('catch1 에러')
    })
  })

  // 3. 혼합된 동기 및 비동기 함수
  describe('혼합된 동기 및 비동기 실행', () => {
    it('동기적인 then 핸들러와 비동기적인 then 핸들러가 혼합된 경우를 처리해야 합니다', async () => {
      const executor = vi.fn(() => 'a')
      const then1 = vi.fn((value: string) => Promise.resolve(value + 'b'))
      const then2 = vi.fn(() => 'c')

      const result = Chain(() => executor())
        .then(then1)
        .then(then2)
        .catch(() => 'd')
        .apply()

      expect(isPromiseLike(result)).toBe(true)
      await expect(result).resolves.toBe('c')
      expect(executor).toHaveBeenCalledTimes(1)
      expect(then1).toHaveBeenCalledWith('a')
      expect(then2).toHaveBeenCalledWith('ab')
    })

    it('동기적인 executor와 비동기적인 catch 핸들러가 혼합된 경우를 처리해야 합니다', async () => {
      const executor = vi.fn(() => 'a')
      const then1 = vi.fn(() => {
        throw new Error('then1 에러')
      })
      const catch1 = vi.fn(() => Promise.resolve('catch1 처리'))
      const catch2 = vi.fn(() => 'catch2 처리')

      const result = Chain(() => executor())
        .then(then1)
        .catch(catch1)
        .catch(catch2)
        .apply()

      expect(isPromiseLike(result)).toBe(true)
      await expect(result).resolves.toBe('catch1 처리')
      expect(executor).toHaveBeenCalledTimes(1)
      expect(then1).toHaveBeenCalledWith('a')
      expect(catch1).toHaveBeenCalledWith(new Error('then1 에러'))
      expect(catch2).not.toHaveBeenCalled()
    })

    it('비동기적인 executor와 동기적인 catch 핸들러가 혼합된 경우를 처리해야 합니다', async () => {
      const executor = vi.fn(() => Promise.reject('초기 에러'))
      const catch1 = vi.fn(() => 'catch1 처리')
      const catch2 = vi.fn(() => 'catch2 처리')

      const result = Chain(() => executor())
        .catch(catch1)
        .catch(catch2)
        .apply()

      expect(isPromiseLike(result)).toBe(true)
      await expect(result).resolves.toBe('catch1 처리')
      expect(executor).toHaveBeenCalledTimes(1)
      expect(catch1).toHaveBeenCalledWith('초기 에러')
      expect(catch2).not.toHaveBeenCalled()
    })
  })

  // 4. 에러 처리
  describe('에러 처리', () => {
    it('executor에서 에러가 발생하면 catch 핸들러가 이를 처리해야 합니다', () => {
      const executor = vi.fn(() => {
        throw new Error('executor 에러')
      })
      const catch1 = vi.fn(() => 'catch1 처리')

      const result = Chain(() => executor())
        .then(() => 'c')
        .catch(catch1)
        .apply()

      expect(result).toBe('catch1 처리')
      expect(executor).toHaveBeenCalledTimes(1)
      expect(catch1).toHaveBeenCalledWith(new Error('executor 에러'))
    })

    it('catch 핸들러가 없는 경우 에러가 전파되어야 합니다', () => {
      const executor = vi.fn(() => {
        throw new Error('executor 에러')
      })

      const ChainInstance = Chain(() => executor())

      expect(() => {
        const result = ChainInstance.apply()
        if (!isPromiseLike(result)) {
          throw result
        }
      }).toThrow('executor 에러')
      expect(executor).toHaveBeenCalledTimes(1)
    })

    it('catch 핸들러 내부에서 에러가 발생하면 다음 catch 핸들러로 전달해야 합니다', async () => {
      const executor = vi.fn(() => Promise.reject('초기 에러'))
      const catch1 = vi.fn(() => {
        throw 'catch1 에러'
      })
      const catch2 = vi.fn(() => 'catch2 처리')

      const result = Chain(() => executor())
        .catch(catch1)
        .catch(catch2)
        .apply()

      expect(isPromiseLike(result)).toBe(true)
      await expect(result).resolves.toBe('catch2 처리')
      expect(executor).toHaveBeenCalledTimes(1)
      expect(catch1).toHaveBeenCalledWith('초기 에러')
      expect(catch2).toHaveBeenCalledWith('catch1 에러')
    })

    it('모든 catch 핸들러가 에러를 처리하지 못하면 최종 에러가 전파되어야 합니다', async () => {
      const executor = vi.fn(() => Promise.reject('초기 에러'))
      const catch1 = vi.fn(() => {
        throw 'catch1 에러'
      })
      const catch2 = vi.fn(() => {
        throw 'catch2 에러'
      })

      const result = Chain(() => executor())
        .catch(catch1)
        .catch(catch2)
        .apply()

      expect(isPromiseLike(result)).toBe(true)
      await expect(result).rejects.toBe('catch2 에러')
      expect(executor).toHaveBeenCalledTimes(1)
      expect(catch1).toHaveBeenCalledWith('초기 에러')
      expect(catch2).toHaveBeenCalledWith('catch1 에러')
    })
  })

  // 5. 결과 타입 검증
  describe('결과 타입 검증', () => {
    it('모든 핸들러가 동기적인 경우, 최종 결과가 동기적으로 반환되어야 합니다', () => {
      const executor = vi.fn(() => 'a')
      const then1 = vi.fn(() => 'b')
      const then2 = vi.fn(() => 'c')

      const result = Chain(() => executor())
        .then(then1)
        .then(then2)
        .catch(() => 'd')
        .apply()

      expect(result).toBe('c')
      expect(typeof result).toBe('string')
    })

    it('하나 이상의 핸들러가 비동기적인 경우, 최종 결과가 Promise로 반환되어야 합니다', async () => {
      const executor = vi.fn(() => 'a')
      const then1 = vi.fn(() => Promise.resolve('b'))
      const then2 = vi.fn(() => 'c')

      const result = Chain(() => executor())
        .then(then1)
        .then(then2)
        .catch(() => 'd')
        .apply()

      expect(isPromiseLike(result)).toBe(true)
      await expect(result).resolves.toBe('c')
    })

    it('체인 후 타입이 올바르게 유지되어야 합니다', () => {
      const executor = vi.fn(() => 'a')
      const then1 = vi.fn(() => 42) // 문자열을 숫자로 변환
      const then2 = vi.fn(() => true) // 숫자를 불리언으로 변환

      const result = Chain(() => executor())
        .then(then1)
        .then(then2)
        .catch(() => 'd')
        .apply()

      expect(result).toBe(true)
      expect(typeof result).toBe('boolean')
    })
  })

  // 6. finally 메서드 테스트
  describe('finally 메서드', () => {
    it('성공적인 체인 실행 후 finally 핸들러가 호출되어야 합니다', () => {
      const executor = vi.fn(() => 'a')
      const then1 = vi.fn((value: string) => value + 'b')
      const then2 = vi.fn((value: string) => value + 'c')
      const finallyHandler = vi.fn(() => {})

      const result = Chain(() => executor())
        .then(then1)
        .then(then2)
        .finally(finallyHandler)
        .apply()

      expect(result).toBe('abc')
      expect(executor).toHaveBeenCalledTimes(1)
      expect(then1).toHaveBeenCalledWith('a')
      expect(then2).toHaveBeenCalledWith('ab')
      expect(finallyHandler).toHaveBeenCalledTimes(1)
    })

    it('에러가 발생한 체인 실행 후 finally 핸들러가 호출되어야 합니다', () => {
      const executor = vi.fn(() => 'a')
      const then1 = vi.fn(() => {
        throw new Error('then1 에러')
      })
      const catch1 = vi.fn(() => 'catch1 처리')
      const finallyHandler = vi.fn(() => {})

      const result = Chain(() => executor())
        .then(then1)
        .catch(catch1)
        .finally(finallyHandler)
        .apply()

      expect(result).toBe('catch1 처리')
      expect(executor).toHaveBeenCalledTimes(1)
      expect(then1).toHaveBeenCalledWith('a')
      expect(catch1).toHaveBeenCalledWith(new Error('then1 에러'))
      expect(finallyHandler).toHaveBeenCalledTimes(1)
    })

    it('비동기적인 체인 실행 후 finally 핸들러가 호출되어야 합니다', async () => {
      const executor = vi.fn(() => Promise.resolve('a'))
      const then1 = vi.fn((value: string) => value + 'b')
      const then2 = vi.fn((value: string) => Promise.resolve(value + 'c'))
      const finallyHandler = vi.fn(() => {})

      const result = Chain(() => executor())
        .then(then1)
        .then(then2)
        .finally(finallyHandler)
        .apply()

      expect(isPromiseLike(result)).toBe(true)
      await expect(result).resolves.toBe('abc')
      expect(executor).toHaveBeenCalledTimes(1)
      expect(then1).toHaveBeenCalledWith('a')
      expect(then2).toHaveBeenCalledWith('ab')
      expect(finallyHandler).toHaveBeenCalledTimes(1)
    })

    it('에러가 발생한 비동기적인 체인 실행 후 finally 핸들러가 호출되어야 합니다', async () => {
      const executor = vi.fn(() => Promise.resolve('a'))
      const then1 = vi.fn(() => Promise.reject('then1 에러'))
      const catch1 = vi.fn(() => 'catch1 처리')
      const finallyHandler = vi.fn(() => {})

      const result = Chain(() => executor())
        .then(then1)
        .catch(catch1)
        .finally(finallyHandler)
        .apply()

      expect(isPromiseLike(result)).toBe(true)
      await expect(result).resolves.toBe('catch1 처리')
      expect(executor).toHaveBeenCalledTimes(1)
      expect(then1).toHaveBeenCalledWith('a')
      expect(catch1).toHaveBeenCalledWith('then1 에러')
      expect(finallyHandler).toHaveBeenCalledTimes(1)
    })

    it('finally 핸들러가 동기 및 비동기 체인에서 모두 호출되어야 합니다', async () => {
      const executorSync = vi.fn(() => 'sync')
      const executorAsync = vi.fn(() => Promise.resolve('async'))
      const finallyHandlerSync = vi.fn(() => {})
      const finallyHandlerAsync = vi.fn(() => {})

      // 동기 체인 테스트
      const syncResult = Chain(() => executorSync())
        .then(value => value + ' Chain')
        .finally(finallyHandlerSync)
        .apply()

      expect(syncResult).toBe('sync Chain')
      expect(executorSync).toHaveBeenCalledTimes(1)
      expect(finallyHandlerSync).toHaveBeenCalledTimes(1)

      // 비동기 체인 테스트
      const asyncResult = Chain(() => executorAsync())
        .then(value => value + ' Chain')
        .finally(finallyHandlerAsync)
        .apply()

      expect(isPromiseLike(asyncResult)).toBe(true)
      await expect(asyncResult).resolves.toBe('async Chain')
      expect(executorAsync).toHaveBeenCalledTimes(1)
      expect(finallyHandlerAsync).toHaveBeenCalledTimes(1)
    })

    it('여러 개의 finally 핸들러가 순차적으로 호출되어야 합니다', async () => {
      const executor = vi.fn(() => Promise.resolve('a'))
      const then1 = vi.fn((value: string) => value + 'b')
      const finallyHandler1 = vi.fn(() => {})
      const finallyHandler2 = vi.fn(() => {})

      const result = Chain(() => executor())
        .then(then1)
        .finally(finallyHandler1)
        .finally(finallyHandler2)
        .apply()

      expect(isPromiseLike(result)).toBe(true)
      await expect(result).resolves.toBe('ab')
      expect(executor).toHaveBeenCalledTimes(1)
      expect(then1).toHaveBeenCalledWith('a')
      expect(finallyHandler1).toHaveBeenCalledTimes(1)
      expect(finallyHandler2).toHaveBeenCalledTimes(1)
    })
  })
})
