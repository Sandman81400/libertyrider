'use strict';

var url = require('url');

var User = require('./UserService');

module.exports.getAvg = function getAvg (req, res, next) {
  User.getAvg(req.swagger.params, res, next);
};

module.exports.createUser = function createUser (req, res, next) {
  User.createUser(req.swagger.params, res, next);
};

module.exports.deleteUser = function deleteUser (req, res, next) {
  User.deleteUser(req.swagger.params, res, next);
};

module.exports.getAll = function getAll (req, res, next) {
  User.getAll(req.swagger.params, res, next);
};

module.exports.getUser = function getUser (req, res, next) {
  User.getUser(req.swagger.params, res, next);
};

module.exports.updateUser = function updateUser (req, res, next) {
  User.updateUser(req.swagger.params, res, next);
};
