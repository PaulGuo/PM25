angular.module('pm25').filter('memory', function memoryFilter() {
    'use strict';

    var sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];

    return function(bytes) {
        if(!bytes && bytes !== 0) {
            return "0 B";
        }

        for(var i = sizes.length; i > 0; i--) {
            var step = Math.pow(1024, i);

            if (bytes >= step) {
                return (bytes / step).toFixed(2) + " " + sizes[i];
            }
        }

        return bytes + " B";
    }
});
