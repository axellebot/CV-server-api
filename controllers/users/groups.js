"use strict";

// Requires packages
const Async = require('async');

// Helpers
const getPageCount = require("../../helpers").getPageCount;

// Schemas
const Group = require('../../models/group.schema');

// Constants
const messages = require('../../constants/messages');
const statuses = require('../../constants/statuses');
const models = require('../../constants/models');
const collections = require('../../constants/collections');
const roles = require('../../constants/roles');
const parameters = require('../../constants/parameters');

// Errors
const DatabaseFindError = require('../../errors/DatabaseFindError');
const DatabaseCountError = require('../../errors/DatabaseCountError');
const DatabaseCreateError = require('../../errors/DatabaseCreateError');
const DatabaseUpdateError = require('../../errors/DatabaseUpdateError');
const DatabaseRemoveError = require('../../errors/DatabaseRemoveError');
const NotFoundError = require('../../errors/NotFoundError');
const MissingPrivilegeError = require('../../errors/MissingPrivilegeError');

// Responses
const SelectDocumentsResponse = require('../../responses/SelectDocumentsResponse');
const SelectDocumentResponse = require('../../responses/SelectDocumentResponse');
const CreateDocumentResponse = require('../../responses/CreateDocumentResponse');
const UpdateDocumentsResponse = require('../../responses/UpdateDocumentsResponse');
const UpdateDocumentResponse = require('../../responses/UpdateDocumentResponse');
const DeleteDocumentsResponse = require('../../responses/DeleteDocumentsResponse');
const DeleteDocumentResponse = require('../../responses/DeleteDocumentResponse');

/* Groups page. */
exports.get = function(req, res, next) {
  var filters = req.query.filters || {};
  filters.user = req.params[parameters.PARAM_ID_USER];
  
  Group
    .find(filters)
    .select(req.query.fields)
    .skip(req.query.offset)
    .limit(req.query.limit)
    .sort(req.query.sort)
    .exec(function(err, groups) {
      if (err) return next(new DatabaseFindError());
      if (!groups || groups.length <= 0) return next(new NotFoundError(models.MODEL_NAME_EDUCATION));
      Group
        .count(req.query.filter)
        .exec(function(err, count) {
          if (err) return next(new DatabaseCountError());
          res.json(new SelectDocumentsResponse(groups, count, getPageCount(count, req.query.limit)));
        });
    });
};

exports.post = function(req, res, next) {
  const userId = req.params[parameters.PARAM_ID_USER];

  var group = req.body.data;
  group.user = userId;
  group = new Group(group);

  group.save(function(err, groupSaved) {
    if (err) return next(new DatabaseCreateError(err.message)());
    res.json(new CreateDocumentResponse(groupSaved));
  });
};

exports.put = function(req, res, next) {
  const userId = req.params[parameters.PARAM_ID_USER];

  const groups = req.body.data;
  var groupsUpdated = [];
  Async.eachOf(groups, function(group, key, callback) {
    const filterUpdate = {
      _id: group._id,
      user: userId
    };
    Group
      .findOneAndUpdate(filterUpdate, group, {
        new: true
      }, function(err, groupUpdated) {
        if (err) return callback(err);
        if (groupUpdated) groupsUpdated.push(groupUpdated);
        callback();
      });
  }, function(err) {
    if (err) return next(new DatabaseUpdateError());
    res.json(new UpdateDocumentsResponse(groupsUpdated));
  });
};

exports.delete = function(req, res, next) {
  const userId = req.params[parameters.PARAM_ID_USER];

  Group
    .remove({
      user: userId
    })
    .exec(function(err, removed) {
      if (err) return next(new DatabaseRemoveError());
      res.json(new DeleteDocumentsResponse(JSON.parse(removed).n));
    });
};