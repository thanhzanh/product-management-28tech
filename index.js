const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
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
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End flash

// Use pug
app.set('views', './views');
app.set('view engine', 'pug');

// App Local Variables: tạo ra biến toàn cục
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static('public'));

// Route
route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})