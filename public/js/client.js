/* global io moment Mustache */

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

const addEntry = (msg, type) => {
  const time = moment(msg.createdAt).format('hh:mm:ss a');
  const { from, text } = msg;
  const template = document.getElementById('template').innerHTML;
  const view = {
    counter, from, text, time,
  };
  view[type] = true;
  const render = Mustache.render(template, view);
  const messages = document.getElementById('messages');
  messages.innerHTML += render;
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
  addEntry(msg, 'message');
  counter += 1;
});

socket.on('newLocation', (msg) => {
  console.log('Received New Location', msg);
  addEntry(msg, 'location');
  counter += 1;
});

socket.on('ping', () => {
  console.log('sending ping to server', moment().format('hh:mm:ss a'));
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
