'use strict';

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (sequelize, DataTypes) {
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
      getParticipatingUsers: function getParticipatingUsers(range) {
        var where = {};
        if (range) where.date = { $gt: range };
        return this.findAll({
          where: where,
          attributes: [[sequelize.fn('DISTINCT', sequelize.col('githubLogin')), 'githubLogin']]
        });
      },
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
      getCommit: function getCommit(id) {
        var where = { id: id };
        return this.findOne({ where: where });
      },
      getCommits: function getCommits(range) {
        var where = {};
        if (range) where.date = { $gt: range };
        return this.findAll({ where: where });
      },
      createLog: function createLog(logInfo) {
        var where = {
          sha: logInfo.sha,
          projectId: logInfo.sha
        };
        var commitDefault = {
          id: _nodeUuid2.default.v4(),
          date: logInfo.date,
          message: logInfo.message,
          githubLogin: logInfo.githubLogin
        };
        return this.findOrCreate({ where: where, defaults: commitDefault });
      }
    }
  });
};