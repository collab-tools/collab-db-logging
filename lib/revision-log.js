'use strict';

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('revision_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
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
    revisionUUID: {
      type: DataTypes.STRING,
      field: 'revision_uuid'
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
      getUserRevisions: function getUserRevisions(email, fileUUID, range) {
        var where = { email: email };
        if (range) where.date = { $gt: range };
        if (fileUUID) where.fileUUID = fileUUID;
        return this.findAll({ where: where });
      },
      getUserRevisionsByProject: function getUserRevisionsByProject(email, projectId, fileUUID, range) {
        var where = { email: email, projectId: projectId };
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
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('email')), 'email']]
        });
      },
      createLog: function createLog(logInfo) {
        var defaultRevision = { id: _nodeUuid2.default.v4() };
        return this.findOrCreate({ where: logInfo, defaults: defaultRevision });
      }
    }
  });
};