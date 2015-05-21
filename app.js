var express       = require('express'),
  bodyParser      = require('body-parser'),
  mongoose        = require('mongoose'),
  session         = require('express-session'),
  cookieParser    = require('cookie-parser'),
  flash           = require('connect-flash'),
  
  passport        = require('passport'),
  passportConfig  = require('./config/passport'),
  mongoConfig     = require('./config/mongo'),

  mainController  = require('./controllers/main'),
  authController  = require('./controllers/authentication'),
  indexController = require('./controllers/index');

mongoose.connect(mongoConfig.stage || mongoConfig.dev);

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());
app.use(flash());
app.use(session({
  secret           : 'secret',
  resave           : false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', indexController.index);
app.get('/login', indexController.login);
app.post('/auth/login', authController.processLogin);
app.get('/signup', indexController.signUp);
app.post('/auth/signup', authController.processSignup);
app.get('/auth/logout', authController.logout);

app.use(passportConfig.ensureAuthenticated);

app.get('/templates/:templateid', function(req, res){
  res.render('templates/' + req.params.templateid);
});
app.get('/main', mainController.main);
app.get('/api/event', mainController.getEvents);
app.get('/api/event/:id', mainController.getSingleEvent);
app.put('/api/event/:id', mainController.updateEvent);
app.post('/api/event', mainController.createEvent);
app.get('/api/category', mainController.getCategories);
app.post('/api/category', mainController.newCategory);
app.put('/api/category/:id', mainController.deleteCategory);
app.get('/api/people', mainController.getPeople);
app.get('/newEvent', mainController.newEventModal);
app.get('/manageCategories', mainController.manageCategoriesModal);
app.get('/newMember', mainController.newMember);
app.get('/viewMembers', mainController.viewMembers);
app.post('/api/people', mainController.createNewMember);
app.put('/api/people/:id', mainController.deleteMember);

var port = process.env.PORT || 5960;
var server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});
module.exports = app;