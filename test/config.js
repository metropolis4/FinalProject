process.env.NODE_ENV = 'test';
var app = require('../app.js'),
  mongoose = require('mongoose'),
  chai = require('chai'),
  expect = chai.expect,
  assert = require('assert'),
  mongoConfig = require('../config/mongo.js');

describe('test environment setup', function() {
  it('should be set to test and not dev or stage', function() {
    expect(process.env.NODE_ENV).to.equal('test');
    expect(process.env.NODE_ENV).to.not.equal('dev');
    expect(process.env.NODE_ENV).to.not.equal('stage')
  });
  it('should be using the test database, not production', function() {
    expect(mongoConfig[app.settings.env]).to.equal('mongodb://localhost/helmer-test');
  });
});