import moment from 'moment';
import uuid from 'node-uuid';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('file_log', {
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
      getActivities(start, end) {
        const where = {};
        where.date = { $between: [start, end] };
        return this.findAll({ where });
      },
      getFileActivities(fileUUID, start, end) {
        const where = { fileUUID };
        where.date = { $between: [start, end] };
        return this.findAll({ where });
      },
      getProjectActivities(projectId, start, end) {
        const where = { projectId };
        where.date = { $between: [start, end] };
        return this.findAll({ where });
      },
      getUserActivities(email, start, end) {
        const where = { email };
        where.date = { $between: [start, end] };
        return this.findAll({ where });
      },
      getUserActivitiesByProject(email, projectId, start, end) {
        const where = { email, projectId };
        where.date = { $between: [start, end] };
        return this.findAll({ where });
      },
      getFiles(email, projectId, start = moment(0).toDate(), end = moment().toDate()) {
        const where = { activity: 'C' };
        if (projectId) where.projectId = projectId;
        if (email) where.email = email;
        where.date = { $between: [start, end] };
        return this.findAll({
          where,
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('file_uuid')), 'fileUUID'],
            'fileName', 'fileMIME', 'fileExtension', 'email', 'projectId'
          ]
        });
      },
      getFile(fileUUID) {
        const where = { fileUUID, activity: 'C' };
        return this.findOne({
          where,
          attributes: [
            'fileUUID', 'fileName', 'fileMIME', 'fileExtension',
            'date', 'email', 'projectId', 'id'
          ]
        });
      },
      getChanges(start, end) {
        const where = { activity: 'U' };
        where.date = { $between: [start, end] };
        return this.findAll({ where });
      },
      getFileChanges(fileUUID, start, end) {
        const where = { fileUUID, activity: 'U' };
        where.date = { $between: [start, end] };
        return this.findAll({ where });
      },
      getProjectChanges(projectId, start, end) {
        const where = { projectId, activity: 'U' };
        where.date = { $between: [start, end] };
        return this.findAll({ where });
      },
      getUserChanges(email, start, end) {
        const where = { email, activity: 'U' };
        where.date = { $between: [start, end] };
        return this.findAll({ where });
      },
      getUserChangesByProject(email, projectId, start, end) {
        const where = { email, projectId, activity: 'U' };
        where.date = { $between: [start, end] };
        return this.findAll({ where });
      },
      getParticipatingUsers(start, end) {
        const where = {};
        where.date = { $between: [start, end] };
        return this.findAll({
          where,
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('email')), 'email']
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
      createLog(logInfo) {
        logInfo.id = uuid.v4();
        return this.create(logInfo);
      },
      upsertLog(logInfo) {
        const where = {
          activity: logInfo.activity,
          fileUUID: logInfo.fileUUID
        };
        const defaultFile = {
          id: uuid.v4(),
          fileName: logInfo.fileName,
          fileMIME: logInfo.fileMIME,
          fileExtension: logInfo.fileExtension,
          date: logInfo.date,
          email: logInfo.email,
          projectId: logInfo.projectId
        };
        return this.findOrCreate({ where, defaults: defaultFile })
          .then((instance, created) => {
            const fileNameChanged = logInfo.fileName !== instance.fileName;
            return (created || fileNameChanged) ? instance : this.update(logInfo);
          });
      }
    }
  });
};
