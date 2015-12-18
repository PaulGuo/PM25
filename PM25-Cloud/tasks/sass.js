/* jshint node: true */
'use strict';

module.exports = {
    deps: ['copyto'],
    task: function sass(gulp) {
        var sass = require('gulp-sass');
        var ignore = require('gulp-ignore');

        return gulp.src('./build/public/**/*.scss')
            .pipe(ignore('**/node_modules/**'))
            .pipe(sass())
            .pipe(gulp.dest('./build/public'));
    }
};
