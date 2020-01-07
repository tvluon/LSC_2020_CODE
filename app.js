var express = require('express');
var data_router = require('./router/data');
var app = express();

app.use(express.static('./public'));
app.use('/data', data_router);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));