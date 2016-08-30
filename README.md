# Collab Logging Library

> Tiny library containing models of logging database.

## Setup / Compling
```
// Initial Setup
$ git clone git@github.com:collab-tools/collab-db-logging.git
$ npm install

// Compilng the code
$ npm run build
```

## Usage
Simply pass in your database configuration that contains `name`, `username`, `password`, `options` properties.
```javascript
require('collab-db-logging')(databaseConfig);
```

Lookup on [Sequelize Docs](http://docs.sequelizejs.com/en/v3/) to understand how to use each of the model and their class methods within the library.
