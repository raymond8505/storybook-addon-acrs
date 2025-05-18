#!/usr/bin/env node
import express  from 'express';
var app = express();
import expressWS from 'express-ws'

expressWS(app);

app.ws('/vpat', function(ws, req) {
  ws.on('message', function(msg) {
    console.log('Socket Message',msg);
  });
  console.log('WebSocket connection opened');
});

app.listen(3000,()=>{
  console.log('Server started on port 3000');
  console.log('WebSocket server running at ws://localhost:3000/vpat');
});