'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Sequelize = require('sequelize');

// Setup Sequelize and Connection with Database
// ======================================================

exports.default = function (config) {
  var dbName = config('name');
  var dbUsername = config('username');
  var dbPassword = config('password');
  var dbOptions = config('options');

  var models = {};
  var sequelize = new Sequelize(dbName, dbUsername, dbPassword, dbOptions);
  models.sequelize = sequelize;

  var modelFiles = ['admin', 'commit-log', 'release-log', 'drive-log', 'milestone-log', 'revision-log', 'task-log'];

  modelFiles.forEach(function (model) {
    models[model] = sequelize.import(__dirname + '/' + model);
  });

  // Synchronize all the defined model into the actual mySQL database
  // ========================================================================
  sequelize.sync().then(function () {}, function (error) {
    return console.error(error);
  });
};