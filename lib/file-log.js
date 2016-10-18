'use strict';

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('file_log', {
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
    email: DataTypes.STRING,
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
      getUniqueFiles: function getUniqueFiles(projectId, email, range) {
        var where = { activity: 'C' };
        if (projectId) where.projectId = projectId;
        if (email) where.email = email;
        if (range) where.date = { $gt: range };
        return this.findAll({
          where: where,
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('file_uuid')), 'fileUUID'], 'fileName', 'fileMIME', 'fileExtension', 'email', 'projectId']
        });
      },
      getFile: function getFile(fileUUID) {
        var where = { fileUUID: fileUUID, activity: 'C' };
        return this.findOne({
          where: where,
          attributes: ['fileUUID', 'fileName', 'fileMIME', 'fileExtension', 'date', 'email', 'projectId', 'id']
        });
      },
      getRevisions: function getRevisions(range) {
        var where = { activity: 'U' };
        if (range) where.date = { $gt: range };
        return this.findAll({ where: where });
      },
      getFileRevisions: function getFileRevisions(fileUUID, range) {
        var where = { fileUUID: fileUUID, activity: 'U' };
        if (range) where.date = { $gt: range };
        return this.findAll({ where: where });
      },
      getProjectRevisions: function getProjectRevisions(projectId, fileUUID, range) {
        var where = { projectId: projectId, activity: 'U' };
        if (range) where.date = { $gt: range };
        if (fileUUID) where.fileUUID = fileUUID;
        return this.findAll({ where: where });
      },
      getUserRevisions: function getUserRevisions(email, fileUUID, range) {
        var where = { email: email, activity: 'U' };
        if (range) where.date = { $gt: range };
        if (fileUUID) where.fileUUID = fileUUID;
        return this.findAll({ where: where });
      },
      getUserRevisionsByProject: function getUserRevisionsByProject(email, projectId, fileUUID, range) {
        var where = { email: email, projectId: projectId, activity: 'U' };
        if (range) where.date = { $gt: range };
        if (fileUUID) where.fileUUID = fileUUID;
        return this.findAll({ where: where });
      },
      createLog: function createLog(logInfo) {
        logInfo.id = _nodeUuid2.default.v4();
        return this.create(logInfo);
      },
      upsertLog: function upsertLog(logInfo) {
        var _this = this;

        var where = {
          activity: logInfo.activity,
          fileUUID: logInfo.fileUUID
        };
        var defaultFile = {
          id: _nodeUuid2.default.v4(),
          fileName: logInfo.fileName,
          fileMIME: logInfo.fileMIME,
          fileExtension: logInfo.fileExtension,
          date: logInfo.date,
          email: logInfo.email,
          projectId: logInfo.projectId
        };
        return this.findOrCreate({ where: where, defaults: defaultFile }).then(function (instance, created) {
          var fileNameChanged = logInfo.fileName !== instance.fileName;
          return created || fileNameChanged ? instance : _this.update(logInfo);
        });
      },
      getParticipatingUsers: function getParticipatingUsers(range) {
        var where = {};
        if (range) where.date = { $gt: range };
        return this.count({
          where: where,
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('email')), 'email']]
        });
      }
    }
  });
};