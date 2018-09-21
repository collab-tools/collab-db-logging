// import uuid from 'node-uuid';
const uuid = require('node-uuid');

module.exports = (sequelize, DataTypes) => {
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
      getParticipatingUsers(start, end) {
        const where = {};
        where.date = { $between: [start, end] };
        return this.findAll({
          where,
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('user_id')), 'userId']
          ]
        });
      },
      getParticipatingProjects(start, end) {
        const where = {};
        where.date = { $between: [start, end] };
        return this.findAll({
          where,
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('project_id')), 'projectId']
          ]
        });
      },
      getProjectActivities(projectId, start, end) {
        const where = { projectId };
        where.date = { $between: [start, end] };
        return this.findAll({ where });
      },
      getMilestoneActivities(milestoneId, start, end) {
        const where = { milestoneId };
        where.date = { $between: [start, end] };
        return this.findAll({ where });
      },
      getUserActivities(userId, start, end) {
        const where = { userId };
        where.date = { $between: [start, end] };
        return this.findAll({ where });
      },
      getUserActivitiesByProject(userId, projectId, start, end) {
        const where = { userId, projectId };
        where.date = { $between: [start, end] };
        return this.findAll({ where });
      },
      getTaskActivities(userId, taskId, start, end) {
        const where = { taskId };
        where.date = { $between: [start, end] };
        if (userId) where.userId = userId;
        return this.findAll({ where });
      },
      getActivities(start, end) {
        const where = {};
        where.date = { $between: [start, end] };
        return this.findAll({ where });
      },
      createLog(logInfo) {
        logInfo.id = uuid.v4();
        return this.create(logInfo);
      }
    }
  });
};
