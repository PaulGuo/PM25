/* jshint node: true */
'use strict';

module.exports = {
    deps: ['sass'],
    task: function cssmin(gulp) {
        var minifyCSS = require('gulp-minify-css');
        var ignore = require('gulp-ignore');
        var autoprefixer = require('gulp-autoprefixer');

        return gulp.src('./build/public/**/*.css')
            .pipe(ignore('**/node_modules/**'))
            .pipe(ignore('**/build/public/js/vendor/**'))
            .pipe(ignore('**/build/public/css/bootstrap-3.3.4.min.css'))
            .pipe(ignore('**/build/public/css/font-awesome.min.css'))
            .pipe(autoprefixer({browsers: ['Android >= 2.2', 'iOS >= 4', 'ChromeAndroid >= 30', 'ExplorerMobile >= 10']}))
            .pipe(minifyCSS({noAdvanced: true}))
            .pipe(gulp.dest('./build/public/'));
    }
};
