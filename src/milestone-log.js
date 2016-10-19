import uuid from 'node-uuid';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('milestone_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    activity: DataTypes.CHAR,
    date: DataTypes.DATE,
    projectId: {
      type: DataTypes.STRING,
      field: 'project_id'
    },
    milestoneId: {
      type: DataTypes.STRING,
      field: 'milestone_id'
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
