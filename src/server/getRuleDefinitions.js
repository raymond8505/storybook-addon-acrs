import playwright  from 'playwright';
import axe from 'axe-core';
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

  const wcagLevelsTags = ['wcag2a','wcag2aa','wcag2aaa','wcag21a','wcag21aa']

  ruleLinks.forEach((link) => {
    const ruleNum = link.label.match(/^[\d\.]+/)?.[0]

    if(ruleNum)
    {
      const ruleTag = `wcag${ruleNum.replace(/\./g,'')}`
      const examplRules = axe.getRules([ruleTag])

      if(examplRules[0])
      {
        const wcagLevels = examplRules[0].tags.filter(value => wcagLevelsTags.includes(value))
        link.tags = [...wcagLevels, ruleTag]
        link.ruleTag = ruleTag
      }

    }

    return {...link}
  })

  await browser.close();

  return ruleLinks
}