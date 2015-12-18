angular.module('pm25').controller('transactionsController', ['$scope', '$filter', '$http', function TransactionsCtrl($scope, $filter, $http) {
    'use strict';

    $scope.transactions = {};

    $http.get('/api/node/transactions/server/' + __public_key + '/' + __server_name).success(function(ret, status) {
        $scope.transactions.data = ret.data;
    });

}]);
