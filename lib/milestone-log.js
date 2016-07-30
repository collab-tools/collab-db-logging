'use strict';

var uuid = require('node-uuid');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('milestone_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    activity: DataTypes.CHAR,
    date: DataTypes.DATE,
    userId: DataTypes.STRING,
    projectId: DataTypes.STRING,
    milestoneId: DataTypes.STRING
  }, {
    underscored: true,
    classMethods: {
      getByUserId: function getByUserId(userId) {
        var where = { userId: userId };
        return this.findAll({ where: where });
      },
      getByUserProject: function getByUserProject(userId, projectId, range) {
        var where = { userId: userId, projectId: projectId };
        if (range) where.date = { $gt: range };
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
      }
    },
    activityCode: {
      CREATE: 'C',
      DONE: 'D'
    }
  });
};