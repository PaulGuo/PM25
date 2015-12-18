angular.module('pm25').controller('bucketCreateController', ['$scope', '$filter', '$http', function BucketCreateCtrl($scope, $filter, $http) {
    'use strict';

    $scope.bucketCreateSubmit = function() {
        var bucketCreateFormData = {
            bucket_name: $scope.bucket_name,
            bucket_description: $scope.bucket_description
        };

        if($scope.secret_key) {
            bucketCreateFormData.secret_key = $scope.secret_key;
        }

        if($scope.public_key) {
            bucketCreateFormData.public_key = $scope.public_key;
        }

        $http({
            method: 'post',
            url: '/api/node/bucket/create',
            data: bucketCreateFormData
        }).success(function(req) {
            $scope.bucketCreateStatus = req.status;
            if(req.status === 0) {
                location.href = '/buckets';
                return;
            }
        });
    };

}]);
