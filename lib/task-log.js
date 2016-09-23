'use strict';

var uuid = require('node-uuid');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('task_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    activity: DataTypes.CHAR,
    date: DataTypes.DATE,
    userId: DataTypes.STRING,
    projectId: DataTypes.STRING,
    taskId: DataTypes.STRING
  }, {
    underscored: true,
    classMethods: {
      // range is optional.
      getByUserProject: function getByUserProject(userId, projectId, range) {
        var where = !range ? { userId: userId, projectId: projectId } : { userId: userId, projectId: projectId, date: { $gt: range } };
        return this.findAll({ where: where });
      },
      getByProject: function getByProject(projectId, range) {
        var where = { projectId: projectId };
        if (range) where.date = { $gt: range };
        return this.findAll({ where: where });
      },
      createLog: function createLog(logInfo) {
        logInfo.id = uuid.v4();
        return this.create(logInfo);
      },
      getByRange: function getByRange(range) {
        var where = {};
        if (range) where.date = { $gt: range };
        return this.findAndCountAll({ where: where });
      }
    },
    activityCode: {
      CREATE: 'C',
      DONE: 'D'
    }
  });
};