#!/usr/bin/env node
import express from 'express';
const wsApp = express();
const httpApp = express();
import expressWS from 'express-ws'
import {runScan} from './runScan.js'
import {createReport} from './createReport.js'
import cors from 'cors'
import { getRuleDefinitions } from './getRuleDefinitions.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import {readdirSync} from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

expressWS(wsApp);
const ruleDefinitions = await getRuleDefinitions()

function getAllReports() {

  const reports = [];
  const files =  readdirSync(`${__dirname}/htdocs/reports`);
  for (const file of files) {
    if (file.endsWith('.json')) {
      reports.push(file.replace('.json', ''));
    }
  }

  return reports
}

wsApp.ws('/vpat', function(ws, req) {
  ws.on('message', async function(msgStr) {
    const msg = JSON.parse(msgStr)
    
    switch(msg.action)
    {
      case 'run-scan':
        //console.log('Running Scan', msg.payload.stories)
        const id = createReport(await runScan(
          //['player-videoheader--relative-layout-with-tap-to-unmute-disabled']
          msg.payload.stories
          ,{
          onProgress: (progress) => {
            ws.send(JSON.stringify({
              action: 'scan-progress',
              payload: {
                progress
              }
            }))
          }
        }))
        ws.send(JSON.stringify({
          action: 'report-created',
          payload: {
            report : {
              id,
            }
          }
        }))
        break
    }
  });
  console.log('WebSocket connection opened');
  ws.send(JSON.stringify({
    action: 'ready',
    payload: {
      ruleDefinitions,
      reports: getAllReports()
    }
  }))
});
httpApp.use(cors())
httpApp.use(express.static(`${__dirname}/../server/htdocs/reports`));

wsApp.listen(3000,()=>{
  console.log('WebSocket server running at ws://localhost:3000/vpat');
  console.log('HTTP server running at http://localhost:3001');

});

httpApp.listen(3001)