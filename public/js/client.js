/* global io moment Mustache */

'use strict';

// message div id
let counter = 0;

// socket init
const socket = io();

// main document selectors
const sendMessageButton = $('#send-message');
const sendLocationButton = $('#send-location');
const messagesContainer = $('#messages');

// callback for message emits
const cbMessage = (elem, button, err) => {
  if (err) console.log(err);
  else elem.val('');
  button.removeAttr('disabled').text('Send');
};

// callback for location emits
const cbLocation = (button, err) => {
  if (err) console.log(err);
  button.removeAttr('disabled').text('Send Location');
};

// message addition
const addEntry = (msg, type) => {
  const hmsTime = moment(msg.createdAt).format('hh:mm:ss');
  const milliTime = moment(msg.createdAt).format('.SS ');
  const ampmTime = moment(msg.createdAt).format('a');
  const { from, text } = msg;
  const template = $('#template').html();
  const view = {
    counter, from, text, hmsTime, milliTime, ampmTime,
  };
  view[type] = true;
  const render = Mustache.render(template, view);
  console.log(render);
  messagesContainer.append(render);
};

// scroll logic
const scroller = () => {
  const lastMessageHeight = messagesContainer.children('div:last-child').prop('scrollHeight');
  const scrollHeight = messagesContainer.prop('scrollHeight');
  const scrollTop = messagesContainer.prop('scrollTop');
  const clientHeight = messagesContainer.prop('clientHeight');
  console.log(`lastMessageHeight ${lastMessageHeight} scrollHeight ${scrollHeight} scrollTop ${scrollTop} clientHeight ${clientHeight}`);
  if (scrollHeight - scrollTop - clientHeight <= lastMessageHeight) {
    messagesContainer.scrollTop(scrollHeight - clientHeight);
  }
};

// socket connection
socket.on('connect', () => {
  console.log('Connected to Server');
  sendMessageButton.removeAttr('disabled').text('Send');
  sendLocationButton.removeAttr('disabled').text('Send Location');
});

// socket disconnection
socket.on('disconnect', (reason) => {
  console.log('Disconnected from Server', reason);
});

// incoming messages
socket.on('newMessage', (msg) => {
  console.log('Received New Message', msg);
  addEntry(msg, 'message');
  scroller();
  counter += 1;
});

// incoming locations
socket.on('newLocation', (msg) => {
  console.log('Received New Location', msg);
  addEntry(msg, 'location');
  scroller();
  counter += 1;
});

// socket ping/pong
socket.on('ping', () => {
  console.log('sending ping to server', moment().format('hh:mm:ss a'));
});

socket.on('pong', (latency) => {
  console.log('received pong from server, latency:', latency);
});

// outgoing messages with callback
$('#message-form').on('submit', (event) => {
  event.preventDefault();
  sendMessageButton.attr('disabled', 'disabled').text('Sending...');
  socket.emit('createMessage', {
    from: socket.id,
    text: $('[name="message"]').val(),
  }, cbMessage.bind(null, $('[name="message"]'), sendMessageButton));
});

// outgoing locations with callback
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
