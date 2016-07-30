'use strict';

const Sequelize = require('sequelize');

// Setup Sequelize and Connection with Database
// ======================================================
export default (config) => {
  const dbName = config('name');
  const dbUsername = config('username');
  const dbPassword = config('password');
  const dbOptions = config('options');

  const models = {};
  const sequelize = new Sequelize(dbName, dbUsername, dbPassword, dbOptions);
  models.sequelize = sequelize;

  const modelFiles = ['admin', 'commit-log', 'release-log', 'drive-log',
    'milestone-log', 'revision-log', 'task-log'];

  modelFiles.forEach(function (model) {
    models[model] = sequelize.import(__dirname + '/' + model);
  });

  // Synchronize all the defined model into the actual mySQL database
  // ========================================================================
  return sequelize.sync().then(() => {
    return models;
  }, error => {
    return console.log(error);
  });
}




