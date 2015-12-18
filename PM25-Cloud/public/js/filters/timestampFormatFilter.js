angular.module('pm25').filter('timestampFormat', function timestampFormatFilter() {
    'use strict';

    return function(timestamp) {
        return moment(timestamp).format('MM/DD HH:mm');
    }
});
