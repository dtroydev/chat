/* global io */

'use strict';

let counter = 0;

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

  const text = `[${ts}] ${msg.from}: ${msg.text}`;

  const container = document.getElementById('container');

  const message = document.createElement('div');
  message.id = `${counter}`;
  message.className = 'message';
  message.textContent = text;
  container.appendChild(message);

  counter += 1;
});
