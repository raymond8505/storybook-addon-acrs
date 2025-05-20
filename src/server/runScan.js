import { AxeBuilder } from '@axe-core/playwright';
import { on } from 'events';
import { totalmem } from 'os';
import playwright  from 'playwright';
import util from 'util';

  function inspect(obj)
  {
    return util.inspect(obj, {
      showHidden: false,
      depth: null,
      colors: true
    });
  }
export async function runScan(stories, options = {
  onProgress: () => {},
})
{
  const results = []

  for(const s in stories) {
    const storyId = stories[s]
    const browser = await playwright.chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`http://localhost:6006/iframe.html?viewMode=story&id=${storyId}`);

    await page.locator('#storybook-root').waitFor({ state: 'visible' });

    try {
      const builder = new AxeBuilder({ page });
      
      const result = await builder.options({
        resultTypes: ['violations','incomplete'],
      }).analyze();

      result.meta = {
        storyId,
        
      }
      results.push(result)
      options.onProgress({
        currentIndex: Number(s),
        currentId: storyId,
        total: stories.length,
        progress: (s / stories.length),
      })
    } catch (e) {
      console.error('Error running axe scan', e)
    }

    await browser.close();
  };

  return results
}