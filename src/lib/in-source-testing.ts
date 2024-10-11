export const TEST = (code: (context: typeof import('vitest')) => any) => {
  if (process.env.NODE_ENV != 'production' && import.meta.vitest)
    code(import.meta.vitest);
};
