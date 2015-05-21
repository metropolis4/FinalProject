process.env.NODE_ENV = 'test';
var app = require('../app.js'),
  request = require('supertest')(app),
  expect = require('chai').expect,
  mongoose = require('mongoose'),
  Event = require('../models/events.js');

describe('main controller', function() {

  describe('main', function() {
    it('should return a view of the main page', function(done) {
      request
        .get('/main')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(302);
          expect(res.type).to.equal('text/plain');
          expect(res.text).to.contain('Redirecting');
          done();
        });
    });
  });

  describe('newEventModel', function() {
    it('should render a new modal window', function(done) {
      request
        .get('/newEvent')
        .end(function(err, res) {
          expect(res.header.location).to.equal('/');
          expect(res.statusCode).to.equal(302);
          expect(res.type).to.equal('text/plain');
          done();
        });
    });
  });

  describe('createEvent', function() {
    it('should save a formatted event to the database', function(done) {
      request
        .post('/api/event')
        .send({ date  : '2015-06-10T06:00:00.000Z',
                Drums : '{"first":"Matt","last":"Rich"}',
                Bass  : '{"first":"Tony","last":"Levin"}',
                Guitar: '{"first":"Wes","last":"Montgomery"}',
                Keys  : '{"first":"Chick","last":"Corea"}' 
        })
        .end(function(err, res) {
          expect(res.req._hasBody).to.equal(true);
          done();
        });
    });
  });

  describe('getEvents', function() {

    before(function(done) {
      var newEvent = { 
        date  : '2015-06-10T06:00:00.000Z',
        people: [
          {
            name: 'Matt Rich',
            category: 'Drums'
          },
          {
            name: 'Tony Levin',
            category: 'Bass'
          },
          {
            name: 'Wes Montgomery',
            category: 'Guitar'
          },
          {
            name: 'Chick Corea',
            category: 'Keys'
          },
        ]
      };

      testEvent = new Event(newEvent)
      testEvent.save(function(err, results) {
        if(err) throw err;
        // console.log("THE RESULTS: " , results);
      })

    })
    it('should return all events that have been created', function(done) {
      request

    })
  })
});