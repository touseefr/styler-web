(function() {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.widgetBooking
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .directive('widgetBooking', [function() {
            return {
               restrict: 'EA',
                scope: {
                    "id": "@id",
                    "userto": "@userto",
					"userfrom": "@userfrom",
                    "categories":"@categories"
                },
                templateUrl: '/apps/widgets/booking/booking.html',
                controller:'BookingController',
                controllerAs: 'self',
                bindToController: true, //required in 1.3+ with controllerAs
                link: function(scope, element, iAttrs, ngModel) {
                }
            };
        }]);
})();
