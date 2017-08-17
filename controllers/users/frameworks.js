"use strict";

var userCanEditUserData = require("../../helpers").userCanEditUserData;

const Framework = require('../../models/framework.schema');

/* Frameworks page. */
exports.get = function (req, res, next) {
    var filter = req.queryParsed.filter || {};
    filter.user = req.params[PARAM_ID_USER];

    Framework
        .find(filter)
        .select(req.queryParsed.select)
        .limit(req.queryParsed.cursor.limit)
        .skip(req.queryParsed.cursor.skip)
        .sort(req.queryParsed.cursor.sort)
        .exec(function (err, frameworks) {
            if (err) return next(new DatabaseFindError());
            res.status(HTTP_STATUS_OK).json({data: frameworks});
        });
};

exports.post = function (req, res, next) {
    const userId = req.params[PARAM_ID_USER];
    if (!userCanEditUserData(req.loggedUser, userId)) return next(new MissingPrivilegeError());

    var framework = req.body.data;
    framework.user = userId;
    framework = new Framework(framework);

    framework.save(function (err, frameworkSaved) {
        if (err) return next(new DatabaseCreateError(err.message)());
        res
            .status(HTTP_STATUS_OK)
            .json({
                message: MESSAGE_SUCCESS_RESOURCE_CREATED,
                data: frameworkSaved
            });
    });
};

exports.put = function (req, res, next) {
    const userId = req.params[PARAM_ID_USER];
    if (!userCanEditUserData(req.loggedUser, userId)) return next(new MissingPrivilegeError());
    const frameworks = req.body.data;
    var frameworksUpdated = [];
    Async.eachOf(frameworks, function (framework, key, callback) {
        const filterUpdate = {
            _id: framework._id,
            user: userId
        };
        Framework
            .findOneAndUpdate(filterUpdate, framework, {new: true}, function (err, frameworkUpdated) {
                if (err) return callback(err);
                if (frameworkUpdated) frameworksUpdated.push(frameworkUpdated);
                callback();
            });
    }, function (err) {
        if (err && frameworksUpdated.length === 0) return next(new DatabaseUpdateError());
        if (err && frameworksUpdated.length > 0) {
            return res
                .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
                .json({
                    error: true,
                    message: MESSAGE_ERROR_RESOURCES_PARTIAL_UPDATE,
                    data: frameworksUpdated
                });
        }
        res
            .status(HTTP_STATUS_OK)
            .json({
                message: MESSAGE_SUCCESS_RESOURCE_UPDATED,
                data: frameworksUpdated
            });
    });
};

exports.delete = function (req, res, next) {
    const userId = req.params[PARAM_ID_USER];
    if (!userCanEditUserData(req.loggedUser, userId)) return next(new MissingPrivilegeError());

    Framework
        .remove({user: userId})
        .exec(function (err, removed) {
            if (err) return next(new DatabaseRemoveError());
            res.status(HTTP_STATUS_OK).json({error: false, message: `${JSON.parse(removed).n} deleted`});
        });
};