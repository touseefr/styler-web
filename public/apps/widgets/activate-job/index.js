(function() {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.activatejob
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .directive('activateJob', [function() {
            return {
               restrict: 'EA',
                scope: {
                    "id": "@id",
                    "status": "@status",
                    "daysleft": "@daysleft"
                },
                templateUrl: '/apps/widgets/activate-job/activatejob.html',
                controller:'ActivatejobController',
                controllerAs: 'self',
                bindToController: true, //required in 1.3+ with controllerAs
                link: function(scope, element, iAttrs, ngModel) {
                }
            };
        }]);
})();
