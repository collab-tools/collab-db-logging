'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _winstonDailyRotateFile = require('winston-daily-rotate-file');

var _winstonDailyRotateFile2 = _interopRequireDefault(_winstonDailyRotateFile);

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Setup Sequelize and Connection with Database
// ======================================================
exports.default = function (config) {
  var dbName = config.name;
  var dbUsername = config.username;
  var dbPassword = config.password;
  var dbOptions = config.options;
  var dbLogging = config.logging;

  // configure logger to use as default error handler
  var tsFormat = function tsFormat() {
    return new Date().toLocaleTimeString();
  };
  if (!_fs2.default.existsSync(dbLogging)) {
    _fs2.default.mkdirSync(dbLogging);
  }
  _winston2.default.remove(_winston2.default.transports.Console);

  // default transport for console with timestamp and color coding
  _winston2.default.add(_winston2.default.transports.Console, {
    prettyPrint: true,
    timestamp: tsFormat,
    colorize: true,
    level: 'debug'
  });

  // file transport for debug messages
  _winston2.default.add(_winstonDailyRotateFile2.default, {
    name: 'debug-transport',
    filename: dbLogging + '/debug.log',
    timestamp: tsFormat,
    level: 'debug'
  });

  _winston2.default.info('Debugging tool initialized.');

  var models = {};
  var sequelize = new _sequelize2.default(dbName, dbUsername, dbPassword, dbOptions);
  models.sequelize = sequelize;

  var modelFiles = ['admin', 'commit-log', 'release-log', 'drive-log', 'milestone-log', 'revision-log', 'task-log'];

  modelFiles.forEach(function (model) {
    models[model.replace('-', '_')] = sequelize.import(__dirname + '/' + model);
  });

  // Synchronize all the defined model into the actual mySQL database
  // ========================================================================
  sequelize.sync();

  return models;
};

module.exports = exports['default'];