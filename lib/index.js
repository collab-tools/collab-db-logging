'use strict';

// import fs from 'fs';
// import winston from 'winston';
// import winstonRotate from 'winston-daily-rotate-file';
// import Sequelize from 'sequelize';

var fs = require('fs');
var winston = require('winston');
var winstonRotate = require('winston-daily-rotate-file');
var Sequelize = require('sequelize');

// Setup logger to log connections and queries send to the database
// ========================================================================
function setupLogger(logDir) {
  // configure logger to use as default error handler
  var tsFormat = function tsFormat() {
    return new Date().toLocaleTimeString();
  };
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  winston.remove(winston.transports.Console);

  // default transport for console with timestamp and color coding
  winston.add(winston.transports.Console, {
    prettyPrint: true,
    timestamp: tsFormat,
    colorize: true,
    level: 'debug'
  });

  // file transport for debug messages
  winston.add(winstonRotate, {
    name: 'debug-transport',
    filename: logDir + '/debug.log',
    timestamp: tsFormat,
    level: 'debug'
  });

  winston.info('Database debugging initialized.');
}

// Setup Sequelize and Connection with Database
// ======================================================
module.exports = function (config) {
  // export default (config) => {
  var dbName = config.name;
  var dbUsername = config.username;
  var dbPassword = config.password;
  var dbOptions = config.options;

  // If logging configuration is found, evaluate and setup logger if needed
  if (config.logging) {
    setupLogger(config.logging);
  }

  var models = {};
  var sequelize = new Sequelize(dbName, dbUsername, dbPassword, dbOptions);
  models.sequelize = sequelize;

  var modelFiles = ['admin', 'commit-log', 'release-log', 'file-log', 'milestone-log', 'task-log'];

  modelFiles.forEach(function (model) {
    models[model.replace('-', '_')] = sequelize.import(__dirname + '/' + model);
  });

  // Synchronize all the defined model into the actual mySQL database
  // ========================================================================
  sequelize.sync().catch(config.logging ? winston.error : console.error);

  return models;
};