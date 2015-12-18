angular.module('pm25').filter('serverName', function serverNameFilter() {
    'use strict';

    return function(host, filterServerName) {
        var _host = {};

        if(!filterServerName) {
            return host;
        }

        for(var i in host) {
            if(host.hasOwnProperty(i)) {
                console.warn(host[i]['server_name'].toLowerCase());
                console.warn(filterServerName.toLowerCase());
                if(host[i]['server_name'].toLowerCase().match(filterServerName.toLowerCase())) {
                    console.log(host[i]['server_name'] + ':::' + filterServerName);
                    _host[i] = host[i];
                }
            }
        }

        return _host;
    }
});
