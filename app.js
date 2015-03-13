var express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    flash = require('connect-flash'),
    passport = require('passport');

var passportConfig = require('./config/passport');

var mainController = require('./controllers/main'),
    authenticationController = require('./controllers/authentication'),
    indexController = require('./controllers/index');

mongoose.connect('mongodb://localhost/helmer');

// Populate test data. REMOVE FOR PRODUCTION
require('./models/seeds/catSeeds.js');
require('./models/seeds/eventSeeds.js');
require('./models/seeds/peopleSeeds.js');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());
app.use(flash());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', indexController.index);
app.get('/login', indexController.login);
app.post('/auth/login', authenticationController.processLogin);
app.get('/signup', indexController.signUp);
app.post('/auth/signup?', authenticationController.processSignup);
app.get('/auth/logout', authenticationController.logout);
// app.use(passportConfig.ensureAuthenticated);

app.get('/main', mainController.main);
app.get('/api/event', mainController.getEvents);
app.post('/api/event', mainController.createEvent);
app.get('/api/category', mainController.getCategories);
app.get('/api/people', mainController.getPeople);
app.get('/newEvent', mainController.newEventModal);

var server = app.listen(5960, function() {
	console.log('Express server listening on port ' + server.address().port);
});