/* jshint node: true */
'use strict';

module.exports = function(router) {
    router.route('/').get(function(req, res, next) {
        var _sid =  req.query.SID;
        var url = decodeURIComponent(req.query.continue);

        if (_sid) {
            res.cookie('_sid', _sid);
            res.cookie('hssoid', _sid);
            res.cookie('ssoid', _sid);
            res.clearCookie('ssoredirect');
            res.redirect(url);
        }
    }).post(function(req, res, next) {
        var data;

        try {
            data = req.body;
        } catch(e) {}

        if(!data) {
            res.end('');
            return;
        }

        var _sid =  data.SID;
        var url = decodeURIComponent(req.query.continue);

        if (_sid) {
            res.cookie('_sid', _sid);
            res.cookie('hssoid', _sid);
            res.cookie('ssoid', _sid);
            res.clearCookie('ssoredirect');
            res.redirect(url);
        } else {
            res.end('');
        }
    });
};

