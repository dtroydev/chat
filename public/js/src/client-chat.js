/* global io moment Mustache  */
/* eslint no-alert: "off" */

'use strict';

// get query string parameters
function getUrlParams(prop) {
  const params = {};

  window.location.search
    .slice(window.location.search.indexOf('?') + 1) // remove leading '?''
    .replace(/\+/g, '%20') // replace '+'' with '%20' for URI encoding compliance
    .split('&') // convert into key=value array
    .forEach((e) => { // convert array elements into params object properties/values
      const [key, val] = e.split('=');
      params[key] = decodeURIComponent(val).trim();
    });
  return (prop && prop in params) ? params[prop] : params;
}

const params = getUrlParams();
// redirect back if blanks are supplied for name or room name
console.log(params);
if (!params.room || !params.name) {
  alert('name and room required');
  window.location.href = '/index.html';
  // return;
} else {
  // force lower case room names
  params.room = params.room.toLowerCase();
  (() => {
    // socket init
    const socket = io();

    // set page title
    document.title = `${params.room} | Chat App`;
    $('#room').text(`${params.room}`);
    // message div id
    let counter = 0;

    // main document selectors
    const sendMessageButton = $('#send-message');
    const sendLocationButton = $('#send-location');
    const messagesContainer = $('#messages');
    const usersContainer = $('#users');
    const fromName = params.name;

    let fromId = '';

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
    // console.log('addEntry', msg);
      const hmsTime = moment(msg.createdAt).format('hh:mm:ss');
      const milliTime = moment(msg.createdAt).format('.SS ');
      const ampmTime = moment(msg.createdAt).format('a');
      const template = $('#template').html();
      const view = {
        counter,
        fromName: msg.fromName,
        fromId: msg.fromId,
        text: msg.text,
        hmsTime,
        milliTime,
        ampmTime,
      };
      view[type] = true;
      const render = Mustache.render(template, view);
      messagesContainer.append(render);
    };

    // scroll logic
    const scroller = () => {
      const lastMessageHeight = messagesContainer.children('div:last-child').prop('scrollHeight');
      const scrollHeight = messagesContainer.prop('scrollHeight');
      const scrollTop = messagesContainer.prop('scrollTop');
      const clientHeight = messagesContainer.prop('clientHeight');
      if (scrollHeight - scrollTop - clientHeight <= lastMessageHeight * 1.5) {
        messagesContainer.scrollTop(scrollHeight - clientHeight);
      }
    };

    // socket connection
    socket.on('connect', () => {
      console.log('Connected to Server');
      fromId = socket.id;
      sendMessageButton.removeAttr('disabled').text('Send');
      sendLocationButton.removeAttr('disabled').text('Send Location');
      socket.emit('join', params, (err) => {
        if (err) {
          console.log(err);
          alert(err);
          window.location.href = '/index.html';
        }
      });
    });

    // socket disconnection
    socket.on('disconnect', (reason) => {
      console.log('Disconnected from Server', reason);
    });

    // updateUserList
    socket.on('updateUserList', (users) => {
      console.log(users);
      usersContainer.empty();
      const list = $('<ol></ol>');
      users.forEach((user) => {
        if (user === fromName) {
          list.prepend($('<li></li>').text(user));
        } else {
          list.append($('<li></li>').text(user));
        }
      });
      $(':first-child', list).css('background-color', 'orange');
      usersContainer.html(list);
    });

    // incoming messages
    socket.on('newMessage', (msg) => {
      console.log('Received New Message', msg);
      addEntry(msg, 'message');
      scroller(); // auto scroll logic
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
        fromName,
        fromId,
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
              fromName,
              fromId,
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
  })();
}
