"use strict";

const messages = require('@constants/messages');
const statuses = require('@constants/statuses');

module.exports = class BodyMissingDataError extends require('@errors/AppError') {
  constructor(message, status) {
    message = message || messages.MESSAGE_ERROR_BODY_MISSING_DATA;
    status = status || statuses.HTTP_STATUS_UNPROCESSABLE_ENTITY;
    super(message, status);
  }
};