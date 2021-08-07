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
        .directive('widgetSearch', [function() {
            return {
               restrict: 'EA',
                scope: {
                    "id": "@id",
                    "placeholder": "@placeholder",
                    "selectedObject": "=selectedobject",
                    "titleField": "@titlefield",
                    "descriptionField": "@descriptionfield",
                    "userPause": "@pause",
					"ishome": "@ishome"
                },
                templateUrl: '/apps/widgets/search/search.html',
                controller:'SearchController',
                controllerAs: 'self',
                bindToController: true, //required in 1.3+ with controllerAs
                link: function(scope, element, iAttrs, ngModel) {
                    element.bind("keyup", function (event) {
                        if(event.which === 40) {
                            if ((scope.currentIndex + 1) < scope.results.length) {
                                scope.currentIndex ++;
                                scope.$apply();
                                event.preventDefault;
                                event.stopPropagation();
                            }

                            scope.$apply();
                        } else if(event.which == 38) {
                            if (scope.currentIndex >= 1) {
                                scope.currentIndex --;
                                scope.$apply();
                                event.preventDefault;
                                event.stopPropagation();
                            }

                        } else if (event.which == 13) {
                            if (scope.currentIndex >= 0 && scope.currentIndex < scope.results.length) {
                                scope.selectResult(scope.results[scope.currentIndex]);
                                scope.$apply();
                                event.preventDefault;
                                event.stopPropagation();
                            } else {
                                scope.results = [];
                                scope.$apply();
                                event.preventDefault;
                                event.stopPropagation();
                            }

                        } else if (event.which == 27) {
                            scope.results = [];
                            scope.showDropdown = false;
                            scope.$apply();
                        } else if (event.which == 8) {
                            scope.selectedObject = null;
                            scope.$apply();
                        }
                    });
                }
            };
        }]);
angular
        .module('infinite-scroll').config(function($provide) {
            $provide.value('THROTTLE_MILLISECONDS', 1000);
        });
})();
