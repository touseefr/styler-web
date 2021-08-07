(function() {
    'use strict';
    /**
     * @ngdoc Controller
     * @name BeautyCollective.Widgets.Controller.LocationMapController
     * @module BeautyCollective.Widgets
     *
     * @description
     * LocationMapController is responsible for login implementation
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .controller('LocationMapController', LocationMapController);

    /* @ngInject */
    function LocationMapController($sanitize, $scope, $timeout, $log, $http, Logger, Spinner, uiGmapGoogleMapApi) {
        /**
         * [self description]
         * @type {[type]}
         */
        var self = this;
        $scope.map = {
            center: {
                latitude: $scope.locationInfo.latitude,
                longitude: $scope.locationInfo.longitude
            },
			zoom: 4,
			options: {
				scrollwheel: false
			},
			marker: {
                id: 0,
                coords: {
                    latitude: $scope.locationInfo.latitude,
                    longitude: $scope.locationInfo.longitude
                },
                options: {
                    showWindow: true,
                    animation: 1,
                    labelContent: $scope.locationInfo.name + ', '+$scope.locationInfo.state + '-' +$scope.locationInfo.postcode,
                    labelClass: "marker-labels",
                    labelAnchor:"50 0"
                }
            }
        };

        uiGmapGoogleMapApi.then(function(maps) {

        });


    }
})();
