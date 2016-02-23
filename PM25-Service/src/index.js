var express = require('express');
var app = express();
var config = require('../configure');
var path = require('path');

app.post('/api/node/verifyPM2', function(req, res) {
    res.json({
        endpoints: config.endpoints,
        new: false,
        active: true,
        pending: false,
        disabled: false
    });
});

app.set('port', process.env.PORT || 8000);
app.set('env', 'production');
app.use(express.static(path.join(process.env.PWD, 'profilings')));

var server = app.listen(app.get('port'), function() {
    console.info('Express server listening on port ' + server.address().port);
});
