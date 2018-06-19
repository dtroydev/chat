'use strict';

require('colors');
const expect = require('expect');
const { prepareMsg, prepareLocation } = require('../utils/message');
const { validateJoinParams } = require('../utils/join.js');

describe('TEST SUITE: prepareMsg function'.black.bgWhite, () => {
  it('should return a message object with timestamp (input: from:\'...\', text:\'...\')', () => {
    const tsRegex = /^\d{13}$/;
    const inputMsg = { fromName: 'Bob', fromId: 'some id', text: 'hello' };
    const outputMsg = prepareMsg(inputMsg);
    const ts = Date.now();
    expect(Object.keys(outputMsg).length).toBe(4);
    expect(outputMsg.fromName).toBe(inputMsg.fromName);
    expect(outputMsg.fromId).toBe(inputMsg.fromId);
    expect(outputMsg.text).toBe(inputMsg.text);
    expect(outputMsg.createdAt.toString().match(tsRegex)).not.toBeNull();
    expect(outputMsg.createdAt).toBeLessThanOrEqual(ts);
    expect(outputMsg.createdAt).toBeGreaterThan(ts - 5);
  });

  it('should return null with empty input', () => {
    const outputMsg = prepareMsg();
    expect(outputMsg).toBeNull();
  });

  it('should return null with invalid input (\'Bob\',\'Hello\',\'random arg\')', () => {
    const outputMsg = prepareMsg('Bob', 'Hello', 'random arg');
    expect(outputMsg).toBeNull();
  });

  it('should return null with invalid input (\'\',\'\')', () => {
    const outputMsg = prepareMsg('', '');
    expect(outputMsg).toBeNull();
  });

  it('should return null with invalid input (\'Bob\',\'\')', () => {
    const outputMsg = prepareMsg('Bob', '');
    expect(outputMsg).toBeNull();
  });

  it('should return null with invalid input (\'\',\'Hi\')', () => {
    const outputMsg = prepareMsg('', 'Hi');
    expect(outputMsg).toBeNull();
  });
});

describe('TEST SUITE: prepareLocation function'.black.bgWhite, () => {
  const latitude = -33.8708464;
  const longitude = 151.20732999999998;
  const fromName = 'Bob';
  const fromId = 'some id';

  it('should return a location message object with timestamp (input: from, latitude, longitude)', () => {
    const baseUrl = 'https://www.google.com/maps/search/?api=1&query=';
    const text = `${baseUrl}${latitude},${longitude}`;
    const tsRegex = /^\d{13}$/;

    //  https://www.google.com/maps/search/?api=1&query=-33.8708464,151.20732999999998

    const inputLocation = {
      fromName, fromId, latitude, longitude,
    };
    const outputLocation = prepareLocation(inputLocation);
    const ts = Date.now();
    expect(Object.keys(outputLocation).length).toBe(4);
    expect(outputLocation.fromName).toBe(inputLocation.fromName);
    expect(outputLocation.fromId).toBe(inputLocation.fromId);
    expect(outputLocation.text).toBe(text);
    expect(outputLocation.createdAt.toString().match(tsRegex)).not.toBeNull();
    expect(outputLocation.createdAt).toBeLessThanOrEqual(ts);
    expect(outputLocation.createdAt).toBeGreaterThan(ts - 5);
  });

  it('should return null with invalid lat input (from, invalid latitude, longitude)', () => {
    const outputMsg = prepareLocation({
      fromName, fromId, latitude: 100, longitude,
    });
    expect(outputMsg).toBeNull();
  });

  it('should return null with invalid lng input (from, latitude, invalid longitude)', () => {
    const outputMsg = prepareLocation({
      fromName, fromId, latitude, longitude: 200,
    });
    expect(outputMsg).toBeNull();
  });

  it('should return null with empty input', () => {
    const outputMsg = prepareLocation();
    expect(outputMsg).toBeNull();
  });

  it('should return null with invalid input ({})', () => {
    const outputMsg = prepareLocation({});
    expect(outputMsg).toBeNull();
  });

  it('should return null with invalid input ({},{})', () => {
    const outputMsg = prepareLocation({}, {});
    expect(outputMsg).toBeNull();
  });

  it('should return null with invalid input ({from, lat, lng, random})', () => {
    const outputMsg = prepareLocation({
      fromName, fromId, latitude, longitude, random: 'random',
    });
    expect(outputMsg).toBeNull();
  });
});

describe('TEST SUITE: validateJoinParams function'.black.bgWhite, () => {
  it('should return true if both name and room strings are supplied', () => {
    const params = { name: 'Bob', room: 'Cool Room' };
    expect(validateJoinParams(params)).toBe(true);
  });

  it('should return false if more than 1 params object is supplied', () => {
    const params = { name: 'Bob', room: 'Cool Room' };
    expect(validateJoinParams(params, params)).toBe(false);
  });

  it('should return false if name property is missing', () => {
    const params = { room: 'Cool Room' };
    expect(validateJoinParams(params)).toBe(false);
  });

  it('should return false if room property is missing', () => {
    const params = { name: 'Bob' };
    expect(validateJoinParams(params)).toBe(false);
  });

  it('should return false if empty object is supplied', () => {
    const params = {};
    expect(validateJoinParams(params)).toBe(false);
  });

  it('should return false if random field is added', () => {
    const params = { name: 'Bob', room: 'Cool Room', random: 'random' };
    expect(validateJoinParams(params)).toBe(false);
  });

  it('should return false if name is an empty string', () => {
    const params = { name: '', room: 'Cool Room' };
    expect(validateJoinParams(params)).toBe(false);
  });

  it('should return false if room is an empty string', () => {
    const params = { name: 'Bob', room: '' };
    expect(validateJoinParams(params)).toBe(false);
  });

  it('should return false if name is a number', () => {
    const params = { name: 123, room: 'Cool Room' };
    expect(validateJoinParams(params)).toBe(false);
  });

  it('should return false if room is a number', () => {
    const params = { name: 'Bob', room: 123 };
    expect(validateJoinParams(params)).toBe(false);
  });
});
