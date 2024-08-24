const express = require('express');
const http = require('http');

const server = http.createServer();
const PORT = 3000;

const app = express();
app.get('/', async (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

server.on('request', app);
server.listen(PORT, () => {
  console.log('server started on port', PORT);
});

// Websocket

const WebsocketServer = require('ws').Server;
const wss = new WebsocketServer({ server: server });

wss.on('connection', (ws) => {
  const clients = wss.clients.size;

  console.log('clients connected', clients);

  broadcast(`Visiters Count:  ${clients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send('welcome');
  }

  ws.on('close', () => {
    broadcast(`Visiters Count:  ${clients}`);
    console.log('A client has disconnected');
  });

  ws.on('error', function error() {
    //
  });
});

/**
 * Broadcast data to all connected clients
 * @param  {Object} data
 * @void
 */
const broadcast = function broadcast(data) {
  console.log('Broadcasting: ', data);
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
/** End Websocket **/
