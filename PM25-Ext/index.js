/* jshint node: true */
'use strict';

var pmx = require('pmx');
var onFinished = require('on-finished');
var probe = pmx.probe();
var init = function(options) {
    options = options || {
        http          : true,
        http_latency  : 200,
        http_code     : 500,
        ignore_routes : [],
        profiling     : true,
        errors        : true,
        // By default if you add alert subfield in custom
        // it's going to be enabled
        alert_enabled : true,
        custom_probes : true,
        network       : true,
        ports         : true
    };

    pmx.init(options);
    return this;
};

var meter = probe.meter({
    name      : 'req/sec',
    samples   : 1,
    timeframe : 60
});

var counter = probe.counter({
    name : 'Current req processed'
});

var middleware = function(req, res, next) {
    meter.mark();
    counter.inc();
    onFinished(res, function() {
        counter.dec();
    });
    next();
};

module.exports = {
    init: init,
    middleware: middleware
};
