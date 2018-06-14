'use strict';

require('colors');
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { prepareMsg, prepareLocation } = require('./utils/message.js');
const staticPath = require('path').join(__dirname, '../public');

const PORT = process.env.PORT || 3000;
app.use(express.static(staticPath));

server.listen(PORT, () => console.log(`Server started on ${PORT}`));

let connCounter = 0;

io.on('connection', (socket) => {
  connCounter += 1;
  const { id } = socket;
  console.log('Connection:'.green, id, 'User Count:', connCounter);

  socket.broadcast.emit('newMessage', prepareMsg('admin', 'new user joined'));
  socket.emit('newMessage', prepareMsg('admin', 'welcome to chat'));

  socket.on('createMessage', (msg, cb) => {
    console.log('Message:'.yellow, id, msg);
    const msgOut = prepareMsg(msg.from, msg.text);
    if (!msgOut) {
      if (!msg.text.trim()) {
        return cb('error: blank message not allowed');
      }
      return cb('error');
    }
    io.emit('newMessage', msgOut);
    return cb();
  });

  socket.on('createLocation', (location, cb) => {
    console.log('Message:'.yellow, id, location);
    const locationOut = prepareLocation(location);
    if (!locationOut) return cb('error');
    io.emit('newLocation', locationOut);
    return cb();
  });

  socket.on('disconnect', (reason) => {
    connCounter -= 1;
    console.log('Disconnection'.red, id, 'User Count:', connCounter, 'Reason:', reason);
  });
});

// yeah
