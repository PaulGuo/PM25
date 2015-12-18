angular.module('pm25').controller('bucketsController', ['$scope', '$filter', '$http', function BucketsCtrl($scope, $filter, $http) {
    'use strict';

    $scope.createNewBucket = function() {
        location.href = '/bucket/create';
    };

    $scope.doLogout = function() {
        location.href = '/logout';
    };

    $scope.removeCurrentBucket = function(bucket_name, public_key) {
        var currentBucketData = {
            bucket_name: bucket_name,
            public_key: public_key
        };

        if(!confirm('删除后不可恢复，确认删除当前选中的桶？')) {
            return;
        }

        $http({
            method: 'post',
            url: '/api/node/bucket/remove',
            data: currentBucketData
        }).success(function(req) {
            if(req.status === 0) {
                location.reload();
                return;
            }
        });
    };

}]);
