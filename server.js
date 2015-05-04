var config = require('config');
var formio = require('formio')(config.formio);
var express = require('express');
var nunjucks = require('nunjucks');
var basicAuth = require('basic-auth-connect');
var _ = require('lodash');
var app = express();

// Configure nunjucks.
nunjucks.configure('server/views', {
  autoescape: true,
  express   : app
});

// CORS Support
app.use(require('cors')());

// Host the dynamic app configuration.
app.get('/config.js', function(req, res, next) {
  res.render('js/config.js', {
    appBase: config.host + '/app'
  });
});

// Mount bower_components as assets.
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// Mount the assets folder.
app.use('/assets', express.static(__dirname + '/server/assets'));

// Mount the brochure.
var brochure = require('./src/brochure')(config.brochure);
app.use('/', brochure);

// Include the swagger ui.
app.use('/swagger', express.static(require('swagger-ui').dist));

// Mount all of our apps.
var apps = require('./apps/index');
_.each(apps, function(path, name) {
  app.use('/apps/' + name, express.static(path));
});

// Add the formio application.
app.use('/app', express.static(__dirname + '/dist'));

// Show the docs page for the API.
app.get('/app/spec.html', function (req, res, next) {
  res.render('docs.html', {
    url: req.protocol + '://' + req.get('host') + '/api/spec.json'
  });
});

// Get the specs for each form.
app.get('/app/form/:formId/spec.html', function (req, res, next) {
  res.render('docs.html', {
    url: '/app/api/form/' + req.params.formId + '/spec.json'
  });
});

app.use('/app/api', formio);
console.log('Listening to port ' + config.port);
app.listen(config.port);
