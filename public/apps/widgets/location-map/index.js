(function() {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.locationMap
     * @module BeautyCollective.Widgets
     *
     * @description
     * This directive is used to avail all feature from google map API and use in application as independent widget
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .directive('locationMap', ['Laravel', function(Laravel) {
            return {
                templateUrl: '/apps/widgets/location-map/location-map.html',
                restrict: 'E',
                scope : {
                    locationInfo : '='
                },
                link: function(scope, element, attrs, ngModel) {
                },
                controller : 'LocationMapController'
            };
        }]);
})();
