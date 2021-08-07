(function() {
  'use strict';
  /**
   * @ngdoc overview
   * @name BeautyCollective.Pages.PagesStateConfig
   * @module BeautyCollective.Pages
   *
   * @description
   * Static page states
   *
   * @author Mohan Singh ( gmail::singhmohancs@gmail.com, skype :: mohan.singh42 )
   */
  angular
    .module('BeautyCollective.Pages')
    .config(PagesStateConfig);

  /* @ngInject */
  function PagesStateConfig($stateProvider) {
    $stateProvider
      .state('page', {
        abstract: true,
        parent: 'index',
        views: {
          '': {
            template: '<div ui-view="page-content" class="fade-in-up"></div>',
          }
        }

      });
  }
})();