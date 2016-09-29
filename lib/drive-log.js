'use strict';

var uuid = require('node-uuid');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('drive_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    activity: DataTypes.CHAR,
    fileUUID: DataTypes.STRING,
    fileName: DataTypes.STRING,
    fileMIME: DataTypes.STRING,
    date: DataTypes.DATE,
    googleId: DataTypes.STRING,
    projectId: DataTypes.STRING
  }, {
    underscored: true,
    classMethods: {
      getUniqueFiles: function getUniqueFiles(projectId, googleId, range) {
        var where = {};
        if (projectId) where.projectId = projectId;
        if (googleId) where.googleId = googleId;
        if (range) where.date = { $gt: range };
        return this.findAll({
          where: where,
          attributes: [[sequelize.literal('DISTINCT `fileUUID`'), 'fileUUID'], 'fileName', 'fileMIME', 'date', 'googleId', 'projectId', 'id']
        });
      },
      getFile: function getFile(fileUUID) {
        var where = { fileUUID: fileUUID };
        return this.findOne({
          where: where,
          attributes: ['fileUUID', 'fileName', 'fileMIME', 'date', 'googleId', 'projectId', 'id']
        });
      },
      createLog: function createLog(logInfo) {
        logInfo.id = uuid.v4();
        return this.create(logInfo);
      }
    },
    activityCode: {
      CREATE: 'C',
      DELETED: 'D'
    }
  });
};