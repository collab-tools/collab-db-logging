// import uuid from 'node-uuid';
const uuid = require('node-uuid');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('commit_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    date: DataTypes.DATE,
    sha: DataTypes.STRING,
    message: DataTypes.STRING,
    githubLogin: {
      type: DataTypes.STRING,
      field: 'github_login'
    },
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
      getParticipatingUsers(start, end) {
        const where = {};
        where.date = { $between: [start, end] };
        return this.findAll({
          where,
          attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('github_login')), 'githubLogin']
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
      getProjectCommits(projectId, start, end) {
        const where = { projectId };
        where.date = { $between: [start, end] };
        return this.findAll({ where });
      },
      getUserCommits(githubLogin, projectId, start, end) {
        const where = { githubLogin };
        if (projectId) where.projectId = projectId;
        where.date = { $between: [start, end] };
        return this.findAll({ where });
      },
      getUserCommitsCount(githubLogin, projectId, start, end) {
        const where = { githubLogin };
        if (projectId) where.projectId = projectId;
        where.date = { $between: [start, end] };
        return this.count({ where });
      },
      getCommitsCount(start, end) {
        const where = {};
        where.date = { $between: [start, end] };
        return this.count({ where });
      },
      getCommit(id) {
        const where = { id };
        return this.findOne({ where });
      },
      getCommits(start, end) {
        const where = {};
        where.date = { $between: [start, end] };
        return this.findAll({ where });
      },
      createLog(logInfo) {
        const where = {
          sha: logInfo.sha,
          projectId: logInfo.projectId
        };
        const commitDefault = {
          id: uuid.v4(),
          date: logInfo.date,
          message: logInfo.message,
          githubLogin: logInfo.githubLogin
        };
        return this.findOrCreate({ where, defaults: commitDefault });
      }
    }
  });
};
