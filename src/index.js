const Sequelize = require('sequelize');

// Setup Sequelize and Connection with Database
// ======================================================
export default (config) => {
  const dbName = config.name;
  const dbUsername = config.username;
  const dbPassword = config.password;
  const dbOptions = config.options;

  const models = {};
  const sequelize = new Sequelize(dbName, dbUsername, dbPassword, dbOptions);
  models.sequelize = sequelize;

  const modelFiles = ['admin', 'commit-log', 'release-log', 'drive-log',
    'milestone-log', 'revision-log', 'task-log'];

  modelFiles.forEach((model) => {
    models[model.replace('-', '_')] = sequelize.import(`${__dirname}/${model}`);
  });

  // Synchronize all the defined model into the actual mySQL database
  // ========================================================================
  sequelize.sync()
    .then(() => {}, error => {
      console.log(error);
    });

  return models;
};
