const uuid = require('node-uuid');

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
    projectId: {
      type: DataTypes.STRING,
      field: 'project_id'
    },
    taskId: {
      type: DataTypes.STRING,
      field: 'task_id'
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
  }, {
    timestamps: true,
    classMethods: {
      getByProject(projectId, range) {
        const where = { projectId };
        if (range) where.date = { $gt: range };
        return this.findAll({ where });
      },
      createLog(logInfo) {
        logInfo.id = uuid.v4();
        return this.create(logInfo);
      },
      getByRange(range) {
        const where = {};
        if (range) where.date = { $gt: range };
        return this.findAndCountAll({ where });
      }
    },
    activityCode: {
      CREATE: 'C',
      DONE: 'D'
    }
  });
};
