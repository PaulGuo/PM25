/* jshint node: true */
'use strict';

module.exports = {
    deps: ['copyto'],
    task: function compile(gulp) {
        var ignore = require('gulp-ignore');
        var replace = require('gulp-replace');
        var t = new Date().getTime();

        return gulp.src('./templates/**/*.*')
            .pipe(ignore('**/node_modules/**'))
            .pipe(replace(/\?v=\d+\./g, '?v=' + t + '.'))
            .pipe(gulp.dest('build/templates'));
    }
};
