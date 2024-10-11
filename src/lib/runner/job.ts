import { noop } from '@/lib/shared';
import { Chain } from '@/lib/chain';
import { Runner } from './runner';

type Step = {
  runner: Runner;
  name: string;
};

type StepTask<T, U> = (
  context: T extends Nothing
    ? { logger: Func<[Serializable], void> }
    : { logger: Func<[Serializable], void>; payload: T },
) => U;

interface JobBuild<T = Nothing> {
  build(): Job<T>;
  name(name: string): JobBuild<T>;
  description(description: string): JobBuild<T>;
  step<U>(name: string, task: StepTask<Awaited<T>, U>): JobBuild<U>;
}

export class Job<T = any> extends Runner<() => T> {
  private logs: Array<{ name: string; log: Serializable[] }> = [];
  private constructor(
    public readonly name: string,
    public readonly description: string,
    private thread: Step[],
  ) {
    super();

    this.task = () => {
      this.init();
      return this.thread
        .reduce(
          (beforeStep, currentStep, i) =>
            beforeStep.then(payload =>
              currentStep.runner.execute({
                payload,
                logger: (data: Serializable) => {
                  this.logs[i].log.push(data);
                },
              }),
            ),
          Chain(noop),
        ) // first step noop
        .apply();
    };
  }
  private init() {
    this.logs = [];
    this.thread.forEach(step => {
      step.runner.reset();
      this.logs.push({
        name: step.name,
        log: [],
      });
    });
  }
  getStatus(): JOBStatus {
    return {
      ...super.getStatus(),
      thread: this.thread.map((step, i) => ({
        ...step.runner.getStatus(),
        name: step.name,
        logs: this.logs[i]?.log ?? [],
      })),
      name: this.name,
      description: this.description,
    };
  }
  static builder(): JobBuild {
    const field = {
      name: '',
      description: '',
      steps: [] as Step[],
    };
    const getBuilder = (): JobBuild => ({
      build() {
        return new Job(field.name, field.description, field.steps);
      },
      name(name: string) {
        field.name = name;
        return getBuilder();
      },
      description(description: string) {
        field.description = description;
        return getBuilder();
      },
      step(name, task) {
        if (field.steps.some(step => step.name == name))
          throw new Error('중복된 Step 이름 사용 금지.');
        const step = { runner: new Runner(task), name };
        field.steps.push(step);
        return getBuilder() as JobBuild<Awaited<any>>;
      },
    });
    return getBuilder();
  }
}
