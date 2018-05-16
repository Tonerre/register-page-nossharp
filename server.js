const express = require('express');
const app = express();
const bodyParser = require('body-parser');


app.use(express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, (req, res) => {
    console.log('listening on port 3000');
});

require('./routes')(app);





