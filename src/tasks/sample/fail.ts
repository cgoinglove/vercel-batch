import { Job } from '@/lib/runner'
import { randomRange, wait } from '@/lib/shared'

export const SampleFailJob = Job.builder()
  .name('Sample Fail Job')
  .description('Process that fails with a certain probability')
  .step('Step 1', context => {
    context.logger('EXECUTED STEP 1')
    return wait(3000)
  })
  .step('Step 2', async context => {
    await wait(3000)
    if (true) throw new Error('Step 2 Error')
    return
  })
  .step('Step 3', context => {
    context.logger('EXECUTED STEP 3')
    return wait(3000)
  })
  .build()
