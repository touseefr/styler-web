(function() {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.applyjob
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .directive('applyJob', [function() {
            return {
               restrict: 'EA',
                scope: {
                    "id": "@id",
                    "userId": "@userid"
                },
                templateUrl: '/apps/widgets/apply-job/applyjob.html',
                controller:'ApplyjobController',
                controllerAs: 'self',
                bindToController: true, //required in 1.3+ with controllerAs
                link: function(scope, element, iAttrs, ngModel) {
                }
            };
        }]);
})();
