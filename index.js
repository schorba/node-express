const express = require('express');
const path = require('path');
const csrf = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {
  allowInsecurePrototypeAccess,
} = require('@handlebars/allow-prototype-access');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const homeRoutes = require('./routes/home');
const cardRoutes = require('./routes/card');
const addRoutes = require('./routes/add');
const orderRoutes = require('./routes/orders');
const coursesRoutes = require('./routes/courses');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const errorHandler = require('./middleware/error');
const fileMiddleware = require('./middleware/file');
const keys = require('./keys');

const PORT = process.env.PORT || 3000;

const app = express();

const handlebars = exphbs.create({
  defaultLayout: 'main',
  extname: 'handlebars',
});

const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI,
});
app.engine(
  'handlebars',
  exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: require('./utils/hbs-helpers'),
  })
);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store, //: store
  })
);
app.use(fileMiddleware.single('avatar'));
app.use(csrf());
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', orderRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.use(errorHandler);

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
