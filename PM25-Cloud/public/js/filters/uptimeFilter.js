angular.module('pm25').filter('uptime', function uptimeFilter() {
    'use strict';

    return function(pm2_uptime) {
        return (new Date().getTime() - pm2_uptime) / 1000;
    }
});
