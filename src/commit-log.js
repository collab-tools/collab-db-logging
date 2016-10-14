const uuid = require('node-uuid');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('commit_log', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    date: DataTypes.DATE,
    sha: DataTypes.STRING,
    message: DataTypes.STRING,
    additions: DataTypes.INTEGER,
    deletions: DataTypes.INTEGER,
    githubLogin: {
      type: DataTypes.STRING,
      field: 'github_login'
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
      getProjectCommits(projectId, range) {
        const where = { projectId };
        if (range) where.date = { $gt: range };
        return this.findAll({ where });
      },
      getUserCommits(githubLogin, projectId, range) {
        const where = { githubLogin };
        if (projectId) where.projectId = projectId;
        if (range) where.date = { $gt: range };
        return this.findAll({ where });
      },
      getUserCommitsCount(githubLogin, projectId, range) {
        const where = { githubLogin };
        if (projectId) where.projectId = projectId;
        if (range) where.date = { $gt: range };
        return this.count({ where });
      },
      getCommitsCount(range) {
        const where = {};
        if (range) where.date = { $gt: range };
        return this.count({ where });
      },
      getCommit(id) {
        const where = { id };
        return this.findOne({ where });
      },
      getCommits(range) {
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
