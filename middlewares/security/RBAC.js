"use strict";

// Errors
const MissingPrivilegeError = require('@errors/MissingPrivilegeError');

// Security
const ensureAuthentication = require('@middlewares/security/authentication');

// Constants
const permissions = require('@constants/permissions');

/**
 * @param req
 * @param res
 * @param next
 */
module.exports = (scopeName, permCRUD) => {
  return [
    ensureAuthentication,
    (req, res, next) => {
      console.info({
        "Scope": scopeName,
        perm: permCRUD,
        user: req.user
      });
      if (!req.user || !req.user.permission) return next(new MissingPrivilegeError());

      const scopes = req.user.permission.scopes;
      const scope = scopes[scopeName];
      if (!scope) return next(new MissingPrivilegeError());

      if (scope && scope[permCRUD]) {
        console.info({
          scope: scope
        });
        const permType = scope[permCRUD];
        if (permType === permissions.PERMISSION_TYPE_NONE) return next(new MissingPrivilegeError());
        return next();
      }
      return next(new MissingPrivilegeError())
    }
  ];
};