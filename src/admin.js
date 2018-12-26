"use strict";
var uuid = require("node-uuid");

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "admin",
    {
      email: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      settings: DataTypes.TEXT,
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at"
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at"
      }
    },
    {
      underscored: true,
      timestamps: true,
      hooks: {
        beforeCreate: function beforeCreate(user) {
          user.id = uuid.v4();
        }
      },
      classMethods: {
        findByEmail: function findByEmail(email) {
          var where = { email: email };
          return this.findOne({ where: where });
        },
        addUser: function addUser(payload) {
          var actualLoad = {
            email: payload.email,
            settings: payload.settings
          };
          return this.create(actualLoad);
        },
        updateUser: function updateUser(payload) {
          if (payload.settings)
            payload.settings = JSON.stringify(payload.settings);
          var where = { email: payload.email };
          delete payload.email;
          return this.update(payload, { where: where, individualHooks: true });
        },
        getAll: function getAll() {
          return this.findAll();
        }
      }
    }
  );
};
