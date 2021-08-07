(function() {
  'use strict';
  /**
   * @ngdoc overview
   * @name BeautyCollective.Pages.PrivacyPolicyStateConfig
   * @module BeautyCollective.Pages
   *
   * @description
   * Static page states
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Pages')
    .config(PrivacyPolicyStateConfig);

  /* @ngInject */
  function PrivacyPolicyStateConfig($stateProvider) {
    $stateProvider
      .state('page.privacypolicy', {
        url: '/privacy-policy',
        data: {
          roles: [],
          pageTitle: 'Privacy Policy'
        },
        views: {
          'page-content': {
            templateUrl: 'modules/pages/privacy-policy/privacy-policy.html',
            controller: 'PrivacyPolicyController'
          }
        }
      });
  }
})();