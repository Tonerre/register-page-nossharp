const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'root', {
    host: 'localhost',
    dialect: 'postgres',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const accounts = sequelize.define('accounts', {
    username: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING
    },
    registrationIP: {
        type: Sequelize.STRING
    },
    emailRegistration: {
        type: Sequelize.STRING
    },
    authority: {
        type: Sequelize.INTEGER
    }
});



module.exports = {
    Sequelize,
    sequelize,
    accounts
} 