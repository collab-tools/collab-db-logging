const uuid = require('node-uuid');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('revision_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    fileUUID: {
      type: DataTypes.STRING,
      field: 'file_uuid'
    },
    fileName: {
      type: DataTypes.STRING,
      field: 'file_name'
    },
    fileMIME: {
      type: DataTypes.STRING,
      field: 'file_mime'
    },
    date: DataTypes.DATE,
    googleId: {
      type: DataTypes.STRING,
      field: 'google_id'
    },
    projectId: {
      type: DataTypes.STRING,
      field: 'project_id'
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' }
  }, {
    timestamps: true,
    classMethods: {
      getFileRevisions(fileUUID, range) {
        const where = { fileUUID };
        if (range) where.date = { $gt: range };
        return this.findAll({ where });
      },
      getProjectRevisions(projectId, fileUUID, range) {
        const where = { projectId };
        if (range) where.date = { $gt: range };
        if (fileUUID) where.fileUUID = fileUUID;
        return this.findAll({ where });
      },
      getUserRevisions(googleId, fileUUID, range) {
        const where = { googleId };
        if (range) where.date = { $gt: range };
        if (fileUUID) where.fileUUID = fileUUID;
        return this.findAll({ where });
      },
      getUserRevisionsByProject(googleId, projectId, fileUUID, range) {
        const where = { googleId, projectId };
        if (range) where.date = { $gt: range };
        if (fileUUID) where.fileUUID = fileUUID;
        return this.findAll({ where });
      },
      getRevisionsCount(range) {
        const where = {};
        if (range) where.date = { $gt: range };
        return this.count({ where });
      },
      getRevisions(range) {
        const where = {};
        if (range) where.date = { $gt: range };
        return this.findAll({ where });
      },
      getParticipationCount(range) {
        const where = {};
        if (range) where.date = { $gt: range };
        return this.count({
          where,
          attributes: [
            [sequelize.literal('DISTINCT `googleId`'), 'googleId']
          ]
        });
      },
      createLog(logInfo) {
        logInfo.id = uuid.v4();
        return this.create(logInfo);
      }
    }
  });
};
