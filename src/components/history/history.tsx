'use client';

import { formatDuration, isObject } from '@/lib/shared';
import {
  BackgroundColorByStatus,
  ColorWithJob,
  IconByStatus,
  RingColorByStatus,
  TextColorByStatus,
} from '@/style/status.style';
import {
  mdiCalendar,
  mdiCheck,
  mdiChevronDown,
  mdiClockTimeEightOutline,
} from '@mdi/js';
import Icon from '@mdi/react';

import dayjs from 'dayjs';
import { ReactNode, useMemo } from 'react';

interface Props {
  history: JobHistory;
  select?: boolean;
  onClick(id: string): void;
}

export default function History({ onClick, history, select }: Props) {
  const flatLogs = useMemo<ReactNode[]>(() => {
    return history.thread
      .flatMap(step => {
        const lines: any[] = [];
        if (step.status == 'READY') return [];
        lines.push(
          <p className="px-6 flex items-center">
            {`Starting...`}{' '}
            <span className="ml-2 text-blue-500">{step.name}</span>
          </p>,
        );

        lines.push(
          ...step.logs
            .flatMap(line => {
              return isObject(line)
                ? JSON.stringify(line, null, 2).split('\n')
                : line;
            })
            // eslint-disable-next-line react/jsx-key
            .map((line: ReactNode) => <p className="px-6">{line}</p>),
        );

        if (step.error) {
          if (step.error.stack) {
            step.error.stack.split('\n').forEach(line => {
              lines.push(
                <p className="px-6 bg-red-400/20 text-red-400">{line}</p>,
              );
            });
          } else {
            lines.push(
              <p className="px-6 bg-red-400/20 text-red-400">
                {step.error.name}:{step.error.message}
              </p>,
            );
          }
        } else {
          lines.push(
            <p className="flex items-center px-6 mb-4">
              <Icon
                path={mdiCheck}
                className="mr-2 text-green-400"
                size={0.6}
              />
              {`finished at ${dayjs(step.finishedAt).format(
                'YYYY-MM-DDTHH:mm',
              )}`}
            </p>,
          );
        }

        return lines;
      })
      .map((line, i) => (
        <div className="hover:bg-white/20" key={i}>
          {line}
        </div>
      ));
  }, [history?.thread]);

  return (
    <div className={`md:px-20 border-t`}>
      <div
        onClick={onClick.bind(null, history.id)}
        className={`${
          select ? 'bg-white/5' : ''
        } border-x w-full px-6 py-4 cursor-pointer hover:bg-neutral-500/10 flex items-center justify-between flex-col md:flex-row`}
      >
        <div className="w-full">
          <div className="flex items-center">
            <div
              className={`${RingColorByStatus(
                history.status,
              )} ${TextColorByStatus(history.status)} ${BackgroundColorByStatus(
                history.status,
              )} mr-2 w-5 h-5 ring rounded-full  p-[2px]`}
            >
              <Icon path={IconByStatus(history.status)} />
            </div>
            <span className="text-white font-bold">
              {dayjs(history.startedAt).format('MM-DD  HH:mm')}
            </span>
          </div>
          <span className="ml-7 text-xs">#{history.id.slice(0, 8)}</span>
        </div>
        <div className="flex items-center justify-between w-full md:w-1/2 mt-6 md:mt-0">
          <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-500 font-semibold text-xs">
            #{history.executor}
          </span>
          <div className="text-xs mx-8">
            <div className="flex items-center">
              <Icon path={mdiCalendar} size={0.5} />
              <span className="ml-0.5">{formatDuration(history.duration)}</span>
            </div>
            <div className="flex items-center mt-1">
              <Icon path={mdiClockTimeEightOutline} size={0.5} />
              <span className="ml-0.5">
                {formatDuration(
                  Date.now() - (history.finishedAt || history.startedAt!),
                )}{' '}
                ago
              </span>
            </div>
          </div>
          <div
            className={`transition-all w-7 h-7 p-1 rounded-full hover:bg-white/10 ${
              select ? 'rotate-180' : ''
            }`}
          >
            <Icon path={mdiChevronDown} />
          </div>
        </div>
      </div>
      {select && (
        <div className="bg-white/5 border-t border-x grid grid-cols-1 md:grid-cols-2 md:max-h-[450px] overflow-y-auto">
          <div className="flex flex-col relative py-8 ml-8 md:ml-12">
            <div className="absolute inset-0 border-l border-dashed border-neutral-700" />
            <div className="sticky left-0 top-0">
              {history.thread.map(step => (
                <div className={`-translate-x-[9px]`} key={step.name}>
                  <div className="flex items-center select-none py-6">
                    <div
                      className={`${ColorWithJob(
                        history.status,
                      ).BackgroundColorByStatus(step.status)} ${ColorWithJob(
                        history.status,
                      ).TextColorByStatus(step.status)} ${ColorWithJob(
                        history.status,
                      ).RingColorByStatus(
                        step.status,
                      )} ring w-5 h-5 rounded-full mr-2 p-[2px]`}
                    >
                      <Icon path={IconByStatus(step.status)} />
                    </div>
                    <h1
                      className={`${
                        status != 'READY' ? 'text-white' : ''
                      } text-base font-bold`}
                    >
                      {step.name}
                    </h1>
                    <span className="text-xs ml-auto mr-4">
                      {formatDuration(step.duration)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full border-l-0 md:border-l border-t md:border-t-0 h-full relative">
            <div className={`min-h-20 text-neutral-500 py-8 text-xs`}>
              {flatLogs}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
