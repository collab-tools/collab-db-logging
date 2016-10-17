import moment from 'moment';
import uuid from 'node-uuid';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('release_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    date: DataTypes.DATE,
    assets: DataTypes.STRING,
    tagName: {
      type: DataTypes.STRING,
      field: 'tag_name'
    },
    body: DataTypes.STRING,
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
      getRelease(id) {
        return this.findById(id);
      },
      getReleases(range) {
        const where = {};
        if (range) where.date = { $gt: range };
        return this.findAll({ where });
      },
      getReleasesCount(range) {
        const where = {};
        if (range) where.date = { $gt: range };
        return this.count({ where });
      },
      getProjectReleases(projectId, range) {
        const where = { projectId };
        if (range) where.date = { $gt: range };
        return this.findAll({ where });
      },
      createLog(logInfo) {
        logInfo.id = uuid.v4();
        return this.create(logInfo);
      },
      upsertLog(logInfo) {
        const defaultRelease = { id: uuid.v4() };
        return this.findOrCreate({ where: logInfo, defaults: defaultRelease })
          .then((instance, created) => {
            const isUpdated = moment(instance.date).diff(moment(logInfo.date)) > 0;
            return (created || isUpdated) ? instance : this.update(logInfo);
          });
      }
    }
  });
};
