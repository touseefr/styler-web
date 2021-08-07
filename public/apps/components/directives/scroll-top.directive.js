(function() {
  'use strict';
  /**
   * @ngdoc Directive
   * @name BeautyCollective.Components.Directvies.Directive.scrollToTopWhen
   * @module BeautyCollective.Components.Directvies
   *
   * @description
   * Scroll any html Element to target pixels
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Components.Directvies')
    .directive('scrollToTopWhen', ScrollToTopWhen);

  /* @ngInject */
  function ScrollToTopWhen($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        scope.$on(attrs.scrollToTopWhen, function() {
          $timeout(function() {
            angular.element(element)[0].scrollTop = element.find('.target').prop('offsetTop');
          }, 100);
        });
      }
    };
  }
})();