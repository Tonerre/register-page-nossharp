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
    const clientIp = reqip.getClientIp(req);
    
    db.sequelize.sync({ force: false })
        .then(() => db.accounts.create({
            username: req.body.username,
            email: req.body.email,
            password: sha512(req.body.password).toString('hex'),
            registrationIP: clientIp,
            emailRegistration: req.body.email,
            authority: 0
        }))
        .then(e => {
            console.log(e.toJSON());
        });

   

    res.redirect('/success');
});

app.get('/success', (req, res) => {
    res.sendFile(__dirname + "/success.html");
})


