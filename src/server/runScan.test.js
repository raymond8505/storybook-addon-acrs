import { runScan } from "./runScan"

    const testIds = [
      //'player-videoheader--relative-layout-with-tap-to-unmute-disabled'
        'example-button--primary',
        // 'example-button--secondary',
        // 'example-button--large',
        // 'example-button--small',
        // 'example-header--logged-in',
        // 'example-header--logged-out',
        // 'example-page--logged-out',
        // 'example-page--logged-in'
      ]

      runScan({stories: testIds}).then(results => {})
      //console.log(util.inspect(results[0],false, null, true))
  
