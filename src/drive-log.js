import uuid from 'node-uuid';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('drive_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    activity: DataTypes.CHAR,
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
    fileExtension: {
      type: DataTypes.STRING,
      field: 'file_extension'
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
      getUniqueFiles(projectId, email, range) {
        const where = {};
        if (projectId) where.projectId = projectId;
        if (email) where.email = email;
        if (range) where.date = { $gt: range };
        return this.findAll({
          where,
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('file_uuid')), 'fileUUID'], 'fileName', 'fileMIME',
            'fileExtension', 'email', 'projectId'
          ]
        });
      },
      getFile(fileUUID) {
        const where = { fileUUID };
        return this.findOne({
          where,
          attributes: [
            'fileUUID', 'fileName', 'fileMIME', 'fileExtension',
            'date', 'email', 'projectId', 'id'
          ]
        });
      },
      createLog(logInfo) {
        logInfo.id = uuid.v4();
        return this.create(logInfo);
      },
      upsertLog(logInfo) {
        const where = {
          activity: logInfo.activity,
          fileUUID: logInfo.fileUUID
        };
        const defaultDrive = {
          id: uuid.v4(),
          fileName: logInfo.fileName,
          fileMIME: logInfo.fileMIME,
          fileExtension: logInfo.fileExtension,
          date: logInfo.date,
          email: logInfo.email,
          projectId: logInfo.projectId
        };
        return this.findOrCreate({ where, defaults: defaultDrive })
          .then((instance, created) => {
            const fileNameChanged = logInfo.fileName !== instance.fileName;
            return (created || fileNameChanged) ? instance : this.update(logInfo);
          });
      }
    }
  });
};
