export type AsyncChecker = (ctx: any, value: any) => Promise<boolean>;

const registry = new Map<string, AsyncChecker>();

export const asyncCheckers = {
  register(name: string, checker: AsyncChecker) {
    registry.set(name, checker);
  },
  get(name: string): AsyncChecker | undefined {
    return registry.get(name);
  },
};
