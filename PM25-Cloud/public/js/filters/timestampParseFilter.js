angular.module('pm25').filter('timestampParse', function timestampParseFilter() {
    'use strict';

    return function(timestamp) {
        return new Date(timestamp).toString();
    }
});
