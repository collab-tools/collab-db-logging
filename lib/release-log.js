'use strict';

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('release_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    date: DataTypes.DATE,
    assets: DataTypes.TEXT,
    tagName: {
      type: DataTypes.STRING,
      field: 'tag_name'
    },
    body: DataTypes.STRING,
    projectId: {
      type: DataTypes.STRING,
      field: 'project_id'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }, {
    underscored: true,
    timestamps: true,
    classMethods: {
      getRelease: function getRelease(id) {
        return this.findById(id);
      },
      getReleases: function getReleases(start, end) {
        var where = {};
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      getReleasesCount: function getReleasesCount(start, end) {
        var where = {};
        where.date = { $between: [start, end] };
        return this.count({ where: where });
      },
      getProjectReleases: function getProjectReleases(projectId, start, end) {
        var where = { projectId: projectId };
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      createLog: function createLog(logInfo) {
        logInfo.id = _nodeUuid2.default.v4();
        return this.create(logInfo);
      },
      upsertLog: function upsertLog(logInfo) {
        var _this = this;

        var defaultRelease = { id: _nodeUuid2.default.v4() };
        return this.findOrCreate({ where: logInfo, defaults: defaultRelease }).then(function (instance, created) {
          var isUpdated = (0, _moment2.default)(instance.date).diff((0, _moment2.default)(logInfo.date)) > 0;
          return created || isUpdated ? instance : _this.update(logInfo);
        });
      }
    }
  });
};