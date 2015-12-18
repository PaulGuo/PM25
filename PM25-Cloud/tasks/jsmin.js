/* jshint node: true */
'use strict';

module.exports = {
    deps: ['copyto'],
    task: function jsmin(gulp) {
        var uglify = require('gulp-uglify');
        var ignore = require('gulp-ignore');

        return gulp.src('./build/public/**/*.js')
            .pipe(ignore.exclude(['**/node_modules/**', '**/*.css.js', '**/*.css-*.js']))
            .pipe(ignore('**/node_modules/**'))
            .pipe(ignore('**/build/public/js/vendor/**'))
            .pipe(uglify())
            .pipe(gulp.dest('./build/public/'));
    }
};
