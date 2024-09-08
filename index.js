const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const moment = require('moment');

require('dotenv').config();

const route = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');
const database = require('./config/database');

const systemConfig = require('./config/system');

database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Flash
app.use(cookieParser('STUDSDAF23KAD7K'));
app.use(session({
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
// End flash

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// End TinyMCE

// Use pug
app.set('views',`${__dirname}/views`);
app.set('view engine', 'pug');

// App Local Variables: tạo ra biến toàn cục
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Local moment
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

// Route
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})