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

// Setup logger to log connections and queries send to the database
// ========================================================================
function setupLogger(logDir) {
  // configure logger to use as default error handler
  var tsFormat = function tsFormat() {
    return new Date().toLocaleTimeString();
  };
  if (!_fs2.default.existsSync(logDir)) {
    _fs2.default.mkdirSync(logDir);
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
    filename: logDir + '/debug.log',
    timestamp: tsFormat,
    level: 'debug'
  });

  _winston2.default.info('Database debugging initialized.');
}

// Setup Sequelize and Connection with Database
// ======================================================

exports.default = function (config) {
  var dbName = config.name;
  var dbUsername = config.username;
  var dbPassword = config.password;
  var dbOptions = config.options;

  // If logging configuration is found, evaluate and setup logger if needed
  if (config.logging) {
    setupLogger(config.logging);
  }

  var models = {};
  var sequelize = new _sequelize2.default(dbName, dbUsername, dbPassword, dbOptions);
  models.sequelize = sequelize;

  var modelFiles = ['admin', 'commit-log', 'release-log', 'file-log', 'milestone-log', 'task-log'];

  modelFiles.forEach(function (model) {
    models[model.replace('-', '_')] = sequelize.import(__dirname + '/' + model);
  });

  // Synchronize all the defined model into the actual mySQL database
  // ========================================================================
  sequelize.sync().catch(config.logging ? _winston2.default.error : console.error);

  return models;
};

module.exports = exports['default'];