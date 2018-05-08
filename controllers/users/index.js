"use strict";

// Requires packages
const Async = require('async');

// Helpers
const getFilterEditData = require("../../helpers").getFilterEditData;
const getPageCount = require("../../helpers").getPageCount;

// Schemas
const User = require('../../models/user.schema');

// Constants
const messages = require('../../constants/messages');
const statuses = require('../../constants/statuses');
const models = require('../../constants/models');
const collections = require('../../constants/collections');
const roles = require('../../constants/roles');
const parameters = require('../../constants/parameters');
const fields = require('../../constants/fields');

// Errors
const DatabaseFindError = require('../../errors/DatabaseFindError');
const DatabaseCountError = require('../../errors/DatabaseCountError');
const DatabaseCreateError = require('../../errors/DatabaseCreateError');
const DatabaseUpdateError = require('../../errors/DatabaseUpdateError');
const DatabaseRemoveError = require('../../errors/DatabaseRemoveError');
const MissingPrivilegeError = require('../../errors/MissingPrivilegeError');
const NotFoundError = require('../../errors/NotFoundError');
const NotImplementedError = require('../../errors/NotImplementedError');

// Responses
const SelectDocumentsResponse = require('../../responses/SelectDocumentsResponse');
const SelectDocumentResponse = require('../../responses/SelectDocumentResponse');
const CreateDocumentResponse = require('../../responses/CreateDocumentResponse');
const UpdateDocumentsResponse = require('../../responses/UpdateDocumentsResponse');
const UpdateDocumentResponse = require('../../responses/UpdateDocumentResponse');
const DeleteDocumentsResponse = require('../../responses/DeleteDocumentsResponse');
const DeleteDocumentResponse = require('../../responses/DeleteDocumentResponse');


/* users page. */
exports.users = {};
exports.users.get = function(req, res, next) {
  User
    .find(req.query.filters)
    .select(req.query.fields || fields.FIELDS_USER_PUBLIC)
    .skip(req.query.offset)
    .limit(req.query.limit)
    .sort(req.query.sort)
    .exec(function(err, users) {
      if (err) return next(new DatabaseFindError());
      if (!users || users.length <= 0) return next(new NotFoundError(models.MODEL_NAME_USER));

      User
        .count(req.query.filters)
        .exec(function(err, count) {
          if (err) return next(new DatabaseCountError());
          res.json(new SelectDocumentsResponse(users, count, getPageCount(count, req.query.limit)));
        });
    });
};

exports.users.post = function(req, res, next) {
  //TODO : users - Create user
  next(new NotImplementedError("Create a new user"));
};

exports.users.put = function(req, res, next) {
  const users = req.body.data;
  var usersUpdated = [];
  Async.eachOf(users, function(user, key, callback) {

    const filterUpdate = {
      _id: user._id
    };
    User
      .findOneAndUpdate(filterUpdate, user, {
        new: true
      }, function(err, computingTagUpdated) {
        if (err) return callback(err);
        if (computingTagUpdated) usersUpdated.push(computingTagUpdated);
        callback();
      });
  }, function(err) {
    if (err) return next(new DatabaseUpdateError());
    res.json(new UpdateDocumentsResponse(usersUpdated));
  });
};

exports.users.delete = function(req, res, next) {
  User
    .remove()
    .exec(function(err, removed) {
      if (err) return next(new DatabaseRemoveError());
      res.json(new DeleteDocumentsResponse(JSON.parse(removed).n));
    });
};

/* user page. */
exports.user = {};
exports.user.get = function(req, res, next) {
  User
    .findById(req.params[parameters.PARAM_ID_USER])
    .select(fields.FIELDS_USER_PUBLIC)
    .exec(function(err, user) {
      if (err) return next(new DatabaseFindError());
      if (!user) return next(new NotFoundError(models.MODEL_NAME_USER));
      res.json(new SelectDocumentResponse(user));
    });
};

exports.user.put = function(req, res, next) {
  const userId = req.params[parameters.PARAM_ID_USER];

  User
    .findOneAndUpdate({
      _id: userId
    }, req.body.data, {
      returnNewDocument: true,
      projection: fields.FIELDS_USER_PUBLIC
    }, function(err, userUpdated) {
      if (err) return next(new DatabaseUpdateError());
      if (!userUpdated) return next(new NotFoundError(models.MODEL_NAME_USER));
      res.json(new UpdateDocumentResponse(userUpdated));
    });
};

exports.user.delete = function(req, res, next) {
  const userId = req.params[parameters.PARAM_ID_USER];

  User
    .findOneAndRemove({
      _id: userId
    }, function(err, userDeleted) {
      if (err) return next(new DatabaseRemoveError());
      if (!userDeleted) return next(new NotFoundError(models.MODEL_NAME_USER));
      res.json(new DeleteDocumentResponse(userDeleted));
    });
};

exports.user.entries = require('./entries');
exports.user.groups = require('./groups');
exports.user.parts = require('./parts');
exports.user.profiles = require('./profiles');