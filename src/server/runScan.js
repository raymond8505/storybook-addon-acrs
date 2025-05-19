import { AxeBuilder } from '@axe-core/playwright';
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
export async function runScan({stories})
{
  const results = []

  for(const storyId of stories) {
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
    } catch (e) {
      // do something with the error
    }

    await browser.close();
  };

  return results
}