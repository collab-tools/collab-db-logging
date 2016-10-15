'use strict';

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
    role: DataTypes.STRING,
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
      findByRole: function findByRole(role) {
        var where = { role: role };
        return this.findAll({ where: where });
      },
      addUser: function addUser(payload) {
        var actualLoad = {
          username: payload.username,
          password: payload.password,
          role: payload.role,
          name: payload.name
        };
        return this.create(actualLoad);
      }
    }
  });
};