(function() {
  'use strict';
  /**
   * @ngdoc Directive
   * @name BeautyCollective.Components.Directvies.Directive.scrollToTopWhen
   * @module BeautyCollective.Components.Directvies
   *
   * @description
   * Stop event propogationt to parents
   *
   * Usage :
   * <a href="#" stop-click-propagation>Hit me</a>
   * 
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */

  angular
    .module('BeautyCollective.Components.Directvies')
    .directive('stopClickPropagation', stopClickPropagation);

  /* @ngInject */
  function stopClickPropagation() {
    return {
      restrict: 'A',
      link: {
        post: function(scope, element, attrs) {
          element.click(function(e) {
            e.stopPropagation();
          });
        }
      }
    };
  }

  /**
   * @ngdoc Directive
   * @name BeautyCollective.Components.Directvies.Directive.preventDefault
   * @module BeautyCollective.Components.Directvies
   *
   * @description
   * preventDefault directive is used to stop default action of html element
   * 
   * Usage :
   * <a href="#" prevent-default>Hit me</a>
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Components.Directvies')
    .directive('preventDefault', preventDefault);
  /* @ngInject */
  function preventDefault() {
    return {
      restrict: 'A',
      link: {
        post: function(scope, element, attrs) {
          element[0].click(function(e) {
            e.preventDefault();
          });
        }
      }
    };
  }

}());