(function() {
  'use strict';
  /**
   * @ngdoc Directive
   * @name BeautyCollective.Components.Directvies.Directive.resizeBackground
   * @module BeautyCollective.Components.Directvies
   *
   * @description
   * Adjust the background image when window is resized
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Components.Directvies')
    .directive('resizeBackground', ResizeBackground);

  /* @ngInject */
  function ResizeBackground($window) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var $img = element.find('> img');
        angular.element($window).on('resize', function() {
          $img.attr('style', '');
          if ($img.height() < element.height()) {
            $img.css({
              height: '100%',
              width: 'auto'
            });
          }
        });
      }
    };
  }
})();