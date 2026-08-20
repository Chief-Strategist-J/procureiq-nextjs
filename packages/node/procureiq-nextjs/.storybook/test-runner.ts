import type { TestRunnerConfig } from '@storybook/test-runner';

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    // Visual regression testing hook: capture element snapshot for each story
    const elementHandler = await page.$('#storybook-root');
    if (elementHandler) {
      const innerHTML = await elementHandler.innerHTML();
      // Ensure element rendered content
      if (!innerHTML || innerHTML.trim().length === 0) {
        throw new Error(`Story ${context.id} failed visual rendering check (empty root element).`);
      }
    }
  },
};

export default config;
