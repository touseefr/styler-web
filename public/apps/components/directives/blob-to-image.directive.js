(function() {
  'use strict';
  /**
   * @ngdoc Directive
   * @name BeautyCollective.Components.Directvies.Directive.userImage
   * @module BeautyCollective.Components.Directvies
   *
   * @description
   * loads user
   *
   * Usage :
   * <user-image data-userid="{{userid}}"></user-image>
   * 
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */

  angular
    .module('BeautyCollective.Components.Directvies')
    .directive('userImage', blobToImageDirective)

  /* @ngInject */
  function blobToImageDirective($rootScope) {
    return {
      restrict: 'E',
      scope: {
        userid: '=',
        imageclass: '@'
      },
      replace: true,
      link: function(scope, element, attributes) {
        scope.$watch(function() {
          return $rootScope.isPhotoUpdated;
        }, function(newVal, oldVal) {
          if(newVal)
          scope.imageUrl = 'api/v1/users/' + scope.userid + '/photo?referece=' + newVal;
        });
        scope.$watch(function() {
          return scope.userid;
        }, function(newVal, oldVal) {
            if(newVal)
          scope.imageUrl = 'api/v1/users/' + scope.userid + '/photo?referece=' + newVal;
        });
      },
      template: '<img ng-src="{{imageUrl}}" class="{{imageclass}}" />'
    };
  }
}());
