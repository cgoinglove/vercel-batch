import Switch from '@/components/switch'
import { mdiCreation } from '@mdi/js'
import Icon from '@mdi/react'

export default function BrowserSkeleton() {
  return (
    <div className='relative w-full h-full bg-gradient-to-b from-ring to-transparent rounded-lg p-[1px]'>
      <div className='w-full h-full bg-gradient-to-b from-background to-transparent rounded-lg overflow-hidden px-3 py-2'>
        <div className='w-full flex gap-1 mb-6'>
          <div className='w-2 h-2 rounded-full bg-gray-soft' />
          <div className='w-2 h-2 rounded-full bg-gray' />
          <div className='w-2 h-2 rounded-full bg-gray' />
        </div>
        <div className='px-1 flex flex-col'>
          <div className='ring ring-teal-400 text-teal-400 bg-teal-400/10 rounded flex p-3 items-center justify-between'>
            <Icon path={mdiCreation} className='animate-pulse' size={0.8} />
            <div className=''>
              <div className='flex mb-1'>
                <div className='rounded-full mr-1 px-4 py-[2px] bg-teal-400'></div>
                <div className='rounded-full px-4 py-[2px] bg-teal-400'></div>
              </div>
              <div className='flex'>
                <div className='rounded-full mr-1 px-3 py-[2px] bg-teal-400'></div>
                <div className='rounded-full mr-1 px-2 py-[2px] bg-teal-400'></div>
                <div className='rounded-full px-5 py-[2px] bg-teal-400'></div>
              </div>
            </div>
            <div className='rounded-lg mr-1 px-7 py-1.5 bg-teal-400'></div>
          </div>
          <div className='animate-pulse flex mt-3 gap-2'>
            <div className='h-4 rounded bg-gray w-1/3'></div>
            <div className='h-4 rounded bg-gray-soft w-2/3'></div>
          </div>
          <div className='animate-pulse flex mt-2 gap-2'>
            <div className=' h-8 rounded bg-gradient-to-b from-neutral-900 w-1/3'></div>
            <div className='h-8 rounded bg-gradient-to-b from-gray-soft w-2/3'></div>

            <div className='h-8 rounded bg-gradient-to-b from-neutral-900 w-2/3'></div>
          </div>
        </div>
      </div>
      <div className='scale-75 rounded-xl absolute -right-6 top-[55%] ring bg-background p-4 flex items-center'>
        <span className='text-xs font-bold mr-2'>Scheduler</span>
        <Switch checked />
      </div>
    </div>
  )
}
