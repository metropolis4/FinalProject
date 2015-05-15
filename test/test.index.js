process.env.NODE_ENV = 'test';
var app    = require("../app.js"),
  request  = require('supertest')(app),
  expect   = require('chai').expect;

describe('main controller', function() {

  describe('index', function() {
    it('should return a view', function(done) {
      request
        .get('/')
        .end(function(err, res) {
          if(err) throw err;
          expect(res.statusCode).to.equal(200);
          expect(res.type).to.equal('text/html');
          expect(res.text).to.contain('ng-app="corbo"');
          done();
        });
    });
  });

  describe('login', function() {
    it('should return a view of the login page', function() {
      request
        .get('/login')
        .end(function(err, res) {
          if(err) throw err;
          expect(res.statusCode).to.equal(200);
          expect(res.type).to.equal('text/html');
          expect(res.text).to.contain('username');
          done();
        });
    });
  });

  describe('signUp', function() {
    it('should return a view of the login page', function() {
      request
        .get('/signup')
        .end(function(err, res) {
          if(err) throw err;
          expect(res.statusCode).to.equal(200);
          expect(res.type).to.equal('text/html');
          expect(res.text).to.contain('action="/auth/signup"');
          done();
        });
    });
  });

});