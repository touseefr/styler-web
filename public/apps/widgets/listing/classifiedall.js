(function () {
    'use strict';

    angular
            .module('BeautyCollective.Widgets')
            .controller('ClassifiedController', ClassifiedController);


    /* @ngInject */

    function ClassifiedController($rootScope,$scope, $sanitize, $q, Logger, Spinner, SearchModel, SuburbsModel, $location, $http) {      
        $scope.request_count = 0;
        $scope.records = [];
        $scope.busy = false;
        $scope.showrecords = 0;

        init();

        function init() {
            getrecords();
        }

        function getrecords() {
            $scope.showrecords = 1;
            $scope.busy = true;
            $scope.request_count += 1
            var para = {
                "_token": csrf_token,
                "page": $scope.request_count,
                "is_api": "1"
            }
            Spinner.start();
            $http({
                method: "GET",
                url: "/allclassified",
                params: para
            }).then(function mySuccess(response) {
                var results = response.data.data;
                if (results.length > 0) {
                    _.each(results, function (item) {
                        $scope.records.push(item);
                    });
                    $scope.busy = false;
                } else {

                }
                Spinner.stop();
            }, function myError(response) {
                Spinner.stop();
            });
        }
        $scope.loadMore = function () {
            getrecords();
        };

        $scope.base64Convertion = function (value) {
            return $rootScope.base64_encode(value);
        }

        $scope.htmlToPlaintext = function (input) {
            var txt = document.createElement("textarea");
            txt.innerHTML = input;
            return txt.value;
        }





    }
    ClassifiedController.$inject = ["$rootScope","$scope", "$sanitize", "$q", "Logger", "Spinner", "SearchModel", "SuburbsModel", "$location", "$http"];
})();