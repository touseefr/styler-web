(function() {
  'use strict';
  /**
   * @ngdoc Controller
   * @name BeautyCollective.Pages.Controller.PrivacyPolicyController
   * @module BeautyCollective.Pages
   *
   * @description
   * PrivacyPolicyController is responsible for privacy policy page
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Pages')
    .controller('PrivacyPolicyController', PrivacyPolicyController);

  /* @ngInject */
  function PrivacyPolicyController($scope, $state, Logger) {
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
      logger = Logger.getInstance('PrivacyPolicyController');
      logger.info('Controller has initialized');
    }
  }
})();