'use client';

import Icon from '@mdi/react';
import dayjs from 'dayjs';
import {
  mdiAutorenew,
  mdiClockTimeEightOutline,
  mdiLoading,
  mdiArrowRightCircle,
} from '@mdi/js';

import React, { useCallback, useMemo, useState } from 'react';

import {
  BackgroundColorByStatus,
  ColorWithJob,
  IconByStatus,
  TextColorByStatus,
} from '@/style/status.style';
import { JobActions } from '@/app/actions/job.action';
import { Chain } from '@/lib/chain';
import { formatDuration, isNull, isObject } from '@/lib/shared';
import TickTime from '../tick-time';

interface Props {
  job: JOBStatus;
  fetchData: () => Promise<void>;
}

const SESSION_USER = 'cgoing';

export function JobCard({ job, fetchData }: Props) {
  const [loading, setLoading] = useState(false);
  const { name, description, thread, status } = job;

  const execute = useCallback(() => {
    Chain(setLoading.bind(null, true))
      .then(JobActions.executeJob.bind(null, name, SESSION_USER))
      .then(fetchData)
      .finally(setLoading.bind(null, false))
      .apply();
  }, [name]);

  const message = useMemo(() => {
    if (job.status == 'FAIL') return job.error?.message;
    if (job.status == 'RUNNING') {
      const runningStep = job.thread.find(step => step.status == 'RUNNING');
      const log = runningStep?.logs.at(-1);
      return (isObject(log) ? JSON.stringify(log) : log) || runningStep?.name;
    }
  }, [job]);

  const isRunning = useMemo(() => status == 'RUNNING', [status]);

  return (
    <div className="h-full relative flex flex-col overflow-hidden hover:bg-white/5 text-xs shadow-md px-6 md:px-12 py-10 cursor-pointer w-full group transition-all">
      {loading && (
        <div className="transition-all absolute cursor-default left-0 z-20 w-full h-full top-0 flex items-center justify-center backdrop-blur-sm">
          <Icon path={mdiLoading} size={3} className="animate-spin" />
        </div>
      )}

      <div className="mb-6">
        <div className="mb-2 items-center flex">
          <h2 className="font-bold text-white text-2xl mr-auto">{name}</h2>
        </div>
        <p className="text-base line-clamp-2">{description}</p>
      </div>
      <div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-white font-bold">Status</span>
          <div
            className={`${TextColorByStatus(status)} ${BackgroundColorByStatus(
              status,
            )} px-3 rounded-full flex gap-1 items-center text-xs font-semibold py-1`}
          >
            <Icon
              path={IconByStatus(status)}
              size={0.5}
              className={`${TextColorByStatus(status)} ${
                status == 'RUNNING' ? 'animate-spin' : ''
              }`}
            />
            {status}
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <span className="text-white font-bold">Start Time</span>
          <span>
            {job.status != 'READY'
              ? dayjs(job.startedAt).format('MMMM D, HH:mm')
              : '-'}
          </span>
        </div>
        <div className="mt-4 flex justify-between">
          <span className="text-white font-bold">Duration</span>
          <div className={` ${status == 'FAIL' ? 'text-red-400' : ''}`}>
            {!isNull(job.duration) ? (
              <div className="flex items-center gap-1">
                <Icon path={mdiClockTimeEightOutline} size={0.6} />
                {status == 'RUNNING' ? (
                  <TickTime time={job.duration} />
                ) : (
                  formatDuration(job.duration)
                )}
              </div>
            ) : (
              '-'
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <span className="text-white font-bold">Feedback</span>
          <span
            className={`max-w-[80%] ${
              status == 'FAIL' && message ? 'text-red-400' : ''
            } truncate`}
          >
            {message || '-'}
          </span>
        </div>
      </div>
      <div className="mt-6 px-8 py-4 rounded-lg h-full relative overflow-hidden ring bg-background">
        {thread.map((step, i) => {
          return (
            <div className="relative" key={step.name}>
              <div className="flex items-center ">
                <div
                  className={`${ColorWithJob(status).TextColorByStatus(
                    step.status,
                  )} ${ColorWithJob(status).BackgroundColorByStatus(
                    step.status,
                  )} ${ColorWithJob(status).RingColorByStatus(
                    step.status,
                  )} ring relative rounded-full w-4 h-4 p-0.5 flex items-center justify-center`}
                >
                  <Icon
                    className={
                      step.status == 'RUNNING' ? 'animate-spin z-10' : ''
                    }
                    path={IconByStatus(step.status)}
                    size={1}
                  />
                  {step.status == 'RUNNING' && (
                    <div
                      className={`absolute animate-ping -left-0.5 -top-0.5 rounded-full w-5 h-5 p-0.5 flex items-center justify-center bg-white/80 `}
                    />
                  )}
                </div>
                <span
                  className={`ml-6 ${
                    step.status == 'RUNNING' ? 'text-white font-bold' : ''
                  }`}
                >
                  {step.name}
                </span>
                <span className={`ml-auto`}>
                  {step.status == 'RUNNING' ? (
                    <TickTime time={step.duration} />
                  ) : (
                    formatDuration(step.duration)
                  )}
                </span>
              </div>
              {i != thread.length - 1 && (
                <div
                  className={`ml-[7px] w-[2px] h-6  -z-10 ${
                    step.status === 'SUCCESS' && status != 'FAIL'
                      ? 'bg-green-400'
                      : 'bg-white/50'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="pt-4 mt-auto">
        <button
          onClick={e => {
            e.preventDefault();
            execute();
          }}
          disabled={isRunning}
          className={`${
            isRunning ? 'text-background bg-white' : 'text-white bg-background'
          } flex items-center justify-center gap-1 disabled:hover:cursor-not-allowed hover:bg-white hover:text-black ring py-2 w-full font-semibold text-md rounded-lg `}
        >
          {isRunning ? (
            <>
              <Icon
                className="animate-spin"
                path={mdiAutorenew}
                size={0.6}
              ></Icon>
              Running
            </>
          ) : (
            <>
              <h1>Execute</h1>
              <Icon
                className="ml-1"
                path={mdiArrowRightCircle}
                size={0.7}
              ></Icon>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
