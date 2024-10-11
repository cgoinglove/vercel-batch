export const noop = () => {};

export const wait = (delay = 0) =>
  new Promise<void>(resolve => setTimeout(resolve, delay));

export const randomRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const isString = (value: any): value is string =>
  typeof value === 'string';

export const isFunction = <
  T extends (...args: any[]) => any = (...args: any[]) => any,
>(
  v: unknown,
): v is T => typeof v == 'function';

export const isObject = (value: any): value is Record<string, any> =>
  Object(value) === value;

export const isNull = (value: any): value is null | undefined => value == null;

export const isPromiseLike = (x: unknown): x is PromiseLike<unknown> =>
  isFunction((x as any)?.then);

export const randomId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const s = 1000;
const m = s * 60;
const h = m * 60;
const d = h * 24;

export const TIME = {
  SECONDS: (timestamp = 1) => s * timestamp,
  MINUTES: (timestamp = 1) => m * timestamp,
  HOURS: (timestamp = 1) => h * timestamp,
  DAYS: (timestamp = 1) => d * timestamp,
  WEEKS: (timestamp = 1) => d * 7 * timestamp,
  YEARS: (timestamp = 1) => d * 365 * timestamp,
};

export const formatDuration = (value?: number) => {
  if (isNull(value)) return '';
  if (value < 0) return '';
  const valid = (n: number) => n >= 1;
  if (valid(value / TIME.DAYS(1)))
    return `${Math.floor(value / TIME.DAYS(1))} days`;
  else if (valid(value / TIME.HOURS(1)))
    return `${Math.floor(value / TIME.HOURS(1))} hours`;
  else if (valid(value / TIME.MINUTES(1)))
    return `${Math.floor(value / TIME.MINUTES(1))}m ${Math.floor(
      (value % TIME.MINUTES(1)) / 1000,
    )}s`;
  else return `${Math.floor(value / TIME.SECONDS(1))} seconds`;
};
