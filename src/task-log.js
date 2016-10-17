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
      getByProject(projectId, range) {
        const where = { projectId };
        if (range) where.date = { $gt: range };
        return this.findAll({ where });
      },
      getByRange(range) {
        const where = {};
        if (range) where.date = { $gt: range };
        return this.findAndCountAll({ where });
      },
      createLog(logInfo) {
        logInfo.id = uuid.v4();
        return this.create(logInfo);
      }
    }
  });
};
