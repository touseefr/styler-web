(function() {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Widgets.addtoWatch
     * @module BeautyCollective.Widgets
     *
     * @description
     * widget is used to use implement add to watch list
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Widgets')
        .directive('addtoWatch', [function() {
            return {
               restrict: 'EA',
                scope: {
                    "id": "@id",
					"type":"@type",
					"watchtype":"@watchtype"
                },
                templateUrl: '/apps/widgets/watch/watch.html',
                controller:'AddtowatchController',
                controllerAs: 'self',
                bindToController: true, //required in 1.3+ with controllerAs
                link: function(scope, element, iAttrs, ngModel) {
                }
            };
        }]);
})();
