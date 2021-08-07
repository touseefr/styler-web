(function() {

  /**
   * @ngdoc Directive
   * @name BeautyCollective.Components.Directvies.Directive.adjustWidth
   * @module BeautyCollective.Components.Directvies.
   *
   * @description
   * directive is used on active run view
   * directive apply width to element same as parent's width
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Components.Directvies')
    .directive('adjustWidth', [function() {
      return {
        restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        link: function(scope, element, attrs) {
          element.width(element.parent().width());
        }
      };
    }]);

})();
