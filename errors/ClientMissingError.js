"use strict";

const messages = require('@constants/messages');
const statuses = require('@constants/statuses');

module.exports = class ClientMissingError extends require('@errors/AppError') {
  constructor(message, status) {
    message = message || messages.MESSAGE_ERROR_CLIENT_MISSING;
    status = status || statuses.HTTP_STATUS_UNAUTHORIZED;
    super(message, status);
  }
};