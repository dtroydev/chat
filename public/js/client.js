/* global io */

'use strict';

let counter = 0;

const cb = (err) => { if (err) console.log(err); };

const socket = io();

socket.on('connect', () => {
  console.log('Connected to Server');
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected from Server', reason);
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

socket.on('newLocation', (msg) => {
  console.log('Received New Location', msg);
  const ts = new Date(msg.createdAt).toString()
    .substr(16, 8);

  const text = `[${ts}] ${msg.from}: `;
  // ${msg.text};

  const container = document.getElementById('container');
  const message = document.createElement('div');
  const aTag = document.createElement('a');

  message.id = `${counter}`;
  message.className = 'message';
  message.textContent = text;
  // message.innerHTML = text;

  aTag.setAttribute('href', msg.text);
  aTag.setAttribute('target', '_blank');
  aTag.textContent = 'My Location on Google Maps';

  container.appendChild(message);
  message.appendChild(aTag);
  counter += 1;
});

socket.on('ping', () => {
  console.log('sending ping to server', new Date()
    .toString()
    .substr(16, 8));
});

socket.on('pong', (latency) => {
  console.log('received pong from server, latency:', latency);
});

$('#message-form').on('submit', (event) => {
  event.preventDefault();
  socket.emit('createMessage', {
    from: socket.id,
    text: $('[name="message"]').val(),
  }, cb);
  $('[name="message"]').val('');
});

$('#send-location').on('click', () => {
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser');
  } else {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { coords: { latitude, longitude } } = position;
        console.log(latitude, longitude);
        socket.emit('createLocation', {
          from: socket.id,
          latitude,
          longitude,
        }, cb);
      },
      (error) => {
        console.log(error.message);
      },
    );
  }
});
