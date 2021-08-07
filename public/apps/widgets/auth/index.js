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
        .directive('widgetAuth', [function() {
            return {
                templateUrl: '/apps/widgets/auth/auth.html',
                restrict: 'E',
                link: function(scope, element, iAttrs, ngModel) {

                }
            };
        }]);
})();
