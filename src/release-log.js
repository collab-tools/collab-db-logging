// import moment from 'moment';
// import uuid from 'node-uuid';
const moment = require('moment');
const uuid = require('node-uuid');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('release_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    date: DataTypes.DATE,
    assets: DataTypes.TEXT,
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
      getReleases(start, end) {
        const where = {};
        where.date = { $between: [start, end] };
        return this.findAll({ where });
      },
      getReleasesCount(start, end) {
        const where = {};
        where.date = { $between: [start, end] };
        return this.count({ where });
      },
      getProjectReleases(projectId, start, end) {
        const where = { projectId };
        where.date = { $between: [start, end] };
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
