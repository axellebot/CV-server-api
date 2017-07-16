var getPagination = require("../helpers").getPagination;

const Profile = require('../models/profile.schema');

/* Profiles page. */
exports.profiles = {};
exports.profiles.get = function (req, res, next) {
    //TODO : Profiles - Handle options
    var pagination = getPagination(req);
    Profile
        .find({})
        .limit(pagination.limit)
        .skip(pagination.skip)
        .exec(function (err, profiles) {
            if (err) return next(err);
            res.json({data: profiles});
        });
};
exports.profiles.post = function (req, res, next) {
    //TODO : Profiles - Create profile
    res.status(404).send('Create a new Profile');
};
exports.profiles.put = function (req, res, next) {
    //TODO : Profiles - Add Bulk update
    res.status(404).send('Bulk update of profiles');
};
exports.profiles.delete = function (req, res, next) {
    //TODO : Profiles - Remove all profiles
    res.status(404).send('Remove all profiles');
};

/* Profile page. */
exports.profile = {};
exports.profile.get = function (req, res, next) {
    Profile
        .findById(req.params.id)
        .exec(function (err, profile) {
            if (err) return next(err);
            res.json({data: profile});
        });
};
exports.profile.post = function (req, res, next) {
    res.sendStatus(403);
};
exports.profile.put = function (req, res, next) {
    //TODO : Profile - Update profile
    res.status(404).send('Update details of profiles');
};
exports.profile.delete = function (req, res, next) {
    //TODO : Profile - Remove profile
    res.status(404).send('Remove profile');
};