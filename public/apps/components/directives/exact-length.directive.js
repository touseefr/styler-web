(function() {
  'use strict';
  /**
   * @ngdoc Directive
   * @name BeautyCollective.Components.Directvies.Directive.ExactLength
   * @module BeautyCollective.Components.Directvies.
   *
   * @description
   * validate model exact length of field
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Components.Directvies')
    .directive('exactLength', ExactLength);
  /* @ngInject */
  function ExactLength() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        exactLength: '='
      },
      link: function(scope, $element, $attrs, ngModel) {
        $element.on('keyup', function() {
          scope.$apply(function() {
            ngModel.$setValidity('exactLength', (scope.exactLength === (ngModel.$modelValue && ngModel.$modelValue.length )));
          });
        });
      }
    }
  }
})();
