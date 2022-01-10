const express = require('express');
const { createServer } = require('http');
const socketio = require('./socketio');

const app = express();
app.use(express.static(__dirname + '/public'));
const server = createServer(app);

socketio(server);
const PORT = process.env.PORT || 2022;
server.listen(PORT, () => {
  console.log(`::> Server running http://localhost:${PORT}`);
});
