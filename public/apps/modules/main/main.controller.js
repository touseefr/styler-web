(function() {
  'use strict';
  /**
   * @ngdoc Controller
   * @name BeautyCollective.main.Controller.MainController
   * @module BeautyCollective.main
   *
   * @description
   * Landing dashboard page controller
   * Responsible for all view states
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective')
    .controller('MainController', MainController);

  /* @ngInject */
  function MainController($scope, $modal, Logger, LayoutService, notify, Spinner, $window, utilFactory, APP_CONFIG, $state, $filter) {
  }
})();