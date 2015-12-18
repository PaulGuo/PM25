angular.module('pm25').filter('decimalPlaces', function decimalPlacesFilter() {
    'use strict';

    return function(number, decimalPlaces) {
        if(!number && number !== 0) {
            return 0;
        }

        return number.toFixed(decimalPlaces);
    }
});
