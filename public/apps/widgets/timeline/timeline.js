'use strict';
angular
  .module('BeautyCollective.Widgets')
  .directive('timeline',function() {
    return {
        templateUrl:'widgets/timeline/timeline.html',
        restrict: 'E',
        replace: true,
    };
  });
