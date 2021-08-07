(function() {
  /**
   * @ngdoc Directive
   * @name BeautyCollective.Components.Directvies.Directive.remainingCharacters
   * @module BeautyCollective.Components.Directvies.
   *
   * @description
   * remainingCharacters
   * this diective is used to show the remaining Characters
   *
   * @required 
   * maxlength attribute is required
   *
   * Usage :
   * =for simple input text or textarea
   * <imput type="text" ng-model="modelobject" remaining-characters data-maxlength="200" />
   * <textarea ng-model="modelobject" remaining-characters data-maxlength="200" ></textarea>
   * 
   * =editable field
   * <strong editable-text="checklist.title" e-maxlength="300" data-maxlength="300" remaining-characters >text content</strong>
   */
  angular
    .module('BeautyCollective.Components.Directvies')
    .directive('remainingCharacters', ['$compile', function($compile) {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, iAttrs, ngModel) {
          var maxChars = parseInt(iAttrs.maxlength),
            template = $compile('<p ng-show="isVisible" class="help-block" style="font-size: 13px;font-family:inherit">{{remainingCharacters}} characters remaining</p>')(scope);
          scope.remainingCharacters = maxChars;
          scope.isVisible = true;

          function getRemaining(value) {
            var currentLength = value ? value.length : 0;
            scope.remainingCharacters = (maxChars - currentLength);
            if (currentLength == 1) {
              scope.remainingCharacters = maxChars - 1;
            }
          }

          function render() {
            element.after(template);
          }

          scope.$watch(function() {
            return element.attr('class');
          }, function(newValue) {
            (element.hasClass('editable-hide')) ?
            (scope.isVisible = true) :
            (element.hasClass('editable') && (scope.isVisible = false))
          });


          scope.$watch(function() {
            return (element.hasClass('editable')) ? scope.$data : ngModel.$modelValue;
          }, function(newValue) {
            getRemaining(newValue);
          });

          render();

        }
      };
    }])


})();
