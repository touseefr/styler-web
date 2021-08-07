(function() {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.widgetLogin
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement login functionality
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .directive('widgetSearchResult', [function() {
            return {
               restrict: 'EA',
                scope: {
                    "query": "@query",
                },
                templateUrl: '/apps/widgets/search-result/results.html',
                controller:'SearchResultController',
                controllerAs: 'self',
                bindToController: true, //required in 1.3+ with controllerAs
                link: function(scope, element, iAttrs, ngModel) {
                }
            };
        }]);
})();
