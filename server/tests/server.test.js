'use strict';

require('colors');
const expect = require('expect');
const { prepareMsg, prepareLocation } = require('../utils/message');

describe('TEST SUITE: prepareMsg function'.black.bgWhite, () => {
  it('should return a message object with timestamp (input: from:\'...\', text:\'...\')', () => {
    const tsRegex = /^\d{13}$/;
    const inputMsg = { from: 'Bob', text: 'hello' };
    const outputMsg = prepareMsg(inputMsg.from, inputMsg.text);
    const ts = Date.now();
    expect(Object.keys(outputMsg).length).toBe(3);
    expect(outputMsg.from).toBe(inputMsg.from);
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
  const from = 'Bob';

  it('should return a location message object with timestamp (input: from, latitude, longitude)', () => {
    const baseUrl = 'https://www.google.com/maps/search/?api=1&query=';
    const text = `${baseUrl}${latitude},${longitude}`;
    const tsRegex = /^\d{13}$/;

    //  https://www.google.com/maps/search/?api=1&query=-33.8708464,151.20732999999998

    const inputLocation = { from, latitude, longitude };
    const outputLocation = prepareLocation(inputLocation);
    const ts = Date.now();
    expect(Object.keys(outputLocation).length).toBe(3);
    expect(outputLocation.from).toBe(inputLocation.from);
    expect(outputLocation.text).toBe(text);
    expect(outputLocation.createdAt.toString().match(tsRegex)).not.toBeNull();
    expect(outputLocation.createdAt).toBeLessThanOrEqual(ts);
    expect(outputLocation.createdAt).toBeGreaterThan(ts - 5);
  });

  it('should return null with invalid lat input (from, invalid latitude, longitude)', () => {
    const outputMsg = prepareLocation({ from, latitude: 100, longitude });
    expect(outputMsg).toBeNull();
  });

  it('should return null with invalid lng input (from, latitude, invalid longitude)', () => {
    const outputMsg = prepareLocation({ from, latitude, longitude: 200 });
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
      from, latitude, longitude, random: 'random',
    });
    expect(outputMsg).toBeNull();
  });
});
