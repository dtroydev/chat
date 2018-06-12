'use strict';

function prepareMsg(from, text) {
  if (arguments.length !== 2) return null;

  const msgOut = {};
  if (typeof from === 'string' && typeof text === 'string') {
    msgOut.from = from;
    msgOut.text = text;
  } else return null;

  if (!msgOut.from || !msgOut.text) return null;

  msgOut.createdAt = Date.now();

  return msgOut;
}

exports.prepareMsg = prepareMsg;
