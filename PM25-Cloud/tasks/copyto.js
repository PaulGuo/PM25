/* jshint node: true */
'use strict';

module.exports = {
    deps: ['del'],
    task: function copyto(gulp) {
        return gulp.src('./public/**/*')
            .pipe(gulp.dest('./build/public/'));
    }
};
