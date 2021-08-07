(function() {
  'use strict';
  /**
   * @ngdoc Directive
   * @name BeautyCollective.Directive.ngSpinnerBar
   * @module BeautyCollective.Core
   *
   * @description
   * Directive commands spinner show and hide based on state change events
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Core')
    .directive('ngSpinnerBar', NgSpinnerDirective);

  /* @ngInject */
  function NgSpinnerDirective($rootScope, $timeout) {
    return {
      link: function(scope, element, attrs) {
        // by defult hide the spinner bar
        $rootScope.loadingSpinner = false;

        // display the spinner bar whenever the route changes(the content part started loading)
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
          $rootScope.loadingSpinner = true;
        });

        // hide the spinner bar on rounte change success(after the content loaded)
        $rootScope.$on('$stateChangeSuccess', function() {
          $rootScope.loadingSpinner = false;
          angular.element('body').removeClass('page-on-load'); // remove page loading indicator
        });

        // handle errors
        $rootScope.$on('$stateNotFound', function(error) {
          //element.addClass('hide'); // hide spinner bar
          $rootScope.loadingSpinner = false;
          console.log(error);
        });

        // handle errors
        $rootScope.$on('$stateChangeError', function() {
          //element.addClass('hide'); // hide spinner bar
          $rootScope.loadingSpinner = false;
        });
        $rootScope.$on('$stateChangeCancel', function() {
          //element.addClass('hide'); // hide spinner bar
          $rootScope.loadingSpinner = false;
        });

      }
    };
  }

  /**
   * @ngdoc Service
   * @name BeautyCollective.Service.Spinner
   * @module BeautyCollective.Core
   *
   * @description
   * Spinner service is used to hide/show spinning loader
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Core')
    .factory('Spinner', SpinnerService);
  /* @ngInject */
  function SpinnerService($rootScope) {
    /**
     * Spinner class
     */
    function Spinner() {}
    /**
     * Method to show shipper
     * @return void
     */
    Spinner.prototype.show = function() {
      $rootScope.loadingSpinner = true;
    };
    /**
     * Method to Hide spinner
     * @return void
     */
    Spinner.prototype.hide = function() {
      $rootScope.loadingSpinner = false;
    };
    return new Spinner();
  }
  
  /**
   * @ngdoc ngEnter
   * @name BeautyCollective.Service.enter
   * @module BeautyCollective.Core
   *
   * @description
   * 
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  
  angular
  .module('BeautyCollective.Core')
  .directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
	});
})();