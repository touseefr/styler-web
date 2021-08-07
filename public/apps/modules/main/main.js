'use strict';

angular.module('BeautyCollective')
  .config(function($stateProvider) {
    $stateProvider
      .state('home', {
        parent: 'index',
        url: '/',
        data: {
          roles: ['ROLE_ADMIN','ROLE_SYSTEM_ADMIN', 'ROLE_TESTER'],
          pageClass : 'home-page',
          pageTitle:'main.title'
        },
        views: {
          'content': {
            templateUrl: 'modules/main/main.html',
            controller: 'MainController'
          },
          'content_sidebar' : {
            templateUrl : 'modules/main/sidebar/main-sidebar.html',
            controller : 'MainSidebarController as _self'
          }
        },
        resolve: {
          mainTranslatePartialLoader: ['$translate', '$translatePartialLoader',
            function($translate, $translatePartialLoader) {
              $translatePartialLoader.addPart('main');
              return $translate.refresh();
            }
          ]
        }
      });
  });