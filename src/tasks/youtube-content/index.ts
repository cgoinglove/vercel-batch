import { Job } from '@/lib/runner';
import { wait } from '@/lib/shared';

export const YoutubeShortsGenerateJob = Job.builder()
  .name('YouTube Shorts Generator with GPT')
  .description(
    'This job automatically generates YouTube Shorts videos using GPT for content creation.',
  )
  .step('Content Fetch via GPT', async context => {
    await wait(1000);
    context.logger('Using GPT to generate content for YouTube Shorts.');
    await wait(1000);
    context.logger('Search Docuemnts');
    await wait(1000);
    context.logger('Generagting Image For Video');
  })
  .step('Video Generation', async context => {
    context.logger(
      'Generating YouTube Shorts video from the GPT-generated content.',
    );
    await wait(5000);
  })
  .step('Retry on Failure', async context => {
    context.logger('Retrying video generation if the initial attempt failed.');
    await wait(5000);
  })
  .step('Upload to YouTube', async context => {
    await wait(1000);
    context.logger('Uploading the generated video to YouTube Shorts.');
    await wait(1000);
    context.logger('Title Is Hello World');
    await wait(1000);
    context.logger("Description: I Don't Care, But i miss you");
    await wait(1000);
    context.logger('Selected Thumbnail Image');
    await wait(1000);
    context.logger('Access Cgoing Youtube Chanel');
  })
  .step('Send Success Email', context => {
    context.logger('Sending success email after video upload.');
    return wait(3000);
  })
  .build();
