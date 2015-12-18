/* jshint node: true */
'use strict';

module.exports = {
    task: function(gulp) {
        var del = require('del');
        del.sync('build');
    }
};
