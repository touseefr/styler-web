(function() {
  'use strict';
  /**
   * @ngdoc Controller
   * @name BeautyCollective.Pages.Controller.ContactSupportController
   * @module BeautyCollective.Pages
   *
   * @description
   * ContactSupportController is responsible for contact support page
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Pages')
    .controller('ContactSupportController', ContactSupportController);

  /* @ngInject */
  function ContactSupportController($scope, $state, Logger) {
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
      logger = Logger.getInstance('ContactSupportController');
      logger.info('Controller has initialized');
    }
  }
})();