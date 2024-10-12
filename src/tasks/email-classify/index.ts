import { Job } from '@/lib/runner'
import { wait } from '@/lib/shared'

export const EmailClassifyJob = Job.builder()
  .name('Email Classifier')
  .description('The Email Classifier automatically processes and categorizes incoming emails')
  .step('Gmail Query', async context => {
    await wait(1000)
    context.logger('Fetching emails from Google.')
    await wait(1000)
    context.logger('3 new emails retrieved.')

    return wait(1000)
  })
  .step('Initial Classification', async context => {
    await wait(1000)
    context.logger('Automatically classifying emails using predefined rules or algorithms.')
    await wait(1000)
    context.logger('1 labeled as Business, 1 labeled as Promotions, 1 Uncategorized.')
  })
  .step('GPT Classification Fallback', async context => {
    context.logger(
      'If initial classification is unsuccessful, using GPT to analyze and classify the email.',
    )
    return wait(3000).then(() => context.payload)
  })
  .step('Notion Update', context => {
    context.logger('Authenticating with Notion.')
    context.logger('Adding or updating classified email data in the Notion table.')
    return wait(3000).then(() => context.payload)
  })
  .step('Send Email', context => {
    context.logger('Sending Success Email to neo.cgoing.')
    context.logger('Total of 3 emails classified.')
    return wait(3000).then(() => context.payload)
  })
  .build()
