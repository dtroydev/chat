'use strict';

require('colors');
const expect = require('expect');
const { prepareMsg } = require('../utils/message');

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
