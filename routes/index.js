module.exports = function (app) {
    app.get('/', function (req, res) {
      res.redirect('/main');
    });
    app.use('/signup', require('./signup'));
    app.use('/signin', require('./signin'));
    app.use('/signout', require('./signout'));
    app.use('/main', require('./main'));
  };