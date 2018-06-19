'use strict';

function prepareMsg(msg) {
  if (arguments.length !== 1 || Object.keys(msg).length !== 3) return null;

  const msgOut = {};
  if (typeof msg.fromName === 'string' && typeof msg.fromId === 'string' && typeof msg.text === 'string') {
    msgOut.fromName = msg.fromName;
    msgOut.fromId = msg.fromId;
    msgOut.text = msg.text;
  } else return null;

  if (!msgOut.fromName.trim() || !msgOut.fromId.trim() || !msgOut.text.trim()) return null;

  msgOut.createdAt = Date.now();

  return msgOut;
}

function prepareLocation(location) {
  const latRegex = /^[-+]?(?:[1-8]?\d(?:\.\d+)?|90(?:\.0+)?)$/; // -90 through to +90 with decimals
  const lngRegex = /^[-+]?(?:180(\.0+)?|(?:(?:1[0-7]\d)|(?:[1-9]?\d))(?:\.\d+)?)$/; // -180 to +180 with decimals
  if (arguments.length !== 1 ||
    Object.keys(location).length !== 4 ||
    typeof location.fromName !== 'string' ||
    typeof location.fromId !== 'string' ||
    !location.latitude.toString().match(latRegex) ||
    !location.longitude.toString().match(lngRegex)) return null;
  const baseUrl = 'https://www.google.com/maps/search/?api=1&query=';
  const locationOut = {};
  locationOut.fromName = location.fromName;
  locationOut.fromId = location.fromId;
  locationOut.createdAt = Date.now();
  locationOut.text = `${baseUrl}${location.latitude},${location.longitude}`;

  return locationOut;
}

module.exports = {
  prepareMsg,
  prepareLocation,
};
