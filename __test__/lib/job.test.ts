import { Job, STATUS } from '@/lib/runner';
import { describe, it, expect } from 'vitest';

const createJob = (steps: { name: string; task: Func }[]) => {
  const builder = Job.builder()
    .name('빌드 작업')
    .description('테스트 작업 설명');
  steps.forEach(step => builder.step(step.name, step.task));
  return builder.build();
};

describe('Job 클래스', () => {
  describe('Job 빌더', () => {
    it('Job 빌더를 사용하여 Job을 올바르게 생성해야 합니다', () => {
      const job = Job.builder()
        .name('빌드 작업')
        .description('테스트 작업 설명')
        .step('스텝1', ({ logger }) => {
          logger('스텝1 로그1');
          return '결과1';
        })
        .step('스텝2', ({ logger }) => {
          logger('스텝2 로그1');
          return '결과2';
        })
        .build();

      expect(job).toBeInstanceOf(Job);
      expect(job.name).toBe('빌드 작업');
      expect(job.description).toBe('테스트 작업 설명');
      expect(job['thread']).toHaveLength(2);
      expect(job['thread'][0].name).toBe('스텝1');
      expect(job['thread'][1].name).toBe('스텝2');
    });

    it('중복된 스텝 이름을 추가하려고 하면 에러를 던져야 합니다', () => {
      const builder = Job.builder().name('중복 테스트').description('설명');

      builder.step('스텝1', () => '결과1');

      expect(() => {
        builder.step('스텝1', () => '결과2');
      }).toThrow('중복된 Step 이름 사용 금지.');
    });
  });

  describe('Job 상태 검증', () => {
    it('Job 상태가 올바르게 업데이트되어야 합니다', async () => {
      const job = createJob([
        {
          name: '스텝1',
          task: () => '결과1',
        },
        {
          name: '스텝2',
          task: () => '결과2',
        },
      ]);

      // 초기 상태 확인
      let status = job.getStatus();
      expect(status.status).toBe(STATUS.ready().status);
      expect(status.thread[0].status).toBe(STATUS.ready().status);
      expect(status.thread[1].status).toBe(STATUS.ready().status);

      // Job 실행
      await job.execute();

      // 실행 후 상태 확인
      status = job.getStatus();
      expect(status.status).toBe('SUCCESS');
      expect(status.thread[0].status).toBe('SUCCESS');
      expect(status.thread[1].status).toBe('SUCCESS');
    });

    it('스텝 실행 중 에러가 발생하면 Job 상태가 실패로 업데이트되어야 합니다', async () => {
      const job = createJob([
        {
          name: '스텝1',
          task: () => '결과1',
        },
        {
          name: '스텝2',
          task: () => {
            throw new Error('스텝2 에러');
          },
        },
      ]);

      try {
        job.execute();
      } catch {}

      const status = job.getStatus();
      expect(status.status).toBe('FAIL');
      expect(status.thread[0].status).toBe('SUCCESS');
      expect(status.thread[1].status).toBe('FAIL');
    });
  });
});
