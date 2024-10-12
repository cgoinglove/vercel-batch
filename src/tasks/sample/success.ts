import { Job } from '@/lib/runner'
import { wait } from '@/lib/shared'

export const SampleJob = Job.builder()
  .name('Sample Sucess Job')
  .description('Should Be Success Process')
  .step('Step 1', context => {
    context.logger('EXECUTED STEP 1')
    return wait(3000)
  })
  .step('Step 2', context => {
    context.logger({ data: 'EXECUTED STEP 2' })
    return wait(3000)
  })
  .step('Step 3', context => {
    context.logger('EXECUTED STEP 3')
    return wait(3000)
  })
  .build()
