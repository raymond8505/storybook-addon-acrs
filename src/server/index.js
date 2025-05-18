#!/usr/bin/env node
import express from 'express';
const wsApp = express();
const httpApp = express();
import expressWS from 'express-ws'
import {runScan} from './runScan.js'
import {createReport} from './createReport.js'
expressWS(wsApp);

wsApp.ws('/vpat', function(ws, req) {
  ws.on('message', async function(msgStr) {
    const msg = JSON.parse(msgStr)

    switch(msg.action)
    {
      case 'run-scan':
        console.log('Running Scan', msg.payload.stories)
        const fileName = createReport(await runScan(msg.payload))
        ws.send(JSON.stringify({
          action: 'report-created',
          payload: {
            report : {
              url: `http://localhost:3001/${fileName}.json`,
            }
          }
        }))
        break
    }
  });
  console.log('WebSocket connection opened');
  ws.send('hello')
});

httpApp.use(express.static(`${process.cwd()}/src/server/htdocs/reports`));

wsApp.listen(3000,()=>{
  console.log('WebSocket server running at ws://localhost:3000/vpat');
  console.log('HTTP server running at http://localhost:3001');
});

httpApp.listen(3001)