module.exports = {
  test: 'mongodb://localhost/helmer-test',
  dev: 'mongodb://localhost/helmer',
  stage: process.env.MONGOLAB_URI
};