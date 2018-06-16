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
  // console.log(socket);
  const ip1 = socket.request.connection.remoteAddress;
  const ip2 = socket.handshake.headers['x-forwarded-for'];
  const clientIP = ip2 || ip1;
  connCounter += 1;
  const { id } = socket;
  console.log('Connection:'.green, id, clientIP, 'User Count:', connCounter);

  socket.broadcast.emit('newMessage', prepareMsg('admin', 'new user joined'));
  socket.emit('newMessage', prepareMsg('admin', 'welcome to chat'));

  socket.on('createMessage', (msg, cb) => {
    console.log('Message:'.yellow, id, msg);
    const msgOut = prepareMsg(msg.from, msg.text);
    if (!msgOut) return cb('error: blank and/or invalid message property name(s) and/or value(s)');
    io.emit('newMessage', msgOut);
    return cb();
  });

  socket.on('createLocation', (location, cb) => {
    console.log('Message:'.yellow, id, location);
    const locationOut = prepareLocation(location);
    if (!locationOut) return cb('error: blank and/or invalid location message property name(s) and/or value(s)');
    io.emit('newLocation', locationOut);
    return cb();
  });

  socket.on('disconnect', (reason) => {
    connCounter -= 1;
    console.log('Disconnection'.red, id, clientIP, 'User Count:', connCounter, 'Reason:', reason);
  });
});
