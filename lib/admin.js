'use strict';

// import bcrypt from 'bcrypt';
// import uuid from 'node-uuid';
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');

var saltRound = 8;

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('admin', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9_-]+$/i
      }
    },
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    settings: DataTypes.TEXT,
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
    instanceMethods: {
      comparePassword: function comparePassword(password) {
        return bcrypt.compareSync(password, this.password);
      },
      updatePassword: function updatePassword(password) {
        this.password = bcrypt.hashSync(password, saltRound);
      }
    },
    hooks: {
      beforeCreate: function beforeCreate(user) {
        user.id = uuid.v4();
        user.password = bcrypt.hashSync(user.password, saltRound);
      }
    },
    classMethods: {
      findByName: function findByName(name) {
        var where = { name: name };
        return this.findOne({ where: where });
      },
      findByisAdmin: function findByisAdmin(isAdmin) {
        var where = { isAdmin: isAdmin };
        return this.findAll({ where: where });
      },
      addUser: function addUser(payload) {
        var actualLoad = {
          username: payload.username,
          password: payload.password,
          isAdmin: payload.isAdmin,
          name: payload.name,
          settings: payload.settings
        };
        return this.create(actualLoad);
      },
      updateUser: function updateUser(payload) {
        if (payload.password) payload.password = bcrypt.hashSync(payload.password, saltRound);
        if (payload.settings) payload.settings = JSON.stringify(payload.settings);
        var where = { username: payload.username };
        delete payload.username;
        return this.update(payload, { where: where, individualHooks: true });
      },
      getAll: function getAll() {
        return this.findAll({ attributes: { exclude: ["password"] } });
      }
    }
  });
};