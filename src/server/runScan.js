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
export async function runScan(stories, options = {
  onProgress: () => {},
})
{
  const results = []

  for(const s in stories) {
    const storyId = stories[s]
    const browser = await playwright.chromium.launch({headless: true});
    const context = await browser.newContext();
    const page = await context.newPage();
    const url = `http://localhost:6006/iframe.html?viewMode=story&id=${storyId}`
    try {
      await page.goto(url,{
        waitUntil: 'load',
      });

      

      try {
        await page.locator('body').waitFor({ state: 'visible', timeout: 10000 });
      }
      catch {}
      finally {
        await page.waitForSelector('#storybook-parameters', {
          timeout: 10000,
          state: 'attached'
        });

        const params = await page.evaluate(() => {
          return window.storyParameters;
        })

        const delay = params?.acr?.delay ?? params?.chromatic?.delay ?? undefined;

        if(delay)
        {
          await page.waitForTimeout(delay)
        }

        const builder = new AxeBuilder({ page });
        
        const result = await builder.options({
          resultTypes: ['violations','incomplete'],
        }).analyze();
  
        result.meta = {
          storyId,
          
        }
        //console.log('Scan result', storyId, result.violations)
        results.push(result)
        options.onProgress({
          currentIndex: Number(s),
          currentId: storyId,
          total: stories.length,
          progress: (s / stories.length),
        })
      }

    } catch (e) {
      console.error('Error running axe scan', storyId, e)
    }

    await browser.close();
  };

  return results
}