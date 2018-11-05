// import bcrypt from 'bcrypt';
// import uuid from 'node-uuid';
const bcrypt = require('bcrypt');
const uuid = require('node-uuid');

const saltRound = 8;

module.exports = (sequelize, DataTypes) => {
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
    role: DataTypes.BOOLEAN,
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
      comparePassword(password) {
        return bcrypt.compareSync(password, this.password);
      },
      updatePassword(password) {
        this.password = bcrypt.hashSync(password, saltRound);
      }
    },
    hooks: {
      beforeCreate(user) {
        user.id = uuid.v4();
        user.password = bcrypt.hashSync(user.password, saltRound);
      },
    },
    classMethods: {
      findByName(name) {
        const where = { name };
        return this.findOne({ where });
      },
      findByRole(role) {
        const where = { role };
        return this.findAll({ where });
      },
      addUser(payload) {
        const actualLoad = {
          username: payload.username,
          password: payload.password,
          role: payload.role,
          name: payload.name,
          settings: payload.settings
        };
        return this.create(actualLoad);
      },
      updateUser(payload) {
        if (payload.password) payload.password = bcrypt.hashSync(payload.password, saltRound);
        if (payload.settings) payload.settings = JSON.stringify(payload.settings);
        const where = { username: payload.username };
        delete payload.username;
        return this.update(payload, { where, individualHooks: true });
      },
      getAll() {
        return this.findAll({attributes: { exclude: ["password"] }});
      }
    }
  });
};
