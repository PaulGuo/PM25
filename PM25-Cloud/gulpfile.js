/* jshint node: true */
'use strict';

var gulp = require('gulp');
var requireDir = require('require-dir');
var tasks = requireDir('./tasks');

for (var task in tasks) {
    if (tasks.hasOwnProperty(task)) {
        gulp.task(task, tasks[task]['deps'] || [], (function(gulp, tasks, task) {
            return function() {
                return tasks[task]['task'](gulp);
            };
        })(gulp, tasks, task));
    }
}

gulp.task('default', [
    'del',
    'copyto',
    'sass',
    'cssmin',
    'jsmin',
    'compile'
]);
