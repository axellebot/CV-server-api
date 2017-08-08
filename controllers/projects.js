"use strict";

var getFilterEditData = require("../helpers").getFilterEditData;

const Project = require('../models/project.schema');

/* Projects page. */
exports.projects = {};
exports.projects.get = function (req, res, next) {
    //TODO : Projects - Handle options
    Project
        .find({})
        .limit(req.queryParsed.cursor.limit)
        .skip(req.queryParsed.cursor.skip)
        .sort(req.queryParsed.cursor.sort)
        .exec(function (err, projects) {
            if (err) return next(new DatabaseFindError());
            res.status(HTTP_STATUS_OK).json({data: projects});
        });
};

exports.projects.post = function (req, res, next) {
    //TODO : Projects - Create project
    next(new NotImplementedError("Create a new project'"));
};

exports.projects.put = function (req, res, next) {
    const projects = req.body.data;
    var projectsUpdated = [];
    Async.eachOf(projects, function (project, key, callback) {
        const filterUpdate = getFilterEditData(project._id, req.decoded);
        Project
            .findOneAndUpdate(filterUpdate, project, {new: true}, function (err, projectUpdated) {
                if (err) return callback(err);
                if (projectUpdated) projectsUpdated.push(projectUpdated);
                callback();
            });
    }, function (err) {
        if (err && projectsUpdated.length === 0) return next(new DatabaseUpdateError());
        if (err && projectsUpdated.length > 0) {
            return res
                .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
                .json({
                    error: true,
                    message: MESSAGE_ERROR_RESOURCES_PARTIAL_UPDATE,
                    data: projectsUpdated
                });
        }

        res
            .status(HTTP_STATUS_OK)
            .json({
                message: MESSAGE_ERROR_RESOURCES_PARTIAL_UPDATE,
                data: projectsUpdated
            });
    });
};

exports.projects.delete = function (req, res, next) {
    Project
        .remove()
        .exec(function (err, removed) {
            if (err) return next(new DatabaseRemoveError());
            return res.status(HTTP_STATUS_OK).json({error: false, message: `${JSON.parse(removed).n} deleted`});
        });
};

/* Project page. */
exports.project = {};
exports.project.get = function (req, res, next) {
    Project
        .findById(req.params[PARAM_ID_PROJECT])
        .exec(function (err, project) {
            if (err) return next(new DatabaseFindError());
            if (!project) return next(new NotFoundError(MODEL_NAME_PROJECT));
            res.status(HTTP_STATUS_OK).json({data: project});
        });
};

exports.project.put = function (req, res, next) {
    var filterUpdate = getFilterEditData(req.params[PARAM_ID_PROJECT], req.decoded);
    Project
        .findOneAndUpdate(filterUpdate, req.body.data, {new: true}, function (err, project) {
            if (err) return next(new DatabaseUpdateError());
            if (!project) return next(new NotFoundError(MODEL_NAME_PROJECT));
            return res.status(HTTP_STATUS_OK).json({message: MESSAGE_SUCCESS_RESOURCE_UPDATED, data: project});
        });
};

exports.project.delete = function (req, res, next) {
    var filterRemove = getFilterEditData(req.params[PARAM_ID_PROJECT], req.decoded);
    Project
        .findOneAndRemove(filterRemove, function (err, project) {
            if (err) return next(new DatabaseRemoveError());
            if (!project) return next(new NotFoundError(MODEL_NAME_PROJECT));
            res.status(HTTP_STATUS_OK).json({message: MESSAGE_SUCCESS_RESOURCE_DELETED, data: project});
        });
};