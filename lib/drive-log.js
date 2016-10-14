'use strict';

var uuid = require('node-uuid');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('drive_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    activity: DataTypes.CHAR,
    fileUUID: {
      type: DataTypes.STRING,
      field: 'file_uuid'
    },
    fileName: {
      type: DataTypes.STRING,
      field: 'file_name'
    },
    fileMIME: {
      type: DataTypes.STRING,
      field: 'file_mime'
    },
    fileExtension: {
      type: DataTypes.STRING,
      field: 'file_extension'
    },
    date: DataTypes.DATE,
    googleId: {
      type: DataTypes.STRING,
      field: 'google_id'
    },
    projectId: {
      type: DataTypes.STRING,
      field: 'project_id'
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
  }, {
    timestamps: true,
    classMethods: {
      getUniqueFiles: function getUniqueFiles(projectId, googleId, range) {
        var where = {};
        if (projectId) where.projectId = projectId;
        if (googleId) where.googleId = googleId;
        if (range) where.date = { $gt: range };
        return this.findAll({
          where: where,
          attributes: [[sequelize.literal('DISTINCT `fileUUID`'), 'fileUUID'], 'fileName', 'fileMIME', 'fileExtension', 'date', 'googleId', 'projectId', 'id']
        });
      },
      getFile: function getFile(fileUUID) {
        var where = { fileUUID: fileUUID };
        return this.findOne({
          where: where,
          attributes: ['fileUUID', 'fileName', 'fileMIME', 'fileExtension', 'date', 'googleId', 'projectId', 'id']
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