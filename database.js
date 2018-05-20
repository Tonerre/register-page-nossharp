const Sequelize = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', null, {
    host: '192.168.99.100',
    port: 32781,
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

let Accounts = sequelize.define('accounts', {
    username: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
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

// If an error is triggered with the Model
/* Accounts.sync().then(function () {
    return Accounts.create()
}); */

module.exports = {
    Sequelize,
    sequelize,
    Accounts
} 