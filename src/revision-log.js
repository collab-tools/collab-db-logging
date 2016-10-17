import uuid from 'node-uuid';

module.exports = (sequelize, DataTypes) => {
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
    revisionUUID: {
      type: DataTypes.STRING,
      field: 'revision_uuid'
    },
    date: DataTypes.DATE,
    email: DataTypes.STRING,
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
      getUserRevisions(email, fileUUID, range) {
        const where = { email };
        if (range) where.date = { $gt: range };
        if (fileUUID) where.fileUUID = fileUUID;
        return this.findAll({ where });
      },
      getUserRevisionsByProject(email, projectId, fileUUID, range) {
        const where = { email, projectId };
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
            [sequelize.fn('DISTINCT', sequelize.col('email')), 'email']
          ]
        });
      },
      createLog(logInfo) {
        const defaultRevision = { id: uuid.v4() };
        return this.findOrCreate({ where: logInfo, defaults: defaultRevision });
      }
    }
  });
};
