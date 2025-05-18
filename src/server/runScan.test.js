import { runScan } from "./runScan"
import util from 'util'

describe('runScan', () => {
  it('should run a scan and return results', async () => {
    const testIds = [
        'example-button--primary',
        // 'example-button--secondary',
        // 'example-button--large',
        // 'example-button--small',
        // 'example-header--logged-in',
        // 'example-header--logged-out',
        // 'example-page--logged-out',
        // 'example-page--logged-in'
      ]

      const results = await runScan({stories: testIds})
      console.log(util.inspect(results[0].violations,false, null, true))
  })
})