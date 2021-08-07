/* globals $ */
'use strict';

angular.module('BeautyCollective')
  .directive('showValidation', function() {
    return {
      restrict: 'A',
      require: 'form',
      link: function(scope, element) {
        element.find('.form-group').each(function() {
          var $formGroup = $(this);
          var $inputs = $formGroup.find('input[ng-model],textarea[ng-model],select[ng-model]');

          if ($inputs.length > 0) {
            $inputs.each(function() {
              var $input = $(this);
              scope.$watch(function() {
                return $input.hasClass('ng-invalid') && $input.hasClass('ng-dirty');
              }, function(isInvalid) {
                $formGroup.toggleClass('has-error', isInvalid);
              });
            });
          }
        });
      }
    };
  });


angular
  .module('BeautyCollective')
  .directive('uiSelectRequired', function() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$validators.uiSelectRequired = function (modelValue, viewValue) {

             var determineVal;
            if (angular.isArray(modelValue)) {
                determineVal = modelValue;
            } else if (angular.isArray(viewValue)) {
                determineVal = viewValue;
            } else {
                return false;
            }

            return determineVal.length > 0;
        };
      }
    };
  });
