import uuid from 'node-uuid';

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
      getParticipatingUsers(range) {
        const where = {};
        if (range) where.date = { $gt: range };
        return this.findAll({
          where,
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('userId')), 'userId']
          ]
        });
      },
      getProjectActivities(projectId, range) {
        const where = { projectId };
        if (range) where.date = { $gt: range };
        return this.findAll({ where });
      },
      getMilestoneActivities(milestoneId, range) {
        const where = { milestoneId };
        if (range) where.date = { $gt: range };
        return this.findAll({ where });
      },
      getUserActivities(userId, range) {
        const where = { userId };
        if (range) where.date = { $gt: range };
        return this.findAll({ where });
      },
      getUserActivitiesByProject(userId, projectId, range) {
        const where = { userId, projectId };
        if (range) where.date = { $gt: range };
        return this.findAll({ where });
      },
      getTaskActivities(userId, taskId, range) {
        const where = { taskId };
        if (range) where.date = { $gt: range };
        if (userId) where.userId = userId;
        return this.findAll({ where });
      },
      getActivities(range) {
        const where = {};
        if (range) where.date = { $gt: range };
        return this.findAll({ where });
      },
      createLog(logInfo) {
        logInfo.id = uuid.v4();
        return this.create(logInfo);
      }
    }
  });
};
