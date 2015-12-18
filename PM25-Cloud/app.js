/* jshint node: true */
'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var juicerExpressAdapter = require('juicer-express-adapter');
var enrouten = require('express-enrouten');
var rewriteModule = require('http-rewrite-middleware');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();
var misauth = require('@mtfe/mis-sso');
var config = require('./configure');

// keep the same rule with nginx rewrite
var rewriteMiddleware = rewriteModule.getMiddleware([]);

var unless = function(path, middleware) {
    return function(req, res, next) {
        if (path === req.path) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};

// view engine setup
app.set('view engine', 'html');
app.engine('html', juicerExpressAdapter);

app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(rewriteMiddleware);

// for production environment
app.set('env', 'production');

if(app.get('env') === 'production') {
    app.set('views', path.join(__dirname, 'build/templates'));
    app.use(express.static(path.join(__dirname, 'build/public')));
} else {
    app.set('views', path.join(__dirname, 'templates'));
    app.use(express.static(path.join(__dirname, 'public')));
}

/// session support
app.use(session({
    secret: 'pm25-secret',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ url: config.sessiondbpath }),
    cookie: { secure: false, httpOnly: false, maxAge: 120 * 60 * 1000 * 100 }
}));

/// misauth
app.use(unless('/settoken', misauth({
    clientId: 'hotelmtafe',
    clientSecret: '869b57889df39467ba07453d99aa50a0',
    redirect: 'server',
    settoken: '/settoken?continue='
})));

/// dynamically include controllers
app.use(enrouten({directory: 'controllers'}));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('buildin/error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('buildin/error', {
        message: err.status,
        error: {}
    });
});

module.exports = app;
