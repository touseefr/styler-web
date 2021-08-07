(function() {
  'use strict';
  /**
   * @ngdoc Controller
   * @name BeautyCollective.Pages.Controller.HelpController
   * @module BeautyCollective.Pages
   *
   * @description
   * HelpController is responsible for Help page
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Pages')
    .controller('HelpController', HelpController);

  /* @ngInject */
  function HelpController($scope, $state, Logger) {
    var logger;
    init();

    function init() {
      setLogger();
      $scope.pageTitle = $state.current.data.pageTitle;
    }
    /**
     * [setLogger description]
     * @method setLogger
     * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
     */
    function setLogger() {
      logger = Logger.getInstance('HelpController');
      logger.info('Controller has initialized');
    }
  }
})();