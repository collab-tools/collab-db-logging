'use strict';

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        return _bcrypt2.default.compareSync(password, this.password);
      },
      updatePassword: function updatePassword(password) {
        this.password = _bcrypt2.default.hashSync(password, saltRound);
      }
    },
    hooks: {
      beforeCreate: function beforeCreate(user) {
        user.id = _nodeUuid2.default.v4();
        user.password = _bcrypt2.default.hashSync(user.password, saltRound);
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