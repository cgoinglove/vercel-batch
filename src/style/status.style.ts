import { mdiAutorenew, mdiCheckBold, mdiCloseThick, mdiLock } from '@mdi/js';

export const TextColorByStatus = (status: StatusType) => {
  switch (status) {
    case 'FAIL':
      return 'text-red-400';
    case 'SUCCESS':
      return 'text-green-400';
    default:
      return 'text-neutral-400';
  }
};
export const BackgroundColorByStatus = (status: StatusType) => {
  switch (status) {
    case 'FAIL':
      return 'bg-red-400/20';
    case 'SUCCESS':
      return 'bg-green-400/20';
    default:
      return 'bg-neutral-400/20';
  }
};
export const RingColorByStatus = (status: StatusType) => {
  switch (status) {
    case 'FAIL':
      return 'ring-red-400';
    case 'SUCCESS':
      return 'ring-green-400';
    default:
      return 'ring-neutral-600';
  }
};
export const IconByStatus = (status: StatusType) => {
  switch (status) {
    case 'FAIL':
      return mdiCloseThick;
    case 'SUCCESS':
      return mdiCheckBold;
    case 'RUNNING':
      return mdiAutorenew;
    default:
      return mdiLock;
  }
};

export const ColorWithJob = (job: StatusType) => {
  return {
    TextColorByStatus: (step: StatusType) =>
      job != 'FAIL'
        ? TextColorByStatus(step)
        : TextColorByStatus(step != 'FAIL' ? 'READY' : step),
    BackgroundColorByStatus: (step: StatusType) =>
      job != 'FAIL'
        ? BackgroundColorByStatus(step)
        : BackgroundColorByStatus(step != 'FAIL' ? 'READY' : step),
    RingColorByStatus: (step: StatusType) =>
      job != 'FAIL'
        ? RingColorByStatus(step)
        : RingColorByStatus(step != 'FAIL' ? 'READY' : step),
  } as const;
};
