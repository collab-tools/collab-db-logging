'use strict';

// import moment from 'moment';
// import uuid from 'node-uuid';
var moment = require('moment');
var uuid = require('node-uuid');

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
        logInfo.id = uuid.v4();
        return this.create(logInfo);
      },
      upsertLog: function upsertLog(logInfo) {
        var _this = this;

        var defaultRelease = { id: uuid.v4() };
        return this.findOrCreate({ where: logInfo, defaults: defaultRelease }).then(function (instance, created) {
          var isUpdated = moment(instance.date).diff(moment(logInfo.date)) > 0;
          return created || isUpdated ? instance : _this.update(logInfo);
        });
      }
    }
  });
};