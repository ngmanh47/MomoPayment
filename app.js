const express = require('express');
const exphbs = require('express-handlebars');
const morgan = require('morgan');

require('express-async-errors');
const app = express();

//
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

const hbs = exphbs.create({
    extname: 'hbs',
    defaultLayout: '_layouts',
    layoutsDir: __dirname + '/views/_layouts'

});

app.engine('hbs', hbs.engine);

app.set('view engine', 'hbs');

require('./middlewares/routes.mdw')(app);

app.use(express.static(__dirname+'/public'));


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})