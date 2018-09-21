const dbFactory = require('./src/index');
/* eslint-enable import/no-unresolved */

let dbInstance = dbFactory({
    "name": "collab_logging",
    "username": "root",
    "password": "",
    "options": {
    "host": "localhost",
    "dialect": "mysql",
    "pool": {
        "max": 5,
        "min": 0,
        "idle": 10000
    },
    "logging": false
    }
});


dbInstance.sequelize.sync({force:true})