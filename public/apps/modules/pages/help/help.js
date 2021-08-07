(function() {
  'use strict';
  /**
   * @ngdoc overview
   * @name BeautyCollective.Pages.HelpStateConfig
   * @module BeautyCollective.Pages
   *
   * @description
   * Static page states
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Pages')
    .config(HelpStateConfig);

  /* @ngInject */
  function HelpStateConfig($stateProvider) {
    $stateProvider
      .state('page.help', {
        url: '/help',
        data: {
          roles: [],
          pageTitle: 'Contact Support'
        },
        views: {
          'page-content': {
            templateUrl: 'modules/pages/help/help.html',
            controller: 'HelpController'
          }
        }
      });
  }
})();