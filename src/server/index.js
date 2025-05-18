#!/usr/bin/env node
import express from 'express';
const wsApp = express();
const httpApp = express();
import expressWS from 'express-ws'

expressWS(wsApp);

wsApp.ws('/vpat', function(ws, req) {
  ws.on('message', function(msgStr) {
    const msg = JSON.parse(msgStr)
  });
  console.log('WebSocket connection opened');
});


httpApp.use(express.static(`${process.cwd()}/src/server/htdocs/reports`));

wsApp.listen(3000,()=>{
  console.log('Server started on port 3000');
  console.log('WebSocket server running at ws://localhost:3000/vpat');
});

httpApp.listen(3001)