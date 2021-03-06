(function() {
    'use strict';
    /**
     * @ngdoc Directive
     * @name BeautyCollective.Components.Directvies.Directive.match
     * @module BeautyCollective.Components.Directvies.
     *
     * @description
     * password matching check
     *
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    angular
        .module('BeautyCollective.Components.Directvies')
        .directive('match', PasswordMatch);

    /* @ngInject*/
    function PasswordMatch($parse) {
        return {
            require: '?ngModel',
            restrict: 'A',
            link: function(scope, elem, attrs, ctrl) {
                if (!ctrl) {
                    if (console && console.warn) {
                        console.warn('Match validation requires ngModel to be on the element');
                    }
                    return;
                }

                var matchGetter = $parse(attrs.match);
                var caselessGetter = $parse(attrs.matchCaseless);
                var noMatchGetter = $parse(attrs.notMatch);

                scope.$watch(getMatchValue, function() {
                    ctrl.$$parseAndValidate();
                });

                ctrl.$validators.match = function() {
                    var match = getMatchValue();
                    var notMatch = noMatchGetter(scope);
                    var value;

                    if (caselessGetter(scope)) {
                        value = angular.lowercase(ctrl.$viewValue) === angular.lowercase(match);
                    } else {
                        value = ctrl.$viewValue === match;
                    }
                    value ^= notMatch;
                    return !!value;
                };

                function getMatchValue() {
                    var match = matchGetter(scope);
                    if (angular.isObject(match) && match.hasOwnProperty('$viewValue')) {
                        match = match.$viewValue;
                    }
                    return match;
                }
            }
        };
    }
})();
