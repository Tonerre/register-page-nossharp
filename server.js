const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Sequelize = require('sequelize');
const reqip = require('request-ip');
const sha512 = require('sha512');
app.use(express.static(__dirname + '/public'))

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
    Username: {
        type: Sequelize.STRING
    },
    Email: {
        type: Sequelize.STRING
    },
    Password: {
        type: Sequelize.STRING
    },
    RegistrationIP: {
        type: Sequelize.STRING
    },
    EmailRegistration:{
        type: Sequelize.STRING
    },
    Authority:{
        type: Sequelize.INTEGER
    }
});

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, (req, res) => {
    console.log('listening on port 3000');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post('/register', (req, res) => {
    const clientIp = reqip.getClientIp(req);
    
    if (req.body.Password !== req.body.repeatPassword) {
        return res.send("Password not equals");
    }

    sequelize.sync({ force: false })
        .then(() => accounts.create({
            Username: req.body.Username,
            Email: req.body.Email,
            Password: sha512(req.body.Password).toString('hex'),
            RegistrationIP: clientIp,
            EmailRegistration: req.body.Email,
            Authority: 0
        }))
        .then(e => {
            console.log(e.toJSON());
        });

    res.redirect('/success');
});

app.get('/success', (req, res) => {
    res.sendFile(__dirname + "/success.html");
})


