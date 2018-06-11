'use strict';

require('colors');
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const staticPath = require('path').join(__dirname, '../public');

const PORT = process.env.PORT || 3000;
app.use(express.static(staticPath));

server.listen(PORT, () => console.log(`Server started on ${PORT}`));

function prepareMsg(msg) {
  const msgOut = {};
  if (typeof msg === 'string') {
    msgOut.from = 'admin';
    msgOut.text = msg;
  } else {
    Object.assign(msgOut, msg);
  }
  msgOut.createdAt = Date.now();
  return msgOut;
}

let connCounter = 0;

io.on('connection', (socket) => {
  connCounter += 1;
  const { id } = socket;
  console.log('Connection:'.green, id, 'Count:', connCounter);

  socket.broadcast.emit('newMessage', prepareMsg('new user joined'));
  socket.emit('newMessage', prepareMsg('welcome to chat'));

  socket.on('createMessage', (msg, cb) => {
    console.log('Message:'.yellow, id, msg);
    cb('server ack');
    io.emit('newMessage', prepareMsg(msg));
  });

  socket.on('disconnect', () => {
    connCounter -= 1;
    console.log('Disconnection'.red, id, 'Count:', connCounter);
  });
});

// yeah
