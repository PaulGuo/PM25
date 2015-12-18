angular.module('pm25').filter('humanise', function humaniseFilter() {
    'use strict';

    return function(date) {
        return moment.duration(date, "seconds").humanize();
    }
});
