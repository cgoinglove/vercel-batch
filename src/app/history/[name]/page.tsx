'use client'

import { queryHistories } from '@/app/actions/job.action'
import CrossLine from '@/components/cross-line'
import History from '@/components/history/history'
import { Chain } from '@/lib/chain'
import { useCallback, useEffect, useState } from 'react'

export default function Page({ params }: { params: { name: string } }) {
  const [loading, setLoading] = useState(false)

  const [histories, setHistories] = useState<JobHistory[]>([])

  const [select, setSelect] = useState<string>()

  const onClickHandler = useCallback((id: string) => {
    setSelect(prev => (prev == id ? undefined : id))
  }, [])

  useEffect(() => {
    Chain(setLoading.bind(null, true))
      .then(() => queryHistories(decodeURIComponent(params.name)))
      .then(setHistories)
      .finally(setLoading.bind(null, false))
      .apply()
  }, [])

  return (
    <div className='border-b text-sm'>
      <div className='relative'>
        <div className='absolute  inset-0 w-full md:px-20 -z-10'>
          <div className='h-full border-x'></div>
        </div>
        <div className='py-20'>
          <div className='border-y md:px-20 '>
            <h1 className='px-4 md:px-0 relative py-14 text-4xl bg-white/5 font-bold text-white text-center'>
              <CrossLine className='absolute -right-[11px] -bottom-[11px] ' />
              <CrossLine className='absolute -left-[11px] -top-[11px] ' />
              {decodeURI(params.name)}
            </h1>
          </div>
        </div>
      </div>
      <div className='overflow-hidden'>
        {loading ? (
          <div>Loading</div>
        ) : histories.length ? (
          histories.map(history => (
            <History
              key={history.id}
              onClick={onClickHandler.bind(null, history.id)}
              select={select == history.id}
              history={history}
            />
          ))
        ) : (
          <div className='flex border-t items-center justify-center p-6'>
            <h1 className='mr-2 text-center my-44 font-bold text-white text-4xl'>No Histories</h1>
          </div>
        )}
      </div>
    </div>
  )
}
