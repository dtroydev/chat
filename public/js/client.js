/* global io */

'use strict';

let counter = 0;
const sendMessageButton = $('#send-message');
const sendLocationButton = $('#send-location');

const cbMessage = (elem, button, err) => {
  if (err) console.log(err);
  else elem.val('');
  button.removeAttr('disabled').text('Send');
};

const cbLocation = (button, err) => {
  if (err) console.log(err);
  button.removeAttr('disabled').text('Send Location');
};

const socket = io();

socket.on('connect', () => {
  console.log('Connected to Server');
  sendMessageButton.removeAttr('disabled').text('Send');
  sendLocationButton.removeAttr('disabled').text('Send Location');
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
  sendMessageButton.attr('disabled', 'disabled').text('Sending...');
  socket.emit('createMessage', {
    from: socket.id,
    text: $('[name="message"]').val(),
  }, cbMessage.bind(null, $('[name="message"]'), sendMessageButton));
});

sendLocationButton.on('click', () => {
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser');
  } else {
    sendLocationButton.attr('disabled', 'disabled').text('Sending Location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { coords: { latitude, longitude } } = position;
        console.log('browser navigator api returned coords:', latitude, longitude);
        socket.emit('createLocation', {
          from: socket.id,
          latitude,
          longitude,
        }, cbLocation.bind(null, sendLocationButton));
      },
      (error) => {
        sendLocationButton.removeAttr('disabled').text('Send Location');
        console.log(error.message);
      },
    );
  }
});
