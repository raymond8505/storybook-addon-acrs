import { AxeBuilder } from "@axe-core/playwright";
import { AxeResults } from "axe-core";
import playwright from "playwright";
import { type ScanProgress } from "src/hooks/useReportServer";
// Wait for all ongoing CSS transitions and animations to finish
async function waitForAnimationsAndTransitions(page: playwright.Page) {
  await page.evaluate(() => {
    function getActiveAnimationsCount() {
      let count = 0;
      const elements = document.querySelectorAll("*");
      elements.forEach((el) => {
        const computed = window.getComputedStyle(el);
        // Check for running animations
        if (
          computed.animationName !== "none" &&
          parseFloat(computed.animationDuration) > 0
        ) {
          count++;
        }
        // Check for running transitions
        if (
          computed.transitionProperty !== "all" &&
          computed.transitionProperty !== "none" &&
          parseFloat(computed.transitionDuration) > 0
        ) {
          count++;
        }
      });
      return count;
    }

    return new Promise((resolve) => {
      let timeout: NodeJS.Timeout;
      let remaining = getActiveAnimationsCount();
      if (remaining === 0) return resolve(0);

      function onEnd(e: Event) {
        remaining--;
        if (remaining <= 0) {
          clearTimeout(timeout);
          document.removeEventListener("transitionend", onEnd, true);
          document.removeEventListener("animationend", onEnd, true);
          resolve(0);
        }
      }

      document.addEventListener("transitionend", onEnd, true);
      document.addEventListener("animationend", onEnd, true);

      // Fallback in case events don't fire
      timeout = setTimeout(() => {
        document.removeEventListener("transitionend", onEnd, true);
        document.removeEventListener("animationend", onEnd, true);
        resolve(0);
      }, 500);
    });
  });
}
export interface ScanOptions {
  onProgress?: (progress?: ScanProgress) => void;
}

export interface ScanError {
  storyId: string;
  error: {
    message: string;
  };
}

export interface ScanMeta {
  timestamp: number;
  testEngine: AxeResults["testEngine"];
  testEnvironment: AxeResults["testEnvironment"];
  toolOptions: AxeResults["toolOptions"];
}
export interface ScanResult {
  results: StoryScanResult[];
  errors: ScanError[];
  meta: ScanMeta;
}

export type StoryScanResult = AxeResults & {
  meta?: { storyId: string; scanTime: number };
};
export type ExpectedParameters = Record<string, unknown> & {
  acr?: {
    delay?: number;
  };
  chromatic?: {
    delay?: number;
  };
  hasPlay?: boolean;
};
export async function runScan(
  stories: string[],
  options: ScanOptions = {
    onProgress: () => {},
  },
): Promise<ScanResult> {
  const results = [];
  const errors = [];
  const scanTimes = [];
  let startTime = new Date().getTime();
  const meta: Partial<ScanMeta> = { timestamp: startTime };

  //for(const s in [{id:'ava-chatinterface--default'}]) {
  for (const s in stories) {
    startTime = Date.now();

    const storyId = stories[s];
    const browser = await playwright.chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    const url = `http://localhost:6006/iframe.html?viewMode=story&id=${storyId}`;

    try {
      console.log(`Scanning story: ${storyId}`);
      await page.goto(url, {
        waitUntil: "load",
      });

      let parameters: ExpectedParameters = {};
      try {
        await page
          .locator("body")
          .waitFor({ state: "visible", timeout: 10000 });
        await page.waitForSelector("#storybook-parameters", {
          timeout: 10000,
          state: "attached",
        });

        parameters = await page.evaluate(() => {
          return window.storyParameters;
        });

        await waitForAnimationsAndTransitions(page);

        const delay =
          parameters?.acr?.delay ?? parameters?.chromatic?.delay ?? undefined;

        if (delay) {
          console.log(`Story has ${delay}ms delay`);
          await page.waitForTimeout(delay);
        }

        if (parameters?.hasPlay) {
          console.log("Story has play function");
          await page.evaluate(() => {
            return window.playFunction({
              canvasElement: document.querySelector("#storybook-root"),
            });
          });
        }
      } catch (e) {
        console.error(storyId, e);
        errors.push({
          storyId,
          error: {
            message: e.message,
          },
        });
      } finally {
        const builder = new AxeBuilder({ page });

        const result: StoryScanResult = await builder
          .options({
            resultTypes: ["violations", "incomplete"],
          })
          .analyze();

        meta.testEngine = result.testEngine;
        meta.testEnvironment = result.testEnvironment;
        meta.toolOptions = result.toolOptions;

        const endTime = Date.now();
        const scanTime = endTime - startTime;
        scanTimes.push(scanTime);
        const estimatedMSRemaining =
          (scanTimes.reduce((a, b) => a + b, 0) / scanTimes.length) *
          (stories.length - scanTimes.length);

        result.meta = {
          storyId,
          scanTime,
        };

        results.push(result);
        options.onProgress({
          currentIndex: Number(s),
          currentId: storyId,
          total: stories.length,
          progress: Number(s) / stories.length,
          estimatedMSRemaining,
        });

        console.log(`Scan completed for story: ${storyId} (${scanTime}ms)`);
      }
    } catch (e) {
      console.error("Error running axe scan", storyId, e);
    }

    await browser.close();
  }

  return { results, errors, meta: meta as ScanMeta };
}
