"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const queryRouter = require('./routers/query');
const clusterRouter = require('./routers/cluster');
const dataRouter = require('./routers/data');
const exportRouter = require('./routers/export');
const actionTreeRouter = require('./routers/action_tree');

const app = express();

// app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public_dataset'));

app.use(bodyParser.text({limit: '50mb'}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
})

app.get('/', (req, res) => {
    res.send('abc xyz');
});

app.use('/query', queryRouter);
app.use('/cluster', clusterRouter);
app.use('/data', dataRouter);
app.use('/export', exportRouter);
app.use('/actiontree', actionTreeRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));