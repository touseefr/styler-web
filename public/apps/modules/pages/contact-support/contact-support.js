(function() {
  'use strict';
  /**
   * @ngdoc overview
   * @name BeautyCollective.Pages.ContactSupportStateConfig
   * @module BeautyCollective.Pages
   *
   * @description
   * Static page states
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Pages')
    .config(ContactSupportStateConfig);

  /* @ngInject */
  function ContactSupportStateConfig($stateProvider) {
     $stateProvider
      .state('page.contactsupport', {
        url: '/contact-support',
        data: {
          roles: [],
          pageTitle: 'Contact Support'
        },
        views: {
          'page-content': {
            templateUrl: 'modules/pages/contact-support/contact-support.html',
            controller: 'ContactSupportController'
          }
        }
      });
  }
})();
