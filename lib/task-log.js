'use strict';

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('task_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    activity: DataTypes.CHAR,
    date: DataTypes.DATE,
    userId: {
      type: DataTypes.STRING,
      field: 'user_id'
    },
    milestoneId: {
      type: DataTypes.STRING,
      field: 'milestone_id'
    },
    projectId: {
      type: DataTypes.STRING,
      field: 'project_id'
    },
    taskId: {
      type: DataTypes.STRING,
      field: 'task_id'
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
      getParticipatingUsers: function getParticipatingUsers(start, end) {
        var where = {};
        where.date = { $between: [start, end] };
        return this.findAll({
          where: where,
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('user_id')), 'userId']]
        });
      },
      getProjectActivities: function getProjectActivities(projectId, start, end) {
        var where = { projectId: projectId };
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      getMilestoneActivities: function getMilestoneActivities(milestoneId, start, end) {
        var where = { milestoneId: milestoneId };
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      getUserActivities: function getUserActivities(userId, start, end) {
        var where = { userId: userId };
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      getUserActivitiesByProject: function getUserActivitiesByProject(userId, projectId, start, end) {
        var where = { userId: userId, projectId: projectId };
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      getTaskActivities: function getTaskActivities(userId, taskId, start, end) {
        var where = { taskId: taskId };
        where.date = { $between: [start, end] };
        if (userId) where.userId = userId;
        return this.findAll({ where: where });
      },
      getActivities: function getActivities(start, end) {
        var where = {};
        where.date = { $between: [start, end] };
        return this.findAll({ where: where });
      },
      createLog: function createLog(logInfo) {
        logInfo.id = _nodeUuid2.default.v4();
        return this.create(logInfo);
      }
    }
  });
};