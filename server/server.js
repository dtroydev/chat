'use strict';

const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const staticPath = require('path').join(__dirname, '../public');

const PORT = process.env.PORT || 3000;
app.use(express.static(staticPath));

server.listen(PORT, () => console.log(`Server started on ${PORT}`));

io.on('connection', (socket) => {
  console.log('User Connected');
  socket.on('disconnect', () => {
    console.log('User Disconnected');
  });
});
