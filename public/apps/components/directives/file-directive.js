(function() {
  'use strict';
  /**
   * @ngdoc Directive
   * @name BeautyCollective.Components.Directvies.Directive.fileModel
   * @module BeautyCollective.Components.Directvies.
   *
   * @description
   * Change file model when file is selected
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */

  angular.module('BeautyCollective.Components.Directvies')
    .directive('fileModel', ['$parse',
      function($parse) {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
              scope.$apply(function() {
                modelSetter(scope, element[0].files[0]);
              });
            });
          }
        };
      }
    ]);

  /**
   * @ngdoc Directive
   * @name BeautyCollective.Components.Directvies.Directive.browseFileButton
   * @module BeautyCollective.Components.Directvies.
   *
   * @description
   * Browse a file when click on link(.upload_link) which again trigger (.upload_file)
   * Usage:
   * <div class="any-class" browse-file-button>
   * <a href="#" class="upload_link">Upload File</a> <input type="file" class="upload_file" />
   * </div>
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
    angular.module('BeautyCollective.Components.Directvies')
    .directive('browseFileButton', [
      function() {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            element.find('.upload_link').bind('click', function() {
              element.find('.upload_file').trigger('click');
            });

            scope.$on('$destroy', function(){
              element.find('.upload_link').unbind('click');
            });
          }
        };
      }
    ]);



    angular.module('BeautyCollective.Components.Directvies')
    .directive('fallbackSrc', function () {
    var fallbackSrc = {
        link: function postLink(scope, iElement, iAttrs) {
            iElement.bind('error', function() {
                angular.element(this).attr("src", iAttrs.fallbackSrc);
            });
        }
    }
    return fallbackSrc;
});

}());