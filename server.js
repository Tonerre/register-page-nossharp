const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const reqip = require('request-ip');
const sha512 = require('sha512');
const db = require('./database.js');

app.use(express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, (req, res) => {
    console.log('listening on port 3000');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post('/register', (req, res) => {

    // search for existing username or email
    db.accounts.findOne({ where: {
        [db.Sequelize.Op.or]: [
          { username: req.body.username },
          { email: req.body.email }
        ]
    }})
    .then(result => {
        // if one of them is found
        if (result !== null) {
            // if the match cause is the username
            if (result.username == req.body.username) {
                console.log(`username ${result.username} is already used`);
            } else {
                console.log(`email ${result.email} is already used`);
            }
        } else {
            // account registration
            console.log('Ok !');

            // force: true will drop the table if it already exists
            db.sequelize.sync({force: false})
            .then(() => db.accounts.create({
                username: req.body.username,
                email: req.body.email,
                password: sha512(req.body.password.toLowerCase()).toString('hex'),
                authority: 0,
                emailRegistration: req.body.email,
                registrationIp: reqip.getClientIp(req),
            }))
            .then(e => {
                console.log(e.toJSON());
            });

            res.redirect('/success');
        }
    });

    
});
app.get('/success', (req, res) => {
    res.sendFile(__dirname + "/success.html");
})


