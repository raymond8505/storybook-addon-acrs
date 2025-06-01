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

// Wait for all ongoing CSS transitions and animations to finish
async function waitForAnimationsAndTransitions(page) {
  await page.evaluate(() => {
    function getActiveAnimationsCount() {
      let count = 0;
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        const computed = window.getComputedStyle(el);
        // Check for running animations
        if (
          computed.animationName !== 'none' &&
          parseFloat(computed.animationDuration) > 0
        ) {
          count++;
        }
        // Check for running transitions
        if (
          computed.transitionProperty !== 'all' &&
          computed.transitionProperty !== 'none' &&
          parseFloat(computed.transitionDuration) > 0
        ) {
          count++;
        }
      });
      return count;
    }

    return new Promise(resolve => {
      let timeout;
      let remaining = getActiveAnimationsCount();
      if (remaining === 0) return resolve();

      function onEnd(e) {
        remaining--;
        if (remaining <= 0) {
          clearTimeout(timeout);
          document.removeEventListener('transitionend', onEnd, true);
          document.removeEventListener('animationend', onEnd, true);
          resolve();
        }
      }

      document.addEventListener('transitionend', onEnd, true);
      document.addEventListener('animationend', onEnd, true);

      // Fallback in case events don't fire
      timeout = setTimeout(() => {
        document.removeEventListener('transitionend', onEnd, true);
        document.removeEventListener('animationend', onEnd, true);
        resolve();
      }, 1000);
    });
  });
}
export async function runScan(stories, options = {
  onProgress: () => {},
})
{
  const results = []

  //for(const s in [{id:'ava-chatinterface--default'}]) {
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

      let parameters = {};
      try {
        await page.locator('body').waitFor({ state: 'visible', timeout: 10000 });
        await page.waitForSelector('#storybook-parameters', {
          timeout: 10000,
          state: 'attached'
        });

         parameters = await page.evaluate(() => {
          return window.storyParameters;
        })

        if(parameters?.hasPlay){
          await page.evaluate(() => {
            return window.playFunction();
          });
        }

        await waitForAnimationsAndTransitions(page);
      }
      catch (e) {
        console.error( storyId, e);
      }
      finally {
        const delay = parameters?.acr?.delay ?? parameters?.chromatic?.delay ?? undefined;

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