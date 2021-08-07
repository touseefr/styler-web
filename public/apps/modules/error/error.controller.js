(function() {
  'use strict';
  /**
   * @ngdoc Controller
   * @name BeautyCollective.Controller.ErrorController
   * @module BeautyCollective
   *
   * @description
   * Error controller to hanlde errors
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective')
    .controller('ErrorController', ErrorController);
  /* @ngInject */
  function ErrorController($scope,Spinner, $state) {
    Spinner.hide();

}
})();