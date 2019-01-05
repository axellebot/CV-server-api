"use strict";

// Constants
const parameters = require('@constants/parameters');
const paths = require('@constants/paths');
const perms = require('@constants/permissions');

// Middlewares
const requireAuthentication = require('@middlewares/security/authentication');
const requireBodyData = require('@middlewares/body/data');
const requireBodyDataArray = require('@middlewares/body/dataArray');
const requireBodyDataObject = require('@middlewares/body/dataObject');
const parseQuerySelection = require('@middlewares/selection');

// Controllers
const ctrlParts = require('@controllers/parts.controller.js');
const ctrlGroups = require('@controllers/groups.controller.js');

module.exports = (router) => {
  router.get('/', requireAuthentication.user({
    scope: "parts:read"
  }), parseQuerySelection, ctrlParts.findMany);
  router.post('/', requireAuthentication.user({
    scope: "parts:write"
  }), requireBodyDataObject, ctrlParts.createOne);
  router.put('/', requireAuthentication.user({
    scope: "parts:write"
  }), requireBodyDataArray, ctrlParts.updateMany);
  router.delete('/', requireAuthentication.user({
    scope: "parts:delete"
  }), ctrlParts.deleteAll);

  router.get('/' + ':' + parameters.PARAM_ID_PART, requireAuthentication.user({
    scope: "parts:read"
  }), ctrlParts.findOne);
  router.put('/' + ':' + parameters.PARAM_ID_PART, requireAuthentication.user({
    scope: "parts:write"
  }), requireBodyDataObject, ctrlParts.updateOne);
  router.delete('/' + ':' + parameters.PARAM_ID_PART, requireAuthentication.user({
    scope: "parts:delete"
  }), ctrlParts.deleteOne);

  router.get('/' + ':' + parameters.PARAM_ID_PART + paths.PATH_GROUPS, requireAuthentication.user({
    scope: "groups:read"
  }), parseQuerySelection, ctrlParts.filterGroupsOfOne, ctrlGroups.findMany);
};