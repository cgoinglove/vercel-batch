'use client';

import CrossLine from '@/components/cross-line';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { JobActions } from './actions/job.action';
import { Chain } from '@/lib/chain';
import BrowserSkeleton from '@/components/job/browser-skeleton';
import JobCardSkeleton from '@/components/job/job-card-skeleton';
import { JobCard } from '@/components/job/job-card';

export default function Page() {
  const [jobs, setJobs] = useState<JOBStatus[]>([]);

  const [loading, setLoading] = useState(true);

  const oneTime = useRef(true);

  const fetchData = useCallback(() => {
    return Chain(setLoading.bind(null, true))
      .then(JobActions.queryJobs)
      .then(setJobs)
      .finally(() => {
        oneTime.current = false;
        setLoading(false);
      })
      .apply();
  }, []);

  useEffect(() => {
    let timmer!: ReturnType<typeof setTimeout>;

    const polling = () =>
      fetchData()
        .then(() => {
          timmer = setTimeout(() => {
            polling();
          }, 3000);
        })
        .catch(() => {
          clearTimeout(timmer);
        });

    polling();
    return () => {
      clearTimeout(timmer);
    };
  }, []);

  return (
    <main className="flex flex-col">
      <div className="w-full relative border-b px-12 py-20 text-2xl hover:bg-white/5">
        <CrossLine className="absolute z-50 -left-[11px] -top-[11px]" />
        <div className="absolute -z-10 inset-0 w-full h-full flex justify-center">
          <div className="w-1/3 border-x" />
        </div>
        <span className="text-white font-bold">
          Effortless job management.{' '}
        </span>
        Schedule, monitor and control
        <br />
        your tasks seamlessly
        <div className="-z-10 absolute inset-0 w-full items-end justify-end hidden lg:flex">
          <div className="w-1/3 h-4/5 px-10 translate-y-2">
            <BrowserSkeleton />
          </div>
        </div>
      </div>
      <div className="h-16 border-b relative hover:bg-white/5 transition-colors px-16">
        <div className="w-full h-full border-x"></div>
        <CrossLine className="absolute -right-[11px] -top-[11px] z-50" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 auto-cols-auto">
        {loading &&
          oneTime.current &&
          Array(2)
            .fill(JobCardSkeleton)
            .map((Suspense, i) => (
              <div
                className={i % 2 ? 'border-b' : 'md:border-r border-b'}
                key={i}
              >
                <Suspense />
              </div>
            ))}
        {jobs.length ? (
          jobs.map((job, i) => (
            <Link
              href={`/history/${job.name}`}
              key={job.name}
              className={i % 2 ? 'border-b' : 'md:border-r border-b'}
            >
              <JobCard key={job.name} job={job} fetchData={fetchData} />
            </Link>
          ))
        ) : !loading ? (
          <div className="flex items-center justify-center h-[500px] col-span-2">
            <h1 className="font-bold text-4xl">No Jobs</h1>
          </div>
        ) : null}
      </div>
    </main>
  );
}
