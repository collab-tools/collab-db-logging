'use strict';

var uuid = require('node-uuid');

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
    githubLogin: DataTypes.STRING,
    projectId: DataTypes.STRING
  }, {
    underscored: true,
    classMethods: {
      getProjectCommits: function getProjectCommits(projectId, range) {
        var where = { projectId: projectId };
        if (range) where.date = { $gt: range };
        return this.findAll({ where: where });
      },
      getUserCommits: function getUserCommits(githubLogin, projectId, range) {
        var where = { githubLogin: githubLogin };
        if (projectId) where.projectId = projectId;
        if (range) where.date = { $gt: range };
        return this.findAll({ where: where });
      },
      getUserCommitsCount: function getUserCommitsCount(githubLogin, projectId, range) {
        var where = { githubLogin: githubLogin };
        if (projectId) where.projectId = projectId;
        if (range) where.date = { $gt: range };
        return this.count({ where: where });
      },
      getCommitsCount: function getCommitsCount(range) {
        var where = {};
        if (range) where.date = { $gt: range };
        return this.count({ where: where });
      },
      getCommit: function getCommit(commitUUID) {
        var where = { commitUUID: commitUUID };
        return this.findOne({ where: where });
      },
      getCommits: function getCommits(range) {
        var where = {};
        if (range) where.date = { $gt: range };
        return this.findAll({ where: where });
      },
      createLog: function createLog(logInfo) {
        logInfo.id = uuid.v4();
        return this.create(logInfo);
      }
    }
  });
};