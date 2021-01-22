var express = require('express');
var dataRouter = require('./router/data');
var mainRouter = require('./router/main');
var searchRouter = require('./router/search');
var hbs = require('express-handlebars');
var bodyParse = require('body-parser');
var app = express();

app.engine(
    'hbs',
    hbs({
        extname: 'hbs',
        defaultLayout: 'main',
        layoutsDir: './views/layouts',
    }),
);

app.set('views', './views');
app.set('view engine', 'hbs');

app.use(bodyParse.urlencoded({extended: true}));
app.use(bodyParse.json());
app.use(express.static('./public'));
app.use('/search', searchRouter);
app.use('/data', dataRouter);
app.use('/', mainRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`))
