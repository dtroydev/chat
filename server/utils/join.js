'use strict';

function validateJoinParams(params) {
  if (arguments.length !== 1 ||
    Object.keys(params).length !== 2 ||
    typeof params.name !== 'string' ||
    typeof params.room !== 'string' ||
    params.name.trim() === '' ||
    params.room.trim() === '') return false;
  return true;
}

exports.validateJoinParams = validateJoinParams;
