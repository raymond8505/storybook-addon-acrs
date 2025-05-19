import playwright  from 'playwright';

export async function getRuleDefinitions(version = 'wcag21')
{
  const browser = await playwright.chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto(`https://www.w3.org/WAI/${version.toUpperCase()}/Understanding/`)

  const ruleLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('main ul > li > a'))?.map((link) => {
      return {
        label: link.innerText,
        url: link.href,
      }
    }).filter(link => {
      // all rule labels start with a number
      // other links dont
      return link.label && link.label.match(/^[\d]/) !== null
    })
  })

  await browser.close();

  return ruleLinks
}