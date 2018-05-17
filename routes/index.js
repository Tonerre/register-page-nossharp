module.exports = app => {
    const db = require('../database.js');
    const sha512 = require('sha512');
    const reqip = require('request-ip');

    app.get('/', (req, res) => {
        res.sendFile(`${process.cwd()}/public/register.html`);
    });

    app.post('/register', (req, res) => {

        // search for existing username or email
        db.Accounts.findOne({
            where: {
                [db.Sequelize.Op.or]: [
                    { username: req.body.username },
                    { email: req.body.email }
                ]
            }
        })
        .then(result => {
            // if one of them is found
            if (result !== null) {
                // if the match cause is the username
                if (result.username == req.body.username) {
                    // THOSE console.log() WILL BE REMPLACE BY res.send() or res.render()
                    console.log(`username ${result.username} is already used`);
                } else {
                    console.log(`email ${result.email} is already used`);
                }

                res.redirect('/');
            } else {
                // account registration
                console.log('Ok !');

                db.sequelize.sync()
                    .then(() => db.Accounts.create({
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
            };

            app.get('/success', (req, res) => {
                res.sendFile(`${process.cwd()}/public/success.html`);
            });
        });
    });
}