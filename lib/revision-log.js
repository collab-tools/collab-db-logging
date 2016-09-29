'use strict';

var uuid = require('node-uuid');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('revision_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    fileUUID: DataTypes.STRING,
    fileName: DataTypes.STRING,
    fileMIME: DataTypes.STRING,
    date: DataTypes.DATE,
    googleId: DataTypes.STRING,
    projectId: DataTypes.STRING
  }, {
    underscored: true,
    classMethods: {
      getFileRevisions: function getFileRevisions(fileUUID, range) {
        var where = { fileUUID: fileUUID };
        if (range) where.date = { $gt: range };
        return this.findAll({ where: where });
      },
      getProjectRevisions: function getProjectRevisions(projectId, fileUUID, range) {
        var where = { projectId: projectId };
        if (range) where.date = { $gt: range };
        if (fileUUID) where.fileUUID = fileUUID;
        return this.findAll({ where: where });
      },
      getUserRevisions: function getUserRevisions(googleId, fileUUID, range) {
        var where = { googleId: googleId };
        if (range) where.date = { $gt: range };
        if (fileUUID) where.fileUUID = fileUUID;
        return this.findAll({ where: where });
      },
      getUserRevisionsByProject: function getUserRevisionsByProject(googleId, projectId, fileUUID, range) {
        var where = { googleId: googleId, projectId: projectId };
        if (range) where.date = { $gt: range };
        if (fileUUID) where.fileUUID = fileUUID;
        return this.findAll({ where: where });
      },
      getRevisionsCount: function getRevisionsCount(range) {
        var where = {};
        if (range) where.date = { $gt: range };
        return this.count({ where: where });
      },
      getRevisions: function getRevisions(range) {
        var where = {};
        if (range) where.date = { $gt: range };
        return this.findAll({ where: where });
      },
      getParticipationCount: function getParticipationCount(range) {
        var where = {};
        if (range) where.date = { $gt: range };
        return this.count({
          where: where,
          attributes: [[sequelize.literal('DISTINCT `googleId`'), 'googleId']]
        });
      },
      createLog: function createLog(logInfo) {
        logInfo.id = uuid.v4();
        return this.create(logInfo);
      }
    }
  });
};