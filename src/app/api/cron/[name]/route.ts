import { executeJobAndWait } from '@/app/actions/job.action'

const verify = () => true

export const GET = async (request: Request, { params }: { params: { name: string } }) => {
  if (!verify()) throw new Error('unauthorized')

  await executeJobAndWait(params.name, 'cron')
  return Response.json({ success: true })
}
