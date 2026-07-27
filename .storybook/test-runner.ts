import { injectAxe, checkA11y } from "axe-playwright";
import type { TestRunnerConfig } from "@storybook/test-runner";

const config: TestRunnerConfig = {
  async preVisit(page, context) {
    // Dynamically set viewport size depending on whether the story is a mobile test
    if (context.id.toLowerCase().includes("mobile")) {
      await page.setViewportSize({ width: 375, height: 667 });
    } else {
      await page.setViewportSize({ width: 1280, height: 720 });
    }
    // Inject axe-core into the page before visiting
    await injectAxe(page);
  },
  async postVisit(page, context) {
    // 1. Run accessibility checks on every story
    await checkA11y(page, "#storybook-root", {
      detailedReport: true,
      detailedReportOptions: { html: true },
    });

    // 2. Perform DOM Snapshot assertion
    const html = await page.content();
    // We expect standard jest-snapshot matchers to compare snapshots of components
    // @ts-ignore
    expect(html).toMatchSnapshot();
  },
};

export default config;
