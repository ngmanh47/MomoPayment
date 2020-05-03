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


app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
    console.log(`Server is running at http://localhost:${app.get('port')}`);
});