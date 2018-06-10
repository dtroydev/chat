/* global io */

'use strict';

const socket = io();
socket.on('connect', () => {
  console.log('Connected to Server');
});

socket.on('disconnect', () => {
  console.log('Disconnected to Server');
});

// custom events
socket.on('newMessage', (msg) => {
  console.log('Received New Message', msg);

  const ts = new Date(msg.createdAt)
    .toString()
    .substr(16, 8);

  document.getElementById('input').innerHTML = `[${ts}] ${msg.from}: ${msg.text}`;
});
