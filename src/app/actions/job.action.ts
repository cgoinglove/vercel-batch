'use server'

import { Chain } from '@/lib/chain'
import { noop } from '@/lib/shared'
import { HistoryService } from '@/service/history.service'
import { EmailClassifyJob } from '@/tasks/email-classify'
import { SampleFailJob } from '@/tasks/sample/fail'
import { SampleJob } from '@/tasks/sample/success'
import { YoutubeShortsGenerateJob } from '@/tasks/youtube-content'

const jobs = [EmailClassifyJob, YoutubeShortsGenerateJob, SampleJob, SampleFailJob]

const service = new HistoryService()

const get = (name: string) => {
  const job = jobs.find(job => job.name == name)
  if (!job) throw new Error(`[${name}] Not Found Job.`)
  return job
}

const execute = (name: string, executor?: string) => {
  const job = get(name)
  return Chain(() => job.execute())
    .catch(noop) // vercel error issue
    .then(() => job.getStatus() as JOBStatus<EndedStatus>)
    .finally(() => {
      service.saveHistory(job.getStatus() as JOBStatus<EndedStatus>, executor)
    })
    .apply()
}

export async function executeJob(name: string, executor?: string) {
  execute(name, executor)
  return Promise.resolve()
}
export async function executeJobAndWait(
  name: string,
  executor?: string,
): Promise<JOBStatus<EndedStatus>> {
  return execute(name, executor)
}
export async function queryJobs() {
  const response = jobs.map(job => job.getStatus())
  return Promise.resolve(response)
}
export async function queryHistories(name: string) {
  return service.queryHistory(name)
}
