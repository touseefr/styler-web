(function() {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.widgetEmail
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to send email to individual users
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .directive('widgetEmail', [function() {
            return {
               restrict: 'EA',
               scope: {
                    "id": "@id",
                    "userto": "@userto",
					"userfrom": "@userfrom"
                },
                templateUrl: '/apps/widgets/email/email.html',
                controller:'EmailController',
                controllerAs: 'self',
                bindToController: true, //required in 1.3+ with controllerAs
                link: function(scope, element, iAttrs, ngModel) {
                }
            };
        }]);
})();
