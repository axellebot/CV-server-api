"use strict";

// Constants
const parameters = require('@constants/parameters');
const paths = require('@constants/paths');
const perms = require('@constants/permissions');

// Middlewares
const hasPerms = require('@middlewares/security/RBAC');
const requireAuthentication = require('@middlewares/security/authentication');
const requireBodyData = require('@middlewares/body/data');
const requireBodyDataArray = require('@middlewares/body/dataArray');
const requireBodyDataObject = require('@middlewares/body/dataObject');
const parseQuerySelection = require('@middlewares/selection');

// Controllers
const ctrlEntries = require('@controllers/entries.controller.js');

module.exports = (router) => {
  router.get('/', hasPerms(perms.PERMISSION_SCOPE_ENTRIES, perms.PERMISSION_CRUD_READ), parseQuerySelection, ctrlEntries.findMany);
  router.post('/', hasPerms(perms.PERMISSION_SCOPE_ENTRIES, perms.PERMISSION_CRUD_WRITE), requireBodyDataObject, ctrlEntries.createOne);
  router.put('/', hasPerms(perms.PERMISSION_SCOPE_ENTRIES, perms.PERMISSION_CRUD_WRITE), requireBodyDataArray, ctrlEntries.updateMany);
  router.delete('/', hasPerms(perms.PERMISSION_SCOPE_ENTRIES, perms.PERMISSION_CRUD_DELETE), ctrlEntries.deleteAll);

  router.get('/' + ':' + parameters.PARAM_ID_ENTRY, hasPerms(perms.PERMISSION_SCOPE_ENTRIES, perms.PERMISSION_CRUD_READ), ctrlEntries.findOne);
  router.put('/' + ':' + parameters.PARAM_ID_ENTRY, hasPerms(perms.PERMISSION_SCOPE_ENTRIES, perms.PERMISSION_CRUD_WRITE), requireBodyDataObject, ctrlEntries.updateOne);
  router.delete('/' + ':' + parameters.PARAM_ID_ENTRY, hasPerms(perms.PERMISSION_SCOPE_ENTRIES, perms.PERMISSION_CRUD_DELETE), ctrlEntries.deleteOne);
};