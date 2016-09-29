'use strict';

var uuid = require('node-uuid');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('release_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    date: DataTypes.DATE,
    assets: DataTypes.STRING,
    tagName: DataTypes.STRING,
    body: DataTypes.STRING,
    projectId: DataTypes.STRING
  }, {
    underscored: true,
    classMethods: {
      getRelease: function getRelease(id) {
        return this.findById(id);
      },
      getReleases: function getReleases(range) {
        var where = {};
        if (range) where.date = { $gt: range };
        return this.findAll({ where: where });
      },
      getReleasesCount: function getReleasesCount(range) {
        var where = {};
        if (range) where.date = { $gt: range };
        return this.count({ where: where });
      },
      getProjectReleases: function getProjectReleases(projectId, range) {
        var where = { projectId: projectId };
        if (range) where.date = { $gt: range };
        return this.findAll({ where: where });
      },
      createLog: function createLog(logInfo) {
        logInfo.id = uuid.v4();
        return this.create(logInfo);
      }
    },
    assetsDelimiter: ';'
  });
};