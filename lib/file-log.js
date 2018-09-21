'use strict';

// import moment from 'moment';
// import uuid from 'node-uuid';
var moment = require('moment');
var uuid = require('node-uuid');

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
      getActivities: function getActivities(start, end) {
        var where = {};
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      getFileActivities: function getFileActivities(fileUUID, start, end) {
        var where = { fileUUID: fileUUID };
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      getProjectActivities: function getProjectActivities(projectId, start, end) {
        var where = { projectId: projectId };
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      getUserActivities: function getUserActivities(email, start, end) {
        var where = { email: email };
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      getUserActivitiesByProject: function getUserActivitiesByProject(email, projectId, start, end) {
        var where = { email: email, projectId: projectId };
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      getFiles: function getFiles(email, projectId) {
        var start = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : moment(0).toDate();
        var end = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : moment().toDate();

        var where = { activity: 'C' };
        if (projectId) where.projectId = projectId;
        if (email) where.email = email;
        where.date = { $between: [start, end] };
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
      getChanges: function getChanges(start, end) {
        var where = { activity: 'U' };
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      getFileChanges: function getFileChanges(fileUUID, start, end) {
        var where = { fileUUID: fileUUID, activity: 'U' };
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      getProjectChanges: function getProjectChanges(projectId, start, end) {
        var where = { projectId: projectId, activity: 'U' };
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      getUserChanges: function getUserChanges(email, start, end) {
        var where = { email: email, activity: 'U' };
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      getUserChangesByProject: function getUserChangesByProject(email, projectId, start, end) {
        var where = { email: email, projectId: projectId, activity: 'U' };
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      getParticipatingUsers: function getParticipatingUsers(start, end) {
        var where = {};
        where.date = { $between: [start, end] };
        return this.findAll({
          where: where,
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('email')), 'email']]
        });
      },
      getParticipatingProjects: function getParticipatingProjects(start, end) {
        var where = {};
        where.date = { $between: [start, end] };
        return this.findAll({
          where: where,
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('project_id')), 'projectId']]
        });
      },
      createLog: function createLog(logInfo) {
        logInfo.id = uuid.v4();
        return this.create(logInfo);
      },
      upsertLog: function upsertLog(logInfo) {
        var _this = this;

        var where = {
          activity: logInfo.activity,
          fileUUID: logInfo.fileUUID
        };
        var defaultFile = {
          id: uuid.v4(),
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
      }
    }
  });
};